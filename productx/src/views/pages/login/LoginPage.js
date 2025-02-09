import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilLockUnlocked, cilUser, cilSettings } from '@coreui/icons';
import LoginHeader from 'src/views/pages/login/LoginHeader';
import api, { API_BASE_URL, setBaseURL, API_CONFIG, setCustomBaseURL } from 'src/axiosInstance';
import { message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { css } from 'styled-components';
import { initReactI18next, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from 'src/store/user';
import { Select } from 'antd';
import HealthCheck from 'src/components/common/HealthCheck';
import { Form } from 'antd';
const { Option } = Select;

const breakpoints = {
  xs: '320px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg, 
    #1a1c2e 0%,
    #2d1b4b 50%,
    #131525 100%
  );
  position: relative;
  overflow: hidden;
  cursor: default;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%);
    top: -300px;
    right: -300px;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0) 70%);
    bottom: -250px;
    left: -250px;
    border-radius: 50%;
  }
`;

const ContentWrapper = styled(CContainer)`
  padding-top: 80px;

  @media (max-width: ${breakpoints.sm}) {
    padding-top: 60px;
  }
`;

const LoginCard = styled(CCard)`
  background: linear-gradient(
    145deg,
    rgba(30, 32, 47, 0.85) 0%,
    rgba(35, 28, 54, 0.85) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.3);
  backdrop-filter: blur(12px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(99, 102, 241, 0.1) inset;
  overflow: visible;
  position: relative;
  border-radius: 24px;
  transform-style: preserve-3d;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(99, 102, 241, 0.2) inset;
  }

  &.exit {
    transform: perspective(1000px) rotateY(720deg) translateZ(300px);
    opacity: 0;
    scale: 0.8;
  }

  & > div:first-child {
    border-radius: 16px 16px 0 0;
  }

  & > div:last-child {
    border-radius: 0 0 16px 16px;
  }

  // 标语容器
  .slogan-container {
    position: absolute;
    top: -60px;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 10;
  }

  // 主标语样式
  .slogan {
    color: rgba(255, 255, 255, 0.9);
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 1px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    white-space: nowrap;
    background: linear-gradient(120deg, #6366f1, #8b5cf6, #6366f1);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
    text-shadow: none;
  }

  // 副标语样式
  .sub-slogan {
    background: linear-gradient(120deg, #8b5cf6, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 0.5px;
    opacity: 0.8;
    white-space: nowrap;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }

  // 渐变背景效果
  .slogan::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(
      45deg,
      rgba(99, 102, 241, 0.1),
      rgba(139, 92, 246, 0.1),
      rgba(99, 102, 241, 0.1)
    );
    filter: blur(10px);
    z-index: -1;
    animation: gradientMove 6s linear infinite;
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
`;

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  background: linear-gradient(
    to right,
    rgba(99, 102, 241, 0.05),
    rgba(139, 92, 246, 0.05)
  );

  h4 {
    color: #f1f5f9;
    margin: 0;
    font-weight: 600;
    font-size: 1.25rem;
    background: linear-gradient(120deg, #6366f1, #8b5cf6, #6366f1);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s linear infinite;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
`;

const CardBody = styled(CCardBody)`
  padding: 2rem 1.5rem;
`;

const ApiSection = styled.div`
  margin-bottom: ${(props) => (props.$visible ? '16px' : '0')};
  padding: ${(props) => (props.$visible ? '16px' : '0')};
  background: rgba(99, 102, 241, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.1);
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transform: translateY(${(props) => (props.$visible ? '0' : '-20px')});
  height: ${(props) => (props.$visible ? 'auto' : '0')};
  pointer-events: ${(props) => (props.$visible ? 'all' : 'none')};
`;

const ApiTitle = styled.div`
  font-size: 0.875rem;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
    color: #8b5cf6;
  }
`;

const ApiInputGroup = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 1px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 6px;
  padding: 1px;
`;

const StyledEnvSelect = styled(Select)`
  &&& {
    width: 100px !important;

    .ant-select-selector {
      background: rgba(30, 32, 47, 0.95) !important;
      border: 1px solid rgba(99, 102, 241, 0.2) !important;
      border-radius: 4px 0 0 4px !important;
      height: 32px !important;
      padding: 0 11px !important;

      .ant-select-selection-item {
        line-height: 30px !important;
        color: #e2e8f0 !important;
        font-size: 12px !important;
      }
    }

    &:not(.ant-select-disabled):hover .ant-select-selector {
      border-color: #8b5cf6 !important;
    }

    &.ant-select-focused .ant-select-selector {
      border-color: #8b5cf6 !important;
      box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2) !important;
    }

    .ant-select-arrow {
      color: #8b5cf6 !important;
    }
  }
`;

const StyledEnvDropdown = styled.div`
  .ant-select-dropdown {
    background: rgba(30, 32, 47, 0.98) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(99, 102, 241, 0.2);
    min-width: 280px !important;
    width: auto !important;
    max-width: 600px !important;
    white-space: nowrap !important;

    .ant-select-item {
      color: #e2e8f0 !important;
      font-size: 12px !important;
      min-height: 28px !important;
      padding: 4px 8px !important;

      &:hover {
        background: rgba(99, 102, 241, 0.1) !important;
      }

      &.ant-select-item-option-selected {
        background: rgba(99, 102, 241, 0.2) !important;
        font-weight: 600;
      }
    }
  }
`;

const EnvOption = styled(Option)`
  &&& {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding-right: 8px !important;

    .env-name {
      font-weight: 500;
      margin-right: 16px;
      white-space: nowrap;
    }

    .env-url {
      font-size: 9px;
      opacity: 0.7;
      margin-right: 4px;
      white-space: nowrap;
    }
  }
`;

const ApiInput = styled(CFormInput)`
  flex: 1;
  background: rgba(30, 32, 47, 0.95) !important;
  border: none !important;
  color: #f1f5f9 !important;
  font-size: 0.875rem !important;
  border-radius: ${(props) => (props.$isCustom ? '4px' : '0 4px 4px 0')} !important;

  &:disabled {
    background: rgba(255, 255, 255, 0.02) !important;
    color: rgba(255, 255, 255, 0.5) !important;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ApiButton = styled(CButton)`
  min-width: 80px;
  background: #6366f1 !important;
  border: none !important;
  color: white !important;
  font-size: 0.875rem !important;
  border-radius: 4px !important;
  margin-left: 1px !important;

  &:hover {
    background: #4f46e5 !important;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const LoginForm = styled(CForm)`
  .divider {
    margin: 2rem 0;
    border-top: 1px solid rgba(99, 102, 241, 0.1);
    position: relative;

    &::after {
      content: 'or';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(30, 32, 47, 0.95);
      padding: 0 1rem;
      background: linear-gradient(120deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 0.875rem;
    }
  }
`;

const StyledInputGroup = styled(CInputGroup)`
  margin-bottom: 1.5rem;
  position: relative;
  transition: all 0.3s ease;

  .input-group-text {
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-right: none;
    color: #8b5cf6;
    min-width: 46px;
    justify-content: center;
    transition: all 0.3s ease;

    svg {
      width: 18px;
      height: 18px;
      transition: all 0.3s ease;
    }
  }

  &:hover {
    transform: translateY(-2px);
    
    .input-group-text {
      background: rgba(99, 102, 241, 0.2);
      color: #6366f1;
    }

    input {
      border-color: rgba(99, 102, 241, 0.4);
    }
  }

  &:focus-within {
    transform: translateY(-2px);
    
    .input-group-text {
      background: rgba(99, 102, 241, 0.25);
      border-color: #8b5cf6;
      color: #6366f1;
    }

    input {
      border-color: #8b5cf6;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
    }
  }
`;

const StyledInput = styled(CFormInput)`
  background: rgba(30, 32, 47, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-left: none;
  color: #e2e8f0;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  padding: 0.75rem 1rem;

  &::placeholder {
    color: rgba(100, 116, 139, 0.8);
  }

  &:focus {
    background: rgba(30, 32, 47, 0.98);
    border-color: #8b5cf6;
    color: #f1f5f9;
    box-shadow: none;
  }
`;

const StyledButton = styled(CButton)`
  background: linear-gradient(
    120deg, 
    #6366f1 0%,
    #8b5cf6 50%,
    #6366f1 100%
  ) !important;
  background-size: 200% auto !important;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.5px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 1rem;
  height: 48px;
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transition: all 0.5s ease;
  }

  &:hover {
    background-position: right center !important;
    transform: translateY(-2px);
    box-shadow: 
      0 4px 20px rgba(139, 92, 246, 0.4),
      0 0 0 2px rgba(139, 92, 246, 0.2) inset;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 
      0 2px 10px rgba(139, 92, 246, 0.3),
      0 0 0 2px rgba(139, 92, 246, 0.3) inset;
  }

  &:disabled {
    background: linear-gradient(
      120deg,
      #4b4d8b 0%,
      #5d4b8b 100%
    ) !important;
    opacity: 0.7;
    transform: none;
    box-shadow: none;
  }
`;

const GithubButton = styled(CButton)`
  background: linear-gradient(
    120deg,
    rgba(99, 102, 241, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #8b5cf6;
  padding: 0.625rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;

  &:hover {
    background: linear-gradient(
      120deg,
      rgba(99, 102, 241, 0.2) 0%,
      rgba(139, 92, 246, 0.2) 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  }
`;

const ForgotPasswordLink = styled.a`
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const StyledFormSelect = styled(CFormSelect)`
  background: rgba(30, 32, 47, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #e2e8f0;
  font-size: 14px;
  padding: 8px 12px;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(30, 32, 47, 0.98);
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
    color: #f1f5f9;
  }

  &:hover {
    background: rgba(99, 102, 241, 0.1);
  }

  option {
    background: #1a1c2e;
    color: #e2e8f0;
    padding: 8px;
  }
`;

const CaptchaInputGroup = styled(StyledInputGroup)`
  height: 42px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: stretch;

  .input-group-text {
    padding: 0;
    height: 100%;
  }

  .captcha-wrapper {
    display: flex;
    align-items: stretch;
    padding: 0;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-right: none;
    border-radius: 4px 0 0 4px;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
    width: 100px;
    min-width: 100px;
    height: 42px;

    &:hover {
      background: rgba(99, 102, 241, 0.2);
      
      img {
        transform: scale(1.02);
        filter: brightness(1.1);
      }
    }

    &:active img {
      transform: scale(0.98);
    }

    img {
      height: 40px;
      width: 100%;
      object-fit: cover;
      border-radius: 3px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      filter: brightness(1.05);
      margin: auto;
      display: block;
    }
  }

  input {
    height: 42px;
    font-family: monospace;
    letter-spacing: 2px;
    font-size: 1rem;
    text-align: center;
    padding: 0.5rem 1rem;
    line-height: 42px;
    margin: 0;
    
    &::placeholder {
      letter-spacing: normal;
      font-size: 0.9rem;
      font-family: inherit;
      line-height: 42px;
    }
  }

  .input-group {
    height: 42px;
    display: flex;
    align-items: stretch;
  }

  &.loading .captcha-wrapper::before {
    width: 18px;
    height: 18px;
    border-width: 1.5px;
  }

  &.refreshed .captcha-wrapper {
    animation: refresh-success 0.5s ease;
  }

  @keyframes refresh-success {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const ApiConfigHint = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  background: linear-gradient(120deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 12px;
  opacity: 0.7;
  pointer-events: none;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }

  @media (max-width: ${breakpoints.sm}) {
    display: none;
  }
`;

const VerticalStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

// 重新设计第二套动画方案 - 流体动态风格
const letterAnimationStyle2 = css`
  .letter {
    display: inline-block;
    position: relative;
    transform-style: preserve-3d;
    animation-duration: 8s;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    animation-iteration-count: infinite;
    
    &::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(120deg, #6366f1, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: blur(8px);
      opacity: 0.5;
      animation: inherit;
    }
    
    &:nth-child(1) { // P
      animation-name: fluid-P;
      color: rgba(99, 102, 241, 0.08);
      transform-origin: left;
      animation-delay: 0s;
    }
    
    &:nth-child(2) { // R
      animation-name: fluid-R;
      color: rgba(109, 97, 243, 0.08);
      transform-origin: top;
      animation-delay: 0.5s;
    }
    
    &:nth-child(3) { // O
      animation-name: fluid-O;
      color: rgba(119, 92, 244, 0.08);
      transform-origin: center;
      animation-delay: 1s;
    }
    
    &:nth-child(4) { // T
      animation-name: fluid-T;
      color: rgba(129, 87, 245, 0.08);
      transform-origin: bottom;
      animation-delay: 1.5s;
    }
    
    &:nth-child(5) { // X
      animation-name: fluid-X;
      color: rgba(139, 92, 246, 0.08);
      transform-origin: right;
      animation-delay: 2s;
    }
  }

  @keyframes fluid-P {
    0%, 100% { 
      transform: translateY(0) translateZ(0);
      filter: brightness(1);
    }
    50% { 
      transform: translateY(-20px) translateZ(50px);
      filter: brightness(1.2);
    }
  }

  @keyframes fluid-R {
    0%, 100% { 
      transform: translateY(0) translateZ(0);
      filter: brightness(1);
    }
    50% { 
      transform: translateY(-30px) translateZ(60px);
      filter: brightness(1.3);
    }
  }

  @keyframes fluid-O {
    0%, 100% { 
      transform: scale(1) translateZ(0);
      filter: brightness(1) blur(0px);
    }
    50% { 
      transform: scale(1.2) translateZ(40px);
      filter: brightness(1.4) blur(2px);
    }
  }

  @keyframes fluid-T {
    0%, 100% { 
      transform: translateY(0) translateZ(0);
      filter: brightness(1);
    }
    50% { 
      transform: translateY(-25px) translateZ(45px);
      filter: brightness(1.2);
    }
  }

  @keyframes fluid-X {
    0%, 100% { 
      transform: translateY(0) translateZ(0);
      filter: brightness(1);
    }
    50% { 
      transform: translateY(-15px) translateZ(35px);
      filter: brightness(1.5);
    }
  }

  // 添加流体光效果
  .letter::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(99, 102, 241, 0.1) 25%,
      transparent 50%,
      rgba(139, 92, 246, 0.1) 75%,
      transparent 100%
    );
    animation: fluid-light 4s linear infinite;
    pointer-events: none;
  }

  @keyframes fluid-light {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 0;
    }
  }
`;

// 原来的动画方案重命名为 letterAnimationStyle1
const letterAnimationStyle1 = css`
  .letter {
    display: inline-block;
    position: relative;
    transform-style: preserve-3d;
    animation-duration: 4s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    
    &:nth-child(1) { // P
      animation-name: letterP;
      color: rgba(99, 102, 241, 0.08);
    }
    
    &:nth-child(2) { // R
      animation-name: letterR;
      color: rgba(109, 97, 243, 0.08);
      animation-delay: 0.2s;
    }
    
    &:nth-child(3) { // O
      animation-name: letterO;
      color: rgba(119, 92, 244, 0.08);
      animation-delay: 0.4s;
    }
    
    &:nth-child(4) { // T
      animation-name: letterT;
      color: rgba(129, 87, 245, 0.08);
      animation-delay: 0.6s;
    }
    
    &:nth-child(5) { // X
      animation-name: letterX;
      color: rgba(139, 92, 246, 0.08);
      animation-delay: 0.8s;
    }
  }

  @keyframes letterP {
    0%, 100% { transform: translateZ(0); }
    50% { transform: translateZ(50px) rotateX(10deg); }
  }

  @keyframes letterR {
    0%, 100% { transform: translateZ(0); }
    50% { transform: translateZ(40px) rotateY(-10deg); }
  }

  @keyframes letterO {
    0%, 100% { transform: scale(1) translateZ(0); }
    50% { transform: scale(1.2) translateZ(30px); }
  }

  @keyframes letterT {
    0%, 100% { transform: translateZ(0); }
    50% { transform: translateZ(45px) rotateZ(5deg); }
  }

  @keyframes letterX {
    0%, 100% { transform: translateZ(0); }
    50% { transform: translateZ(35px) rotate3d(1, 1, 0, 15deg); }
  }
`;

// 添加第三套动画方案 - 赛博朋克风格
const letterAnimationStyle3 = css`
  .letter {
    display: inline-block;
    position: relative;
    text-shadow: 2px 2px 0px #6366f1, -2px -2px 0px #8b5cf6;
    animation: glitch 4s infinite;
    
    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(30, 32, 47, 0.95);
    }

    &::before {
      left: 2px;
      text-shadow: -2px 0 #6366f1;
      animation: glitch-2 5s infinite reverse;
      clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
    }

    &::after {
      left: -2px;
      text-shadow: 2px 0 #8b5cf6;
      animation: glitch-3 1s infinite;
      clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
    }

    &:nth-child(1) { // P
      animation-delay: 0.1s;
      &::before { animation-delay: 0.2s; }
      &::after { animation-delay: 0.3s; }
    }
    
    &:nth-child(2) { // R
      animation-delay: 0.2s;
      &::before { animation-delay: 0.3s; }
      &::after { animation-delay: 0.4s; }
    }
    
    &:nth-child(3) { // O
      animation-delay: 0.3s;
      &::before { animation-delay: 0.4s; }
      &::after { animation-delay: 0.5s; }
    }
    
    &:nth-child(4) { // T
      animation-delay: 0.4s;
      &::before { animation-delay: 0.5s; }
      &::after { animation-delay: 0.6s; }
    }
    
    &:nth-child(5) { // X
      animation-delay: 0.5s;
      &::before { animation-delay: 0.6s; }
      &::after { animation-delay: 0.7s; }
    }
  }

  @keyframes glitch {
    0%, 100% { transform: translate(0); }
    7% { transform: translate(-2px, 2px); }
    10% { transform: translate(2px, -2px); }
    13% { transform: translate(-2px, -2px); }
    20%, 100% { transform: translate(0); }
  }

  @keyframes glitch-2 {
    0%, 100% { transform: translate(0); }
    7% { transform: translate(2px, -2px); }
    10% { transform: translate(-2px, 2px); }
    13% { transform: translate(2px, 2px); }
    20%, 100% { transform: translate(0); }
  }

  @keyframes glitch-3 {
    0%, 100% { transform: translate(0); opacity: 0.75; }
    7% { transform: translate(-2px, -2px); opacity: 0.75; }
    10% { transform: translate(2px, 2px); opacity: 0.75; }
    13% { transform: translate(-2px, 2px); opacity: 0.75; }
    20%, 100% { transform: translate(0); opacity: 0.75; }
  }

  // 添加霓虹灯效果
  @keyframes neon {
    0%, 100% {
      text-shadow: 
        0 0 7px rgba(99, 102, 241, 0.8),
        0 0 10px rgba(99, 102, 241, 0.8),
        0 0 21px rgba(99, 102, 241, 0.8),
        0 0 42px rgba(99, 102, 241, 0.8),
        0 0 82px rgba(99, 102, 241, 0.8),
        0 0 92px rgba(99, 102, 241, 0.8),
        0 0 102px rgba(99, 102, 241, 0.8),
        0 0 151px rgba(99, 102, 241, 0.8);
    }
    50% {
      text-shadow: 
        0 0 7px rgba(139, 92, 246, 0.8),
        0 0 10px rgba(139, 92, 246, 0.8),
        0 0 21px rgba(139, 92, 246, 0.8),
        0 0 42px rgba(139, 92, 246, 0.8),
        0 0 82px rgba(139, 92, 246, 0.8),
        0 0 92px rgba(139, 92, 246, 0.8),
        0 0 102px rgba(139, 92, 246, 0.8),
        0 0 151px rgba(139, 92, 246, 0.8);
    }
  }
`;

// 添加第四套动画方案 - 全息投影风格
const letterAnimationStyle4 = css`
  .letter {
    display: inline-block;
    position: relative;
    color: rgba(255, 255, 255, 0.1);
    text-shadow: 0 0 1px rgba(99, 102, 241, 0.8);
    transform-style: preserve-3d;
    
    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.4;
      filter: blur(0.02em);
      pointer-events: none;
      animation: hologram 8s infinite linear;
    }

    &::before {
      text-shadow: 
        0 0 15px rgba(99, 102, 241, 0.6),
        0 0 30px rgba(99, 102, 241, 0.4),
        0 0 45px rgba(99, 102, 241, 0.2);
      animation: hologram-1 4s infinite linear;
      transform-origin: 50% 100%;
    }

    &::after {
      text-shadow: 
        0 0 15px rgba(139, 92, 246, 0.6),
        0 0 30px rgba(139, 92, 246, 0.4),
        0 0 45px rgba(139, 92, 246, 0.2);
      animation: hologram-2 4s infinite linear;
      transform-origin: 50% 0%;
    }

    &:nth-child(1) {
      animation: float-1 6s infinite ease-in-out;
      &::before { animation-delay: -1s; }
      &::after { animation-delay: -2s; }
    }

    &:nth-child(2) {
      animation: float-2 6s infinite ease-in-out;
      &::before { animation-delay: -1.2s; }
      &::after { animation-delay: -2.2s; }
    }

    &:nth-child(3) {
      animation: float-3 6s infinite ease-in-out;
      &::before { animation-delay: -1.4s; }
      &::after { animation-delay: -2.4s; }
    }

    &:nth-child(4) {
      animation: float-4 6s infinite ease-in-out;
      &::before { animation-delay: -1.6s; }
      &::after { animation-delay: -2.6s; }
    }

    &:nth-child(5) {
      animation: float-5 6s infinite ease-in-out;
      &::before { animation-delay: -1.8s; }
      &::after { animation-delay: -2.8s; }
    }
  }

  @keyframes hologram-1 {
    0%, 100% {
      transform: rotateX(0deg) skewX(0deg) scale(1);
    }
    25% {
      transform: rotateX(2deg) skewX(2deg) scale(1.02);
    }
    75% {
      transform: rotateX(-2deg) skewX(-2deg) scale(0.98);
    }
  }

  @keyframes hologram-2 {
    0%, 100% {
      transform: rotateY(0deg) skewY(0deg);
    }
    25% {
      transform: rotateY(2deg) skewY(2deg);
    }
    75% {
      transform: rotateY(-2deg) skewY(-2deg);
    }
  }

  @keyframes float-1 {
    0%, 100% { transform: translateY(0) translateZ(0) rotateX(0); }
    50% { transform: translateY(-10px) translateZ(20px) rotateX(10deg); }
  }

  @keyframes float-2 {
    0%, 100% { transform: translateY(0) translateZ(0) rotateY(0); }
    50% { transform: translateY(-15px) translateZ(30px) rotateY(-10deg); }
  }

  @keyframes float-3 {
    0%, 100% { transform: translateY(0) translateZ(0) scale(1); }
    50% { transform: translateY(-20px) translateZ(40px) scale(1.1); }
  }

  @keyframes float-4 {
    0%, 100% { transform: translateY(0) translateZ(0) rotateZ(0); }
    50% { transform: translateY(-15px) translateZ(30px) rotateZ(5deg); }
  }

  @keyframes float-5 {
    0%, 100% { transform: translateY(0) translateZ(0) rotate3d(1,1,0,0deg); }
    50% { transform: translateY(-10px) translateZ(20px) rotate3d(1,1,0,10deg); }
  }

  // 添加扫描线效果
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(99, 102, 241, 0.1) 50%
    );
    background-size: 100% 4px;
    animation: scan 4s linear infinite;
    pointer-events: none;
    z-index: 1;
  }

  @keyframes scan {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 100%;
    }
  }

  // 添加干扰效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(
        circle at 50% 50%,
        rgba(99, 102, 241, 0.1) 0%,
        transparent 5%
      ) 0 0 / 3px 3px;
    animation: noise 2s steps(3) infinite;
    pointer-events: none;
    z-index: 2;
  }

  @keyframes noise {
    0%, 100% { background-position: 0 0; }
    20% { background-position: 1px -1px; }
    40% { background-position: -2px 2px; }
    60% { background-position: 1px 1px; }
    80% { background-position: -1px -2px; }
  }
`;

// 添加第五套动画方案 - 另一种赛博朋克风格
const letterAnimationStyle5 = css`
  .letter {
    display: inline-block;
    position: relative;
    color: rgba(255, 255, 255, 0.15);
    text-shadow: 
      0 0 2px #6366f1,
      0 0 10px #6366f1,
      0 0 20px #6366f1,
      0 0 40px #6366f1;
    animation: cyber-pulse 4s infinite;
    
    &::before,
    &::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.8;
      mix-blend-mode: screen;
    }

    &::before {
      color: #ff00ff;
      z-index: -1;
      animation: cyber-glitch-1 4s infinite;
      clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
    }

    &::after {
      color: #00ffff;
      z-index: -2;
      animation: cyber-glitch-2 4s infinite;
      clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
    }

    &:nth-child(1) {
      animation-delay: -0.4s;
      &::before { animation-delay: -0.3s; }
      &::after { animation-delay: -0.5s; }
    }

    &:nth-child(2) {
      animation-delay: -0.8s;
      &::before { animation-delay: -0.7s; }
      &::after { animation-delay: -0.9s; }
    }

    &:nth-child(3) {
      animation-delay: -1.2s;
      &::before { animation-delay: -1.1s; }
      &::after { animation-delay: -1.3s; }
    }

    &:nth-child(4) {
      animation-delay: -1.6s;
      &::before { animation-delay: -1.5s; }
      &::after { animation-delay: -1.7s; }
    }

    &:nth-child(5) {
      animation-delay: -2s;
      &::before { animation-delay: -1.9s; }
      &::after { animation-delay: -2.1s; }
    }
  }

  @keyframes cyber-pulse {
    0%, 100% {
      text-shadow: 
        0 0 2px #6366f1,
        0 0 10px #6366f1,
        0 0 20px #6366f1,
        0 0 40px #6366f1;
    }
    50% {
      text-shadow: 
        0 0 4px #8b5cf6,
        0 0 20px #8b5cf6,
        0 0 40px #8b5cf6,
        0 0 80px #8b5cf6;
    }
  }

  @keyframes cyber-glitch-1 {
    0%, 100% { transform: translate(0); }
    33% { transform: translate(-5px, 3px); }
    66% { transform: translate(5px, -3px); }
  }

  @keyframes cyber-glitch-2 {
    0%, 100% { transform: translate(0); }
    33% { transform: translate(5px, -3px); }
    66% { transform: translate(-5px, 3px); }
  }

  // 添加数字雨效果
  &::before {
    content: '';
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 300%;
    background: repeating-linear-gradient(
      90deg,
      transparent 0%,
      transparent 48%,
      rgba(99, 102, 241, 0.05) 49%,
      rgba(139, 92, 246, 0.05) 51%,
      transparent 52%,
      transparent 100%
    );
    animation: matrix-rain 20s linear infinite;
    pointer-events: none;
  }

  @keyframes matrix-rain {
    0% { transform: translateY(0); }
    100% { transform: translateY(33.33%); }
  }

  // 添加扫描线效果
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 1px,
      rgba(99, 102, 241, 0.1) 2px,
      rgba(99, 102, 241, 0.1) 3px
    );
    animation: scan-lines 8s linear infinite;
    pointer-events: none;
  }

  @keyframes scan-lines {
    0% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }

  // 添加闪烁效果
  .letter {
    animation: flicker 4s infinite;
  }

  @keyframes flicker {
    0%, 100% { opacity: 1; }
    8% { opacity: 0.8; }
    9% { opacity: 1; }
    12% { opacity: 0.9; }
    20% { opacity: 1; }
    25% { opacity: 0.8; }
    30% { opacity: 1; }
  }
`;

// 修改 GlowingText 组件的样式条件
const GlowingText = styled.div`
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20vw;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: rgba(255, 255, 255, 0.05);
  text-shadow: 
    0 0 80px rgba(139, 92, 246, 0.15),
    0 0 32px rgba(139, 92, 246, 0.15),
    0 0 16px rgba(139, 92, 246, 0.15);
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  z-index: 0;
  perspective: 1000px;
  transform-style: preserve-3d;
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 25vw;
    top: 20%;
  }

  &::before {
    content: 'PROTX';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(99, 102, 241, 0.08),
      rgba(139, 92, 246, 0.08)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: blur(4px);
  }

  &::after {
    content: 'PROTX';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(139, 92, 246, 0.15) 50%,
      transparent 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: blur(2px);
  }

  ${props => {
    switch(props.$animationStyle) {
      case 1:
        return letterAnimationStyle1;
      case 2:
        return letterAnimationStyle2;
      case 3:
        return letterAnimationStyle3;
      case 4:
        return letterAnimationStyle4;
      case 5:
        return letterAnimationStyle5;
      default:
        return letterAnimationStyle1;
    }
  }}

  @keyframes glow {
    0%, 100% {
      filter: brightness(1) blur(0px);
      text-shadow: 
        0 0 80px rgba(139, 92, 246, 0.2),
        0 0 32px rgba(139, 92, 246, 0.2);
    }
    50% {
      filter: brightness(1.2) blur(2px);
      text-shadow: 
        0 0 100px rgba(139, 92, 246, 0.3),
        0 0 40px rgba(139, 92, 246, 0.3);
    }
  }

  animation: glow 6s ease-in-out infinite;
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [historyUsernames, setHistoryUsernames] = useState([]);
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState('');
  const [notice, setNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState('');
  const [selectedEnv, setSelectedEnv] = useState('PROD');
  const [loading, setLoading] = useState(false);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const { t } = useTranslation();
  const [isCustomEnv, setIsCustomEnv] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const dispatch = useDispatch();
  const [showSlogan, setShowSlogan] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [animationStyle, setAnimationStyle] = useState(Math.floor(Math.random() * 5) + 1);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaRefreshed, setCaptchaRefreshed] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const refreshCaptcha = async () => {
    setCaptchaLoading(true);
    setCaptchaRefreshed(false);
    
    try {
      const newCaptchaUrl = `${API_BASE_URL}/manage/base/system/captcha?${new Date().getTime()}`;
      // 预加载图片
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = newCaptchaUrl;
      });
      
      setCaptcha(newCaptchaUrl);
      setCaptchaRefreshed(true);
      
      // 清除刷新成功状态
      setTimeout(() => {
        setCaptchaRefreshed(false);
      }, 500);
    } catch (error) {
      message.error('验证码加载失败，请重试');
    } finally {
      setCaptchaLoading(false);
    }
  };

  const handleSetBaseURL = () => {
    if (isCustomEnv) {
      if (!isValidURL(customUrl)) {
        message.error('请输入有效的URL地址（以 http:// 或 https:// 开头）');
        return;
      }
      setCustomBaseURL(customUrl);
    } else {
      setBaseURL(selectedEnv);
    }
    refreshCaptcha();
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
      return false;
    }
  };

  // 初始化时从 localStorage 加载历史用户名
  useEffect(() => {
    const savedUsernames = localStorage.getItem('historyUsernames');
    if (savedUsernames) {
      setHistoryUsernames(JSON.parse(savedUsernames));
    }
  }, []);

  // 保存新的用户名到历史记录
  const saveUsernameToHistory = (username) => {
    if (!username) return;
    
    const newHistoryUsernames = [
      username,
      ...historyUsernames.filter(name => name !== username)
    ].slice(0, 5); // 只保留最近5个

    setHistoryUsernames(newHistoryUsernames);
    localStorage.setItem('historyUsernames', JSON.stringify(newHistoryUsernames));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = { username, password, verify };

    try {
      const token = await api.post('/manage/manager/login', formData);
      localStorage.setItem('jwtManageToken', token);

      try {
        const userInfo = await api.get('/manage/manager/get-by-token');

        dispatch(
          setCurrentUser({
            id: userInfo.id,
            username: userInfo.username,
            email: userInfo.email,
            phone: userInfo.phone,
            roleId: userInfo.roleId,
            status: userInfo.status,
            isDeleted: userInfo.isDeleted,
            thirdUserAccountId: userInfo.thirdUserAccountId,
            createBy: userInfo.createBy,
            avatar: userInfo.avatar,
          }),
        );

        localStorage.setItem('currentUser', JSON.stringify(userInfo));
        
        // 登录成功后保存用户名
        saveUsernameToHistory(username);
        
        // 添加登录成功动画
        setIsExiting(true);
        message.success(t('loginSuccess'));
        
        // 等待动画完成后再跳转
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);

      } catch (userError) {
        localStorage.removeItem('jwtManageToken');
        message.error(t('failedToGetUserInfo'));
        refreshCaptcha();
      }
    } catch (error) {
      message.error(t('loginFailed'));
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href =
      'https://github.com/login/oauth/authorize?client_id=Ov23liKtBY8tbrKGO1q2&redirect_uri=https://protx.cn/manage/manager/github-callback';
  };

  // 在组件加载时自动设置当前环境
  useEffect(() => {
    const hostname = window.location.hostname;
    let initialEnv = 'PROD';

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      initialEnv = 'LOCAL';
    } else if (hostname.includes('test')) {
      initialEnv = 'TEST';
    }

    setSelectedEnv(initialEnv);
  }, []);

  const getEnvDisplayName = (env) => {
    switch (env) {
      case 'TEST':
        return '测试环境';
      case 'TEST2':
        return '测试环境2';
      case 'PROD':
        return '生产环境';
      case 'LOCAL':
        return '本地环境';
      case 'CUSTOM':
        return '自定义';
      default:
        return env;
    }
  };

  const renderEnvironmentOption = (env, url) => (
    <EnvOption value={env} key={env} label={getEnvDisplayName(env)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="env-name">{env === 'TEST' ? '测试环境(推荐)' : `${env}环境`}</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="env-url">{url}</span>
          <HealthCheck url={url} />
        </div>
      </div>
    </EnvOption>
  );

  // 鼠标移入处理函数
  const handleMouseEnter = () => {
    setShowSlogan(true);
  };

  // 鼠标移出处理函数
  const handleMouseLeave = () => {
    setShowSlogan(false);
  };

  // 添加双击事件处理函数
  const handleBackgroundDoubleClick = () => {
    setShowApiConfig(!showApiConfig);
  };

  return (
    <PageWrapper onDoubleClick={handleBackgroundDoubleClick}>
      <GlowingText $animationStyle={animationStyle}>
        {'PROTX'.split('').map((letter, index) => (
          <span 
            key={index} 
            className="letter"
            data-text={letter} // 为赛博朋克效果添加
          >
            {letter}
          </span>
        ))}
      </GlowingText>
      <LoginHeader />
      <div className="min-vh-100 d-flex align-items-center">
        <ContentWrapper>
          <CRow className="justify-content-center">
            <CCol xs={12} sm={10} md={8} lg={6} xl={5}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <LoginCard className={isExiting ? 'exit' : ''}>
                  <AnimatePresence>
                    {showSlogan && (
                      <motion.div
                        className="slogan-container"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="slogan">极致的用户体验，直达用户的内心</div>
                        <div className="sub-slogan">ProductX - 让每一次使用都触及灵魂</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <CardHeader>
                    <h4>{t('login')} ProductX Admin</h4>
                  </CardHeader>

                  <CardBody>
                    <ApiSection $visible={showApiConfig}>
                      <ApiTitle>
                        <CIcon icon={cilSettings} />
                        API 配置
                      </ApiTitle>
                      <VerticalStack>
                        <ApiInputGroup>
                          <StyledEnvDropdown>
                            <StyledEnvSelect
                              value={isCustomEnv ? 'CUSTOM' : selectedEnv}
                              onChange={(value) => {
                                if (value === 'CUSTOM') {
                                  setIsCustomEnv(true);
                                  setCustomUrl('');
                                } else {
                                  setIsCustomEnv(false);
                                  setSelectedEnv(value);
                                }
                              }}
                              dropdownMatchSelectWidth={false}
                              optionLabelProp="label"
                            >
                              {Object.entries(API_CONFIG).map(([env, url]) =>
                                renderEnvironmentOption(env, url),
                              )}
                              <Option value="CUSTOM" label="自定义">
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <span>自定义环境</span>
                                </div>
                              </Option>
                            </StyledEnvSelect>
                          </StyledEnvDropdown>
                          <ApiInput
                            $isCustom={isCustomEnv}
                            value={isCustomEnv ? customUrl : API_CONFIG[selectedEnv]}
                            onChange={(e) => isCustomEnv && setCustomUrl(e.target.value)}
                            disabled={!isCustomEnv}
                            placeholder={
                              isCustomEnv
                                ? '请输入自定义API地址，例如: http://example.com:8080'
                                : 'API 地址将根据选择的环境自动设置'
                            }
                          />
                          <ApiButton onClick={handleSetBaseURL}>
                            {isCustomEnv ? '应用配置' : '切换环境'}
                          </ApiButton>
                        </ApiInputGroup>
                        {isCustomEnv && (
                          <div
                            style={{
                              fontSize: '12px',
                              color: '#64748b',
                              padding: '4px 8px',
                            }}
                          >
                            请输入完整的URL地址，包含 http:// 或 https:// 前缀
                          </div>
                        )}
                      </VerticalStack>
                    </ApiSection>

                    <LoginForm onSubmit={handleLogin}>
                      <StyledInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <StyledInput
                          type="text"
                          placeholder={t('username')}
                          list="usernames"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                        <datalist id="usernames">
                          {historyUsernames.map((username) => (
                            <option key={username} value={username} />
                          ))}
                        </datalist>
                      </StyledInputGroup>

                      <StyledInputGroup>
                        <CInputGroupText onClick={() => setShowPassword(!showPassword)}>
                          <CIcon icon={showPassword ? cilLockUnlocked : cilLockLocked} />
                        </CInputGroupText>
                        <StyledInput
                          type={showPassword ? 'text' : 'password'}
                          placeholder={t('password')}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </StyledInputGroup>

                      <CaptchaInputGroup 
                        className={`
                          ${captchaLoading ? 'loading' : ''} 
                          ${captchaRefreshed ? 'refreshed' : ''}
                        `}
                      >
                        <div className="captcha-wrapper">
                          <img 
                            src={captcha} 
                            alt="验证码" 
                            onClick={refreshCaptcha}
                            style={{ 
                              opacity: captchaLoading ? 0.5 : 1
                            }}
                          />
                        </div>
                        <StyledInput
                          placeholder="请输入验证码"
                          value={verify}
                          onChange={(e) => setVerify(e.target.value)}
                          maxLength={4}
                        />
                      </CaptchaInputGroup>

                      <StyledButton
                        type="submit"
                        className="w-100"
                        disabled={loading}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        {loading ? '登录中...' : t('loginButton')}
                      </StyledButton>

                      <div className="divider" />

                      <CRow>
                        <CCol xs={12} className="text-center mb-3">
                          <GithubButton onClick={handleGitHubLogin} className="w-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              className="bi bi-github me-2"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                            </svg>
                            {t('githubLogin')}
                          </GithubButton>
                        </CCol>
                        <CCol xs={12} className="text-center">
                          <ForgotPasswordLink>{t('forgetPassword')}</ForgotPasswordLink>
                        </CCol>
                      </CRow>
                    </LoginForm>
                  </CardBody>
                </LoginCard>
              </motion.div>
            </CCol>
          </CRow>
        </ContentWrapper>
      </div>
      {!showApiConfig && <ApiConfigHint>双击背景显示 API 配置！！！</ApiConfigHint>}
    </PageWrapper>
  );
};

export default LoginPage;
