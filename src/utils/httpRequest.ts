import axios, { AxiosResponse } from 'axios';
import constants from '../assets/constants';

const httpRequest = axios.create({
  baseURL: constants.baseUrl,
  timeout: 100000, 
});

// const httpRequest = axios.create({
//   baseURL: 'http://192.168.1.18:5001/',
//   timeout: 100000, 
// });
 
httpRequest.interceptors.response.use(
  function (response: AxiosResponse) {
    return response.data || { statusCode: response.status };
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default httpRequest;
