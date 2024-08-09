import axios from 'axios'
import {message} from "antd";
const axiosInstance = axios.create({
    baseURL: 'https://www.anakkix.cn/',
})
// 请求拦截器
axiosInstance.interceptors.request.use(config => {
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
  const { code, data, message: msg	 } = response.data;

  if (code === 200) {
    return data;
  } else if (code === 302) {
    // 302 重定向逻辑，通常需要跳转到登录页面
    message.warning('会话已过期，请重新登录', 4);
    return Promise.reject(new Error('Session expired'));
  } else {
    // 弹出错误信息提示
    message.error(`错误码: ${code}, 错误信息: ${msg}`, 4);
    return Promise.reject(new Error(msg || 'Error'));
  }
}, error => {
  message.error(`请求失败: ${error.message}`, 4);
  return Promise.reject(error);
});
export default axiosInstance
