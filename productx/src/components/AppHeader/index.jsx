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
  CModal,
  CModalBody,
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
  cilUser,
} from '@coreui/icons';
import { Badge, Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import { toggleFloating } from 'src/store/aiChat';
import styled from 'styled-components';

import { AppHeaderDropdown, AppBreadcrumb } from './component';
import MessageModal from './component/MessageModal';
import appHeaderStyle from './index.module.scss';

const HeaderItem = styled.div`
  margin: 0 6px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 20px;
    background: var(--cui-border-color);
    opacity: 0.5;
  }
`;

const StyledButton = styled(CButton)`
  position: relative;
  color: var(--cui-body-color);
  overflow: hidden;
  border-radius: 40px;
  padding: 6px 16px;
  border: 1px solid rgba(var(--cui-primary-rgb), 0.1);
  background: rgba(var(--cui-primary-rgb), 0.05);
  
  ${props => props.$hasUnread && `
    background: linear-gradient(
      90deg,
      rgba(var(--cui-primary-rgb), 0.05),
      rgba(var(--cui-danger-rgb), 0.1),
      rgba(var(--cui-info-rgb), 0.1),
      rgba(var(--cui-primary-rgb), 0.05)
    );
    background-size: 300% 100%;
    animation: gradientMove 3s ease infinite;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transform: translateX(-100%);
      animation: lightPass 2s ease-in-out infinite;
    }

    &::after {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(
        90deg,
        var(--cui-primary),
        var(--cui-danger),
        var(--cui-info),
        var(--cui-primary)
      );
      background-size: 300% 100%;
      animation: gradientBorder 3s ease infinite;
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    @keyframes gradientMove {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes gradientBorder {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes lightPass {
      0% {
        transform: translateX(-200%) skewX(-45deg);
      }
      100% {
        transform: translateX(200%) skewX(-45deg);
      }
    }

    .icon {
      animation: iconPulse 2s ease infinite;
    }

    @keyframes iconPulse {
      0%, 100% {
        transform: scale(1);
        color: var(--cui-primary);
      }
      50% {
        transform: scale(1.2);
        color: var(--cui-danger);
      }
    }
  `}

  &:hover {
    color: var(--cui-btn-hover-color);
    background: var(--cui-btn-hover-bg);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(var(--cui-primary-rgb), 0.15);

    ${props => props.$hasUnread && `
      &::after {
        animation: gradientBorder 1.5s ease infinite;
      }
      &::before {
        animation: lightPass 1s ease-in-out infinite;
      }
    `}

    .icon {
      color: var(--cui-primary);
      transform: scale(1.1);
    }

    .text {
      color: var(--cui-primary);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(var(--cui-primary-rgb), 0.1);
  }

  .icon {
    position: relative;
    z-index: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .text {
    position: relative;
    z-index: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
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
    color: var(--cui-btn-hover-color);

    .usage-count {
      background: var(--cui-primary);
      color: white;
    }
  }

  &.active {
    background: var(--cui-primary);
    color: white;

    .usage-count {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    &:hover {
      background: var(--cui-primary-hover);
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
    transition: all 0.3s;
  }
`;

const ThemeButton = styled(StyledButton)`
  position: relative;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 40px;
    background: ${props => props.$isDark ? 
      'linear-gradient(135deg, #2c3e50, #3498db)' : 
      'linear-gradient(135deg, #f6d365, #fda085)'
    };
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  .theme-icon-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .icon {
      font-size: 16px;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
      
      ${props => props.$isDark ? `
        animation: moonRotate 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        @keyframes moonRotate {
          from {
            transform: rotate(0deg) scale(0.5);
            opacity: 0;
          }
          to {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }
      ` : `
        animation: sunRotate 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        @keyframes sunRotate {
          from {
            transform: rotate(0deg) scale(0.5);
            opacity: 0;
          }
          to {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }
      `}
    }

    .text {
      font-size: 14px;
      font-weight: 500;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: left center;
      
      ${props => props.$isDark ? `
        animation: textFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      ` : `
        animation: textFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      `}

      @keyframes textFadeIn {
        from {
          transform: translateY(10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  }
`;

const AIButton = styled(StyledButton)`
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 42px;
    background: linear-gradient(
      90deg,
      #4355f5,
      #4d2cf5,
      #842cf5,
      #4355f5
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 1px;
    background: var(--cui-body-bg);
    border-radius: 40px;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(67, 85, 245, 0.2);

    &::before {
      opacity: 1;
      animation: borderRotate 3s linear infinite;
    }

    .ai-icon-wrapper {
      transform: scale(1.05);

      .robot-icon {
        animation: robotPulse 1.5s ease infinite;
        color: #4355f5;
      }

      .ai-particles {
        opacity: 1;
      }
    }

    .text {
      background: linear-gradient(90deg, #4355f5, #842cf5);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .ai-icon-wrapper {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: transform 0.3s ease;
    white-space: nowrap;
  }

  .robot-icon {
    transition: all 0.3s ease;
  }

  .ai-particles {
    position: absolute;
    inset: -10px;
    opacity: 0;
    transition: opacity 0.3s ease;

    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #4355f5;
      animation: particleFloat 2s ease-in-out infinite;
    }

    &::before {
      top: 50%;
      left: -10px;
      animation-delay: -1s;
    }

    &::after {
      bottom: 50%;
      right: -10px;
      animation-delay: -0.5s;
    }
  }

  @keyframes borderRotate {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }

  @keyframes robotPulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  @keyframes particleFloat {
    0%, 100% {
      transform: translate(0, 0);
      opacity: 0;
    }
    25% {
      opacity: 1;
    }
    50% {
      transform: translate(10px, -10px);
      opacity: 0;
    }
  }
`;

const MobileMenuButton = styled(StyledButton)`
  padding: 8px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--cui-tertiary-bg);
  border: 1px solid var(--cui-border-color);
  transition: all 0.3s ease;

  &:hover {
    background: var(--cui-body-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  .menu-icon {
    font-size: 20px;
    color: var(--cui-body-color);
    transition: transform 0.3s ease;
  }

  &:hover .menu-icon {
    transform: scale(1.1);
    color: var(--cui-primary);
  }
`;

const StyledDropdownMenu = styled(CDropdownMenu)`
  min-width: 220px;
  padding: 8px;
  margin-top: 8px;
  border: none;
  border-radius: 12px;
  background: var(--cui-body-bg);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: dropdownFadeIn 0.2s ease-out;

  @keyframes dropdownFadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledDropdownItem = styled(CDropdownItem)`
  padding: 10px 16px;
  margin: 2px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--cui-body-color);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(var(--cui-primary-rgb), 0.08);
    color: var(--cui-primary);
    transform: translateX(4px);
  }

  .icon {
    font-size: 16px;
    flex-shrink: 0;
  }

  .badge {
    margin-left: auto;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 12px;
    background: var(--cui-danger);
    color: white;
  }
`;

const LanguageModal = styled(CModal)`
  .modal-content {
    border-radius: 12px;
    border: none;
    background: var(--cui-body-bg);
  }
  
  .modal-header {
    border-bottom: 1px solid var(--cui-border-color);
    padding: 16px 20px;
  }
  
  .modal-body {
    padding: 16px;
    max-height: 400px;
    overflow-y: auto;
  }
`;

// 添加一个新的样式组件来处理 CDropdownToggle
const StyledDropdownToggle = styled(CDropdownToggle)`
  padding: 0;
  border: none;
  background: none;

  &::after {
    display: none;
  }

  &:focus {
    box-shadow: none;
  }
`;

const AppHeader = () => {
  const headerRef = useRef(null);
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const { t, i18n } = useTranslation();
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

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

  // 添加一个判断是否为移动设备的媒体查询
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  // 创建一个渲染头部按钮的函数
  const renderHeaderButtons = () => (
    <>
      <HeaderItem>
        <AIButton 
          onClick={handleOpenAIChat}
          title={t('openAIAssistant')}
        >
          <div className="ai-icon-wrapper">
            <div className="ai-particles" />
            <RobotOutlined className="robot-icon" style={{ fontSize: '16px' }} />
            <span className="text" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('aiAssistant')}
            </span>
          </div>
        </AIButton>
      </HeaderItem>

      <HeaderItem>
        <StyledButton 
          onClick={() => setMessageModalVisible(true)}
          title={t('messages')}
          $hasUnread={unreadCount > 0}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
          }}>
            <CIcon 
              icon={cilEnvelopeOpen} 
              className="icon" 
              style={{ fontSize: '16px' }} 
            />
            <span className="text" style={{ fontSize: '14px', fontWeight: 500 }}>
              {t('messages')}
              {unreadCount > 0 && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '6px',
                  background: 'var(--cui-danger)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600',
                  height: '18px',
                  minWidth: '18px',
                  padding: '0 5px',
                  borderRadius: '9px',
                  lineHeight: 1
                }}>
                  {unreadCount}
                </span>
              )}
            </span>
          </div>
        </StyledButton>
      </HeaderItem>

      <HeaderItem>
        <ThemeButton 
          onClick={() => onChangeTheme(colorMode === 'dark' ? 'light' : 'dark')}
          $isDark={colorMode === 'dark'}
        >
          <div className="theme-icon-wrapper">
            <CIcon 
              icon={colorMode === 'dark' ? cilMoon : cilSun} 
              className="icon"
            />
            <span className="text">
              {colorMode === 'dark' ? t('darkMode') : t('lightMode')}
            </span>
          </div>
        </ThemeButton>
      </HeaderItem>

      <HeaderItem>
        <CDropdown variant="nav-item" placement="bottom-end">
          <CDropdownToggle caret={false}>
            <StyledButton>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CIcon icon={cilLanguage} className="icon" style={{ fontSize: '16px' }} />
                <span className="text" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {sortedLanguages.find(lang => lang.languageCode === currentLang)?.languageNameNative}
                </span>
              </div>
            </StyledButton>
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
      </HeaderItem>
    </>
  );

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler onClick={toggleSidebar}>
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <AppBreadcrumb />
        </CHeaderNav>
        <CHeaderNav className="ms-3 d-flex align-items-center">
          {/* 大屏幕显示所有按钮 */}
          <div className="d-none d-md-flex align-items-center gap-2">
            {renderHeaderButtons()}
          </div>
          
          {/* 小屏幕显示菜单按钮 */}
          <div className="d-md-none">
            <MobileMenuButton 
              onClick={() => setMobileMenuVisible(true)} 
              title={t('menu')}
            >
              <CIcon icon={cilMenu} className="menu-icon" />
            </MobileMenuButton>
          </div>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>

      <MessageModal
        visible={messageModalVisible}
        onCancel={handleModalClose}
        onSuccess={handleModalSuccess}
      />

      {/* 移动端菜单模态框 */}
      <CModal
        visible={mobileMenuVisible}
        onClose={() => setMobileMenuVisible(false)}
        className="mobile-menu-modal"
      >
        <CModalBody className="p-3">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <StyledDropdownItem onClick={() => {
              dispatch(toggleFloating(true));
              setMobileMenuVisible(false);
            }}>
              <RobotOutlined className="icon" />
              {t('aiAssistant')}
            </StyledDropdownItem>

            <StyledDropdownItem onClick={() => {
              setMessageModalVisible(true);
              setMobileMenuVisible(false);
            }}>
              <CIcon icon={cilEnvelopeOpen} className="icon" />
              {t('messages')}
              {unreadCount > 0 && (
                <span className="badge">{unreadCount}</span>
              )}
            </StyledDropdownItem>

            <StyledDropdownItem onClick={() => {
              onChangeTheme(colorMode === 'dark' ? 'light' : 'dark');
              setMobileMenuVisible(false);
            }}>
              <CIcon icon={colorMode === 'dark' ? cilMoon : cilSun} className="icon" />
              {colorMode === 'dark' ? t('darkMode') : t('lightMode')}
            </StyledDropdownItem>

            <StyledDropdownItem onClick={() => {
              setLanguageModalVisible(true);
              setMobileMenuVisible(false);
            }}>
              <CIcon icon={cilLanguage} className="icon" />
              {sortedLanguages.find(lang => lang.languageCode === currentLang)?.languageNameNative}
            </StyledDropdownItem>
          </div>
        </CModalBody>
      </CModal>

      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title={t('selectLanguage')}
      >
        <CModalBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sortedLanguages.map((lang) => (
              <LanguageItem 
                key={lang.id} 
                onClick={() => {
                  changeLanguage(lang.languageCode);
                  setLanguageModalVisible(false);
                }}
                className={currentLang === lang.languageCode ? 'active' : ''}
              >
                <div className="language-info">
                  <span className="language-name">{lang.languageNameNative}</span>
                </div>
                <span className="usage-count">
                  {formatUsageCount(lang.usageCount)}
                </span>
              </LanguageItem>
            ))}
          </div>
        </CModalBody>
      </LanguageModal>
    </CHeader>
  );
};

export default AppHeader;
