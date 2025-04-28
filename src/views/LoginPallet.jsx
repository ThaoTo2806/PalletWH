import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { handleLogin } from '../assets/httpRequest'; 

export default function LoginPallet({ navigation }) {
  const isDarkMode = useColorScheme() === 'dark';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const handleLoginClick = async () => {
    setLoading(true);
    setLoginError('');

    // Gọi hàm handleLogin từ httpRequest.js
    const result = await handleLogin(username, password);

    if (result.success) {
      // Nếu đăng nhập thành công, chuyển hướng đến Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { token: result.token } }] 
      });
    } else {
      setLoginError(result.message);  // Hiển thị lỗi nếu đăng nhập thất bại
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={['#5bf4fd', '#51a7fe']} style={styles.gradient} />
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logologin.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Ô nhập tài khoản */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Tài Khoản"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Ô nhập mật khẩu với icon show/hide */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Mật Khẩu"
            style={styles.input}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
            <Icon name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={25} color="#6600ff" />
          </TouchableOpacity>
        </View>

        {/* Quên mật khẩu */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {/* Hiển thị lỗi đăng nhập nếu có */}
        {loginError ? (
          <Text style={styles.errorText}>{loginError}</Text>
        ) : null}

        {/* Nút Đăng Nhập */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLoginClick}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.loginText}>ĐĂNG NHẬP</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    height: '60%',
    width: '90%',
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  forgotPassword: {
    color: '#6600ff',
    marginTop: 10,
    textAlign: 'right',
    width: '100%',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 20,
    width: '80%',
    height: 50,
    backgroundColor: '#6600ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});
