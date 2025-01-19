import { to } from 'src/utils/awaitTo';
import { axiosInstance } from 'src/utils/axiosUtil';

export const getProductListService = async (params) => {
  return await to(
    axiosInstance.get('/manage/user-product/list', {
      params,
    }),
  );
};

export const deleteProductService = async (productId) => {
  return await to(axiosInstance.post('/manage/user-product/remove', { id: productId }));
};

export const deleteProductByIdsService = async (productIds) => {
  return await to(
    axiosInstance.delete('/manage/user-product/delete-batch', { data: { idList: productIds } }),
  );
};

export const updateProductService = async (product) => {
  return await to(axiosInstance.put('/manage/user-product/update', product));
};

export const createProductService = async (product) => {
  return await to(axiosInstance.post('/manage/user-product/create', product));
};

export const createProductByJsonService = async (jsonProduct) => {
  return await to(axiosInstance.post('/manage/user-product/create-json', jsonProduct));
};

export const detailProductService = async (productId) => {
  return await to(
    axiosInstance.get('/manage/user-product/detail', {
      params: {
        id: productId,
      },
    }),
  );
};
