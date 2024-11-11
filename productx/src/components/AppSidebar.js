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

import { AppSidebarNav } from './AppSidebarNav'
import { sygnet } from 'src/assets/brand/sygnet'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { t } = useTranslation()  // 通过 i18n 获取语言切换信息
  const [translatedNav, setTranslatedNav] = useState(getNavWithTranslation(navigation, t))

  // 每次语言切换时，重新计算翻译的导航
  useEffect(() => {
    setTranslatedNav(getNavWithTranslation(navigation, t))
  }, [t])  // 在语言变化时重新计算导航翻译

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <strong>Product X ADMIN</strong>
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={20} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      {/* 将更新后的 translatedNav 传递给 AppSidebarNav */}
      <AppSidebarNav items={translatedNav} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

const getNavWithTranslation = (navigation, t) => {
  return navigation.map(item => {
    if (item.name) {
      item.name = t(item.name)  // 使用传入的 t 函数翻译 name 字段
    }
    if (item.items) {
      item.items = getNavWithTranslation(item.items, t)  // 递归翻译子菜单
    }
    return item
  })
}

export default React.memo(AppSidebar)
