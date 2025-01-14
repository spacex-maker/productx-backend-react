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
import api, { API_BASE_URL, setBaseURL, API_CONFIG, setCustomBaseURL } from 'src/axiosInstance';
import { message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import WaveEffect from 'src/components/WaveEffect';
import { initReactI18next, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from 'src/store/user';
import { Select } from 'antd';
import HealthCheck from 'src/components/common/HealthCheck';
const { Option } = Select;

const breakpoints = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg, 
    #1a1c2e 0%,
    #2d1b4b 50%,
    #131525 100%
  );
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
  background: linear-gradient(
    145deg,
    rgba(30, 32, 47, 0.95) 0%,
    rgba(35, 28, 54, 0.95) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: visible;
  position: relative;
  border-radius: 16px;

  & > div:first-child {
    border-radius: 16px 16px 0 0;
  }

  & > div:last-child {
    border-radius: 0 0 16px 16px;
  }

  // 标语容器
  .slogan-container {
    position: absolute;
    top: -60px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 10;
  }

  // 主标语样式
  .slogan {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 1px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    white-space: nowrap;
    background: linear-gradient(120deg, #6366f1, #8b5cf6, #6366f1);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
    text-shadow: none;
  }

  // 副标语样式
  .sub-slogan {
    background: linear-gradient(120deg, #8b5cf6, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.5px;
    opacity: 0.8;
    white-space: nowrap;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }

  // 渐变背景效果
  .slogan::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      rgba(99, 102, 241, 0.1),
      rgba(139, 92, 246, 0.1),
      rgba(99, 102, 241, 0.1)
    );
    filter: blur(10px);
    z-index: -1;
    animation: gradientMove 6s linear infinite;
  }

  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  background: linear-gradient(
    to right,
    rgba(99, 102, 241, 0.05),
    rgba(139, 92, 246, 0.05)
  );

  h4 {
    color: #f1f5f9;
    margin: 0;
    font-weight: 600;
    font-size: 1.25rem;
    background: linear-gradient(120deg, #6366f1, #8b5cf6, #6366f1);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
`;

const CardBody = styled(CCardBody)`
  padding: 2rem 1.5rem;
`;

const ApiSection = styled.div`
  margin-bottom: ${(props) => (props.$visible ? '16px' : '0')};
  padding: ${(props) => (props.$visible ? '16px' : '0')};
  background: rgba(99, 102, 241, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transform: translateY(${(props) => (props.$visible ? '0' : '-20px')});
  height: ${(props) => (props.$visible ? 'auto' : '0')};
  pointer-events: ${(props) => (props.$visible ? 'all' : 'none')};
`;

const ApiTitle = styled.div`
  font-size: 0.875rem;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: #8b5cf6;
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

const StyledEnvSelect = styled(Select)`
  &&& {
    width: 100px !important;

    .ant-select-selector {
      background: rgba(30, 32, 47, 0.95) !important;
      border: 1px solid rgba(99, 102, 241, 0.2) !important;
      border-radius: 4px 0 0 4px !important;
      height: 32px !important;
      padding: 0 11px !important;

      .ant-select-selection-item {
        line-height: 30px !important;
        color: #e2e8f0 !important;
        font-size: 12px !important;
      }
    }

    &:not(.ant-select-disabled):hover .ant-select-selector {
      border-color: #8b5cf6 !important;
    }

    &.ant-select-focused .ant-select-selector {
      border-color: #8b5cf6 !important;
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2) !important;
    }

    .ant-select-arrow {
      color: #8b5cf6 !important;
    }
  }
`;

const StyledEnvDropdown = styled.div`
  .ant-select-dropdown {
    background: rgba(30, 32, 47, 0.98) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    min-width: 280px !important;
    width: auto !important;
    max-width: 600px !important;
    white-space: nowrap !important;

    .ant-select-item {
      color: #e2e8f0 !important;
      font-size: 12px !important;
      min-height: 28px !important;
      padding: 4px 8px !important;

      &:hover {
        background: rgba(99, 102, 241, 0.1) !important;
      }

      &.ant-select-item-option-selected {
        background: rgba(99, 102, 241, 0.2) !important;
        font-weight: 600;
      }
    }
  }
`;

const EnvOption = styled(Option)`
  &&& {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding-right: 8px !important;

    .env-name {
      font-weight: 500;
      margin-right: 16px;
      white-space: nowrap;
    }

    .env-url {
      font-size: 9px;
      opacity: 0.7;
      margin-right: 4px;
      white-space: nowrap;
    }
  }
`;

const ApiInput = styled(CFormInput)`
  flex: 1;
  background: rgba(30, 32, 47, 0.95) !important;
  border: none !important;
  color: #f1f5f9 !important;
  font-size: 0.875rem !important;
  border-radius: ${(props) => (props.$isCustom ? '4px' : '0 4px 4px 0')} !important;

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
    margin: 2rem 0;
    border-top: 1px solid rgba(99, 102, 241, 0.1);
    position: relative;

    &::after {
      content: 'or';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(30, 32, 47, 0.95);
      padding: 0 1rem;
      background: linear-gradient(120deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 0.875rem;
    }
  }
`;

const StyledInputGroup = styled(CInputGroup)`
  margin-bottom: 1.5rem;

  .input-group-text {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-right: none;
    color: #8b5cf6;
    min-width: 46px;
    justify-content: center;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  &:last-of-type {
    margin-bottom: 2rem;
  }
`;

const StyledInput = styled(CFormInput)`
  background: rgba(30, 32, 47, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-left: none;
  color: #e2e8f0;
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
  background: linear-gradient(
    120deg, 
    #6366f1 0%,
    #8b5cf6 50%,
    #6366f1 100%
  ) !important;
  background-size: 200% auto !important;
  border: none;
  padding: 0.625rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  height: 42px;

  &:hover {
    background-position: right center !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    background: linear-gradient(
      120deg,
      #4b4d8b 0%,
      #5d4b8b 100%
    ) !important;
    opacity: 0.7;
  }
`;

const GithubButton = styled(CButton)`
  background: linear-gradient(
    120deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #8b5cf6;
  padding: 0.625rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;

  &:hover {
    background: linear-gradient(
      120deg,
      rgba(99, 102, 241, 0.2) 0%,
      rgba(139, 92, 246, 0.2) 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
`;

const ForgotPasswordLink = styled.a`
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const StyledFormSelect = styled(CFormSelect)`
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
    padding: 4px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-right: none;
    position: relative;

    img {
      height: 32px;
      border-radius: 4px;
      cursor: pointer;
    }

    .captcha-tooltip {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(30, 32, 47, 0.95);
      padding: 4px 12px;
      color: #64748b;
      font-size: 0.75rem;
      border-radius: 4px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    &:hover .captcha-tooltip {
      opacity: 1;
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
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 12px;
  opacity: 0.7;
  pointer-events: none;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }

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
  const [captcha, setCaptcha] = useState('');
  const [selectedEnv, setSelectedEnv] = useState('PROD');
  const [loading, setLoading] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const { t } = useTranslation(); // 获取 t 数
  const [isCustomEnv, setIsCustomEnv] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const dispatch = useDispatch();
  const [showSlogan, setShowSlogan] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
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
      setCustomBaseURL(customUrl);
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
      localStorage.setItem('jwtManageToken', token);

      try {
        const userInfo = await api.get('/manage/manager/get-by-token');

        dispatch(
          setCurrentUser({
            id: userInfo.id,
            username: userInfo.username,
            email: userInfo.email,
            phone: userInfo.phone,
            roleId: userInfo.roleId,
            status: userInfo.status,
            isDeleted: userInfo.isDeleted,
            thirdUserAccountId: userInfo.thirdUserAccountId,
            createBy: userInfo.createBy,
            avatar: userInfo.avatar,
          }),
        );

        localStorage.setItem('currentUser', JSON.stringify(userInfo));

        navigate('/dashboard');
        message.success(t('loginSuccess'));
      } catch (userError) {
        localStorage.removeItem('jwtManageToken');
        message.error(t('failedToGetUserInfo'));
        refreshCaptcha();
      }
    } catch (error) {
      message.error(t('loginFailed'));
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href =
      'https://github.com/login/oauth/authorize?client_id=Ov23liKtBY8tbrKGO1q2&redirect_uri=https://protx.cn/manage/manager/github-callback';
  };

  const handleWaveDoubleClick = () => {
    setShowApiConfig((prev) => !prev);
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

  const getEnvDisplayName = (env) => {
    switch (env) {
      case 'TEST':
        return '测试环境';
      case 'TEST2':
        return '测试环境2';
      case 'PROD':
        return '生产环境';
      case 'LOCAL':
        return '本地环境';
      case 'CUSTOM':
        return '自定义';
      default:
        return env;
    }
  };

  const renderEnvironmentOption = (env, url) => (
    <EnvOption value={env} key={env} label={getEnvDisplayName(env)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="env-name">{env === 'TEST' ? '测试环境(推荐)' : `${env}环境`}</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="env-url">{url}</span>
          <HealthCheck url={url} />
        </div>
      </div>
    </EnvOption>
  );

  // 鼠标移入处理函数
  const handleMouseEnter = () => {
    setShowSlogan(true);
  };

  // 鼠标移出处理函数
  const handleMouseLeave = () => {
    setShowSlogan(false);
  };

  return (
    <PageWrapper>
      <WaveEffect onDoubleClick={handleWaveDoubleClick} />
      <LoginHeader />
      <div className="min-vh-100 d-flex align-items-center">
        <ContentWrapper>
          <CRow className="justify-content-center">
            <CCol xs={12} sm={10} md={8} lg={6} xl={5}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <LoginCard>
                  <AnimatePresence>
                    {showSlogan && (
                      <motion.div
                        className="slogan-container"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="slogan">极致的用户体验，直达用户的内心</div>
                        <div className="sub-slogan">ProductX - 让每一次使用都触及灵魂</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <CardHeader>
                    <h4>{t('login')} ProductX Admin</h4>
                  </CardHeader>

                  <CardBody>
                    <ApiSection $visible={showApiConfig}>
                      <ApiTitle>
                        <CIcon icon={cilSettings} />
                        API 配置
                      </ApiTitle>
                      <VerticalStack>
                        <ApiInputGroup>
                          <StyledEnvDropdown>
                            <StyledEnvSelect
                              value={isCustomEnv ? 'CUSTOM' : selectedEnv}
                              onChange={(value) => {
                                if (value === 'CUSTOM') {
                                  setIsCustomEnv(true);
                                  setCustomUrl('');
                                } else {
                                  setIsCustomEnv(false);
                                  setSelectedEnv(value);
                                }
                              }}
                              dropdownMatchSelectWidth={false}
                              optionLabelProp="label"
                            >
                              {Object.entries(API_CONFIG).map(([env, url]) =>
                                renderEnvironmentOption(env, url),
                              )}
                              <Option value="CUSTOM" label="自定义">
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <span>自定义环境</span>
                                </div>
                              </Option>
                            </StyledEnvSelect>
                          </StyledEnvDropdown>
                          <ApiInput
                            $isCustom={isCustomEnv}
                            value={isCustomEnv ? customUrl : API_CONFIG[selectedEnv]}
                            onChange={(e) => isCustomEnv && setCustomUrl(e.target.value)}
                            disabled={!isCustomEnv}
                            placeholder={
                              isCustomEnv
                                ? '请输入自定义API地址，例如: http://example.com:8080'
                                : 'API 地址将根据选择的环境自动设置'
                            }
                          />
                          <ApiButton onClick={handleSetBaseURL}>
                            {isCustomEnv ? '应用配置' : '切换环境'}
                          </ApiButton>
                        </ApiInputGroup>
                        {isCustomEnv && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#64748b',
                              padding: '4px 8px',
                            }}
                          >
                            请输入完整的URL地址，包含 http:// 或 https:// 前缀
                          </div>
                        )}
                      </VerticalStack>
                    </ApiSection>

                    <LoginForm onSubmit={handleLogin}>
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

                      <StyledInputGroup>
                        <CInputGroupText onClick={() => setShowPassword(!showPassword)}>
                          <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} />
                        </CInputGroupText>
                        <StyledInput
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('password')}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </StyledInputGroup>

                      <CaptchaInputGroup>
                        <div className="captcha-wrapper">
                          <div className="captcha-tooltip">{t('clickToChange')}</div>
                          <img src={captcha} alt={t('captcha')} onClick={refreshCaptcha} />
                        </div>
                        <StyledInput
                          placeholder="验证码"
                          value={verify}
                          onChange={(e) => setVerify(e.target.value)}
                        />
                      </CaptchaInputGroup>

                      <StyledButton
                        type="submit"
                        className="w-100"
                        disabled={loading}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {loading ? '登录中...' : t('loginButton')}
                      </StyledButton>

                      <div className="divider" />

                      <CRow>
                        <CCol xs={12} className="text-center mb-3">
                          <GithubButton onClick={handleGitHubLogin} className="w-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-github me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                            </svg>
                            {t('githubLogin')}
                          </GithubButton>
                        </CCol>
                        <CCol xs={12} className="text-center">
                          <ForgotPasswordLink>{t('forgetPassword')}</ForgotPasswordLink>
                        </CCol>
                      </CRow>
                    </LoginForm>
                  </CardBody>
                </LoginCard>
              </motion.div>
            </CCol>
          </CRow>
        </ContentWrapper>
      </div>
      {!showApiConfig && <ApiConfigHint>双击水面显示 API 配置！！！</ApiConfigHint>}
    </PageWrapper>
  );
};

export default LoginPage;
