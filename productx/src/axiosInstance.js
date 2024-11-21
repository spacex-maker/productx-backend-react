import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export var API_BASE_URL = 'https://protx.cn'; // 默认地址

// 设置 API 基地址
export const setBaseURL = (url) => {
  if (!url || typeof url !== 'string' || !isValidURL(url)) {
    message.error('无效的 API 基地址');
    return;
  }
  API_BASE_URL = url;
  axiosInstance.defaults.baseURL = API_BASE_URL; // 动态更新 axios 实例的 baseURL
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

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // 允许携带 Cookie
});
// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    config.baseURL = API_BASE_URL; // 设置基础 URL
    config.withCredentials = true; // 确保跨域请求时携带 Cookie
    const token = localStorage.getItem('jwtManageToken');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {

    const { success, data, message: msg } = response.data;

    if (success) {
      return data;
    } else {
      message.error(`${msg}`, 4);
      return Promise.reject(new Error(msg || 'Error'));
    }
  },
  (error) => {

    if (error.response) {
      // 判断状态码
      const { status, error: errorType, message } = error.response.data;

      if (status === 401) {
        message.warning('未授权，请重新登录', 4);
        // 这里可以执行一些操作，例如重定向到登录页
      } else {
        message.error(`请求失败: ${message || errorType}`, 4);
      }
    } else {
      // 处理网络错误
      message.error('请登录', 4);
    }
    return Promise.reject(error);
  }
);




export default axiosInstance;
