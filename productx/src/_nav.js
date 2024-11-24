import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell, cilBrowser,
  cilCalculator,
  cilChartPie, cilCommentSquare,
  cilCursor,
  cilDescription, cilDevices,
  cilDrop, cilEnvelopeClosed, cilFolder, cilGroup, cilImage, cilMovie,
  cilNotes,
  cilPencil,
  cilPuzzle, cilSettings,
  cilSpeedometer,
  cilStar,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const _nav = [
  {
    component: CNavItem,
    name: 'XAI',
    to: '/data/ai',
    icon: <CIcon icon={cilDevices} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '控制台',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '用户',
  },
  {
    component: CNavItem,
    name: '管理',
    to: '/user/list',
  },
  {
    component: CNavItem,
    name: 'usersManage',
    to: '/data/userList',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '订单管理',
    to: '/data/userOrder',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '系统',
  },
  {
    component: CNavItem,
    name: '系统支持货币',
    to: '/data/sysCurrency',
    icon: <CIcon icon={cilDevices} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '系统支持国家',
    to: '/data/country',
    icon: <CIcon icon={cilDevices} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '系统支持银行',
    to: '/data/globalBank',
    icon: <CIcon icon={cilDevices} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '客服',
  },
  {
    component: CNavItem,
    name: '工单系统',
    to: '/data/workOrder',
    icon: <CIcon icon={cilBrowser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '财务系统',
  },
  {
    component: CNavItem,
    name: '[系统]钱包管理',
    to: '/data/sysWallets',
    icon: <CIcon icon={cilBrowser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '[系统]加密货币管理',
    to: '/data/sysCryptoCurrencies',
    icon: <CIcon icon={cilBrowser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '快递系统',
  },
  {
    component: CNavItem,
    name: '快递平台',
    to: '/data/express',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '公司管理',
  },
  {
    component: CNavItem,
    name: '部门管理',
    to: '/data/department',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '员工管理',
    to: '/data/manager',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '角色管理',
    to: '/data/role',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '权限管理',
    to: '/data/permission',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '世界',
  },
  {
    component: CNavItem,
    name: 'ThreeWord',
    to: '/threeJs',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Theme',
  },
  {
    component: CNavItem,
    name: 'Colors',
    to: '/theme/colors',
    icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Typography',
    to: '/theme/typography',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'Base',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/base/accordion',
      },
      {
        component: CNavItem,
        name: 'Breadcrumb',
        to: '/base/breadcrumbs',
      },
      {
        component: CNavItem,
        name: 'Cards',
        to: '/base/cards',
      },
      {
        component: CNavItem,
        name: 'Carousel',
        to: '/base/carousels',
      },
      {
        component: CNavItem,
        name: 'Collapse',
        to: '/base/collapses',
      },
      {
        component: CNavItem,
        name: 'List group',
        to: '/base/list-groups',
      },
      {
        component: CNavItem,
        name: 'Navs & Tabs',
        to: '/base/navs',
      },
      {
        component: CNavItem,
        name: 'Pagination',
        to: '/base/paginations',
      },
      {
        component: CNavItem,
        name: 'Placeholders',
        to: '/base/placeholders',
      },
      {
        component: CNavItem,
        name: 'Popovers',
        to: '/base/popovers',
      },
      {
        component: CNavItem,
        name: 'Progress',
        to: '/base/progress',
      },
      {
        component: CNavItem,
        name: 'Spinners',
        to: '/base/spinners',
      },
      {
        component: CNavItem,
        name: 'Tables',
        to: '/base/tables',
      },
      {
        component: CNavItem,
        name: 'Tabs',
        to: '/base/tabs',
      },
      {
        component: CNavItem,
        name: 'Tooltips',
        to: '/base/tooltips',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Buttons',
    to: '/buttons',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Buttons',
        to: '/buttons/buttons',
      },
      {
        component: CNavItem,
        name: 'Buttons groups',
        to: '/buttons/button-groups',
      },
      {
        component: CNavItem,
        name: 'Dropdowns',
        to: '/buttons/dropdowns',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Forms',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Form Control',
        to: '/forms/form-control',
      },
      {
        component: CNavItem,
        name: 'Select',
        to: '/forms/select',
      },
      {
        component: CNavItem,
        name: 'Checks & Radios',
        to: '/forms/checks-radios',
      },
      {
        component: CNavItem,
        name: 'Range',
        to: '/forms/range',
      },
      {
        component: CNavItem,
        name: 'Input Group',
        to: '/forms/input-group',
      },
      {
        component: CNavItem,
        name: 'Floating Labels',
        to: '/forms/floating-labels',
      },
      {
        component: CNavItem,
        name: 'Layout',
        to: '/forms/layout',
      },
      {
        component: CNavItem,
        name: 'Validation',
        to: '/forms/validation',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Icons',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'CoreUI Free',
        to: '/icons/coreui-icons',
        badge: {
          color: 'success',
          text: 'NEW',
        },
      },
      {
        component: CNavItem,
        name: 'CoreUI Flags',
        to: '/icons/flags',
      },
      {
        component: CNavItem,
        name: 'CoreUI Brands',
        to: '/icons/brands',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Alerts',
        to: '/notifications/alerts',
      },
      {
        component: CNavItem,
        name: 'Badges',
        to: '/notifications/badges',
      },
      {
        component: CNavItem,
        name: 'Modal',
        to: '/notifications/modals',
      },
      {
        component: CNavItem,
        name: 'Toasts',
        to: '/notifications/toasts',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Widgets',
    to: '/widgets',
    icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Extras',
  },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
