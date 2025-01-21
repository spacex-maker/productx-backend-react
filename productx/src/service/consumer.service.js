import { to } from 'src/utils/awaitTo';
import { axiosInstance } from 'src/utils/axiosUtil';

export const getConsumerListService = async (params) => {
  return await to(
    axiosInstance.get('/manage/user/list', {
      params,
    }),
  );
};

export const getConsumerByIdService = async (id) => {
  return await to(
    axiosInstance.get('/manage/user/summary', {
      params: { id },
    }),
  );
};
