import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import RegisterHeader from './RegisterHeader';
import {
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
import api from 'src/axiosInstance';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

const breakpoints = {
  md: '768px'
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

const StyledCard = styled(CCard)`
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
  transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.8s ease,
              scale 1.2s cubic-bezier(0.4, 0, 0.2, 1);
`;

const StyledInputGroup = styled(CInputGroup)`
  margin-bottom: 16px;

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

const RegisterButton = styled.button`
  width: 100%;
  height: 44px;
  background: linear-gradient(
    120deg, 
    #6366f1 0%,
    #8b5cf6 50%,
    #6366f1 100%
  );
  background-size: 200% auto;
  border: none;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  }

  &:disabled {
    background: linear-gradient(
      120deg,
      #4b4d8b 0%,
      #5d4b8b 100%
    );
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoginLink = styled(Link)`
  color: #8b5cf6;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  display: block;
  text-align: center;
  margin-top: 16px;

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

const GlowingText = styled.div`
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20vw;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: rgba(255, 255, 255, 0.05);
  text-shadow: 
    0 0 80px rgba(139, 92, 246, 0.15),
    0 0 32px rgba(139, 92, 246, 0.15),
    0 0 16px rgba(139, 92, 246, 0.15);
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  z-index: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 25vw;
    top: 20%;
  }

  .letter {
    display: inline-block;
    position: relative;
    color: rgba(255, 255, 255, 0.15);
    text-shadow: 
      0 0 2px #6366f1,
      0 0 10px #6366f1,
      0 0 20px #6366f1,
      0 0 40px #6366f1;
    animation: cyber-pulse 4s infinite;
    
    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.8;
      mix-blend-mode: screen;
    }

    &::before {
      color: #ff00ff;
      z-index: -1;
      animation: cyber-glitch-1 4s infinite;
      clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
    }

    &::after {
      color: #00ffff;
      z-index: -2;
      animation: cyber-glitch-2 4s infinite;
      clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
    }
  }

  @keyframes cyber-pulse {
    0%, 100% {
      text-shadow: 
        0 0 2px #6366f1,
        0 0 10px #6366f1,
        0 0 20px #6366f1,
        0 0 40px #6366f1;
    }
    50% {
      text-shadow: 
        0 0 4px #8b5cf6,
        0 0 20px #8b5cf6,
        0 0 40px #8b5cf6,
        0 0 80px #8b5cf6;
    }
  }

  @keyframes cyber-glitch-1 {
    0%, 100% { transform: translate(0); }
    33% { transform: translate(-5px, 3px); }
    66% { transform: translate(5px, -3px); }
  }

  @keyframes cyber-glitch-2 {
    0%, 100% { transform: translate(0); }
    33% { transform: translate(5px, -3px); }
    66% { transform: translate(-5px, 3px); }
  }
`;

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

  const isFormValid = useCallback(() => {
    const { username, password, confirmPassword } = formData;
    return (
      username.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      password === confirmPassword
    );
  }, [formData]);

  const checkPasswordMatch = useCallback(() => {
    const match = formData.password === formData.confirmPassword;
    setPasswordMatch(match);
    setErrorMessage(match ? '' : '两次输入的密码不一致');
    return match;
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (field) => (e) => {
    const value = e.target.value.trim();
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'password' || field === 'confirmPassword') {
      setTimeout(() => {
        checkPasswordMatch();
      }, 300);
    }
  };

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
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <GlowingText>
        {'PROTX'.split('').map((letter, index) => (
          <span 
            key={index} 
            className="letter"
            data-text={letter}
          >
            {letter}
          </span>
        ))}
      </GlowingText>
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

                      {!passwordMatch && (
                        <div style={{ color: '#ef4444', fontSize: '14px', marginBottom: '16px' }}>
                          {errorMessage}
                        </div>
                      )}

                      <RegisterButton
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
                      </RegisterButton>

                      <LoginLink to="/login">
                        已有账号？点击登录
                      </LoginLink>
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

export default Register;
