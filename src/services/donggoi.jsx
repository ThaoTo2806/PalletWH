import axios from 'axios';
import constants from '../assets/constants';

const donggoi = axios.create({
    baseURL: constants.baseUrl,
});

export const loadLoHang = async (token, code, func) => {
    try {
        const response = await donggoi.post(constants.API_URLS.SERVICES, { token, code, func }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        //console.log(response.data);
        if (response.data) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: 'No data found' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export const loadSanPham = async (token, code, func, name) => {
    try {
        const response = await donggoi.post(constants.API_URLS.SERVICES, { token, code, func, name }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        //console.log(response.data);
        if (response.data) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: 'No data found' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export const layMaThung = async (token, code, func, data) => {
    try {
        const response = await donggoi.post(constants.API_URLS.SERVICES, { token, code, func, ...data }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        //console.log(response.data);
        if (response.data) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: 'No data found' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export const ghiThung = async (token, code, func, data) => {
    try {
        const response = await donggoi.post(
            constants.API_URLS.SERVICES,
            { token, code, func, ...data }, // dàn object data ra các key
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (response.data) {
            return { success: true, data: response.data };
        } else {
            return { success: false, message: 'No data found' };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};


export default donggoi;
