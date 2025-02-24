import { to } from 'src/utils/awaitTo';
import { axiosInstance } from 'src/utils/axiosUtil';

const searchUserService = async (username) => {
  console.log('发送请求参数:', {
    currentPage: 1,
    pageSize: 10,
    isBelongSystem: true,
    username
  });
  
  return await to(
    axiosInstance.get('/manage/user/list-all', {
      params: {
        currentPage: 1,
        pageSize: 10,
        isBelongSystem: true,
        username
      }
    })
  );
};

const getUserDetailService = async (userId) => {
  return await to(
    axiosInstance.get('/manage/user/detail', {
      params: {
        id: userId
      }
    })
  );
};

export {
  searchUserService,
  getUserDetailService
}; 