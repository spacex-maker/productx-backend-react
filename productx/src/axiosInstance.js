import axios from 'axios';
import { message } from 'antd';
import { getNavigate } from './utils/navigationService';

// 定义环境配置
export const API_CONFIG = {
  TEST: 'http://34.92.193.186:8090',
  TEST2: 'http://34.92.218.25:18090',
  PROD: 'https://admin.anakkix.cn',
  LOCAL: 'http://localhost:8090',
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

const API_BASE_URL_STORAGE_KEY = '__API_BASE_URL';

(function setBaseUrlByStorage() {
  API_BASE_URL = localStorage.getItem(API_BASE_URL_STORAGE_KEY) ?? API_BASE_URL;
})();

// 设置 API 基地址
export const setBaseURL = (environment) => {
  const url = API_CONFIG[environment];
  if (!url) {
    message.error('无效的环境配置');
    return;
  }
  API_BASE_URL = url;
  axiosInstance.defaults.baseURL = url;
  localStorage.setItem(API_BASE_URL_STORAGE_KEY, url);

  // 更新环境提示信息
  const envNames = {
    PROD: '生产(测试库1)，主机2c2g-谷歌云-香港',
    TEST2: '测试(测试库1)，主机16c60g-内网-北京',
    TEST: '测试(测试库1)，主机2c8g-谷歌云-香港',
    LOCAL: '本地',
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
  withCredentials: true, // 允许携带 Cookie
});
// 请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 检查请求路径是否在白名单中
    const isWhitelisted = whiteList.some((path) => config.url.includes(path));

    // 只有不在白名单中的请求才添加 token
    if (!isWhitelisted) {
      const token = localStorage.getItem('jwtManageToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
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
    console.log('===== axios 拦截器捕获到错误 =====', error); // 调试日志
    
    if (error.response) {
      // 判断状态码
      const status = error.response.status;
      const { error: errorType, message: errorMsg } = error.response.data || {};

      console.log('错误响应状态码:', status, '完整响应:', error.response); // 调试日志

      if (status === 401) {
        console.log('✅ 检测到 401，立即执行跳转'); // 调试日志
        
        // 清除token和用户信息
        localStorage.removeItem('jwtManageToken');
        localStorage.removeItem('currentUser');
        
        // 显示提示信息
        message.warning('未授权，请重新登录');
        
        // 立即跳转，不使用延迟
        const navigate = getNavigate();
        console.log('导航函数:', navigate); // 调试日志
        
        if (navigate) {
          console.log('🚀 使用 React Router navigate 跳转'); // 调试日志
          try {
            navigate('/login');
            console.log('✅ navigate 执行完成'); // 调试日志
          } catch (navError) {
            console.error('❌ navigate 执行失败:', navError); // 调试日志
            window.location.href = '#/login';
          }
        } else {
          console.log('⚠️ 导航服务未初始化，使用 window.location 跳转'); // 调试日志
          window.location.href = '#/login';
        }
      } else {
        message.error(`请求失败: ${errorMsg || errorType || '未知错误'}`, 4);
      }
    } else if (error.request) {
      console.log('网络错误，可能是 401 被 CORS 拦截'); // 调试日志
      
      // 检查是否是 401 被 CORS 拦截导致的网络错误
      // 如果没有 token，很可能是未授权导致的
      const token = localStorage.getItem('jwtManageToken');
      if (!token) {
        console.log('⚠️ 没有 token，可能是 401 被 CORS 拦截，跳转登录页'); // 调试日志
        localStorage.removeItem('jwtManageToken');
        localStorage.removeItem('currentUser');
        message.warning('登录已过期，请重新登录');
        
        const navigate = getNavigate();
        if (navigate) {
          navigate('/login');
        } else {
          window.location.href = '#/login';
        }
      } else {
        message.error('网络错误，请检查网络连接', 4);
      }
    } else {
      console.log('其他错误:', error.message); // 调试日志
      message.error(`请求失败: ${error.message || '未知错误'}`, 4);
    }
    return Promise.reject(error);
  },
);

// 添加设置自定义基地址的函数
export const setCustomBaseURL = (customUrl) => {
  API_BASE_URL = customUrl;
  axiosInstance.defaults.baseURL = customUrl;
  localStorage.setItem(API_BASE_URL_STORAGE_KEY, customUrl);
  message.success(`已切换到自定义环境: ${customUrl}`);
};

export default axiosInstance;
