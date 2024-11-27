import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

// 定义环境配置
export const API_CONFIG = {
  TEST: 'http://34.92.193.186:18090',
  PROD: 'https://protx.cn',
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

// 将 const 改为 let，使其可以被修改
export let API_BASE_URL = API_CONFIG[autoDetectEnvironment()];

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
    TEST: '测试(推荐)',
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

// 添加不需要 token 的白名单路径
const whiteList = [
  '/login',
  // 可以添加其他不需要 token 的路径
];

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

    // 检查请求路径是否在白名单中
    const isWhitelisted = whiteList.some(path =>
      config.url.includes(path)
    );

    // 只有不在白名单中的请求才添加 token
    if (!isWhitelisted) {
      const token = localStorage.getItem('jwtManageToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
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

// 添加设置自定义基地址的函数
export const setCustomBaseURL = (customUrl) => {
  API_BASE_URL = customUrl;
  axiosInstance.defaults.baseURL = customUrl;
  message.success(`已切换到自定义环境: ${customUrl}`);
};

export default axiosInstance;
