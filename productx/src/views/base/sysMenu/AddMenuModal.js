import React from 'react'
import { Modal, Form, Input, Select, Space } from 'antd'
import { 
  MenuOutlined, 
  LinkOutlined, 
  AppstoreOutlined,
  TagOutlined,
  BgColorsOutlined
} from '@ant-design/icons'
import CIcon from '@coreui/icons-react'
import * as icons from '@coreui/icons'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 12px;
    color: #000000;
  }

  .ant-form {
    .ant-form-item-label > label {
      font-size: 10px;
      color: #666666;
      height: 20px;
    }

    .ant-input,
    .ant-select-selection-item,
    .ant-select-item-option-content {
      font-size: 10px !important;
      color: #000000 !important;
    }

    .ant-input::placeholder,
    .ant-select-selection-placeholder {
      color: #999999 !important;
      font-size: 10px !important;
    }

    .ant-select-selector {
      height: 24px !important;
      
      .ant-select-selection-search-input {
        height: 22px !important;
      }
    }

    .ant-form-item {
      margin-bottom: 8px;
    }

    .ant-form-item-explain {
      font-size: 10px;
    }
  }

  .ant-modal-footer {
    .ant-btn {
      font-size: 10px;
      height: 24px;
      padding: 0 12px;
    }
  }

  .menu-icon {
    width: 14px;
    height: 14px;
  }

  .ant-select-dropdown {
    .ant-select-item {
      padding: 8px 12px;
      
      .menu-icon {
        width: 16px;
        height: 16px;
        vertical-align: middle;
      }
      
      .ant-space {
        width: 100%;
        justify-content: flex-start;
      }
    }
  }

  .ant-select-selection-item {
    .menu-icon {
      width: 16px;
      height: 16px;
      vertical-align: middle;
    }
  }
`

// 获取所有 CoreUI 图标
const getAllCoreUIIcons = () => {
  return Object.keys(icons).filter(key => key.startsWith('cil'));
};

const AddMenuModal = ({ 
  visible, 
  onCancel, 
  onOk, 
  form, 
  selectedParent,
  componentOptions = ['CNavGroup', 'CNavItem', 'CNavTitle']
}) => {
  const { t } = useTranslation()

  // 获取所有图标选项
  const iconOptions = getAllCoreUIIcons();

  return (
    <StyledModal
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
            placeholder={t('pleaseSelectIcon')}
            showSearch
            optionFilterProp="children"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ 
              maxHeight: '400px',
              overflow: 'auto'
            }}
          >
            {iconOptions.map(icon => (
              <Select.Option key={icon} value={icon}>
                <Space>
                  <CIcon 
                    icon={icons[icon]} 
                    className="menu-icon"
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ marginLeft: '8px' }}>{icon}</span>
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
    </StyledModal>
  )
}

export default AddMenuModal 