import httpRequest from '../utils/httpRequest';

// Lấy danh sách lô
export const getBatch = async (kho_id: string): Promise<any> => {
  return await httpRequest.get('/api/ma_lo', { params: { kho_id } });
};

// Lấy danh sách sản phẩm
export const getProduct = async (lo_id: string): Promise<any> => {
  return await httpRequest.get('/api/san_pham', { params: { lo_id } });
};

// Lấy danh sách kho
export const getWareHouse = async (): Promise<any> => {
  return await httpRequest.get('/api/kho', {});
};

// Thêm dữ liệu
export const insertData = async (payload: any): Promise<any> => {
  return await httpRequest.post('/api/ghi_du_lieu', payload);
};

// Lấy mã thùng
export const getBox = async (payload: any): Promise<any> => {
  return await httpRequest.post('/api/ma_thung', payload);
};

// Thêm dữ liệu
export const insertData_v2 = async (payload: any): Promise<any> => {
  return await httpRequest.post('/api/ghi_du_lieu_v2', payload);
};

// Lấy danh lô
export const getBatch_v2 = async (): Promise<any> => {
  return await httpRequest.post('/api/ma_lo_v2', {});
};

// Lấy danh sách sản phẩm
export const getProduct_v2 = async (name:string): Promise<any> => {
  return await httpRequest.post('/api/san_pham_v2', { params: { name } });
};
