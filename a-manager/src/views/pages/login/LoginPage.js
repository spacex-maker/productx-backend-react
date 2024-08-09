import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilLockUnlocked, cilUser } from '@coreui/icons'
import LoginHeader from 'src/views/pages/login/LoginHeader'
import { API_BASE_URL, axiosInstance ,setBaseURL} from 'src/axiosInstance'
import {Input} from "antd";

const captchaUrl = API_BASE_URL + '/base/system/captcha'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verify, setVerify] = useState('')
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false) // 管理密码可见性
  const navigate = useNavigate()
  const [captcha, setCaptcha] = useState(captchaUrl)
  const [apiBaseURL, setApiBaseURL] = useState('');
  const refreshCaptcha = () => {
    // Append a timestamp to the URL to force a refresh
    setCaptcha(`${captchaUrl}?${new Date().getTime()}`)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = { username, password, verify }
    setBaseURL(apiBaseURL);
    try {
      const response = await axiosInstance.post('/base/anakki/manager/login', formData)

      if (response.data.code === 200) {
        const token = response.data.data
        localStorage.setItem('jwtManageToken', token)
        navigate('/dashboard')
      } else if (response.data.code === 101) {
        setNotice(response.data.data)
      }
    } catch (error) {
      alert(`登录失败：${error}`)
    }
  }

  return (
    <div>
      <LoginHeader />
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody className="p-4">
                    <CForm onSubmit={handleLogin}>
                      <h4>登录</h4>
                      <p className="text-body-secondary">公告：</p>
                      {notice && <p id="manager-login-notice">{notice}</p>}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="用户名"
                          autoComplete="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} onClick={() => setShowPassword(!showPassword)} />
                        </CInputGroupText>
                        <CFormInput
                          type={showPassword ? 'text' : 'password'} // 根据状态显示密码或文本
                          placeholder="密码"
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <img
                            className="captcha-img"
                            src={captcha}
                            alt="验证码"
                            onClick={refreshCaptcha}
                          />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          className="form-control"
                          placeholder="请输入验证码（点击图片刷新）"
                          maxLength="6"
                          value={verify}
                          onChange={(e) => setVerify(e.target.value)}
                        />
                      </CInputGroup>

                      <CRow>
                        <CCol xs={6}>
                          <Input
                              placeholder="请输入 API 基地址"
                              value={apiBaseURL}
                              onChange={(e) => setApiBaseURL(e.target.value)}
                          />
                          <CButton color="primary" className="px-4" type="submit">
                            登录
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-right">
                          <CButton color="link" className="px-0" style={{ float: 'right' }}>
                            忘记密码
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
  )
}

export default LoginPage
