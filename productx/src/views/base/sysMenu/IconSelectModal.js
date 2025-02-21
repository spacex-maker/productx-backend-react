import React, { useState } from 'react'
import { Modal, Tabs, Input, Space } from 'antd'
import * as icons from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import * as AntdIcons from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next'

const { TabPane } = Tabs
const { Search } = Input

const IconSelectModal = ({ visible, onCancel, onSelect }) => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [activeTab, setActiveTab] = useState('coreui')

  // 获取所有 CoreUI 图标
  const getCoreUIIcons = () => {
    return Object.keys(icons)
      .filter(key => key.startsWith('cil'))
      .filter(key => key.toLowerCase().includes(searchText.toLowerCase()))
  }

  // 获取所有 Ant Design 图标
  const getAntdIcons = () => {
    return Object.keys(AntdIcons)
      .filter(key => key.endsWith('Outlined'))  // 只使用 Outlined 风格的图标
      .filter(key => key.toLowerCase().includes(searchText.toLowerCase()))
  }

  // 获取所有 Font Awesome 图标
  const getFontAwesomeIcons = () => {
    return Object.keys(fas)
      .filter(key => key.toLowerCase().includes(searchText.toLowerCase()))
  }

  // 优化后的图标网格渲染
  const renderIconGrid = (iconType, iconList) => {
    return (
      <div style={{
        height: '400px',
        padding: '8px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '8px',
          padding: '4px'
        }}>
          {iconList.map(iconName => (
            <div
              key={iconName}
              onClick={() => onSelect(iconName)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 8px',
                cursor: 'pointer',
                border: '1px solid #d9d9d9',
                borderRadius: '4px',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: '#40a9ff',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              <div style={{ 
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}>
                {iconType === 'coreui' && (
                  <CIcon icon={icons[iconName]} style={{ width: '20px', height: '20px' }} />
                )}
                {iconType === 'antd' && React.createElement(AntdIcons[iconName], { 
                  style: { fontSize: '20px' } 
                })}
                {iconType === 'fontawesome' && (
                  <FontAwesomeIcon icon={fas[iconName]} style={{ fontSize: '20px' }} />
                )}
              </div>
              <div style={{
                fontSize: '12px',
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%'
              }}>
                {iconName}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Modal
      title={t('selectIcon')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={720}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ 
        padding: '16px 16px 8px',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Search
          placeholder={t('searchIcon')}
          onChange={e => setSearchText(e.target.value)}
          allowClear
          style={{ 
            maxWidth: '300px'
          }}
        />
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ padding: '0 16px' }}
        items={[
          {
            key: 'coreui',
            label: 'CoreUI',
            children: renderIconGrid('coreui', getCoreUIIcons())
          },
          {
            key: 'antd',
            label: 'Ant Design',
            children: renderIconGrid('antd', getAntdIcons())
          },
          {
            key: 'fontawesome',
            label: 'Font Awesome',
            children: renderIconGrid('fontawesome', getFontAwesomeIcons())
          }
        ]}
      />
    </Modal>
  )
}

export default IconSelectModal 