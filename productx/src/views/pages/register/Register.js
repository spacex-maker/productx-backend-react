import React, { useState } from 'react';
import RegisterHeader from './RegisterHeader'; // 引入Header组件
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
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
import axiosInstance from 'src/axiosInstance'; // 确保导入你的 axios 实例
import { message } from 'antd'; // 用于提示消息

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 提交注册表单
  const handleRegister = async (e) => {
    e.preventDefault();

    // 检查密码是否匹配
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
      // 可以在此处重定向到登录页或其他页面
    } catch (error) {
      const errorMessage = error.response?.data?.message || '注册失败，请重试';
      message.error(errorMessage);
    }
  };

  return (
    <div>
      <RegisterHeader />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <CCardGroup>
                <CCard className="p-3">
                  <CCardBody className="p-3">
                    <CForm onSubmit={handleRegister}>
                      <h4 className="mb-3" style={{ fontSize: '20px' }}>注册</h4>
                      <CInputGroup className="mb-2">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="用户名"
                          autoComplete="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          style={{ fontSize: '14px' }}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-2">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="密码"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ fontSize: '14px' }}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="再次输入密码"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{ fontSize: '14px' }}
                        />
                      </CInputGroup>
                      <div className="d-grid">
                        <CButton color="success" type="submit">
                          注册
                        </CButton>
                      </div>
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

export default Register;
