import axios from 'axios';
import { getGenericPassword, setGenericPassword, resetGenericPassword } from 'react-native-keychain';
import constants from './constants';

const httpRequest = axios.create({
    baseURL: constants.baseUrl,
});

// Interceptor cho các yêu cầu (request) gửi đi
httpRequest.interceptors.request.use(
    async config => {
        try {
            // Lấy token từ Keychain
            const userData = await getGenericPassword();

            if (userData) {
                const { token } = JSON.parse(userData.password); // Dữ liệu là token được lưu trữ

                // Gắn token vào header của các yêu cầu
                if (token) {
                    config.headers['X-User-Token'] = token;  // Add token to headers
                }
            }
        } catch (error) {
            console.error('Error getting token:', error);
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

// Interceptor cho các phản hồi (response) từ server
httpRequest.interceptors.response.use(
    (response) => {
        // Handle invalid token or other cases
        if (response.data && response.data.message === 'invalid') {
            resetGenericPassword(); // Clear the stored data
        }
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    },
);


// Hàm xử lý đăng nhập và lưu token vào Keychain
export const handleLogin = async (username, password) => {
    try {
        // Tạo data theo định dạng application/x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('txtUserName', username);
        formData.append('txtPassword', password);

        // Gửi yêu cầu với Content-Type là application/x-www-form-urlencoded
        const response = await axios.post(constants.API_URLS.LOGIN, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Kiểm tra nếu API trả về token
        if (response.data && response.data.token) {
            const { token } = response.data;
            
            // Lưu token vào Keychain
            await setGenericPassword('token', token);

            return { success: true, token: token };
        } else {
            return { success: false, message: 'Thông tin tài khoản không chính xác' };
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};
export default httpRequest;
