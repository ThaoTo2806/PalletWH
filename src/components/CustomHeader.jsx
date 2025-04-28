import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Animated,
  Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuListOnTheLeft from './home/MenuListOnTheRight';

const CustomHeader = ({ title, navigation, token, user, userN, user06, wh_id, wh_name, ser, ver }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  return (
    <View style={styles.header}>
      <StatusBar barStyle="light-content" backgroundColor="#6600ff" />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openMenu}>
        <Icon name="menu-sharp" size={30} color="white" />
      </TouchableOpacity>

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
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
    width: '55%',
    height: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
});

export default CustomHeader;
