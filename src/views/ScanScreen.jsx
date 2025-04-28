import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

export default function ScanScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [latestScannedData, setLatestScannedData] = useState(null);

  // Request camera permission on component mount
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Setup code scanner hook for qr and ean-13 barcodes
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      setLatestScannedData(codes[0]?.value);
      console.log('Scanned Code: ', codes[0]?.value);
    },
  });

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
        <Text>Camera permission is required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject} // Makes camera fill the screen
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
      {latestScannedData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Latest Scanned Code:</Text>
          <Text style={styles.resultText}>{latestScannedData}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 40, // Adjust the position to provide space between the camera view and the result container
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  resultText: {
    fontSize: 14,
    color: 'white',
  },
});
