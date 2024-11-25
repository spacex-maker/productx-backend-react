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

// 组件映射
const componentMap = {
  CNavGroup,
  CNavItem,
  CNavTitle,
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
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
      className="border-end custom-sidebar"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
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
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <strong>Product X ADMIN</strong>
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={25} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={menuItems} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
