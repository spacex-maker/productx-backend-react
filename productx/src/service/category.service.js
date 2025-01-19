import { to } from 'src/utils/awaitTo';
import { axiosInstance } from 'src/utils/axiosUtil';

export const getCategoryListService = async (parentId) => {
  return await to(
    axiosInstance.get('/manage/user-product-category/list', {
      params: { parentId },
    }),
  );
};
