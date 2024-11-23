import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

// 定义环境配置
export const API_CONFIG = {
  PROD: 'https://protx.cn',
  TEST: 'https://test.protx.cn',
  LOCAL: 'http://localhost:8090'
};

// 自动判断当前环境
const autoDetectEnvironment = () => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'LOCAL';
  } else if (hostname.includes('test')) {
    return 'TEST';
  }
  return 'PROD';
};

// 根据自动检测设置初始环境
export var API_BASE_URL = API_CONFIG[autoDetectEnvironment()];

// 设置 API 基地址
export const setBaseURL = (environment) => {
  const url = API_CONFIG[environment];
  if (!url) {
    message.error('无效的环境配置');
    return;
  }
  API_BASE_URL = url;
  axiosInstance.defaults.baseURL = API_BASE_URL;

  // 更新环境提示信息
  const envNames = {
    PROD: '生产',
    TEST: '测试',
    LOCAL: '本地'
  };
  message.success(`API 基地址已切换到${envNames[environment]}环境: ${API_BASE_URL}`);
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
        // 这里可以执行一些操作例如重定向到登录页
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
