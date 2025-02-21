import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import * as icons from '@coreui/icons';
import * as AntdIcons from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AppSidebarNav } from './AppSidebarNav';
import { sygnet } from 'src/assets/brand/sygnet';
import api from 'src/axiosInstance';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';
import styled, { keyframes } from 'styled-components';

// 组件映射
const componentMap = {
  CNavGroup,
  CNavItem,
  CNavTitle,
};

const glowAnimation = keyframes`
  0% {
    text-shadow: 0 0 5px #fff,
                 0 0 10px #fff,
                 0 0 15px #0073e6,
                 0 0 20px #0073e6;
  }
  50% {
    text-shadow: 0 0 10px #fff,
                 0 0 20px #fff,
                 0 0 25px #0073e6,
                 0 0 30px #0073e6;
  }
  100% {
    text-shadow: 0 0 5px #fff,
                 0 0 10px #fff,
                 0 0 15px #0073e6,
                 0 0 20px #0073e6;
  }
`;

const BrandContainer = styled(CSidebarBrand)`
  padding: 0 1rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none !important;

  &:hover {
    text-decoration: none !important;
  }
`;

const BrandText = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  animation: ${glowAnimation} 2s ease-in-out infinite;
  transition: all 0.3s ease;
  text-decoration: none !important;

  .full-brand {
    display: ${({ $narrow }) => ($narrow ? 'none' : 'block')};
    text-decoration: none !important;

    &:hover {
      text-decoration: none !important;
    }
  }

  .single-letter {
    display: ${({ $narrow }) => ($narrow ? 'block' : 'none')};
    font-size: 1.5rem;
    font-weight: 800;
    text-decoration: none !important;

    &:hover {
      text-decoration: none !important;
    }
  }

  &:hover {
    text-decoration: none !important;
  }
`;

const AppSidebar = () => {
  const dispatch = useDispatch();
  const { sidebarShow, sidebarUnfoldable } = useSelector((state) => state.sidebar);
  const { t } = useTranslation();
  const [menuItems, setMenuItems] = useState([]);

  // 转换后端数据为导航配置
  const transformNavData = (navItem) => {
    const Component = componentMap[navItem.component];
    if (!Component) return null;

    // 基础配置
    const baseItem = {
      component: Component,
      name: t(`menu.${navItem.name}`),
    };

    // 添加路径（如果存在）
    if (navItem.path) {
      baseItem.to = navItem.path;
    }

    // 处理图标
    if (navItem.icon) {
      // CoreUI 图标
      if (navItem.icon.startsWith('cil')) {
        const icon = icons[navItem.icon];
        if (icon) {
          baseItem.icon = <CIcon icon={icon} customClassName="nav-icon" />;
        }
      }
      // Ant Design 图标
      else if (navItem.icon.endsWith('Outlined') || navItem.icon.endsWith('Filled') || navItem.icon.endsWith('TwoTone')) {
        const AntIcon = AntdIcons[navItem.icon];
        if (AntIcon) {
          baseItem.icon = <AntIcon className="nav-icon" />;
        }
      }
      // Font Awesome 图标
      else if (fas[navItem.icon]) {
        baseItem.icon = <FontAwesomeIcon icon={fas[navItem.icon]} className="nav-icon" />;
      }
    }

    // 处理徽章
    if (navItem.badgeText) {
      baseItem.badge = {
        color: navItem.badgeColor || 'info',
        text: t(`badge.${navItem.badgeText}`),
      };
    }

    // 处理子菜单
    if (navItem.children && navItem.children.length > 0) {
      const childItems = navItem.children.map(transformNavData).filter(Boolean);
      if (childItems.length > 0) {
        baseItem.items = childItems;
      }
    }

    return baseItem;
  };

  // 获取菜单数据
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/manage/sys-menu/tree');
        if (response && Array.isArray(response)) {
          // 按 id 排序
          const sortedResponse = response.sort((a, b) => a.id - b.id);
          const transformedItems = sortedResponse.map(transformNavData).filter(Boolean);
          setMenuItems(transformedItems);
        }
      } catch (error) {
        console.error('获取菜单失败:', error);
      }
    };

    fetchMenuItems();
  }, [t]); // 添加 t 作为依赖，当语言改变时重新获取

  return (
    <CSidebar
      position="fixed"
      visible={sidebarShow}
      unfoldable={sidebarUnfoldable}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
      className="sidebar-dark"
    >
      <BrandContainer>
        <BrandText $narrow={sidebarUnfoldable || !sidebarShow}>
          <span className="full-brand">ProTX ADMIN</span>
          <span className="single-letter">X</span>
        </BrandText>
      </BrandContainer>
      <style>
        {`
          /* 强制使用暗色主题样式 */
          .sidebar-dark {
            background-color: #3c4b64 !important;
            color: #fff !important;
          }

          .sidebar-dark .nav-link {
            color: rgba(255, 255, 255, 0.8) !important;
          }

          .sidebar-dark .nav-link:hover {
            color: #fff !important;
            background: rgba(255, 255, 255, 0.05) !important;
          }

          .sidebar-dark .nav-link.active {
            color: #fff !important;
            background: rgba(255, 255, 255, 0.1) !important;
          }

          .sidebar-dark .nav-group.show {
            background: rgba(0, 0, 0, 0.2) !important;
          }

          .sidebar-dark .nav-group-toggle {
            color: rgba(255, 255, 255, 0.8) !important;
          }

          .sidebar-dark .nav-group-toggle:hover {
            color: #fff !important;
            background: rgba(255, 255, 255, 0.05) !important;
          }

          /* 展开状态下的子菜单图标缩进 */
          .nav-group-items .nav-item .nav-icon {
            margin-left: 0.5rem;
          }

          /* 折叠状态下重置缩进 */
          .sidebar-narrow .nav-group-items .nav-item,
          .sidebar-narrow-unfoldable .nav-group-items .nav-item {
            padding-left: 0 !important;
          }

          /* 折叠状态下重置图标位置 */
          .sidebar-narrow .nav-group-items .nav-item .nav-icon,
          .sidebar-narrow-unfoldable .nav-group-items .nav-item .nav-icon {
            margin-left: 0;
          }
        `}
      </style>
      <AppSidebarNav items={menuItems} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !sidebarUnfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
