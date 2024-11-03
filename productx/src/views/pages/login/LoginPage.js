import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilLockUnlocked, cilUser } from '@coreui/icons';
import LoginHeader from 'src/views/pages/login/LoginHeader';
import axiosInstance, { API_BASE_URL, setBaseURL } from 'src/axiosInstance';
import { message } from 'antd';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState();
  const [apiBaseURL, setApiBaseURL] = useState('');
  const [protocol, setProtocol] = useState('http');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(`${API_BASE_URL}/manage/base/system/captcha?${new Date().getTime()}`);
  };

  const handleSetBaseURL = () => {
    if (apiBaseURL) {
      const fullURL = `${protocol}://${apiBaseURL}`;
      setBaseURL(fullURL);
      console.log('设置的 API 基地址:', fullURL);
    } else {
      console.error('请输入有效的 API 基地址');
    }
  };

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = { username, password, verify };
    try {
      await axiosInstance.post('/manage/manager/login', formData);
      navigate('/dashboard');
      setNotice("登录成功");
    } catch (error) {
      message.error('登录失败: ' + error.message, 4);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=Ov23liKtBY8tbrKGO1q2&redirect_uri=http://127.0.0.1:8090/manage/manager/github-callback';
  };

  return (
    <div>
      <LoginHeader />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={4}>
              <CCardGroup>
                <CCard className="p-3">
                  <CCardBody>
                    <CRow className="mb-3">
                      <CCol xs={12}>
                        <CRow>
                          <CCol xs={4}>
                            <CFormSelect value={protocol} onChange={(e) => setProtocol(e.target.value)} size="sm">
                              <option value="http">http</option>
                              <option value="https">https</option>
                            </CFormSelect>
                          </CCol>
                          <CCol xs={8}>
                            <CInputGroup>
                              <CFormInput
                                placeholder="请输入 API 基地址"
                                value={apiBaseURL}
                                onChange={(e) => setApiBaseURL(e.target.value)}
                                size="sm"
                              />
                              <CButton
                                className="custom-button"
                                size={"sm"}
                                color="primary" className="px-2" type="button" onClick={handleSetBaseURL}>
                                设置
                              </CButton>
                            </CInputGroup>
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                    <CForm onSubmit={handleLogin}>
                      <h5 className="mb-3">登录</h5>
                      {notice && <p id="manager-login-notice">{notice}</p>}
                      <CInputGroup className="mb-2">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="用户名"
                          autoComplete="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          size="sm"
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-2">
                        <CInputGroupText>
                          <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} onClick={() => setShowPassword(!showPassword)} />
                        </CInputGroupText>
                        <CFormInput
                          type={showPassword ? 'text' : 'password'}
                          placeholder="密码"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          size="sm"
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-2">
                        <div>
                          <img
                            className="captcha-img"
                            src={captcha}
                            alt="验证码"
                            onClick={refreshCaptcha}
                            style={{ cursor: 'pointer', marginRight: '5px' }}
                          />
                        </div>
                        <CFormInput
                          type="text"
                          className="form-control"
                          placeholder="请输入验证码"
                          maxLength="4"
                          value={verify}
                          onChange={(e) => setVerify(e.target.value)}
                          size="sm"
                        />
                      </CInputGroup>

                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-3" type="submit" disabled={loading} size="sm">
                            {loading ? '登录中...' : '登录'}
                          </CButton>
                        </CCol>
                        <CCol xs={3} className="text-right">
                          <CButton color="link" className="px-0" style={{ float: 'right', fontSize: 'smaller' }}>
                            忘记密码
                          </CButton>
                        </CCol>
                        <CCol xs={3} className="text-right" >
                          <CButton
                            style={{width: '100%'}}
                            color="primary"
                            className="px-2"
                            type="button"
                            onClick={handleGitHubLogin} size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-github" viewBox="0 0 16 16">
                              <path
                                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                            </svg>
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </div>
  );
};

export default LoginPage;
