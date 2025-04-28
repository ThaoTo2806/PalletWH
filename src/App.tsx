import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import LoginPallet from './views/LoginPallet';
import HomePallet from './views/HomePallet';
import hoan_tat_don_hang from './components/hoan-tat-don-hang/hoan_tat_don_hang';
import doi_vi_tri from './components/doi-vi-tri/doi_vi_tri';
import dem_hang from './components/dem-hang/dem_hang';
import in_lai from './components/in-lai/in_lai';
import lay_hang from './components/lay-hang/lay_hang';
import len_ke from './components/len-ke/len_ke';
import may_in from './components/may-in/may_in';
import nhan_san_pham from './components/nhan-san-pham/nhan_san_pham';
import sap_xep_hang from './components/sap-xep-hang/sap_xep_hang';
import thay_doi_don_hang from './components/thay-doi-don-hang/thay_doi_don_hang';
import tra_ve_ke from './components/tra-ve-ke/tra_ve_ke';
import xu_ly_hang from './components/xu-ly-hang/xu_ly_hang';
import chi_tiet_don_hang from './components/chi-tiet-don-hang/chi_tiet_don_hang';
import { getGenericPassword } from 'react-native-keychain'; // Lấy thông tin người dùng từ Keychain
import Loading from './components/Loading';

const Stack = createStackNavigator();

// Định nghĩa kiểu của user, nó có thể là một đối tượng chứa token
type User = {
  token: string | null; // token là kiểu string hoặc null
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState<User | null>(null); // Gán kiểu User cho state user
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const userData = await getGenericPassword(); // Lấy dữ liệu người dùng từ Keychain
        if (userData && userData.password) {
          // Kiểm tra nếu có token
          const token = userData.password;
          if (token) {
            setUser({ token });
          }
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken(); // Kiểm tra token khi ứng dụng khởi động
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user && user.token ? 'Home' : 'Login'}>
        <Stack.Screen
          name="Login"
          component={LoginPallet}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomePallet}
          initialParams={user ? { token: user.token } : {} } 
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout1"
          component={nhan_san_pham}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout2"
          component={len_ke}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout3"
          component={lay_hang}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout4"
          component={xu_ly_hang}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout5"
          component={hoan_tat_don_hang}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout6"
          component={tra_ve_ke}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout7"
          component={thay_doi_don_hang}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout8"
          component={doi_vi_tri}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout9"
          component={sap_xep_hang}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout10"
          component={dem_hang}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout11"
          component={in_lai}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="layout12"
          component={may_in}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="detail"
          component={chi_tiet_don_hang}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
