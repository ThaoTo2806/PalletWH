import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { loadData } from '../../services/lenke';
import { updateData } from '../../services/lenke';

export default function BodyInfo({ token, user, userN, user06, wh_id, wh_name, latestScannedData }) {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pallets, setPallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
          if (latestScannedData) {
              const [data1, data2] = latestScannedData.split('|');
              setInput1(data1);
              setInput2(data2);
          }
      }, [latestScannedData]);
      
  const isButtonDisabled = !input1 || !input2;

  const fetchPallets = async () => {
    setIsLoading(true);
    const result = await loadData(token, '0279', 'select', wh_id);
    console.log(result);
    if (result.success) {
      setPallets(Object.entries(result.data));
    } else {
      Alert.alert('Lỗi', result.message);
    }
    setIsLoading(false);
  };

  const updatePallets = async () => {
    const result = await updateData(token, '0279', 'update', wh_id, user06, input2);
    console.log(result);
    if (result.success) {
      Alert.alert('Thông báo', 'Lên kệ thành công');
      setInput1('');
      setInput2('');
      fetchPallets();
    } else {
      Alert.alert('Lỗi', result.message);
    }
  };

  useEffect(() => {
    fetchPallets();
  }, []);

  const handlePalletSelect = (key, value) => {
    setInput1(key);
    setInput2(value);
    setShowModal(false);
  };

  return (
    <View>
      <View style={styles.container}>
        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
          onPress={() => updatePallets()}
          disabled={isButtonDisabled}
        >
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.viewAllInput}>
        {/* Input 1: "Pallet" */}
        <View style={styles.viewInput}>
          <Text style={styles.title}>Pallet:</Text>
          <TextInput
            style={styles.input}
            value={input1}
            editable={false}
          />
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Icon name="caret-down-outline" size={20} color="#737373" />
          </TouchableOpacity>
        </View>

        {/* Input 2: "Vị trí" */}
        <View style={styles.viewInput}>
          <Text style={styles.title}>Vị trí:</Text>
          <TextInput
            style={styles.input1}
            value={input2}
            editable={false}
          />
        </View>
      </View>

      {/* Modal to select Pallet */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isLoading ? (
              <Text>Loading...</Text>
            ) : (
              <FlatList
                data={pallets}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => handlePalletSelect(item[0], item[1])}
                  >
                    <Text style={styles.modalText}>{item[1]}</Text>
                  </TouchableOpacity>
                )}
              />

            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'baseline',
    padding: 6,
  },
  viewAllInput: {
    marginTop: 50,
  },
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#b3b3b3',
    fontWeight: 'bold',
  },
  input: {
    color: '#737373',
    width: '70%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 20,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  input1: {
    color: '#737373',
    width: '80%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 20,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#6600ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 10,
  },
  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
  },
});