import React, { useState } from 'react'
import { Modal, Form, Input, Select, Space, Alert, Tabs } from 'antd'
import { 
  MenuOutlined, 
  LinkOutlined, 
  AppstoreOutlined,
  TagOutlined,
  BgColorsOutlined,
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  SettingOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import CIcon from '@coreui/icons-react'
import * as icons from '@coreui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faUsers, 
  faShoppingCart,
  faStore,
  faCog,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'
import IconSelectModal from './IconSelectModal'

const { Option } = Select
const { TabPane } = Tabs

// 创建 Ant Design 图标映射
const antIcons = {
  UserOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  SettingOutlined,
  DashboardOutlined,
}

// 添加样式常量
const ICON_GRID_STYLES = {
  display: 'grid',
  gridTemplateColumns: 'repeat(6, 1fr)', // 改为6列
  gap: '4px',
  padding: '8px',
  maxHeight: '280px',    // 限制最大高度
  overflowY: 'auto',     // 添加垂直滚动
}

const ICON_ITEM_STYLES = {
  padding: '8px 4px',
  cursor: 'pointer',
  borderRadius: '4px',
  border: '1px solid #d9d9d9',
  textAlign: 'center',
  fontSize: '12px',      // 减小字体大小
  transition: 'all 0.3s',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  '&:hover': {
    borderColor: '#40a9ff',
    backgroundColor: '#e6f7ff',
  }
}

const ICON_WRAPPER_STYLES = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '24px',       // 固定图标容器高度
}

const AddMenuModal = ({ 
  visible, 
  onCancel, 
  onOk, 
  form, 
  selectedParent,
  componentOptions = ['CNavGroup', 'CNavItem', 'CNavTitle']
}) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('coreui')
  const [iconModalVisible, setIconModalVisible] = useState(false)

  // 获取所有图标
  const getAllIcons = () => {
    return {
      coreui: Object.keys(icons).filter(key => key.startsWith('cil')),
      antd: Object.keys(antIcons),
      fontawesome: ['user', 'users', 'shopping-cart', 'store', 'cog', 'tachometer-alt']
    }
  }

  // 优化图标选项渲染
  const renderIconOption = (iconType, iconName) => {
    switch(iconType) {
      case 'coreui':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={ICON_WRAPPER_STYLES}>
              <CIcon 
                icon={icons[iconName]} 
                className="menu-icon"
                style={{ width: '16px', height: '16px' }}
              />
            </div>
            <div style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontSize: '12px',
              color: '#666'
            }}>
              {iconName}
            </div>
          </div>
        )
      case 'antd':
        const AntIcon = antIcons[iconName]
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={ICON_WRAPPER_STYLES}>
              <AntIcon style={{ fontSize: '16px' }} />
            </div>
            <div style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontSize: '12px',
              color: '#666'
            }}>
              {iconName}
            </div>
          </div>
        )
      case 'fontawesome':
        const faIcon = {
          'user': faUser,
          'users': faUsers,
          'shopping-cart': faShoppingCart,
          'store': faStore,
          'cog': faCog,
          'tachometer-alt': faTachometerAlt,
        }[iconName]
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={ICON_WRAPPER_STYLES}>
              <FontAwesomeIcon icon={faIcon} style={{ fontSize: '16px' }} />
            </div>
            <div style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              fontSize: '12px',
              color: '#666'
            }}>
              {iconName}
            </div>
          </div>
        )
    }
  }

  const handleIconSelect = (iconName) => {
    form.setFieldValue('icon', iconName)
    setIconModalVisible(false)
  }

  return (
    <Modal
      title={selectedParent ? t('addSubmenu') : t('addRootMenu')}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={500}
      maskClosable={false}
      destroyOnClose
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Alert
        message={t('menuPermissionTip')}
        type="info"
        showIcon
        banner
        style={{ marginBottom: '8px' }}
      />
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: true }}
      >
        <Form.Item
          name="parentId"
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<Space><MenuOutlined /> {t('menuName')}</Space>}
          name="name"
          rules={[{ required: true, message: t('pleaseEnterMenuName') }]}
        >
          <Input placeholder={t('pleaseEnterMenuName')} />
        </Form.Item>

        <Form.Item
          label={<Space><LinkOutlined /> {t('menuPath')}</Space>}
          name="path"
          rules={[{ required: true, message: t('pleaseEnterMenuPath') }]}
        >
          <Input placeholder={t('menuPathPlaceholder')} />
        </Form.Item>

        <Form.Item
          label={<Space><AppstoreOutlined /> {t('menuIcon')}</Space>}
          name="icon"
          rules={[{ required: true, message: t('pleaseSelectIcon') }]}
        >
          <Input
            readOnly
            placeholder={t('pleaseSelectIcon')}
            onClick={() => setIconModalVisible(true)}
            suffix={<AppstoreOutlined />}
          />
        </Form.Item>

        <Form.Item
          label={<Space><AppstoreOutlined /> {t('componentType')}</Space>}
          name="component"
          rules={[{ required: true, message: t('pleaseSelectComponentType') }]}
        >
          <Select placeholder={t('pleaseSelectComponentType')}>
            {componentOptions.map(component => (
              <Option key={component} value={component}>
                {t(component.toLowerCase())}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<Space><TagOutlined /> {t('badgeText')}</Space>}
          name="badgeText"
        >
          <Input placeholder={t('badgeTextPlaceholder')} />
        </Form.Item>

        <Form.Item
          label={<Space><BgColorsOutlined /> {t('badgeColor')}</Space>}
          name="badgeColor"
        >
          <Input placeholder={t('badgeColorPlaceholder')} />
        </Form.Item>
      </Form>

      <IconSelectModal
        visible={iconModalVisible}
        onCancel={() => setIconModalVisible(false)}
        onSelect={handleIconSelect}
      />
    </Modal>
  )
}

export default AddMenuModal 