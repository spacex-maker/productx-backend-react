import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export var API_BASE_URL = 'http://127.0.0.1:8090'; // 默认地址

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
    config.baseURL = API_BASE_URL;
    const token = localStorage.getItem('jwtManageToken');
    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    const { success, data, message: msg } = response.data;

    if (success) {
      console.log("请求成功");
      return data;
    } else {
      const error = response.data.error || 'Unknown Error'; // 默认错误信息
      if (error === 'Unauthorized') {
        message.warning('会话已过期，请重新登录', 4);
        return Promise.reject(new Error('Session expired'));
      } else {
        message.error(`错误码: ${success}, 错误信息: ${msg}`, 4);
        return Promise.reject(new Error(msg || 'Error'));
      }
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
