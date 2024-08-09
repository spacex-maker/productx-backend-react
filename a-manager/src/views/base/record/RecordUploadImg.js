import api from "src/axiosInstance";
import {message} from "antd";

const RecordUploadImg = async (values) => {
  try {
    const token = localStorage.getItem('jwtManageToken');
    const formData = new FormData();

    // 处理其他字段
    Object.keys(values).forEach((key) => {
        formData.append(key, key === 'photoTime' ? values[key].format("YYYY-MM-DDTHH:mm:ss") : values[key]);
    });

    await api.post('/manage/record/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `${token}`,
      },
    });

    message.success('Upload successful!');
  } catch (error) {
    console.error('Failed to upload image', error);
    message.error('Upload failed!');
  }
};

export { RecordUploadImg }
