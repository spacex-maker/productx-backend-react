import React from 'react'
import { CHeader, CHeaderBrand, CHeaderNav, CHeaderText } from '@coreui/react'
import { Link } from 'react-router-dom'
import {Button} from "antd";

const LoginHeader = () => {
  return (
    <CHeader position="sticky">
      <CHeaderBrand to="/">ANAKKI MANAGE-X</CHeaderBrand>
      <CHeaderNav className="ms-auto">
        <Button>
          <Link to="/register">注册</Link>
        </Button>
      </CHeaderNav>
    </CHeader>
  )
}

export default LoginHeader
