import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import axiosInstance from 'src/axiosInstance';
import { message } from 'antd';
import { Link } from 'react-router-dom';
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

  .input-group-text {
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-right: none;
    color: #8b5cf6;
    padding: 10px 16px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`

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

const StyledButton = styled(CButton)`
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  border: none;
  padding: 12px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
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

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      message.error('两次输入的密码不匹配');
      return;
    }

    const formData = {
      username,
      password,
    };

    try {
      const response = await axiosInstance.post('/manage/manager/register', formData);
      message.success('注册成功！');
    } catch (error) {
      const errorMessage = error.response?.data?.message || '注册失败，请重试';
      message.error(errorMessage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: (i) => ({
      x: i % 2 === 0 ? -1000 : 1000,
      y: i % 3 === 0 ? -1000 : (i % 3 === 1 ? 1000 : 0),
      rotate: Math.random() * 360,
      opacity: 0
    }),
    visible: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
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
                      <motion.div
                        custom={0}
                        variants={itemVariants}
                      >
                        <TitleText>创建账号</TitleText>
                      </motion.div>

                      <motion.div
                        custom={1}
                        variants={itemVariants}
                      >
                        <StyledInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <StyledInput
                            placeholder="请输入用户名"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </StyledInputGroup>
                      </motion.div>

                      <motion.div
                        custom={2}
                        variants={itemVariants}
                      >
                        <StyledInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <StyledInput
                            type="password"
                            placeholder="请输入密码"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </StyledInputGroup>
                      </motion.div>

                      <motion.div
                        custom={3}
                        variants={itemVariants}
                      >
                        <StyledInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <StyledInput
                            type="password"
                            placeholder="请确认密码"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </StyledInputGroup>
                      </motion.div>

                      <motion.div
                        custom={4}
                        variants={itemVariants}
                      >
                        <div className="d-grid gap-2">
                          <StyledButton type="submit">
                            注册
                          </StyledButton>
                          <div className="text-center mt-3">
                            <LoginLink to="/login">
                              已有账号？立即登录
                            </LoginLink>
                          </div>
                        </div>
                      </motion.div>
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
