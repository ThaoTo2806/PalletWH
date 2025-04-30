import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity, Modal, StyleSheet, SafeAreaView, Alert } from 'react-native';
import CustomHeader from '../CustomHeader';
import { loadData } from '../../services/botrikho';

export default function WarehouseMapScreen({ route, navigation }) {
  const { token, user, userN, user06, wh_id, wh_name, ser, ver } = route.params;
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadData(token, '0207');
      if (result.success && Array.isArray(result.data)) {
        // Map dữ liệu từ API về đúng format cần
        const transformedData = result.data.map((line) => ({
          id: line.lv001,
          sections: Object.entries(line.faces).map(([sectionKey, face]) => ({
            id: sectionKey,
            rows: face.floors,
            columns: face.columns,
            positions: face.positions.map((pos, index) => ({
              id: pos.lv001_2,
              status: getStatusFromColor(pos.color),
              product_list: pos.product_list,
              details: pos.details_html,
            })),
          })),
        }));
        setWarehouseData(transformedData);
      } else {
        Alert.alert('Error', result.message || 'Không lấy được dữ liệu');
      }
    };

    fetchData();
  }, []);

  const getStatusFromColor = (color) => {
    switch (color.toLowerCase()) {
      case '#e6e600': return 'highlighted'; // vàng
      case '#00cc00': return 'available';  // xanh
      case '#ffb3b3': return 'occupied';   // đỏ
      case '#e6e6e6': return 'reserved';   // xám
      default: return 'reserved';          // fallback
    }
  };

  const parseDetailsHtml = (detailsString) => {
    if (!detailsString) return [];

    const parts = detailsString.split("|");
    const result = [];
    for (let i = 0; i < parts.length; i += 4) {
      result.push({
        code: parts[i],
        name: parts[i + 1],
        quantity: parts[i + 2],
        weight: parts[i + 3],
      });
    }
    return result;
  };

  const handlePositionClick = (positionId) => {
    const position = warehouseData.flatMap(line => line.sections)
      .flatMap(section => section.positions)
      .find(p => p.id === positionId);
    setSelectedPosition(position);
  };

  const renderPositions = (positions, columns) => {
    const rows = [];
    for (let i = 0; i < positions.length; i += columns) {
      const row = positions.slice(i, i + columns);
      rows.push(row);
    }

    return rows.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.row}>
        {row.map((position) => {
          let backgroundColor;
          switch (position.status) {
            case 'highlighted': backgroundColor = '#FACC15'; break; // vàng
            case 'available': backgroundColor = '#34D399'; break;   // xanh
            case 'occupied': backgroundColor = '#EF4444'; break;    // đỏ
            case 'reserved':
            default: backgroundColor = '#E2E8F0'; break;             // xám
          }

          return (
            <TouchableOpacity
              key={position.id}
              style={[styles.positionCell, { backgroundColor }]}
              onPress={() => handlePositionClick(position.id)}
            >
              <Text style={styles.positionText}>{position.id}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        title="Bố trí kho"
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
      <ScrollView style={styles.container}>

        {warehouseData.map((line) => (
          <View key={line.id} style={styles.card}>
            <Text style={styles.cardTitle}>Line {line.id}</Text>
            <ScrollView horizontal>
              <View style={styles.sectionContainer}>
                {line.sections.map((section) => (
                  <View key={section.id} style={styles.sectionColumn}>
                    <Text style={styles.sectionTitle}>Section {section.id}</Text>
                    {renderPositions(section.positions, section.columns)}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        ))}

        {selectedPosition && (
          <Modal transparent visible onRequestClose={() => setSelectedPosition(null)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{selectedPosition.id}</Text>
                <Text style={{ fontWeight: 'bold' }}>Mã Pallet: {selectedPosition.product_list}</Text>

                <View style={{ marginTop: 12 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Chi tiết:</Text>
                  <View style={{ borderWidth: 1, borderColor: '#ccc' }}>
                    {parseDetailsHtml(selectedPosition.details).map((item, idx) => (
                      <View key={idx} style={{ flexDirection: 'row', padding: 6, borderBottomWidth: 1, borderColor: '#eee' }}>
                        <Text style={{ flex: 1, fontSize: 12 }}>{item.code}</Text>
                        <Text style={{ flex: 2, fontSize: 12 }}>{item.name}</Text>
                        <Text style={{ flex: 1, fontSize: 12 }}>{item.quantity}</Text>
                        <Text style={{ flex: 1, fontSize: 12 }}>{item.weight}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Button title="Đóng" onPress={() => setSelectedPosition(null)} />
              </View>
            </View>
          </Modal>
        )}

      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sectionColumn: {
    marginRight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  positionCell: {
    width: 50,
    height: 50,
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  positionText: {
    fontSize: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});
