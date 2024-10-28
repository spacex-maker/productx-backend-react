import api from 'src/axiosInstance';

const BatchButton = async (endpoint, ids) => {
        await api.put(endpoint, {
            idList: ids
        })
}

export { BatchButton }
