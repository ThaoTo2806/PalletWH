import axios from 'axios';
import constants from '../assets/constants';

const lenke = axios.create({
    baseURL: constants.baseUrl,
});

export const loadData = async (token, code, func, wh_id) => {
    try {
        const result = {};
        const response = await lenke.post(constants.API_URLS.SERVICES, { token, code, func, wh_id }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        for (const item of response.data.data) {
            const key = item.lv011; 
            const value = item.lv001;
            result[key] = value;
        }
        //console.log(result);
        //console.log(response.data.data[0].lv001);
        if (response.data) {
            return { success: true, data: result};
        } else {
            return { success: false, message: 'No data found' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export const updateData = async (token, code, func, wh_id, user06, pallet_id) => {
    try {
        const response = await lenke.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, user06, pallet_id }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        //console.log(response.data.success);
        if (response.data.success) {
            return { success: true};
        } else {
            return { success: false, message: 'Lên kệ thất bại' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export default lenke;
