import React from 'react'
import { CHeader, CHeaderBrand, CHeaderNav, CHeaderText } from '@coreui/react'
import { Link } from 'react-router-dom'

const LoginHeader = () => {
  return (
    <CHeader position="sticky">
      <CHeaderBrand to="/">Your Logo</CHeaderBrand>
      <CHeaderNav className="ms-auto">
        <CHeaderText>
          <Link to="/register">注册</Link>
        </CHeaderText>
      </CHeaderNav>
    </CHeader>
  )
}

export default LoginHeader
