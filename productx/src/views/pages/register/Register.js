import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import RegisterHeader from './RegisterHeader';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import api, { API_BASE_URL, setBaseURL } from 'src/axiosInstance';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import RippleEffect from 'src/components/RippleEffect';
import WaveEffect from 'src/components/WaveEffect';

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

const StyledCard = styled(CCard)`
  background: rgba(30, 32, 47, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  border-radius: 16px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const StyledInputGroup = styled(CInputGroup)`
  margin-bottom: 16px;
`;

const StyledInput = styled(CFormInput)`
  background: rgba(30, 32, 47, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-left: none;
  color: #e2e8f0;
  padding: 10px 16px;
  font-size: 14px;
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

const WaterButton = styled.button`
  position: relative;
  width: 100%;
  height: 44px;
  background: transparent;
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover {
    border-color: rgba(99, 102, 241, 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  // 水波效果
  &::before {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(99, 102, 241, 0.2) 0%,
      rgba(99, 102, 241, 0.4) 100%
    );
    transition: height 0.3s ease;
  }
`;

const LoginLink = styled(Link)`
  color: #8b5cf6;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    color: #6366f1;
    text-decoration: underline;
  }
`;

const TitleText = styled.h3`
  color: #f1f5f9;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProgressIndicator = styled.div`
  position: relative;
  width: 100%;
  height: 4px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 2px;
  margin: 24px 0 8px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => props.progress * 100}%;
  background: ${props =>
    props.progress === 1
      ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
      : 'linear-gradient(90deg, #6366f1, #818cf8)'
  };
  transition: width 0.3s ease, background 0.3s ease;
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: 13px;
  color: ${props => {
    if (props.isError) return '#ef4444';
    if (props.progress === 1) return '#8b5cf6';
    return '#64748b';
  }};
  margin-top: 8px;
  transition: color 0.3s ease;
`;

// 添加动画变体定义
const containerVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

const inputVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 修改检查表单是否完整且有效的函数
  const isFormValid = useCallback(() => {
    const { username, password, confirmPassword } = formData;
    return (
      username.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword
    );
  }, [formData]);

  // 简化 checkPasswordMatch 函数
  const checkPasswordMatch = useCallback(() => {
    const match = formData.password === formData.confirmPassword;
    setPasswordMatch(match);
    setErrorMessage(match ? '' : '两次输入的密码不一致');
    return match;
  }, [formData.password, formData.confirmPassword]);

  // 处理输入框变化
  const handleInputChange = (field) => (e) => {
    const value = e.target.value.trim();
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 当修改密码或确认密码时，检查匹配
    if (field === 'password' || field === 'confirmPassword') {
      setTimeout(() => {
        checkPasswordMatch();
      }, 300);
    }
  };

  // 处理注册
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      setLoading(true);
      const data = await api.post('/manage/manager/register', {
        username: formData.username,
        password: formData.password
      });

      if (data) {
        message.success('注册成功！');
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('注册失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <WaveEffect />
      <RegisterHeader />
      <div className="min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={5}>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <StyledCard>
                  <CCardBody>
                    <CForm onSubmit={handleRegister}>
                      <TitleText>创建账号</TitleText>

                      <StyledInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <StyledInput
                          placeholder="请输入用户名"
                          autoComplete="username"
                          value={formData.username}
                          onChange={handleInputChange('username')}
                        />
                      </StyledInputGroup>

                      <StyledInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <StyledInput
                          type="password"
                          placeholder="请输入密码"
                          autoComplete="new-password"
                          value={formData.password}
                          onChange={handleInputChange('password')}
                        />
                      </StyledInputGroup>

                      <StyledInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <StyledInput
                          type="password"
                          placeholder="请确认密码"
                          autoComplete="new-password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange('confirmPassword')}
                        />
                      </StyledInputGroup>

                      {/* 修改注册按钮部分 */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key="register-button"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <WaterButton
                            type="submit"
                            disabled={loading || !isFormValid()}
                            onClick={handleRegister}
                          >
                            {loading ? (
                              <>
                                <CSpinner size="sm" className="me-2" />
                                注册中...
                              </>
                            ) : '注册'}
                            <RippleEffect />
                          </WaterButton>
                        </motion.div>
                      </AnimatePresence>
                    </CForm>
                  </CCardBody>
                </StyledCard>
              </motion.div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </PageWrapper>
  );
};

// 只保留这些新的样式组件
const AnimatedInputGroupText = styled(CInputGroupText)`
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-right: none;
  color: #8b5cf6;
  transition: all 0.3s ease;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

const AnimatedInput = styled(CFormInput)`
  background: rgba(30, 32, 47, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-left: none;
  color: #e2e8f0;
  transition: all 0.3s ease;

  &::placeholder {
    color: #64748b;
    transition: all 0.3s ease;
  }

  &:focus {
    background: rgba(30, 32, 47, 0.98);
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);

    &::placeholder {
      transform: translateX(10px);
      opacity: 0.5;
    }

    & + ${AnimatedInputGroupText} {
      border-color: rgba(99, 102, 241, 0.5);
    }
  }

  ${props => props.hasValue && `
    border-color: rgba(99, 102, 241, 0.4);
    & + ${AnimatedInputGroupText} {
      border-color: rgba(99, 102, 241, 0.4);
    }
  `}
`;

export default Register;
