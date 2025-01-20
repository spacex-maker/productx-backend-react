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
  CButton,
  CHeaderToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { 
  cilContrast, 
  cilEnvelopeOpen, 
  cilLanguage, 
  cilMenu, 
  cilMoon, 
  cilSun,
  cilCommentSquare,
} from '@coreui/icons';
import { Badge, Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import { toggleFloating } from 'src/store/aiChat';
import styled from 'styled-components';

import { AppHeaderDropdown, AppBreadcrumb } from './component';
import MessageModal from './component/MessageModal';
import appHeaderStyle from './index.module.scss';

const StyledButton = styled(CButton)`
  color: var(--cui-body-color);
  
  &:hover {
    color: var(--cui-btn-hover-color);
    background: var(--cui-btn-hover-bg);
  }

  &:active {
    color: var(--cui-btn-active-color);
    background: var(--cui-btn-active-bg);
  }
`;

const StyledLanguageMenu = styled(CDropdownMenu)`
  min-width: 240px;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08);
`;

const LanguageItem = styled(CDropdownItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 2px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: var(--cui-btn-hover-bg);
  }

  &.active {
    background: var(--cui-primary);
    color: white;

    .usage-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }
  }

  .language-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .language-name {
    font-weight: 500;
    font-size: 14px;
  }

  .usage-count {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--cui-tertiary-bg);
    color: var(--cui-body-color);
  }
`;

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

  const handleOpenAIChat = () => {
    dispatch(toggleFloating(true));
  };

  // 获取当前语言
  const currentLang = i18n.language;
  
  // 对语言列表进行排序
  const sortedLanguages = [...supportedLanguages].sort((a, b) => {
    // 首先按使用人数降序
    if (b.usageCount !== a.usageCount) {
      return b.usageCount - a.usageCount;
    }
    // 如果使用人数相同，按语言名称排序
    return a.languageNameEn.localeCompare(b.languageNameEn);
  });

  // 格式化使用人数
  const formatUsageCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <AppBreadcrumb />
        </CHeaderNav>
        <CHeaderNav className="ms-3 d-flex align-items-center">
          <CNavItem>
            <StyledButton 
              color="light" 
              variant="ghost"
              className="p-2"
              onClick={handleOpenAIChat}
              title="打开 AI 助手"
            >
              <RobotOutlined style={{ fontSize: '1.25rem' }} />
            </StyledButton>
          </CNavItem>
          <CNavItem>
            <Badge count={unreadCount || 0} offset={[-5, 5]}>
              <Button color="primary" onClick={() => setMessageModalVisible(true)} variant="link">
                <CIcon icon={cilEnvelopeOpen} size="lg" />
              </Button>
            </Badge>
          </CNavItem>
          <CNavItem>
            <div className="nav-link">
              <span
                style={{
                  marginRight: '15px',
                  color: colorMode === 'dark' ? '#fff' : '#333',
                  fontSize: '14px',
                  lineHeight: '40px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CIcon icon={cilLanguage} size="lg" />
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {sortedLanguages.find(lang => lang.languageCode === currentLang)?.languageNameNative || ''}
                </span>
              </div>
            </CDropdownToggle>
            <StyledLanguageMenu>
              {sortedLanguages.map((lang) => (
                <LanguageItem 
                  key={lang.id} 
                  onClick={() => changeLanguage(lang.languageCode)}
                  className={currentLang === lang.languageCode ? 'active' : ''}
                >
                  <div className="language-info">
                    <span className="language-name">
                      {lang.languageNameNative}
                    </span>
                  </div>
                  <span className="usage-count" title={`${lang.usageCount} users`}>
                    {formatUsageCount(lang.usageCount)}
                  </span>
                </LanguageItem>
              ))}
            </StyledLanguageMenu>
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
