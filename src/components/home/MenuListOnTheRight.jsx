import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { resetInfo } from '../../services/logout';


const items = [
  { name: 'Nhận sản phẩm', icon: 'cube', layout: 'layout1' },
  { name: 'Lên kệ', icon: 'layers', layout: 'layout2' },
  { name: 'Lấy hàng', icon: 'cart', layout: 'layout3' },
  { name: 'Xử lý hàng', icon: 'construct', layout: 'layout4' },
  { name: 'Hoàn tất đơn hàng', icon: 'checkmark-done', layout: 'layout5' },
  { name: 'Trả về kệ', icon: 'return-up-back', layout: 'layout6' },
  { name: 'Thay đổi đơn hàng', icon: 'swap-horizontal', layout: 'layout7' },
  { name: 'Đổi vị trí', icon: 'move', layout: 'layout8' },
  { name: 'Sắp xếp hàng', icon: 'reorder-four', layout: 'layout9' },
  { name: 'Đếm hàng', icon: 'analytics', layout: 'layout10' },
  { name: 'In lại', icon: 'print-outline', layout: 'layout11' },
  { name: 'Máy in', icon: 'print', layout: 'layout12' },
  { name: 'Đăng xuất', icon: 'log-out-outline'},
];

const MenuListOnTheRight = ({ navigation, token, user, userN, user06, wh_id, wh_name, ser, ver }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  const handleLogout = async () => {
    const result = await resetInfo(token);
    if (result.success) {
      setIsLoggedIn(false);
      navigation.navigate('Login');
    } else {
      console.log(result.message);
    }
  };

  const handleItemPress = (item) => {
    if (item.name === 'Đăng xuất') {
      handleLogout();
    } else {
      navigation.navigate(item.layout, {
        token,
        user,
        userN,
        user06,
        wh_id,
        wh_name,
        ser,
        ver
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleInfo}>
        <Text style={styles.headerText}>
          {wh_name} - {wh_id}
        </Text>
        <Icon name="caret-down-outline" size={20} color="#737373" style={styles.icon} />
      </TouchableOpacity>

      {showInfo && (
        <View style={styles.infoContainer}>
          <Text>Phiên bản: {ver}</Text>
          <Text>Tài khoản: {user}</Text>
          <Text>Họ tên: {userN}</Text>
          <Text>Máy chủ: {ser}</Text>
        </View>
      )}

      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => {
            handleItemPress(item);
          }}
        >
          <Icon name={item.icon} size={20} color="black" />
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    marginTop: 45,
  },
  header: {
    padding: 10,
    backgroundColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  icon: {
    marginLeft: 'auto',
  },
  infoContainer: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default MenuListOnTheRight;
