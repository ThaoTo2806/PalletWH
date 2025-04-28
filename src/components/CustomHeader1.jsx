import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Animated,
  Pressable,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuListOnTheLeft from './home/MenuListOnTheRight';

// Import necessary components from 'react-native-vision-camera'
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

const CustomHeader1 = ({ title, navigation, token, user, userN, user06, wh_id, wh_name, onScan, triggerScan, setTriggerScan, ser, ver }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [scannerVisible, setScannerVisible] = useState(false); // To control the visibility of the scanner modal
  const slideAnim = useRef(new Animated.Value(300)).current;

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [latestScannedData, setLatestScannedData] = useState(null);

  // Hàm quét mã vạch
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'upc-a', 'upc-e'],
    onCodeScanned: (codes) => {
      const scannedData = codes[0]?.value;
      setLatestScannedData(scannedData);
      console.log('Scanned Code:', scannedData);
      onScan(scannedData);
      setScannerVisible(false); // Đóng modal quét mã vạch
    }
  });

  // Hàm mở menu
  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Hàm đóng menu
  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  // Request permission khi component được mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Lắng nghe sự thay đổi của triggerScan
  useEffect(() => {
    if (triggerScan) {
      console.log('Trigger Scan activated');
      setScannerVisible(true); // Mở modal quét mã
      setTriggerScan(false); // Reset triggerScan về false sau khi quét
    }
  }, [triggerScan]);

  // Lắng nghe sự thay đổi của latestScannedData và gọi Alert khi giá trị thay đổi
  useEffect(() => {
    if (latestScannedData) {
      Alert.alert('Scanned Code', `Scanned value: ${latestScannedData}`);
    }
  }, [latestScannedData]); // Chạy khi latestScannedData thay đổi

  if (device == null) {
    return (
      <View style={styles.container}>
        <Text>Device Not Found</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text>No Camera Permission</Text>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#6600ff" />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerLeft}
      >
        <Icon name="chevron-back-outline" size={30} color="white" />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>

      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.icon1}>
          <Icon name="barcode-outline" size={30} color="white" onPress={() => setScannerVisible(true)} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openMenu}>
          <Icon name="menu-sharp" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal for Barcode Scanner */}
      <Modal transparent visible={scannerVisible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setScannerVisible(false)} />
        <View style={styles.scannerContainer}>
          <Camera
            style={styles.camera}
            device={device}
            isActive={true}
            codeScanner={codeScanner} // Pass the codeScanner object to Camera
            captureAudio={false} // Disable audio capture
          >
            <View style={styles.overlay}>
              <Text style={styles.scanText}>Scan Barcode</Text>
            </View>
          </Camera>
        </View>
      </Modal>

      {/* Menu Modal */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={styles.overlay} onPress={closeMenu} />
        <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>
          <MenuListOnTheLeft
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
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#6600ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon1: {
    marginRight: 20,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    right: 0,
    width: '50%',
    height: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scanText: {
    position: 'absolute',
    top: '50%',
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CustomHeader1;
