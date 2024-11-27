import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentUser } from 'src/redux/userSlice';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import defaultAvatar from './../../assets/images/avatars/8.jpg';
import Cookies from 'js-cookie';
import axiosInstance from "src/axiosInstance";
import { message } from "antd";

// 添加自定义样式
const CompactDropdownMenu = styled(CDropdownMenu)`
  min-width: 200px !important;
  padding: 4px !important;
  font-size: 10px !important;
`;

const CompactDropdownItem = styled(CDropdownItem)`
  padding: 4px 8px !important;
  font-size: 10px !important;
  
  .me-2 {
    width: 12px !important;
    height: 12px !important;
    margin-right: 4px !important;
  }
`;

const CompactDropdownHeader = styled(CDropdownHeader)`
  padding: 4px 8px !important;
  font-size: 10px !important;
  margin-bottom: 4px !important;
`;

const CompactBadge = styled(CBadge)`
  font-size: 8px !important;
  padding: 2px 4px !important;
  margin-left: 4px !important;
`;

const SmallAvatar = styled(CAvatar)`
  width: 28px !important;
  height: 28px !important;
`;

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentUser = useSelector((state) => state.user?.currentUser);
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('jwtManageToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginOut = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/manage/manager/logout');
      localStorage.removeItem('jwtManageToken');
      localStorage.removeItem('currentUser');
      Cookies.remove('LOGIN_IDENTITY');
      dispatch(clearCurrentUser());
      setIsLoggedIn(false);
      message.success("登出成功");
      navigate('/login');
    } catch (error) {
      message.error('登出失败', 4);
      localStorage.removeItem('jwtManageToken');
      localStorage.removeItem('currentUser');
      Cookies.remove('LOGIN_IDENTITY');
      dispatch(clearCurrentUser());
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  const avatarUrl = currentUser?.avatar || defaultAvatar;

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <SmallAvatar 
          src={avatarUrl} 
          size="md"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
      </CDropdownToggle>
      <CompactDropdownMenu className="pt-0" placement="bottom-end">
        <CompactDropdownHeader className="bg-body-secondary fw-semibold">
          {currentUser?.username || t('account')}
        </CompactDropdownHeader>
        <CompactDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          {t('updates')}
          <CompactBadge color="info">42</CompactBadge>
        </CompactDropdownItem>
        <CompactDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          {t('messages')}
          <CompactBadge color="success">42</CompactBadge>
        </CompactDropdownItem>
        <CompactDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          {t('tasks')}
          <CompactBadge color="danger">42</CompactBadge>
        </CompactDropdownItem>
        <CompactDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          {t('comments')}
          <CompactBadge color="warning">42</CompactBadge>
        </CompactDropdownItem>
        <CompactDropdownHeader className="bg-body-secondary fw-semibold">
          {t('settings')}
        </CompactDropdownHeader>
        <CompactDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          {t('profile')}
        </CompactDropdownItem>
        <CompactDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          {t('settings')}
        </CompactDropdownItem>
        <CDropdownDivider />
        {isLoggedIn ? (
          <CompactDropdownItem onClick={handleLoginOut}>
            <CIcon icon={cilLockLocked} className="me-2" />
            {t('logout')}
          </CompactDropdownItem>
        ) : (
          <>
            <CompactDropdownItem onClick={() => navigate('/login')}>
              <CIcon icon={cilLockLocked} className="me-2" />
              {t('login')}
            </CompactDropdownItem>
            <CompactDropdownItem onClick={() => navigate('/register')}>
              <CIcon icon={cilLockLocked} className="me-2" />
              {t('register')}
            </CompactDropdownItem>
          </>
        )}
      </CompactDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
