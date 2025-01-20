import React, { useState, useEffect } from 'react';
import { Avatar, Typography, Divider, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentUser, setCurrentUser } from 'src/store/user';
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
// @ts-ignore
import defaultAvatar from '../../../assets/images/avatars/8.jpg';
import Cookies from 'js-cookie';
import axiosInstance from 'src/axiosInstance';
import { message } from 'antd';
import { AdminDetailModal } from './AdminDetailModal';
import SettingsModal from './SettingsModal';

const { Text } = Typography;
const { confirm } = Modal;

// 添加自定义样式
const CompactDropdownMenu = styled(CDropdownMenu)`
  min-width: 200px !important;
  padding: 4px !important;
`;

const CompactDropdownItem = styled(CDropdownItem)`
  padding: 4px 8px !important;

  .me-2 {
    width: 12px !important;
    height: 12px !important;
    margin-right: 4px !important;
  }
`;

const CompactDropdownHeader = styled(CDropdownHeader)`
  padding: 4px 8px !important;
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

export const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentUser = useSelector((state) => state.user?.currentUser);
  const { t } = useTranslation();
  const [showAdminDetail, setShowAdminDetail] = useState(false);
  const [adminDetail, setAdminDetail] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtManageToken');
    setIsLoggedIn(!!token);
  }, []);

  const fetchAdminDetail = async () => {
    try {
      const userInfo = await axiosInstance.get('/manage/manager/get-by-token');
      setAdminDetail(userInfo);
      // 同时更新 Redux 中的用户信息
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
    } catch (error) {
      message.error('获取管理员信息失败');
    }
  };

  const handleLoginOut = async (e) => {
    e.preventDefault();
    confirm({
      title: t('logoutConfirm'),
      content: t('logoutConfirmContent'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          await axiosInstance.post('/manage/manager/logout');
          localStorage.removeItem('jwtManageToken');
          localStorage.removeItem('currentUser');
          Cookies.remove('LOGIN_IDENTITY');
          dispatch(clearCurrentUser());
          setIsLoggedIn(false);
          message.success('登出成功');
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
      },
      centered: true,
      maskClosable: true,
      closable: true,
      width: 400,
    });
  };

  const avatarUrl = currentUser?.avatar || defaultAvatar;

  const handleShowProfile = async () => {
    setShowAdminDetail(true);
    await fetchAdminDetail();
  };

  const handleSettingsSuccess = async () => {
    await fetchAdminDetail(); // 刷新用户信息
  };

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle className="py-0" caret={false}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '4px',
            borderRadius: '40px',
            border: '1px solid var(--cui-border-color)',
          }}>
            <div style={{ position: 'relative', padding: '4px' }}>
              <Avatar
                size={40}
                src={currentUser?.avatar || defaultAvatar}
                style={{ 
                  border: '3px solid var(--cui-body-bg)',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.1)'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: '12px',
                height: '12px',
                background: currentUser?.status ? '#52c41a' : '#ff4d4f',
                borderRadius: '50%',
                border: '2px solid var(--cui-body-bg)'
              }} />
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '2px',
              paddingRight: '12px'
            }}>
              <span style={{ 
                fontWeight: 600,
                fontSize: '14px'
              }}>{currentUser?.username}</span>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {currentUser?.email}
              </Text>
            </div>
          </div>
        </CDropdownToggle>

        <CDropdownMenu style={{
          padding: '8px',
          minWidth: '220px',
          border: '1px solid var(--cui-border-color)',
          borderRadius: '12px',
          boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08)',
        }}>
          <CDropdownHeader style={{ 
            padding: '8px 16px',
            color: 'var(--cui-body-color)',
            fontWeight: 600,
            borderBottom: '1px solid var(--cui-border-color)'
          }}>
            {t('account')}
          </CDropdownHeader>

          <CompactDropdownItem href="#" style={{ marginTop: '8px' }}>
            <CIcon icon={cilBell} className="me-2" />
            {t('updates')}
            <CompactBadge color="info" className="ms-auto">42</CompactBadge>
          </CompactDropdownItem>

          <CompactDropdownItem href="#">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            {t('messages')}
            <CompactBadge color="success" className="ms-auto">42</CompactBadge>
          </CompactDropdownItem>

          <CompactDropdownItem href="#">
            <CIcon icon={cilTask} className="me-2" />
            {t('tasks')}
            <CompactBadge color="danger" className="ms-auto">42</CompactBadge>
          </CompactDropdownItem>

          <CompactDropdownItem href="#">
            <CIcon icon={cilCommentSquare} className="me-2" />
            {t('comments')}
            <CompactBadge color="warning" className="ms-auto">42</CompactBadge>
          </CompactDropdownItem>

          <CDropdownHeader style={{ 
            padding: '8px 16px',
            marginTop: '8px',
            color: 'var(--cui-body-color)',
            fontWeight: 600,
            borderTop: '1px solid var(--cui-border-color)',
            borderBottom: '1px solid var(--cui-border-color)'
          }}>
            {t('settings')}
          </CDropdownHeader>

          <CompactDropdownItem onClick={handleShowProfile}>
            <CIcon icon={cilUser} className="me-2" />
            {t('profile')}
          </CompactDropdownItem>

          <CompactDropdownItem onClick={() => setShowSettings(true)}>
            <CIcon icon={cilSettings} className="me-2" />
            {t('settings')}
          </CompactDropdownItem>

          <CDropdownDivider style={{ margin: '8px 0' }} />

          <CompactDropdownItem 
            onClick={handleLoginOut}
            style={{ color: 'var(--cui-danger)' }}
          >
            <CIcon icon={cilLockLocked} className="me-2" />
            {t('logout')}
          </CompactDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      <AdminDetailModal
        visible={showAdminDetail}
        onCancel={() => {
          setShowAdminDetail(false);
          setAdminDetail(null);
        }}
        adminInfo={adminDetail || currentUser}
      />

      <SettingsModal
        visible={showSettings}
        onCancel={() => setShowSettings(false)}
        currentUser={currentUser}
        onSuccess={handleSettingsSuccess}
      />
    </>
  );
};
