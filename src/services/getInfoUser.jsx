import axios from 'axios';
import constants from '../assets/constants';

const getInfoUser = axios.create({
    baseURL: constants.baseUrl,
});

export const loadInfo = async (code, token) => {
    try {
        const response = await getInfoUser.post(constants.API_URLS.SERVICES, { code, token }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        //console.log(response.data);
        //console.log(response.data.data[0].lv001);
        if (response.data) {
            return { success: true, data: response.data.data[0]};
        } else {
            return { success: false, message: 'No data found' };
        }
    } catch (error) {
        // Catch any error and return a failure response
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export const loadData1 = async (code,token) => {
    try {
        const response = await getInfoUser.post(constants.API_URLS.SERVICES, {code,token}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        //console.log(response.data);
        if (response.data) {
            return { success: true, data: response.data};
        } else {
            return { success: false, message: 'No data found' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export default getInfoUser;
