import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const items = [
  'Nhận sản phẩm', 'Lên kệ', 'Lấy hàng', 'Xử lý hàng', 
  'Hoàn tất đơn hàng', 'Trả về kệ', 'Thay đổi đơn hàng', 'Đổi vị trí', 
  'Sắp xếp hàng', 'Đếm hàng', 'In lại', 'Máy in', 'Bố trí kho', 'Đóng gói'
];

export default function ListFolder({ navigation, token, user, userN, user06, wh_id, wh_name, ser, ver }) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.itemContainer}
          onPress={() => {
            navigation.navigate(`layout${index + 1}`, {
              token,
              user,
              userN,
              user06,
              wh_id,
              wh_name,
              ser, ver
            });
          }}
        >
          <Text style={styles.itemText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  itemContainer: {
    backgroundColor: '#e6e6e6',
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
