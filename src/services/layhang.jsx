import axios from 'axios';
import constants from '../assets/constants';

const layhang = axios.create({
    baseURL: constants.baseUrl,
});

export const loadData = async (token, code, func, wh_id, status) => {
    try {
        const result = {};
        //console.log(token, code, wh_id);
        const response = await layhang.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, status}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        //console.log(response.data.data[0]);

        for (const item of response.data.data) {
            const key = item.lv011; 
            const value = item.lv014;
            result[key] = value;
        }

        //console.log(result);

        if (response.data) {
            return { success: true, data: result};
        } else {
            return { success: false, message: 'No data found' };
        }
    } catch (error) {
        if (error.stack) {
            console.error('Error stack:', error.stack); 
        }
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export const updateData = async (token, code, func, wh_id, pallet_id, user06) => {
    try {
        //console.log(token, code, func, wh_id, pallet_id, user06);
        
        const response = await layhang.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, pallet_id, user06}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        //console.log(response.data.success);

        if (response.data.success) {
            return { success: true};
        } else {
            return { success: false, message: 'Đã cập nhật sang trạng thái xử lý hàng thành công' };
        }
    } catch (error) {
        console.log('Request URL:', error.config.url);
        if (error.stack) {
            console.log('Error stack:', error.stack); 
        }
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export default layhang;