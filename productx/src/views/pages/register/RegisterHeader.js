import React from 'react'
import { CHeader, CHeaderBrand, CHeaderNav, CHeaderText } from '@coreui/react'
import { Link } from 'react-router-dom'

const RegisterHeader = () => {
  return (
    <CHeader position="sticky">
      <CHeaderBrand to="/">Your Logo</CHeaderBrand>
      <CHeaderNav className="ms-auto">
        <CHeaderText>
          <Link to="/login">登录</Link>
        </CHeaderText>
      </CHeaderNav>
    </CHeader>
  )
}

export default RegisterHeader
