import axios from 'axios';
import constants from '../assets/constants';

const doivitri = axios.create({
    baseURL: constants.baseUrl,
});

export const updateData = async (token, code, func, wh_id, user06, pallet_id, position) => {
    try {
        console.log(token, code, func, wh_id, user06, pallet_id, position);
        const response = await doivitri.post(constants.API_URLS.SERVICES, { token, code, func, wh_id, user06, pallet_id, position }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(response);
        //console.log(response.data.success);
        if (response.data.success) {
            return { success: true};
        } else {
            return { success: false, message: response.data.error };
        }
    } catch (error) {
        return { success: false, message: 'Đã có lỗi xảy ra, vui lòng thử lại' };
    }
};

export default doivitri;
