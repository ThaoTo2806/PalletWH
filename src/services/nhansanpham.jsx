import axios from 'axios';
import constants from '../assets/constants';

const nhansanpham = axios.create({
    baseURL: constants.baseUrl,
});

export const loadData2 = async (token, code, func, wh_id, coke, zone, pallettypeid) => {
    try {
        const result = {};
        console.log(token, code, wh_id, coke, zone, pallettypeid);
        const response = await nhansanpham.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, coke, zone, pallettypeid}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        console.log(response);

        for (const item of response.data.data) {
            const key = item.position; 
            const value = item.position;
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

export const updateData = async (token, code, func, wh_id, user06, pallet_id, position) => {
    try {
        const response = await nhansanpham.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, user06, pallet_id, position }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        //console.log(response.data.success);
        if (response.data.success) {
            return { success: true};
        } else {
            return { success: false, message: 'Nhận sản phẩm thất bại' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export const updateData2 = async (token, code, func, wh_id, user06, pallet_id, position) => {
    try {
        const response = await nhansanpham.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, user06, pallet_id, position }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        //console.log(response.data.success);
        if (response.data.success) {
            return { success: true};
        } else {
            return { success: false, message: 'Trả về kệ thất bại' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};


export default nhansanpham;
