import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CNavLink,
  CNavItem,
  useColorModes,
  CNavbar,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilContrast, cilEnvelopeOpen, cilLanguage, cilMenu, cilMoon, cilSun } from '@coreui/icons';

import { AppHeaderDropdown, AppBreadcrumb } from './component';
import appHeaderStyle from './index.module.scss';

const AppHeader = () => {
  const headerRef = useRef(null);
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const { t, i18n } = useTranslation(); // 获取 i18n 实例

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user?.currentUser);

  // 切换语言的方法
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  return (
    <CHeader position="sticky" className={appHeaderStyle.rootHeaderContainer} ref={headerRef}>
      <CContainer className="px-4" fluid>
        <CNavbar>
          <CNavLink className="p-2" onClick={toggleSidebar}>
            <CIcon icon={cilMenu} size="lg" />
          </CNavLink>
          <AppBreadcrumb />
        </CNavbar>
        <CHeaderNav>
          <CNavItem>
            <CNavLink>
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <div className="nav-link d-flex align-items-center">
              <span
                style={{
                  marginRight: '15px',
                  color: colorMode === 'dark' ? '#fff' : '#333',
                  fontSize: '14px',
                }}
              >
                {currentUser?.username
                  ? `${t('welcome')}, ${currentUser.username}`
                  : t('notLoggedIn')}
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
                <CIcon className="me-2" icon={cilSun} size="lg" />
                明亮
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" />
                暗黑
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" />
                自动
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <CDropdown variant="nav-item" placement="bottom-end">
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
              <CDropdownItem onClick={() => changeLanguage('ar')}>عربي</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
