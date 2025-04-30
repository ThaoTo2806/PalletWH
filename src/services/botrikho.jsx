import axios from 'axios';
import constants from '../assets/constants';

const botrikho = axios.create({
    baseURL: constants.baseUrl,
});

export const loadData = async (token, code) => {
    try {
        const response = await botrikho.post(constants.API_URLS.SERVICES, { token, code }, {
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

export default botrikho;
