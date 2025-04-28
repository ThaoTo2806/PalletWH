import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { loadData } from '../../services/xulyhang';

export default function BodyInfo({ token, user, userN, user06, wh_id, wh_name, navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await loadData(token, '0010', 'select', wh_id, 'PRC');

        if (response.success && response.data) {
          const transformedData = Object.keys(response.data).map(key => ({
            orderNumber: key,
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
  }, [token, wh_id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

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
        <Text style={styles.title}>Đơn hàng #</Text>
        <Text style={styles.title}>Số PO #</Text>
      </View>

      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.row}
          onPress={() => {
            navigation.navigate('detail', {
              orderNumber: item.orderNumber,
              poNumber: item.poNumber,
              token,
              user,
              userN,
              user06,
              wh_id,
              wh_name,
            });
          }}
        >
          <Text style={styles.contentText}>{item.orderNumber}</Text>
          <Text style={styles.contentText}>{item.poNumber}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  contentText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
});
