import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    inputGroup: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      marginBottom: 6,
      color: '#666',
      fontWeight: '500',
    },
    pickerWrapper: {
      position: 'relative',
    },
    pickerInput: {
      fontSize: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 4,
      color: '#000',
      backgroundColor: '#fff',
      paddingRight: 40,
    },
    pickerIcon: {
      position: 'absolute',
      right: 12,
      top: '50%',
      marginTop: -10,
    },
    header: {
      backgroundColor: '#fff',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    headerStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerStatusText: {
      fontSize: 12,
      color: '#4CAF50',
      marginLeft: 4,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#eee',
      height: 60,
    },
    tabButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    },
    activeTabButton: {
      borderTopWidth: 2,
      borderTopColor: '#0066cc',
    },
    tabLabel: {
      fontSize: 12,
      color: '#999',
      marginTop: 4,
    },
    activeTabLabel: {
      color: '#0066cc',
    },
    tabContent: {
      flex: 1,
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
    },
    button: {
      backgroundColor: '#0066cc',
      borderRadius: 8,
      padding: 12,
      marginBottom: 30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 4,
    },
    buttonDisabled: {
      backgroundColor: '#999',
    },
    buttonIcon: {
      marginRight: 8,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '600',
    },
    deviceList: {
      marginTop: 16,
      flex: 1,
    },
    deviceItem: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    deviceIcon: {
      marginRight: 12,
    },
    deviceInfo: {
      flex: 1,
    },
    deviceName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    deviceId: {
      fontSize: 12,
      color: '#999',
      marginTop: 4,
    },
    noDevices: {
      textAlign: 'center',
      color: '#999',
      marginTop: 32,
    },
    connectedDevice: {
      backgroundColor: '#e6f7ff',
      borderRadius: 8,
      padding: 12,
      marginVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderLeftWidth: 4,
      borderLeftColor: '#0066cc',
    },
    connectedText: {
      fontSize: 14,
      color: '#0066cc',
      fontWeight: 'bold',
    },
    disconnectButton: {
      backgroundColor: '#ff4d4f',
      borderRadius: 4,
      padding: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    disconnectText: {
      color: '#fff',
      fontSize: 12,
      marginLeft: 4,
    },
    warningBox: {
      backgroundColor: '#fff9e6',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderLeftWidth: 4,
      borderLeftColor: '#ff9800',
    },
    warningText: {
      fontSize: 14,
      color: '#664d00',
      marginLeft: 8,
      flex: 1,
    },
    weightContainer: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    weightLabel: {
      fontSize: 16,
      color: '#333',
      marginBottom: 8,
    },
    weightInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 18,
      marginBottom: 16,
    },
    dropdownHeight:{
      height: 51
    },
    totalWeightBox: {
      backgroundColor: '#f0f8ff',
      borderRadius: 8,
      padding: 16,
      marginTop: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalWeightLabel: {
      fontSize: 16,
      color: '#333',
      fontWeight: 'bold',
    },
    totalWeightValue: {
      fontSize: 20,
      color: '#0066cc',
      fontWeight: 'bold',
    },
    qrContainer: {
      flex: 1,
      alignItems: 'center',
    },
    qrBox: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 16,
    },
    qrInfo: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      width: '100%',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    batchId: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    qrDataText: {
      fontSize: 14,
      color: '#666',
    },
    actionButtons: {
      width: '100%',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    resetButton: {
      flex: 1,
      marginBottom: 0
    },
    resetButtonColorRed: {
      backgroundColor: '#ff4d4f', 
    },
    resetButtonColorOrange: {
      backgroundColor: '#fa8c16', 
    },
    printButton: {
      backgroundColor: '#28a745', 
      marginTop: 8,
    },
    noQrContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    noQrText: {
      textAlign: 'center',
      color: '#999',
      marginVertical: 16,
      paddingHorizontal: 32,
    },
    headerControls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modeButton: {
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
    },
    mockModeActive: {
      backgroundColor: '#ffeb3b',
    },
    modeButtonText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#333',
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    
    inputBox: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginRight: 8, 
    },
    
    lastInputBox: {
      marginRight: 0, 
    }    
  });

  export default styles;