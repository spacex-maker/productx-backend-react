import React, {Suspense, useEffect, useState} from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import TawkToChat from "src/TawkToChat";
import styled, { createGlobalStyle } from 'styled-components';

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
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/LoginPage'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
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
      <TawkToChat />
    </HashRouter>
  )
}

export default App
