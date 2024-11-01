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
    setCaptcha(`${API_BASE_URL + '/manage/base/system/captcha'}?${new Date().getTime()}`);
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
    window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23liKtBY8tbrKGO1q2&redirect_uri=http://127.0.0.1:8090/manage/manager/github-callback`;
  };

  return (
    <div>
      <LoginHeader />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <CCardGroup>
                <CCard className="p-3">
                  <CCardBody>
                    <CCol xs={12}>
                      <CFormSelect value={protocol} onChange={(e) => setProtocol(e.target.value)} size="sm">
                        <option value="http">http</option>
                        <option value="https">https</option>
                      </CFormSelect>
                      <CInputGroup className="mb-2">
                        <CFormInput
                          placeholder="请输入 API 基地址"
                          value={apiBaseURL}
                          onChange={(e) => setApiBaseURL(e.target.value)}
                          size="sm"
                        />
                        <CButton color="primary" className="px-2" type="button" onClick={handleSetBaseURL}>
                          设置
                        </CButton>
                      </CInputGroup>
                    </CCol>
                    <CForm onSubmit={handleLogin}>
                      <h4 className="mb-3">登录</h4>
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
                      <CInputGroup className="mb-3">
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
                          maxLength="6"
                          value={verify}
                          onChange={(e) => setVerify(e.target.value)}
                          size="sm"
                        />
                      </CInputGroup>

                      <CRow>
                        <CCol xs={4}>
                          <CButton color="primary" className="px-3" type="submit" disabled={loading} size="sm">
                            {loading ? '登录中...' : '登录'}
                          </CButton>
                        </CCol>
                        <CCol xs={4} className="text-right">
                          <CButton color="link" className="px-0" style={{ float: 'right', fontSize: 'smaller' }}>
                            忘记密码
                          </CButton>
                        </CCol>
                        <CCol xs={4}>
                          <CButton color="primary" className="px-3" type="button" onClick={handleGitHubLogin} size="sm">
                            GitHub 登录
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
