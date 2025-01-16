import axios from 'axios';
import { message } from 'antd';

// 定义环境配置
export const BASE_URL = {
  TEST: {
    url: 'http://34.92.193.186:8090',
    name: '测试(测试库1)，主机2c8g-谷歌云-香港',
  },
  TEST2: {
    url: 'http://34.92.218.25:18090',
    name: '测试(测试库1)，主机16c60g-内网-北京',
  },
  PROD: {
    url: 'https://protx.cn',
    name: '生产(测试库1)，主机2c2g-谷歌云-香港',
  },
  LOCAL: {
    url: 'http://localhost:8090',
    name: '本地',
  },
};

const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

class AxiosUtil {
  static instance;
  constructor() {
    if (AxiosUtil.instance) {
      return AxiosUtil.instance;
    }
    this.axiosInstance = null;
    this.whiteList = ['/login'];
    this.axiosInstance = axios.create({
      baseURL: this._getBaseURL(),
      withCredentials: true,
      headers:{
        'Content-Type': 'application/json'
      }
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        const isWhitelisted = this.whiteList.some((path) => config.url.includes(path));
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

    this.axiosInstance.interceptors.response.use(
      (response) => {
        const { success, data, message: msg } = response.data;
        if (success) {
          return data;
        }
        message.error(`${msg}`, 4);
        return Promise.reject(new Error(msg || 'Error'));
      },
      (error) => {
        if (error.response) {
          const { status, error: errorType, message } = error.response.data;
          if (status === 401) {
            message.warning('未授权，请重新登录', 4);
          } else {
            message.error(`请求失败: ${message || errorType}`, 4);
          }
        } else {
          message.error('请登录', 4);
        }
        return Promise.reject(error);
      },
    );
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AxiosUtil();
    }
    return this.instance;
  }

  static getAxiosInstance() {
    return this.getInstance().axiosInstance;
  }

  _getBaseURL() {
    const autoDetectEnvironment = () => {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'LOCAL';
      } else if (hostname.includes('test')) {
        return 'TEST';
      }
      return 'PROD';
    };
    const defaultBaseURL = BASE_URL[autoDetectEnvironment()].url;
    const API_BASE_URL_STORAGE_KEY = '__API_BASE_URL';
    return localStorage.getItem(API_BASE_URL_STORAGE_KEY) ?? defaultBaseURL;
  }

  setBaseURL(url) {
    const API_BASE_URL_STORAGE_KEY = '__API_BASE_URL';
    const baseURL = BASE_URL[url].url;
    if (baseURL) {
      this.axiosInstance.defaults.baseURL = baseURL;
      localStorage.setItem(API_BASE_URL_STORAGE_KEY, baseURL);
      message.success(`API 基地址已切换到${BASE_URL[url].name}环境: ${baseURL}`);
      return;
    }
    if (isValidURL(url)) {
      this.axiosInstance.defaults.baseURL = url;
      localStorage.setItem(API_BASE_URL_STORAGE_KEY, url);
      message.success(`已切换到自定义环境: ${url}`);
      return;
    }
    message.error('无效的环境配置');
  }
}

export const axiosInstance = AxiosUtil.getAxiosInstance();
