import React from 'react'
import { CHeader, CHeaderBrand, CHeaderNav } from '@coreui/react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

const LoginHeader = () => {
  return (
    <CHeader position="sticky" style={{ padding: '8px 16px' }}> {/* 调整内边距 */}
      <CHeaderBrand to="/" style={{ fontSize: '20px' }}>ANAKKI MANAGE-X</CHeaderBrand>
      <CHeaderNav className="ms-auto" style={{ marginLeft: 'auto' }}>
        <Button type="link" style={{ padding: '0', fontSize: '14px' }}> {/* 调整按钮样式 */}
          <Link to="/register">注册</Link>
        </Button>
      </CHeaderNav>
    </CHeader>
  )
}

export default LoginHeader
