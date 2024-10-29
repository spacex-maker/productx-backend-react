import React from 'react'
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  // // 从 Cookie 中读取 jwtManageToken
  // const token = Cookies.get('jwtManageToken');
  //
  // if (!token) {
  //   // 如果没有token，则跳转到登录页面
  //   return <Navigate to="/login" />;
  // }

  // 如果有token，则渲染子组件
  return children;
};

export default PrivateRoute;
