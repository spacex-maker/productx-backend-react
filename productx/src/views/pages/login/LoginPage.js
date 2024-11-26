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
import { cilLockLocked, cilLockUnlocked, cilUser, cilSettings } from '@coreui/icons';
import LoginHeader from 'src/views/pages/login/LoginHeader';
import api, { API_BASE_URL, setBaseURL, API_CONFIG } from 'src/axiosInstance';
import { message } from 'antd';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import WaveEffect from 'src/components/WaveEffect';
import {initReactI18next, useTranslation} from 'react-i18next';
const breakpoints = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px'
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1c2e 0%, #131525 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%);
    top: -300px;
    right: -300px;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%);
    bottom: -250px;
    left: -250px;
    border-radius: 50%;
  }
`;

const ContentWrapper = styled(CContainer)`
  padding-top: 80px;

  @media (max-width: ${breakpoints.sm}) {
    padding-top: 60px;
  }
`;

const LoginCard = styled(CCard)`
  background: rgba(30, 32, 47, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);

  h4 {
    color: #f1f5f9;
    margin: 0;
    font-weight: 600;
    font-size: 1.25rem;
    background: linear-gradient(120deg, #6366f1, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const CardBody = styled(CCardBody)`
  padding: 24px;
`;

const ApiSection = styled.div`
  margin-bottom: ${props => props.$visible ? '16px' : '0'};
  padding: ${props => props.$visible ? '16px' : '0'};
  background: rgba(99, 102, 241, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? '0' : '-20px'});
  height: ${props => props.$visible ? 'auto' : '0'};
  pointer-events: ${props => props.$visible ? 'all' : 'none'};
`;

const ApiTitle = styled.div`
  font-size: 0.875rem;
  color: #8b5cf6;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ApiInputGroup = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 1px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 6px;
  padding: 1px;
`;

const EnvSelect = styled(CFormSelect)`
  width: 120px !important;
  border-radius: 4px 0 0 4px !important;
  border: none !important;
  background: rgba(30, 32, 47, 0.95) !important;
  color: #f1f5f9 !important;
  font-size: 0.875rem !important;
  
  &:focus {
    box-shadow: none !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }
`;

const ApiInput = styled(CFormInput)`
  flex: 1;
  background: rgba(30, 32, 47, 0.95) !important;
  border: none !important;
  color: #f1f5f9 !important;
  font-size: 0.875rem !important;
  border-radius: ${props => props.$isCustom ? '4px' : '0 4px 4px 0'} !important;
  
  &:disabled {
    background: rgba(255, 255, 255, 0.02) !important;
    color: rgba(255, 255, 255, 0.5) !important;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ApiButton = styled(CButton)`
  min-width: 80px;
  background: #6366f1 !important;
  border: none !important;
  color: white !important;
  font-size: 0.875rem !important;
  border-radius: 4px !important;
  margin-left: 1px !important;
  
  &:hover {
    background: #4f46e5 !important;
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const LoginForm = styled(CForm)`
  .divider {
    margin: 24px 0;
    border-top: 1px solid rgba(99, 102, 241, 0.1);
    position: relative;

    &::after {
      content: 'or';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(30, 32, 47, 0.95);
      padding: 0 16px;
      color: #64748b;
      font-size: 0.875rem;
    }
  }
`;

const StyledInputGroup = styled(CInputGroup)`
  margin-bottom: 12px;

  .input-group-text {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-right: none;
    color: #8b5cf6;
    padding: 6px 10px;
    cursor: pointer;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  &:last-of-type {
    margin-bottom: 20px;
  }
`;

const StyledInput = styled(CFormInput)`
  background: rgba(30, 32, 47, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-left: none;
  color: #e2e8f0;
  padding: 6px 10px;
  font-size: 14px;
  height: 32px;
  line-height: 20px;
  transition: all 0.3s ease;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    background: rgba(30, 32, 47, 0.98);
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
    color: #f1f5f9;
  }

  &:hover {
    background: rgba(99, 102, 241, 0.1);
  }
`;

const StyledButton = styled(CButton)`
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  border: none;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    background: linear-gradient(120deg, #4b4d8b, #5d4b8b);
    opacity: 0.7;
  }
`;

const GithubButton = styled(CButton)`
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #8b5cf6;
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
`;

const ForgotPasswordLink = styled.a`
  color: #8b5cf6;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #6366f1;
    text-decoration: underline;
  }
`;

const StyledFormSelect = styled(CFormSelect)`
  height: 36px;
  background: rgba(30, 32, 47, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #e2e8f0;
  font-size: 14px;
  padding: 8px 12px;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(30, 32, 47, 0.98);
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
    color: #f1f5f9;
  }

  &:hover {
    background: rgba(99, 102, 241, 0.1);
  }

  option {
    background: #1a1c2e;
    color: #e2e8f0;
    padding: 8px;
  }
`;

const CaptchaInputGroup = styled(StyledInputGroup)`
  .captcha-wrapper {
    display: flex;
    align-items: center;
    padding: 2px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-right: none;

    img {
      height: 28px;
      border-radius: 3px;
      cursor: pointer;
    }
  }
`;

const ApiConfigHint = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: #8b5cf6;
  font-size: 12px;
  opacity: 0.7;
  pointer-events: none;

  @media (max-width: ${breakpoints.sm}) {
    display: none;
  }
`;

const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState();
  const [selectedEnv, setSelectedEnv] = useState('PROD');
  const [loading, setLoading] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const { t } = useTranslation(); // 获取 t 函数
  const [isCustomEnv, setIsCustomEnv] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(`${API_BASE_URL}/manage/base/system/captcha?${new Date().getTime()}`);
  };

  const handleSetBaseURL = () => {
    if (isCustomEnv) {
      if (!isValidURL(customUrl)) {
        message.error('请输入有效的URL地址（以 http:// 或 https:// 开头）');
        return;
      }
      API_BASE_URL = customUrl;
      axiosInstance.defaults.baseURL = customUrl;
      message.success(`已切换到自定义环境: ${customUrl}`);
    } else {
      setBaseURL(selectedEnv);
    }
    refreshCaptcha();
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
      return false;
    }
  };

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = { username, password, verify };
    try {
      const token = await api.post('/manage/manager/login', formData);
      localStorage.setItem('jwtManageToken',token);
      navigate('/dashboard');
      setNotice("登录成功");
    } catch (error) {
      message.error('登录失败: ' + error.message, 4);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = 'https://github.com/login/oauth/authorize?client_id=Ov23liKtBY8tbrKGO1q2&redirect_uri=https://protx.cn/manage/manager/github-callback';
  };

  // 定义随机初始位置
  const getRandomPosition = () => ({
    x: (Math.random() - 0.5) * window.innerWidth * 0.8,
    y: (Math.random() - 0.5) * window.innerHeight * 0.8,
    rotate: Math.random() * 360 - 180,
    scale: 0.5 + Math.random() * 0.5,
  });

  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: (i) => ({
      ...getRandomPosition(),
      opacity: 0
    }),
    visible: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100,
        duration: 1.5
      }
    }
  };

  const handleWaveDoubleClick = () => {
    setShowApiConfig(prev => !prev);
    message.info(showApiConfig ? 'API 配置已隐藏' : 'API 配置已显示');
  };

  // 在组件加载时自动设置当前环境
  useEffect(() => {
    const hostname = window.location.hostname;
    let initialEnv = 'PROD';

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      initialEnv = 'LOCAL';
    } else if (hostname.includes('test')) {
      initialEnv = 'TEST';
    }

    setSelectedEnv(initialEnv);
  }, []);

  return (
    <PageWrapper>
      <WaveEffect onDoubleClick={handleWaveDoubleClick} />
      <LoginHeader />
      <div className="min-vh-100 d-flex align-items-center">
        <ContentWrapper>
          <CRow className="justify-content-center">
            <CCol xs={12} sm={10} md={8} lg={6} xl={5}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <LoginCard>
                  <motion.div variants={itemVariants} custom={0}>
                    <CardHeader>
                      <h4>{t('login')} ProductX Admin</h4>
                    </CardHeader>
                  </motion.div>

                  <CardBody>
                    <motion.div variants={itemVariants} custom={1}>
                      <ApiSection $visible={showApiConfig}>
                        <ApiTitle>
                          <CIcon icon={cilSettings} />
                          API 配置
                        </ApiTitle>
                        <VerticalStack>
                          <ApiInputGroup>
                            <EnvSelect
                              value={isCustomEnv ? 'CUSTOM' : selectedEnv}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === 'CUSTOM') {
                                  setIsCustomEnv(true);
                                } else {
                                  setIsCustomEnv(false);
                                  setSelectedEnv(value);
                                }
                              }}
                            >
                              <option value="LOCAL">本地环境 ({API_CONFIG.LOCAL})</option>
                              <option value="TEST">测试环境 ({API_CONFIG.TEST})</option>
                              <option value="PROD">生产环境 ({API_CONFIG.PROD})</option>
                              <option value="CUSTOM">自定义环境</option>
                            </EnvSelect>
                            <ApiInput
                              $isCustom={isCustomEnv}
                              value={isCustomEnv ? customUrl : API_CONFIG[selectedEnv]}
                              onChange={(e) => isCustomEnv && setCustomUrl(e.target.value)}
                              disabled={!isCustomEnv}
                              placeholder={
                                isCustomEnv 
                                  ? "请输入自定义API地址，例如: http://example.com:8080"
                                  : "API 地址将根据选择的环境自动设置"
                              }
                            />
                            <ApiButton onClick={handleSetBaseURL}>
                              {isCustomEnv ? '应用配置' : '切换环境'}
                            </ApiButton>
                          </ApiInputGroup>
                          {isCustomEnv && (
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#64748b', 
                              padding: '4px 8px'
                            }}>
                              请输入完整的URL地址，包含 http:// 或 https:// 前缀
                            </div>
                          )}
                        </VerticalStack>
                      </ApiSection>
                    </motion.div>

                    <LoginForm onSubmit={handleLogin}>
                      <motion.div variants={itemVariants} custom={2}>
                        <StyledInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <StyledInput
                            placeholder={t('username')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </StyledInputGroup>
                      </motion.div>

                      <motion.div variants={itemVariants} custom={3}>
                        <StyledInputGroup>
                          <CInputGroupText onClick={() => setShowPassword(!showPassword)}>
                            <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} />
                          </CInputGroupText>
                          <StyledInput
                            type={showPassword ? "text" : "password"}
                            placeholder={t('password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </StyledInputGroup>
                      </motion.div>

                      <motion.div variants={itemVariants} custom={4}>
                        <CaptchaInputGroup>
                          <div className="captcha-wrapper">
                            <img
                              src={captcha}
                              alt={t('captcha')}
                              onClick={refreshCaptcha}
                            />
                          </div>
                          <StyledInput
                            placeholder="验证码"
                            value={verify}
                            onChange={(e) => setVerify(e.target.value)}
                          />
                        </CaptchaInputGroup>
                      </motion.div>

                      <motion.div variants={itemVariants} custom={5}>
                        <StyledButton
                          type="submit"
                          className="w-100"
                          disabled={loading}
                        >
                          {loading ? "登录中..." : t('loginButton')}
                        </StyledButton>
                      </motion.div>

                      <div className="divider" />

                      <motion.div variants={itemVariants} custom={6}>
                        <CRow>
                          <CCol xs={12} className="text-center mb-3">
                            <GithubButton
                              onClick={handleGitHubLogin}
                              className="w-100"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                   className="bi bi-github me-2" viewBox="0 0 16 16">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                              </svg>
                              {t('githubLogin')}
                            </GithubButton>
                          </CCol>
                          <CCol xs={12} className="text-center">
                            <ForgotPasswordLink>
                              {t('forgetPassword')}
                            </ForgotPasswordLink>
                          </CCol>
                        </CRow>
                      </motion.div>
                    </LoginForm>
                  </CardBody>
                </LoginCard>
              </motion.div>
            </CCol>
          </CRow>
        </ContentWrapper>
      </div>
      {!showApiConfig && (
        <ApiConfigHint>
          双击水面显示 API 配置！！！
        </ApiConfigHint>
      )}
    </PageWrapper>
  );
};

export default LoginPage;
