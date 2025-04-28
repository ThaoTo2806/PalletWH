import axios from 'axios';
import constants from '../assets/constants';
import {resetGenericPassword } from 'react-native-keychain';

const logout  = axios.create({
    baseURL: constants.baseUrl,
});

export const resetInfo = async (token) => {
    try {
        const response = await logout.post(constants.API_URLS.LOGOUT, { token }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(response);
        
        if (response.data && response.data.success) {
            await resetGenericPassword();
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        return { success: false, message: {error} };
    }
};

export default logout ;