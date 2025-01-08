import api from 'src/axiosInstance';

const DeleteBatchButton = async (endpoint, ids) => {
  await api.delete(endpoint, {
    data: { idList: ids },
  });
};

export { DeleteBatchButton };
