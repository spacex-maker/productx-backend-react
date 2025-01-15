import React from 'react'
import { Modal, Form, Input, Select, Space, Alert } from 'antd'
import { 
  MenuOutlined, 
  LinkOutlined, 
  AppstoreOutlined,
  TagOutlined,
  BgColorsOutlined
} from '@ant-design/icons'
import CIcon from '@coreui/icons-react'
import * as icons from '@coreui/icons'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const AddMenuModal = ({ 
  visible, 
  onCancel, 
  onOk, 
  form, 
  selectedParent,
  componentOptions = ['CNavGroup', 'CNavItem', 'CNavTitle']
}) => {
  const { t } = useTranslation()

  // 获取所有 CoreUI 图标并添加搜索过滤功能
  const getAllCoreUIIcons = () => {
    return Object.keys(icons).filter(key => key.startsWith('cil'));
  };

  // 图标搜索过滤函数
  const filterIconOption = (input, option) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

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
          <Select
            suffixIcon={<AppstoreOutlined />}
            placeholder={t('pleaseSelectIcon')}
            showSearch
            optionFilterProp="children"
            filterOption={filterIconOption}
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ 
              maxHeight: '400px',
              overflow: 'auto'
            }}
            // 自定义选中项的显示内容
            menuItemSelectedIcon={null}
            // 自定义选择框中显示的内容
            value={form.getFieldValue('icon')}
          >
            {getAllCoreUIIcons().map(icon => (
              <Select.Option key={icon} value={icon}>
                <Space align="center" style={{ width: '100%' }}>
                  <CIcon 
                    icon={icons[icon]} 
                    className="menu-icon"
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ flex: 1 }}>{icon}</span>
                </Space>
              </Select.Option>
            ))}
          </Select>
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
    </Modal>
  )
}

export default AddMenuModal 