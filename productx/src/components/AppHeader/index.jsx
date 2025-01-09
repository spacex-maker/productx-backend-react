import React, { useRef, useState, useEffect } from 'react';
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
import { Badge, Button } from 'antd';
import api from 'src/axiosInstance';

import { AppHeaderDropdown, AppBreadcrumb } from './component';
import MessageModal from './component/MessageModal';
import appHeaderStyle from './index.module.scss';

const AppHeader = () => {
  const headerRef = useRef(null);
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const { t, i18n } = useTranslation();
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.currentUser);
  // 获取未读消息数
  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/manage/admin-messages/unread-count');
      if (response) {
        setUnreadCount(response);
      }
    } catch (error) {
      console.error('获取未读消息数失败:', error);
    }
  };

  // 组件加载和消息模态框关闭时获取未读消息数
  useEffect(() => {
    fetchUnreadCount();
  }, []);

  // 消息模态框关闭时刷新未读消息数
  const handleModalClose = () => {
    setMessageModalVisible(false);
    fetchUnreadCount();
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const onChangeTheme = (theme) => {
    setColorMode(theme);
  };

  const handleModalSuccess = () => {
    fetchUnreadCount(); // 刷新未读消息数
  };

  // 获取系统支持的语言列表
  const fetchSupportedLanguages = async () => {
    try {
      const response = await api.get('/manage/sys-languages/enabled');
      if (response) {
        setSupportedLanguages(response);
      }
    } catch (error) {
      console.error('获取支持的语言列表失败:', error);
    }
  };

  useEffect(() => {
    fetchSupportedLanguages();
  }, []);

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
            <Badge count={unreadCount || 0} offset={[-5, 5]}>
              <Button color="primary" onClick={() => setMessageModalVisible(true)} variant="link">
                <CIcon icon={cilEnvelopeOpen} size="lg" />
              </Button>
            </Badge>
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
                onClick={onChangeTheme.bind(null, 'light')}
              >
                <CIcon className="me-2" icon={cilSun} size="lg" />
                明亮
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={onChangeTheme.bind(null, 'dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" />
                暗黑
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={onChangeTheme.bind(null, 'auto')}
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
              {supportedLanguages.map((lang) => (
                <CDropdownItem key={lang.id} onClick={() => changeLanguage(lang.languageCode)}>
                  {lang.languageNameNative}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      <MessageModal
        visible={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        onSuccess={handleModalSuccess}
      />
    </CHeader>
  );
};

export default AppHeader;
