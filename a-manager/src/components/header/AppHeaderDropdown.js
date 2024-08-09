import React, { useState, useEffect } from 'react';
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
import avatar8 from './../../assets/images/avatars/8.jpg';
import {Link} from "react-router-dom";

const AppHeaderDropdown = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking token
    const token = localStorage.getItem('jwtManageToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Clear the token and update the login status
    localStorage.removeItem('jwtManageToken');
    setIsLoggedIn(false);
    // Optionally redirect to login page
    window.location.href = '/login';
  };

  return (
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={avatar8} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilBell} className="me-2" />
            Updates
            <CBadge color="info" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Messages
            <CBadge color="success" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilTask} className="me-2" />
            Tasks
            <CBadge color="danger" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilCommentSquare} className="me-2" />
            Comments
            <CBadge color="warning" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilCreditCard} className="me-2" />
            Payments
            <CBadge color="secondary" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilFile} className="me-2" />
            Projects
            <CBadge color="primary" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownDivider />
          {isLoggedIn ? (
              <CDropdownItem onClick={handleLogout}>
                <CIcon icon={cilLockLocked} className="me-2" />
                登出
              </CDropdownItem>
          ) : (
              <>
                <CDropdownItem>
                  <CIcon icon={cilLockLocked} className="me-2" />
                  <Link to="/login">登录</Link>
                </CDropdownItem>
                <CDropdownItem href="/register">
                  <CIcon icon={cilLockLocked} className="me-2" />
                  <Link to="/register">注册</Link>
                </CDropdownItem>
              </>
          )}
        </CDropdownMenu>
      </CDropdown>
  );
};

export default AppHeaderDropdown;
