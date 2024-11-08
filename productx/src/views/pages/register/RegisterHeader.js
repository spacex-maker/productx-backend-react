import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer } from '@coreui/icons'

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: rgba(30, 32, 47, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: #667eea;
  }
`

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`

const LoginButton = styled(Button)`
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
  height: 32px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  font-weight: 500;

  &:hover {
    background: linear-gradient(120deg, #6366f1, #8b5cf6);
    border-color: transparent;
    color: white !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }

  transition: all 0.3s ease;
`

const RegisterHeader = () => {
  return (
    <HeaderWrapper>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Logo
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <CIcon icon={cilSpeedometer} />
          <LogoText>ProductX Admin</LogoText>
        </Logo>
      </Link>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link to="/login">
          <LoginButton>
            登录
          </LoginButton>
        </Link>
      </motion.div>
    </HeaderWrapper>
  )
}

export default RegisterHeader
