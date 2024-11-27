import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'  // 引入 useTranslation
import api from 'src/axiosInstance'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen, cilLanguage,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import Icon from "@ant-design/icons";
import styled from 'styled-components'
import TimeDisplay from './header/TimeDisplay';  // 添加导入

// 添加自定义样式
const CompactHeader = styled(CHeader)`
  min-height: 40px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`;

const CompactContainer = styled(CContainer)`
  min-height: 40px !important;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
`;

const CompactNav = styled(CHeaderNav)`
  height: 32px !important;
  
  .nav-link {
    padding: 4px 8px !important;
    font-size: 12px !important;
    height: 32px !important;
    display: flex !important;
    align-items: center !important;
  }
`;

const CompactDropdownMenu = styled(CDropdownMenu)`
  min-width: 120px !important;
  padding: 4px !important;
  font-size: 10px !important;
`;

const CompactDropdownItem = styled(CDropdownItem)`
  padding: 4px 8px !important;
  font-size: 10px !important;
  height: 24px !important;
  display: flex !important;
  align-items: center !important;
`;

const CompactIcon = styled(CIcon)`
  width: 16px !important;
  height: 16px !important;
`;

const MenuToggler = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 0.8;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { t, i18n } = useTranslation()  // 获取 i18n 实例

  const dispatch = useDispatch()
  const { show: sidebarShow } = useSelector((state) => state.sidebar)
  const currentUser = useSelector((state) => state.user?.currentUser)

  // 切换语言的方法
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }

  return (
    <CompactHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CompactContainer className="border-bottom px-4" fluid>
        <MenuToggler onClick={toggleSidebar}>
          <CIcon icon={cilMenu} />
        </MenuToggler>
        
        <CompactNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
        </CompactNav>
        <CompactNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <TimeDisplay />  {/* 替换原来的时间显示 */}
          </CNavItem>
          <CNavItem>
            <div className="nav-link d-flex align-items-center">
              <span style={{ 
                marginRight: '15px',
                color: colorMode === 'dark' ? '#fff' : '#333',
                fontSize: '14px'
              }}>
                {currentUser?.username ? `${t('welcome')}, ${currentUser.username}` : t('notLoggedIn')}
              </span>
            </div>
          </CNavItem>
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" />明亮
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" />暗黑
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" />自动
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <CDropdown variant="nav-item" placement="bottom-end" className="ms-2">
            <CDropdownToggle caret={false} className="py-0">
              <CompactIcon icon={cilLanguage} size="sm" />
            </CDropdownToggle>
            <CompactDropdownMenu>
              <CompactDropdownItem onClick={() => changeLanguage('en')}>English</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('zh')}>中文</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('fr')}>Français</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('es')}>Español</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('de')}>Deutsch</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('it')}>Italiano</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('ja')}>日本語</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('ko')}>한국어</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('ru')}>Русский</CompactDropdownItem>
              <CompactDropdownItem onClick={() => changeLanguage('ar')}>عربي</CompactDropdownItem>
            </CompactDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CompactNav>
      </CompactContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CompactHeader>
  )
}

export default AppHeader
