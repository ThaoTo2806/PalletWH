import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { loadData2 } from '../../services/xulyhang';

export default function BodyInfo({orderNumber, poNumber, token, user, userN, user06, wh_id, wh_name, navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await loadData2(token, '0010', 'selectDetail', wh_id, poNumber);

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
        <View style={styles.row1}>
        <Text style={styles.title1}>Số PO #</Text>
        <Text style={styles.title}>{orderNumber}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.title}>Pallet</Text>
        <Text style={styles.title}>Vùng</Text>
      </View>

      {data.map((item, index) => (
        <View key={index} style={styles.row}> 
          <Text style={styles.contentText}>{item.orderNumber}</Text>
          <Text style={styles.contentText}>{item.poNumber}</Text>
        </View>
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
  row1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  title1: {
    flex: 1,
    textAlign: 'left',
    fontSize: 20,
    color: '#737373',
  },
  contentText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
});
