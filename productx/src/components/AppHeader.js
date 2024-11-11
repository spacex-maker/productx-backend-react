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

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { t, i18n } = useTranslation()  // 获取 i18n 实例

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [siteViewCount, setSiteViewCount] = useState(null)

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString())
    const timeInterval = setInterval(updateTime, 1000)
    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
      headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    }
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  // 切换语言的方法
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
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
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
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
            <div className="nav-link d-flex align-items-center">
              <CIcon icon={cilSun} size="lg" className="me-2" />
              <span>{currentTime}</span>
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
            <CDropdownToggle caret={false}>
              <CIcon icon={cilLanguage} size="lg" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => changeLanguage('en')}>English</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('zh')}>中文</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('fr')}>Français</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('es')}>Español</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('de')}>Deutsch</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('it')}>Italiano</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('ja')}>日本語</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('ko')}>한국어</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('ru')}>Русский</CDropdownItem>
              <CDropdownItem onClick={() => changeLanguage('ar')}>عربي</CDropdownItem> {/* 阿拉伯语 */}
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
