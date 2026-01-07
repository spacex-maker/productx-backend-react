import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import { setCurrentUser } from './store/user';
import './scss/style.scss';
import styled, { createGlobalStyle } from 'styled-components';
import { ConfigProvider } from 'antd';
import { CustomTheme } from './config/theme';
import GlobalAIChat from './components/GlobalAIChat';
import { setNavigate } from './utils/navigationService';

// 添加全局样式
const GlobalStyle = createGlobalStyle`
  #tawk-default-container {
    left: 20px !important;
    right: auto !important;
    bottom: 20px !important;
  }

  .tawk-min-container {
    left: 20px !important;
    right: auto !important;
    bottom: 20px !important;
  }

  .tawk-button {
    width: 32px !important;
    height: 32px !important;
    padding: 6px !important;
  }

  iframe#tawkId {
    width: 280px !important;
    height: 360px !important;
    left: 20px !important;
    right: auto !important;
    bottom: 70px !important;
  }

  .tawk-custom-color {
    background-color: #1890ff !important;
  }
`;

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/LoginPage'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const defaultTheme = 'light';
const themeLocalStorageKey = 'coreui-free-react-admin-template-theme';

// 内部组件用于设置导航服务
const NavigationSetter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);
  return null;
};

const App = () => {
  const { colorMode, isColorModeSet, setColorMode } = useColorModes(themeLocalStorageKey);
  const dispatch = useDispatch();
  const theme = isColorModeSet() ? CustomTheme[colorMode] : CustomTheme[defaultTheme];

  useEffect(() => {
    const handleColorSchemeChange = () => {
      const colorMode = localStorage.getItem('coreui-free-react-admin-template-theme');
      setColorMode(colorMode ?? defaultTheme);
    };

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange);

    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange);
    };
  }, []);

  useEffect(() => {
    // 从 localStorage 恢复用户信息
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);
        dispatch(setCurrentUser(userInfo));
      } catch (error) {
        console.error('Failed to parse stored user info:', error);
        localStorage.removeItem('currentUser'); // 如果解析失败，清除存储的数据
      }
    }
  }, [dispatch]);

  return (
    <ConfigProvider theme={theme}>
      <HashRouter>
        <NavigationSetter />
        <GlobalStyle />
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route exact path="/login" name="登录" element={<Login />} />
            <Route exact path="/register" name="注册" element={<Register />} />
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
        {/*<TawkToChat />*/}
        <GlobalAIChat />
      </HashRouter>
    </ConfigProvider>
  );
};

export default App;
