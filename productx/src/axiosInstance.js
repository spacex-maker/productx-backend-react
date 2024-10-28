import axios from 'axios'
import {message} from "antd";
import {useNavigate} from "react-router-dom";
export const setBaseURL = (url) => {
    if (!url || typeof url !== 'string' || !isValidURL(url)) {
        message.error('无效的 API 基地址');
        return;
    }
    API_BASE_URL = url;
    message.success(`API 基地址已更新为: ${API_BASE_URL}`);
};




// 校验 URL 的合法性
const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};
export var API_BASE_URL = 'http://127.0.0.1:8090'; // 默认地址，可以根据需要修改

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
})
// 请求拦截器
axiosInstance.interceptors.request.use(config => {
    config.baseURL = API_BASE_URL;
    const token = localStorage.getItem('jwtManageToken');
    if (token) {
        // 如果 Token 存在，则将其添加到请求头中
        config.headers['Authorization'] = `${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
axiosInstance.interceptors.response.use(response => {
  const { success, data, message } = response.data;

  if (success) {
    console.log("登录成功");
    return data;
  } else {
    const { error } = response.data; // 不重新定义 msg
    if (error === "Unauthorized") { // 改为使用 === 进行比较
      // 302 重定向逻辑，通常需要跳转到登录页面
      message.warning('会话已过期，请重新登录', 4);
      return Promise.reject(new Error('Session expired'));
    } else {
      // 弹出错误信息提示
      message.error(`错误码: ${success}, 错误信息: ${message}`, 4); // 使用 message 变量
      return Promise.reject(new Error(message || 'Error'));
    }
  }
}, error => {
  console.error(`请求失败: ${error.message}`, error); // 输出详细的错误信息
  message.error(`请求失败: ${error.message}`, 4);
  return Promise.reject(error);
});

export default axiosInstance
