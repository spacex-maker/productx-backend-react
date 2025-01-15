import React from 'react'
import { Modal, Form, Input, Select, Space, Switch } from 'antd'
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

const EditMenuModal = ({ 
  visible, 
  onCancel, 
  onOk, 
  form,
  currentItem,
  componentOptions = ['CNavGroup', 'CNavItem', 'CNavTitle']
}) => {
  const { t } = useTranslation()

  // 获取所有 CoreUI 图标
  const allIconOptions = Object.keys(icons).filter(key => key.startsWith('cil'));

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
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="parentId" hidden>
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
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          >
            {allIconOptions.map(icon => (
              <Option key={icon} value={icon}>
                <Space>
                  <CIcon icon={icons[icon]} className="menu-icon" />
                  {icon}
                </Space>
              </Option>
            ))}
          </Select>
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
    </Modal>
  )
}

export default EditMenuModal 