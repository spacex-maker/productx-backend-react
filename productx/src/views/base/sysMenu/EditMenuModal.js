import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Space, Switch, Tabs } from 'antd'
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

const EditMenuModal = ({ 
  visible, 
  onCancel, 
  onOk, 
  form,
  currentItem,
  componentOptions = ['CNavGroup', 'CNavItem', 'CNavTitle']
}) => {
  const { t } = useTranslation()
  const [iconModalVisible, setIconModalVisible] = useState(false)

  // 获取所有图标
  const getAllIcons = () => {
    return {
      coreui: Object.keys(icons).filter(key => key.startsWith('cil')),
      antd: Object.keys(antIcons),
      fontawesome: ['user', 'users', 'shopping-cart', 'store', 'cog', 'tachometer-alt']
    }
  }

  // 渲染图标选项
  const renderIconOption = (iconType, iconName) => {
    switch(iconType) {
      case 'coreui':
        return (
          <Space align="center">
            <CIcon 
              icon={icons[iconName]} 
              className="menu-icon"
              style={{ width: '16px', height: '16px' }}
            />
            <span>{iconName}</span>
          </Space>
        )
      case 'antd':
        const AntIcon = antIcons[iconName]
        return (
          <Space align="center">
            <AntIcon className="menu-icon" />
            <span>{iconName}</span>
          </Space>
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
          <Space align="center">
            <FontAwesomeIcon icon={faIcon} className="menu-icon" />
            <span>{iconName}</span>
          </Space>
        )
    }
  }

  const handleIconSelect = (iconName) => {
    form.setFieldValue('icon', iconName)
    setIconModalVisible(false)
  }

  useEffect(() => {
    if (visible && currentItem) {
      form.setFieldsValue({
        id: currentItem.id,
        parentId: currentItem.parentId,
        name: currentItem.name,
        path: currentItem.path,
        icon: currentItem.icon,
        component: currentItem.component,
        badgeText: currentItem.badgeText,
        badgeColor: currentItem.badgeColor,
        status: currentItem.status,
      });
    }
  }, [visible, currentItem, form]);

  return (
    <Modal
      title={t('editMenu')}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={500}
      maskClosable={false}
      destroyOnClose
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="parentId" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={<Space><MenuOutlined /> {t('menuName')}</Space>}
          name="name"
          rules={[{ required: true, message: t('pleaseInputMenuName') }]}
        >
          <Input placeholder={t('pleaseInputMenuName')} />
        </Form.Item>

        <Form.Item
          label={<Space><LinkOutlined /> {t('menuPath')}</Space>}
          name="path"
          rules={[{ required: true, message: t('pleaseInputMenuPath') }]}
        >
          <Input placeholder={t('pleaseInputMenuPath')} />
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
          <Select 
            placeholder={t('pleaseSelectComponentType')}
            disabled={currentItem?.children?.length > 0}
          >
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

        <Form.Item
          name="status"
          label={<Space><AppstoreOutlined /> {t('status')}</Space>}
          valuePropName="checked"
        >
          <Switch
            checkedChildren={t('enabled')}
            unCheckedChildren={t('disabled')}
          />
        </Form.Item>
      </Form>

      <IconSelectModal
        visible={iconModalVisible}
        onCancel={() => setIconModalVisible(false)}
        onSelect={handleIconSelect}
      />
    </Modal>
  );
};

export default EditMenuModal; 