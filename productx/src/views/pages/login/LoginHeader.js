import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import CIcon from '@coreui/icons-react';
import { cilLanguage, cilSpeedometer } from '@coreui/icons';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';

import { useTranslation } from 'react-i18next'; // 引入 useTranslation
const breakpoints = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: rgba(26, 28, 46, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: ${breakpoints.sm}) {
    padding: 0 16px;
  }
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: #8b5cf6;
    filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.3));
  }
`;

const LogoText = styled.span`
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 16px;
  }
`;

const RegisterButton = styled(Button)`
  background: transparent;
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #8b5cf6;
  height: 32px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  font-weight: 500;

  &:hover {
    background: linear-gradient(120deg, #6366f1, #8b5cf6);
    border-color: transparent;
    color: white !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: linear-gradient(120deg, #6366f1, #8b5cf6);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover::before {
    opacity: 1;
  }

  transition: all 0.3s ease;

  @media (max-width: ${breakpoints.sm}) {
    padding: 0 12px;
    font-size: 13px;
  }
`;

const LoginHeader = () => {
  // 动画配置
  const { t, i18n } = useTranslation(); // 获取 i18n 实例
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
      },
    },
  };
  // 切换语言的方法
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <HeaderWrapper>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Logo
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
            <CIcon icon={cilSpeedometer} />
          </motion.div>
          <LogoText>ProTX Admin</LogoText>
        </Logo>
      </Link>
      <CDropdown variant="nav-item" placement="bottom-end" className="ms-2">
        <CDropdownToggle caret={false}>
          <CIcon icon={cilLanguage} size="lg" />
        </CDropdownToggle>
        <CDropdownMenu>
          <CDropdownItem onClick={() => changeLanguage('en')}>English</CDropdownItem>
          <CDropdownItem onClick={() => changeLanguage('zh')}>中文</CDropdownItem>
          <CDropdownItem onClick={() => changeLanguage('es')}>Español</CDropdownItem>
          <CDropdownItem onClick={() => changeLanguage('fr')}>Français</CDropdownItem>
          <CDropdownItem onClick={() => changeLanguage('ar')}>عربي</CDropdownItem> {/* 阿拉伯语 */}
          <CDropdownItem onClick={() => changeLanguage('ru')}>Русский</CDropdownItem>
          <CDropdownItem onClick={() => changeLanguage('de')}>Deutsch</CDropdownItem>
          <CDropdownItem onClick={() => changeLanguage('ko')}>한국어</CDropdownItem>
          <CDropdownItem onClick={() => changeLanguage('ja')}>日本語</CDropdownItem>
          <CDropdownItem onClick={() => changeLanguage('it')}>Italiano</CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <motion.div variants={buttonVariants} initial="hidden" animate="visible" whileHover="hover">
        <Link to="/register">
          <RegisterButton>注册账号</RegisterButton>
        </Link>
      </motion.div>
    </HeaderWrapper>
  );
};

export default LoginHeader;
