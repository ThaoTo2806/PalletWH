import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { loadData } from '../../services/layhang';

export default function BodyInfo({ token, user, userN, user06, wh_id, wh_name }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data only when component is mounted and dependencies change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await loadData(token, '0010', 'select2', wh_id, 'PKG');

        if (response.success && response.data) {
          const transformedData = Object.keys(response.data).map(key => ({
            orderPosition: key,
            poNumber: response.data[key],
          }));
          setData(transformedData);
        } else {
          setError('No data found');
        }
      } catch (err) {
        setError('Đã có lỗi xảy ra, vui lòng thử lại');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, wh_id]); // only re-fetch data if token or wh_id changes

  // Ensure modal logic does not affect hook consistency
  const positions = ['Tất cả', ...new Set(data.map(item => item.orderPosition))];

  const [selectedPosition, setSelectedPosition] = useState('Tất cả');
  const [filteredData, setFilteredData] = useState(data);
  const [showModal, setShowModal] = useState(false);

  const handleFilter = (position) => {
    setSelectedPosition(position);
    if (position === 'Tất cả') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter(item => item.orderPosition.includes(position)));
    }
  };

  // Only show loading if data is still being fetched
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Handle errors gracefully
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Filter Dropdown */}
        <TouchableOpacity style={styles.iconsTouch} onPress={() => setShowModal(true)}>
          <Text style={styles.filterText}>
            {selectedPosition === 'Tất cả' ? 'Vị trí' : selectedPosition}
          </Text>
          <Icon name="caret-down-outline" size={20} color="#737373" />
        </TouchableOpacity>

        {/* PO Number Header */}
        <View style={styles.poHeader}>
          <Text style={styles.title}>Số PO #</Text>
        </View>
      </View>

      {/* Modal for dropdown */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {positions.map((position, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalOption}
                onPress={() => {
                  handleFilter(position);
                  setShowModal(false);
                }}
              >
                <Text style={styles.modalText}>{position}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* FlatList to display filtered data */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.contentText}>{item.orderPosition}</Text>
            <Text style={styles.contentText}>{item.poNumber}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  iconsTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  poHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  contentText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
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
