import api from 'src/axiosInstance';

const DeleteBatchButton = async (endpoint, ids) => {
  try {
    const response = await api.delete(endpoint, {
      data: { idList: ids },
    });
    return response;  // 返回响应结果
  } catch (error) {
    throw error;  // 抛出错误让调用方处理
  }
};

export { DeleteBatchButton };
