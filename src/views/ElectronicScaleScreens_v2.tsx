'use client';

import { Buffer } from 'buffer';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BleManager, type Device } from 'react-native-ble-plx';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Dropdown } from 'react-native-element-dropdown';
import CustomHeader from '../components/CustomHeader';
import { useMockBluetooth } from '../hook/use-mock-bluetooth';
import { useDebounce } from '../hook/useDebounce';
import styles from '../styles/ElectronicScaleStyles';

// Khởi tạo BLE Manager
const bleManager = new BleManager();

// Tạo các component riêng biệt thay vì sử dụng TabView
import type { NavigationProp } from '@react-navigation/native';
import { ghiThung, layMaThung, loadLoHang, loadSanPham } from '../services/donggoi';

interface RouteParams {
  token: string;
  user: string;
  userN: string;
  user06: string;
  wh_id: string;
  wh_name: string;
  ser: string;
  ver: string;
}

const ElectronicScaleScreens_v2 = ({
  navigation,
  route,
}: {
  navigation: NavigationProp<any>;
  route: { params: RouteParams };
}) => {
  const { token, user, userN, user06, wh_id, wh_name, ser, ver } = route.params;
  const [currentTab, setCurrentTab] = useState('connect');

  // State cho Bluetooth
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  // State cho dữ liệu cân
  const [actualWeight, setActualWeight] = useState('');
  const [packagingWeight, setPackagingWeight] = useState('');
  const [totalWeight, setTotalWeight] = useState(0);

  const [batchId, setBatchId] = useState<string>('');
  const [productId, setProductId] = useState<string>('');
  const [listBatch, setListBatch] = useState<any[]>([]);
  const [listProduct, setListProduct] = useState<any[]>([]);

  const [size, setSize] = useState('');
  const [weighingTime, setWeighingTime] = useState<string>(
    new Date().toLocaleString(),
  );

  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  // State cho QR code
  const [qrData, setQrData] = useState('');

  // Thêm state để theo dõi chế độ giả lập
  const [useMockMode, setUseMockMode] = useState(false);

  // Sử dụng hook giả lập Bluetooth
  const mockBluetooth = useMockBluetooth();

  // Kết hợp dữ liệu thật và giả lập
  const deviceList = useMockMode ? mockBluetooth.mockDevices : devices;
  const isScanning = useMockMode ? mockBluetooth.scanning : scanning;
  const isConnectedDevice = useMockMode
    ? mockBluetooth.connectedDevice
    : connectedDevice;

  // Nếu đang ở chế độ giả lập, sử dụng dữ liệu trọng lượng từ giả lập
  useEffect(() => {
    if (useMockMode && mockBluetooth.weightData) {
      setActualWeight(mockBluetooth.weightData);
    }
  }, [useMockMode, mockBluetooth.weightData]);

  // Yêu cầu quyền truy cập Bluetooth
  const requestPermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ...(Platform.Version >= 31
            ? [
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
              PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]
            : []),
        ]);

        const allGranted = Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED,
        );

        if (!allGranted) {
          Alert.alert(
            'Quyền truy cập bị từ chối',
            'Ứng dụng cần quyền truy cập Bluetooth và vị trí để kết nối với cân.',
          );
        }
        return allGranted;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }, []);

  // Thêm hàm này vào ứng dụng nhận dữ liệu để dễ dàng tìm cân ảo
  const scanDevices = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setScanning(true);
    setDevices([]);

    // Dừng quét trước nếu đang quét
    bleManager.stopDeviceScan();

    // Bắt đầu quét thiết bị
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Lỗi quét:', error);
        setScanning(false);
        return;
      }

      // Lọc thiết bị - ưu tiên hiển thị cân ảo
      if (device) {
        const deviceName = device.name || '';
        const localName = device.localName || '';

        // Ưu tiên hiển thị thiết bị có tên liên quan đến cân
        const isScaleDevice =
          deviceName.toLowerCase().includes('cân') ||
          deviceName.toLowerCase().includes('scale') ||
          localName.toLowerCase().includes('cân') ||
          localName.toLowerCase().includes('scale');

        if (isScaleDevice || device.name) {
          setDevices(prevDevices => {
            // Kiểm tra xem thiết bị đã tồn tại trong danh sách chưa
            if (!prevDevices.find(d => d.id === device.id)) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });
        }
      }
    });

    // Dừng quét sau 10 giây
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  }, [requestPermissions]);

  // // Kết nối đến thiết bị
  const connectToDevice = useCallback(
    async (device: Device) => {
      if (useMockMode) {
        mockBluetooth.connectToMockDevice({
          ...device,
          name: device.name || 'Unknown Device',
          isConnectable: device.isConnectable ?? false, // Ensure isConnectable is a boolean
        });
      } else {
        try {
          setConnectedDevice(null);
          bleManager.stopDeviceScan();
          console.log(`Đang kết nối đến ${device.name || device.id}...`);

          const connectedDevice = await device.connect();
          console.log('Đã kết nối, khám phá dịch vụ...');

          const deviceWithServices =
            await connectedDevice.discoverAllServicesAndCharacteristics();
          console.log('Đã khám phá dịch vụ và đặc tính');

          setConnectedDevice(deviceWithServices);

          // Chuyển đến tab cân sau khi kết nối thành công
          setCurrentTab('weigh');

          // Bắt đầu lắng nghe dữ liệu cân
          listenToWeightData(deviceWithServices);

          Alert.alert(
            'Kết nối thành công',
            `Đã kết nối với ${device.name || device.id}`,
          );
        } catch (error) {
          console.log('Lỗi kết nối:', error);
          Alert.alert(
            'Lỗi kết nối',
            'Không thể kết nối với thiết bị. Vui lòng thử lại.',
          );
          setConnectedDevice(null);
        }
      }
    },
    [useMockMode, mockBluetooth.connectToMockDevice],
  );

  // Ngắt kết nối thiết bị
  const disconnectDevice = useCallback(async () => {
    if (useMockMode) {
      mockBluetooth.disconnectMockDevice();
    } else {
      if (connectedDevice) {
        try {
          await connectedDevice.cancelConnection();
          setConnectedDevice(null);
          setActualWeight('');
          Alert.alert('Đã ngắt kết nối', 'Thiết bị đã được ngắt kết nối');
        } catch (error) {
          console.log('Lỗi ngắt kết nối:', error);
        }
      }
    }
  }, [useMockMode, mockBluetooth.disconnectMockDevice, connectedDevice]);

  const listenToWeightData = useCallback(async (deviceWithServices: Device) => {
    try {
      console.log('Bắt đầu lắng nghe dữ liệu cân...');
      const services = await deviceWithServices.services();

      for (const service of services) {
        console.log('service', service);

        const characteristics = await service.characteristics();
        console.log('characteristics', characteristics);

        for (const characteristic of characteristics) {
          console.log(456);

          if (characteristic.isNotifiable) {
            console.log(`Đăng ký lắng nghe: ${characteristic.uuid}`);
            console.log(789);

            deviceWithServices.monitorCharacteristicForService(
              service.uuid,
              characteristic.uuid,
              (error, characteristic) => {
                if (error) {
                  console.log('Lỗi lắng nghe BLE:', error);
                  return;
                }

                if (characteristic?.value) {
                  try {
                    const buffer = Buffer.from(characteristic.value, 'base64');

                    // Lấy từng byte trong buffer
                    for (let i = 0; i < buffer.length; i++) {
                      const byte = buffer[i];

                      // Chuyển byte thành chuỗi nhị phân 8 bit
                      const binaryStr = byte.toString(2).padStart(8, '0');

                      console.log(`Byte ${i}:`, binaryStr);

                      // Ví dụ: xử lý bit thứ 0, 1, 2...
                      const bit0 = (byte & 0b00000001) !== 0;
                      const bit1 = (byte & 0b00000010) !== 0;
                      const bit2 = (byte & 0b00000100) !== 0;

                      console.log(
                        `Bit 0: ${bit0}, Bit 1: ${bit1}, Bit 2: ${bit2}`,
                      );
                    }
                  } catch (e) {
                    console.log('Lỗi giải mã bit:', e);
                  }
                }
              },
            );
          }
        }
      }
    } catch (error) {
      console.log('Lỗi khi lắng nghe dữ liệu:', error);
    }
  }, []);

  // Tính tổng trọng lượng khi trọng lượng thực hoặc đóng gói thay đổi
  useEffect(() => {
    const actual = Number.parseFloat(actualWeight) || 0;
    const packaging = Number.parseFloat(packagingWeight) || 0;
    setTotalWeight(actual + packaging);
  }, [actualWeight, packagingWeight]);

  //Validation
  const Validation = () => {
    if (!batchId) {
      Alert.alert(
        'Thiếu dữ liệu',
        'Vui lòng quét barcode lô hàng hoặc nhập mã lô hàng.',
      );
      return;
    }

    if (!productId) {
      Alert.alert(
        'Thiếu dữ liệu',
        'Vui lòng quét barcode lô hàng hoặc nhập mã sản phẩm.',
      );
      return;
    }

    if (!actualWeight) {
      Alert.alert(
        'Thiếu dữ liệu',
        'Vui lòng nhập hoặc lấy dữ liệu trọng lượng từ cân.',
      );
      return;
    }

    if (!packagingWeight) {
      Alert.alert('Thiếu dữ liệu', 'Vui lòng nhập trọng lượng bao bì.');
      return;
    }

    if (!width) {
      Alert.alert('Thiếu dữ liệu', 'Vui lòng nhập chiều rộng bao bì.');
      return;
    }

    if (!length) {
      Alert.alert('Thiếu dữ liệu', 'Vui lòng nhập chiều dài bao bì.');
      return;
    }

    if (!height) {
      Alert.alert('Thiếu dữ liệu', 'Vui lòng nhập chiều cao bao bì.');
      return;
    }

    if (!size) {
      Alert.alert(
        'Thiếu dữ liệu',
        'Vui lòng nhập kích thước bao bì (Rộng x Dài x Cao).',
      );
      return;
    }
  };

  // Tạo mã QR
  const generateQRCode = useCallback(async () => {
    Validation();

    const actual = Number.parseFloat(actualWeight) || 0;
    const packaging = Number.parseFloat(packagingWeight) || 0;
    const total = actual + packaging;
    const timeNow = new Date().toISOString();

    const payload = {
      ma_lo: batchId || '',
      khoi_luong_tong: total,
      kich_thuoc: size,
      ma_sp: productId || '',
      thoi_gian: timeNow,
      khoi_luong_vo: packaging,
      khoi_luong_tinh: actual,
      rong: width,
      dai: length,
      cao: height,
    };

    console.log('Dữ liệu gửi lên API:', payload); // log toàn bộ dữ liệu

    // Gửi dữ liệu đến API
    try {
      const response = await ghiThung(token, '0281', 'addBox', {
        ma_lo: batchId || '',
        khoi_luong_tong: total,
        kich_thuoc: size,
        ma_sp: productId || '',
        thoi_gian: timeNow,
        khoi_luong_vo: packaging,
        khoi_luong_tinh: actual,
        rong: width,
        dai: length,
        cao: height,
      });

      if (response?.success) {
        console.log('Lưu thành công:', response.message);
      } else {
        Alert.alert('Lỗi', response?.message || 'Không xác định');
        return;
      }
    } catch (error) {
      console.error('Lỗi gửi dữ liệu:', error);
      Alert.alert('Lỗi', 'Không thể gửi dữ liệu đến máy chủ');
      return;
    }

    // Sau khi lưu, gọi API để lấy mã thùng
    let boxId = 'N/A';
    try {
      const boxRes = await layMaThung(token, '0281', 'getBoxId', {
        ma_lo: batchId,
        ma_sp: productId,
        thoi_gian: timeNow,
      });

      if (boxRes?.success && Array.isArray(boxRes.data) && boxRes.data.length > 0) {
        boxId = boxRes.data[0].lv001 as string;
      } else {
        Alert.alert('Thông báo', boxRes?.message || 'Không tìm thấy mã thùng.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy mã thùng từ máy chủ');
    }

    // Tạo nội dung QR
    const data =
      `Mã lô: ${batchId || 'N/A'}\n` +
      `Mã sản phẩm: ${productId || 'N/A'}\n` +
      `Mã thùng: ${boxId}\n` +
      `Rộng: ${width} cm\n` +
      `Dài: ${length} cm\n` +
      `Cao: ${height} cm\n` +
      `Kích thước: ${size}\n cm` +
      `Khối lượng thực: ${actual.toFixed(2)} kg\n` +
      `Khối lượng đóng gói: ${packaging.toFixed(2)} kg\n` +
      `Tổng khối lượng: ${total.toFixed(2)} kg\n` +
      `Thời gian cân: ${timeNow}`;

    setQrData(data);
    setCurrentTab('qrcode');
  }, [actualWeight, packagingWeight, batchId, productId, size]);

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      if (connectedDevice) {
        connectedDevice.cancelConnection();
      }
      bleManager.destroy();
    };
  }, [connectedDevice]);

  // Render tab kết nối Bluetooth
  const renderConnectTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Kết nối thiết bị Bluetooth</Text>

      <TouchableOpacity
        style={[styles.button, isScanning ? styles.buttonDisabled : null]}
        onPress={scanDevices}
        disabled={isScanning}>
        <Icon
          name="bluetooth-search"
          size={20}
          color="#fff"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>
          {isScanning ? 'Đang quét...' : 'Quét thiết bị Bluetooth'}
        </Text>
        {isScanning && (
          <ActivityIndicator color="#fff" style={{ marginLeft: 10 }} />
        )}
      </TouchableOpacity>

      {isConnectedDevice && (
        <View style={styles.connectedDevice}>
          <Text style={styles.connectedText}>
            Đã kết nối: {isConnectedDevice.name || isConnectedDevice.id}
          </Text>
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={disconnectDevice}>
            <Icon name="bluetooth-off" size={16} color="#fff" />
            <Text style={styles.disconnectText}>Ngắt kết nối</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.deviceList}>
        {deviceList.length > 0 ? (
          deviceList.map(device => {
            const isMockDevice = 'mockProperty' in device;
            return (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceItem}
                onPress={() => connectToDevice(device as Device)}>
                <Icon
                  name="bluetooth"
                  size={24}
                  color="#0066cc"
                  style={styles.deviceIcon}
                />
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>
                    {device.name ||
                      (isMockDevice
                        ? 'Thiết bị giả lập'
                        : 'Thiết bị không tên')}
                  </Text>
                  <Text style={styles.deviceId}>{device.id}</Text>
                </View>
                <Icon name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.noDevices}>
            {isScanning
              ? 'Đang tìm thiết bị...'
              : 'Không tìm thấy thiết bị. Nhấn quét để tìm kiếm.'}
          </Text>
        )}
      </ScrollView>
    </View>
  );

  useEffect(() => {
    if (width && length && height) {
      setSize(`${width} x ${length} x ${height}`);
    } else {
      setSize('');
    }
  }, [width, length, height]);

  //Lấy danh sách lô hàng
  useEffect(() => {
    const getDataBatch = async () => {
      try {
        const res = await loadLoHang(token, '0281', 'getListBatchId');

        if (res && res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((item: { lv001: string; lv002: string }) => ({
            label: item.lv001,
            value: item.lv001,
          }));

          const unique = Array.from(
            new Map(mapped.map(i => [i.value, i])).values(),
          );

          setListBatch(unique);
          setDropdownDataBatch(unique);
        }

      } catch (e) {
        console.log('Lỗi khi lấy dữ liệu lô hàng: ', e);
      }
    };

    getDataBatch();
  }, []);

  const [dropdownDataBatch, setDropdownDataBatch] = useState(listBatch);
  const [inputTextBatch, setInputTextBatch] = useState('');

  const handleChangeBatch = (item: any) => {
    if (item.value.startsWith('new__')) {
      const actualValue = item.value.replace('new__', '');
      const newItem = { label: actualValue, value: actualValue };

      if (
        !listBatch.some(
          i => i.value.toLowerCase() === actualValue.toLowerCase(),
        )
      ) {
        const newList = [...listBatch, newItem];
        setListBatch(newList);
        setDropdownDataBatch(newList);
      }

      setBatchId(actualValue);
      setInputTextBatch('');
    } else {
      setBatchId(item.value);
      setInputTextBatch('');
    }
  };

  const handleSearchTextChangeBatch = (text: string) => {
    setInputTextBatch(text);

    const filtered = listBatch.filter(item =>
      item.label.toLowerCase().includes(text.toLowerCase()),
    );

    const exists = listBatch.some(
      (item: { label: string; value: string }) =>
        item.label.toLowerCase() === text.toLowerCase(),
    );

    if (text !== '' && !exists) {
      setDropdownDataBatch([
        ...filtered,
        { label: `➕ Tạo mới: "${text}"`, value: `new__${text}` },
      ]);
    } else {
      setDropdownDataBatch(filtered);
    }
  };

  const [dropdownDataProduct, setDropdownDataProduct] = useState<
    { label: string; value: string }[]
  >([]);
  const [inputTextProduct, setInputTextProduct] = useState('');
  const debouncedInputProduct = useDebounce(inputTextProduct, 500); // 1000ms để tránh call liên tục

  useEffect(() => {
    const getDataProduct = async () => {
      try {
        const res = await loadSanPham(token, '0281', 'getListProductByName', debouncedInputProduct);

        if (res && res.success && Array.isArray(res.data)) {
          const newData = res.data.map((item: { lv001: string; lv002: string }) => ({
            label: item.lv002,
            value: item.lv001,
          }));

          // Gộp listProduct (bao gồm sản phẩm tự thêm) với newData
          const mergedList = Array.from(
            new Map(
              [...listProduct, ...newData].map(i => [i.value, i]),
            ).values(),
          );

          setListProduct(mergedList);

          // Và để dropdown show merged luôn
          const filtered = mergedList.filter(item =>
            item.label
              .toLowerCase()
              .includes(debouncedInputProduct.toLowerCase()),
          );

          setDropdownDataProduct(filtered);
        }
      } catch (e) {
        console.log('Lỗi khi lấy dữ liệu sản phẩm: ', e);
      }
    };

    if (debouncedInputProduct !== '') {
      getDataProduct();
    }
  }, [debouncedInputProduct]);

  const handleChangeProduct = (item: any) => {
    if (item.value.startsWith('new__')) {
      const actualValue = item.value.replace('new__', '');
      const newItem = { label: actualValue, value: actualValue };

      if (
        !listProduct.some(
          i => i.value.toLowerCase() === actualValue.toLowerCase(),
        )
      ) {
        const newList = [...listProduct, newItem];
        setListProduct(newList);
        setDropdownDataProduct(newList); // để list có cái item vừa thêm
      }
      setProductId(actualValue);
      setInputTextProduct(actualValue);
    } else {
      setProductId(item.value);
      setInputTextProduct(item.label); // gán lại input đúng tên sản phẩm
    }
  };

  const handleSearchTextChangeProduct = (text: string) => {
    setInputTextProduct(text);

    const filtered = listProduct.filter(item =>
      item.label.toLowerCase().includes(text.toLowerCase()),
    );

    const exists = listProduct.some(
      item => item.label.toLowerCase() === text.toLowerCase(),
    );

    if (text !== '' && !exists) {
      setDropdownDataProduct([
        ...filtered,
        { label: `➕ Tạo mới: "${text}"`, value: `new__${text}` },
      ]);
    } else {
      setDropdownDataProduct(filtered);
    }
  };

  // Render tab cân
  const renderWeighTab = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Cân và đo trọng lượng</Text>

      {!isConnectedDevice && (
        <View style={styles.warningBox}>
          <Icon name="alert-circle-outline" size={24} color="#ff9800" />
          <Text style={styles.warningText}>
            Chưa kết nối với cân. Kết nối thiết bị hoặc nhập trọng lượng thủ
            công.
          </Text>
        </View>
      )}

      <View style={styles.weightContainer}>
        <Text style={styles.weightLabel}>
          Mã lô: <Text style={{ color: 'red' }}>*</Text>
        </Text>

        <Dropdown
          style={[styles.weightInput, styles.dropdownHeight]}
          data={dropdownDataBatch}
          labelField="label"
          valueField="value"
          placeholder="Nhập hoặc chọn lô hàng"
          search
          value={batchId}
          onChange={handleChangeBatch}
          onChangeText={handleSearchTextChangeBatch}
          onFocus={() => {
            setDropdownDataBatch(listBatch);
          }}
        />

        <Text style={styles.weightLabel}>
          Mã sản phẩm: <Text style={{ color: 'red' }}>*</Text>
        </Text>

        <Dropdown
          style={[styles.weightInput, styles.dropdownHeight]}
          data={dropdownDataProduct}
          labelField="label"
          valueField="value"
          placeholder="Nhập hoặc chọn sản phẩm"
          search
          value={productId}
          onChange={handleChangeProduct}
          onChangeText={handleSearchTextChangeProduct}
          onFocus={() => {
            setDropdownDataProduct(listProduct);
          }}
        />

        <Text style={styles.weightLabel}>
          Trọng lượng tịnh (Net): <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <TextInput
          style={styles.weightInput}
          value={actualWeight}
          onChangeText={setActualWeight}
          keyboardType="numeric"
          placeholder="0.00"
        />

        <Text style={styles.weightLabel}>
          Trọng lượng bao bì (Package): <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <TextInput
          style={styles.weightInput}
          value={packagingWeight}
          onChangeText={setPackagingWeight}
          keyboardType="numeric"
          placeholder="0.00"
        />

        <Text style={styles.weightLabel}>
          Kích thước (cm): <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputBox}
            placeholder="Rộng"
            value={width}
            onChangeText={setWidth}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputBox}
            placeholder="Dài"
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.inputBox, styles.lastInputBox]}
            placeholder="Cao"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.weightLabel}>
          Kích thước (Rộng x Dài x Cao): <Text style={{ color: 'red' }}>*</Text>
        </Text>
        <TextInput
          style={styles.weightInput}
          value={size}
          onChangeText={text => {
            setSize(text);
          }}
          readOnly
        />

        <Text style={styles.weightLabel}>Thời gian cân: {weighingTime}</Text>

        <View style={styles.totalWeightBox}>
          <Text style={styles.totalWeightLabel}>Tổng trọng lượng:</Text>
          <Text style={styles.totalWeightValue}>
            {totalWeight.toFixed(2)} kg
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={generateQRCode}>
        <Icon
          name="qrcode-scan"
          size={20}
          color="#fff"
          style={styles.buttonIcon}
        />
        <Text style={styles.buttonText}>Tạo mã QR</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Render tab QR code
  const renderQRCodeTab = () => (
    <ScrollView>
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Mã QR</Text>

        {qrData ? (
          <View style={styles.qrContainer}>
            <View style={styles.qrBox}>
              <QRCode value={qrData} size={200} />
            </View>

            <View style={styles.qrInfo}>
              <Text style={styles.batchId}>Mã lô: {batchId}</Text>
              <Text style={styles.qrDataText}>{qrData}</Text>
            </View>

            <View style={styles.actionButtons}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.resetButton,
                    styles.resetButtonColorRed,
                    { marginRight: 8 },
                  ]}
                  onPress={() => {
                    setQrData('');
                    setActualWeight('');
                    setPackagingWeight('');
                    setBatchId('');
                    setProductId('');
                    setWidth('');
                    setLength('');
                    setHeight('');
                    setSize('');
                    setCurrentTab('weigh');
                  }}>
                  <Icon
                    name="refresh"
                    size={20}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Làm mới dữ liệu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.resetButton,
                    styles.resetButtonColorOrange,
                  ]}
                  onPress={() => {
                    setQrData('');
                    setActualWeight('');
                    setCurrentTab('weigh');
                  }}>
                  <Icon
                    name="refresh"
                    size={20}
                    color="#fff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Làm mới trọng lượng</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={[styles.button, styles.printButton]}>
                <Icon
                  name="printer"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>In mã QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noQrContainer}>
            <Icon name="qrcode" size={80} color="#ddd" />
            <Text style={styles.noQrText}>
              Chưa có mã QR nào được tạo. Vui lòng nhập trọng lượng và tạo mã QR.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentTab('weigh')}>
              <Icon
                name="scale"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Đi đến cân</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // Render thanh tab tùy chỉnh
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          currentTab === 'connect' && styles.activeTabButton,
        ]}
        onPress={() => setCurrentTab('connect')}>
        <Icon
          name="bluetooth"
          size={24}
          color={currentTab === 'connect' ? '#0066cc' : '#999'}
        />
        <Text
          style={[
            styles.tabLabel,
            currentTab === 'connect' && styles.activeTabLabel,
          ]}>
          Kết nối
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          currentTab === 'weigh' && styles.activeTabButton,
        ]}
        onPress={() => setCurrentTab('weigh')}>
        <Icon
          name="scale"
          size={24}
          color={currentTab === 'weigh' ? '#0066cc' : '#999'}
        />
        <Text
          style={[
            styles.tabLabel,
            currentTab === 'weigh' && styles.activeTabLabel,
          ]}>
          Cân
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          currentTab === 'qrcode' && styles.activeTabButton,
        ]}
        onPress={() => setCurrentTab('qrcode')}>
        <Icon
          name="qrcode"
          size={24}
          color={currentTab === 'qrcode' ? '#0066cc' : '#999'}
        />
        <Text
          style={[
            styles.tabLabel,
            currentTab === 'qrcode' && styles.activeTabLabel,
          ]}>
          Mã QR
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render nội dung tab hiện tại
  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'connect':
        return renderConnectTab();
      case 'weigh':
        return renderWeighTab();
      case 'qrcode':
        return renderQRCodeTab();
      default:
        return renderConnectTab();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <CustomHeader
        title="Đóng gói"
        navigation={navigation}
        token={token}
        user={user}
        userN={userN}
        user06={user06}
        wh_id={wh_id}
        wh_name={wh_name}
        ser={ser}
        ver={ver}
      />
      <View style={styles.header}>
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              useMockMode ? styles.mockModeActive : {},
            ]}
            onPress={() => setUseMockMode(!useMockMode)}>
            <Text style={styles.modeButtonText}>
              {useMockMode ? 'Chế độ giả lập' : 'Chế độ thật'}
            </Text>
          </TouchableOpacity>

          {isConnectedDevice && (
            <View style={styles.headerStatus}>
              <Icon name="bluetooth-connect" size={16} color="#4CAF50" />
              <Text style={styles.headerStatusText}>Đã kết nối</Text>
            </View>
          )}
        </View>
      </View>

      {renderCurrentTab()}
      {renderTabBar()}
    </SafeAreaView>
  );
};

export default ElectronicScaleScreens_v2;
