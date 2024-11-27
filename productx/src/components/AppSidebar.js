import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icons from '@coreui/icons'
import { AppSidebarNav } from './AppSidebarNav'
import { sygnet } from 'src/assets/brand/sygnet'
import api from 'src/axiosInstance'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import styled, { keyframes } from 'styled-components'

// 组件映射
const componentMap = {
  CNavGroup,
  CNavItem,
  CNavTitle,
}

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
`;

const BrandText = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  animation: ${glowAnimation} 2s ease-in-out infinite;
  transition: all 0.3s ease;
  
  .full-brand {
    display: ${props => props.narrow ? 'none' : 'block'};
  }
  
  .single-letter {
    display: ${props => props.narrow ? 'block' : 'none'};
    font-size: 1.5rem;
    font-weight: 800;
  }
`;

const AppSidebar = () => {
  const dispatch = useDispatch()
  const { sidebarShow, sidebarUnfoldable } = useSelector((state) => state.sidebar)
  const { t } = useTranslation()
  const [menuItems, setMenuItems] = useState([])

  // 转换后端数据为导航配置
  const transformNavData = (navItem) => {
    const Component = componentMap[navItem.component]
    if (!Component) return null

    // 基础配置
    const baseItem = {
      component: Component,
      name: t(`menu.${navItem.name}`), // 使用 t 函数，添加 menu 前缀
    }

    // 添加路径（如果存在）
    if (navItem.path) {
      baseItem.to = navItem.path
    }

    // 处理图标
    if (navItem.icon) {
      const icon = icons[navItem.icon]
      if (icon) {
        baseItem.icon = <CIcon icon={icon} customClassName="nav-icon" />
      }
    }

    // 处理徽章
    if (navItem.badgeText) {
      baseItem.badge = {
        color: navItem.badgeColor || 'info',
        text: t(`badge.${navItem.badgeText}`), // 徽章文本也使用 t 函数
      }
    }

    // 处理子菜单
    if (navItem.children && navItem.children.length > 0) {
      const childItems = navItem.children
        .map(transformNavData)
        .filter(Boolean)
      if (childItems.length > 0) {
        baseItem.items = childItems
      }
    }

    return baseItem
  }

  // 获取菜单数据
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get('/manage/sys-menu/tree')
        if (response && Array.isArray(response)) {
          // 按 id 排序
          const sortedResponse = response.sort((a, b) => a.id - b.id)
          const transformedItems = sortedResponse
            .map(transformNavData)
            .filter(Boolean)
          setMenuItems(transformedItems)
        }
      } catch (error) {
        console.error('获取菜单失败:', error)
      }
    }

    fetchMenuItems()
  }, [t]) // 添加 t 作为依赖，当语言改变时重新获取

  return (
    <CSidebar
      position="fixed"
      visible={sidebarShow}
      unfoldable={sidebarUnfoldable}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <BrandContainer>
        <BrandText narrow={sidebarUnfoldable || !sidebarShow}>
          <span className="full-brand">Product X ADMIN</span>
          <span className="single-letter">P</span>
        </BrandText>
      </BrandContainer>
      <style>
        {`
          /* 增加子菜单的左边距 */
          .custom-sidebar .nav-group-items {
            padding-left: 1rem !important;
          }
          
          /* 如果侧边栏折叠时不需要缩进 */
          .custom-sidebar.unfoldable .nav-group-items {
            padding-left: 0 !important;
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
  )
}

export default React.memo(AppSidebar)
