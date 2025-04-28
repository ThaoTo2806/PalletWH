import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, Button, View, TextInput } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Printer, BluetoothManager } from 'react-native-esc-pos-printer';
import CustomHeader from '../CustomHeader';

export default function may_in({ navigation }) {
  const [manager, setManager] = useState(null);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [ipAddress, setIpAddress] = useState('');
  const [connectedWifiPrinter, setConnectedWifiPrinter] = useState(false);

  useEffect(() => {
    const initManager = new BleManager();
    setManager(initManager);

    return () => {
      initManager.destroy();  // Đảm bảo hủy manager khi component unmount
    };
  }, []);

  // Scan devices Bluetooth
  const startScan = () => {
    if (manager) {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Error scanning Bluetooth devices:', error);
          return;
        }

        if (device && device.name) {
          setDevices(prevDevices => {
            if (!prevDevices.some(d => d.id === device.id)) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });
        }
      });
    }
  };

  // Connect to Bluetooth Device
  const connectToDevice = async (device) => {
    try {
      const connectedDevice = await device.connect();
      setConnectedDevice(connectedDevice);
      console.log('Connected to device:', connectedDevice.name);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.stack);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  // Kết nối đến máy in qua Wi-Fi
  const connectToWifiPrinter = async (ipAddress) => {
    try {
      const printer = new Printer(); // Khởi tạo đối tượng máy in
      await printer.connect(ipAddress);  // Kết nối máy in qua IP
      setConnectedWifiPrinter(true);
      console.log('Connected to Wi-Fi printer');
    } catch (error) {
      console.error('Failed to connect to Wi-Fi printer:', error.message);
      console.error('Error stack:', error.stack);
    }
  };


  // Gửi lệnh in qua máy in Wi-Fi
  const print = async () => {
    if (!connectedWifiPrinter) {
      console.error('Máy in chưa kết nối!');
      return;
    }
    try {
      const printer = new Printer();
      await printer.connect(ipAddress); // Kết nối đến máy in
      await printer.printText('Đây là lệnh in thử.'); // Gửi lệnh in
      await printer.disconnect(); // Ngắt kết nối sau khi in
      console.log('Printed successfully!');
    } catch (error) {
      console.error('Error printing:', error);
    }
  };

  return (
    <SafeAreaView>
      <CustomHeader title="Máy in" navigation={navigation} />

      {/* Kết nối Bluetooth */}
      <Button title="Scan Devices" onPress={startScan} />

      <View>
        <Text>Tên máy in: {connectedDevice ? connectedDevice.name : 'Chưa kết nối'}</Text>
        <Text>Trạng thái: {connectedDevice ? 'Đã kết nối' : 'Chưa kết nối'}</Text>

        {devices.length > 0 && (
          <View>
            <Text>Danh sách thiết bị:</Text>
            {devices.map(device => (
              <Button
                key={device.id}
                title={`Connect to ${device.name}`}
                onPress={() => connectToDevice(device)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Kết nối máy in Wi-Fi */}
      <Text>Nhập IP của máy in Wi-Fi:</Text>
      <TextInput
        value={ipAddress}
        onChangeText={setIpAddress}
        placeholder="IP Address của máy in"
      />
      <Button
        title="Connect to Wi-Fi Printer"
        onPress={() => connectToWifiPrinter(ipAddress)}
      />
      <Button title="Print" onPress={print} />
    </SafeAreaView>
  );
}
