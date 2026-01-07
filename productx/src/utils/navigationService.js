// 导航服务 - 用于在非组件中进行路由跳转
let navigate = null;

export const setNavigate = (nav) => {
  console.log('导航服务已初始化'); // 调试日志
  navigate = nav;
};

export const getNavigate = () => {
  console.log('获取导航服务:', navigate ? '存在' : '不存在'); // 调试日志
  return navigate;
};

export default {
  setNavigate,
  getNavigate,
};

