import axios from 'axios';
import constants from '../assets/constants';

const sapxephang = axios.create({
    baseURL: constants.baseUrl,
});

export const loadData1 = async (token, code, func, wh_id, pallet_id) => {
    try {
        const response = await sapxephang.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, pallet_id }, {
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

export const updateData = async (token, code, func, wh_id, pallet_id, pallettypeid, status, quantity) => {
    //onsole.log(token, code, func, wh_id, pallet_id, pallettypeid, status, quantity);
    try {
        const response = await sapxephang.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, pallet_id, pallettypeid, status, quantity}, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(response.data.success);
        if (response.data.success) {
            return { success: true};
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

export default sapxephang;
