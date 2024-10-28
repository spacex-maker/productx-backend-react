import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput, CFormSelect,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilLockLocked, cilLockUnlocked, cilUser} from '@coreui/icons'
import LoginHeader from 'src/views/pages/login/LoginHeader'
import axiosInstance, {API_BASE_URL, setBaseURL} from 'src/axiosInstance'
import {Input, Button, message} from 'antd';

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [verify, setVerify] = useState('')
    const [notice, setNotice] = useState('')
    const [showPassword, setShowPassword] = useState(false) // 管理密码可见性
    const navigate = useNavigate()
    const [captcha, setCaptcha] = useState()
    const [apiBaseURL, setApiBaseURL] = useState('');
    const [protocol, setProtocol] = useState('http');
    const [loading, setLoading] = useState(false) // 用于管理按钮的加载状态

    useEffect(() => {
        // Refresh the captcha when the component is mounted
        refreshCaptcha()
    }, [])

    const refreshCaptcha = () => {
        // Append a timestamp to the URL to force a refresh
        setCaptcha(`${API_BASE_URL + '/base/system/captcha'}?${new Date().getTime()}`)
    }

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
        setLoading(true) // 在请求开始时禁用按钮
        e.preventDefault()
        const formData = {username, password, verify}
        const response = await axiosInstance.post('/manage/manager/login', formData)
        localStorage.setItem('jwtManageToken', response)
        navigate('/dashboard')
        setNotice("登录成功")
    }
    return (
        <div>
            <LoginHeader/>
            <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md={8}>
                            <CCardGroup>
                                <CCard className="p-4">
                                    <CCardBody className="p-4">
                                        <CCol xs={12}>
                                            <CRow>
                                                <CCol md={3}>
                                                    <CFormSelect value={protocol}
                                                                 onChange={(e) => setProtocol(e.target.value)}>
                                                        <option value="http">http</option>
                                                        <option value="https">https</option>
                                                    </CFormSelect>
                                                </CCol>
                                                <CCol xs={6}>
                                                    <CFormInput
                                                        placeholder="请输入 API 基地址"
                                                        value={apiBaseURL}
                                                        onChange={(e) => setApiBaseURL(e.target.value)}
                                                    />
                                                </CCol>
                                                <CCol xs={3}>
                                                    <CButton color="primary" className="px-4" type="button"
                                                             onClick={handleSetBaseURL}>
                                                        设置
                                                    </CButton>
                                                </CCol>
                                            </CRow>
                                        </CCol>
                                        <br/>
                                        <CForm onSubmit={handleLogin}>
                                            <h4>登录</h4>
                                            <p className="text-body-secondary">公告：</p>
                                            {notice && <p id="manager-login-notice">{notice}</p>}
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilUser}/>
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
                                                    <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked}
                                                           onClick={() => setShowPassword(!showPassword)}/>
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
                                                <div>
                                                    <img
                                                        className="captcha-img"
                                                        src={captcha}
                                                        alt="验证码"
                                                        onClick={refreshCaptcha}
                                                    />
                                                </div>
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
                                                <CCol xs={3}>
                                                    <CButton color="primary" className="px-4" type="submit"
                                                             disabled={loading}>
                                                        {loading ? '登录中...' : '登录'}
                                                    </CButton>
                                                </CCol>
                                                <CCol xs={3} className="text-right">
                                                    <CButton color="link" className="px-0" style={{float: 'right'}}>
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
