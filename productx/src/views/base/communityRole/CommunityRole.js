import React, { useState } from 'react'
import { Tabs, Badge } from 'antd'
import { TeamOutlined, SettingOutlined, FileTextOutlined, RobotOutlined, PictureOutlined } from '@ant-design/icons'
import AdminList from './AdminList'
import RoleSettings from './RoleSettings'
import ApplicationList from './ApplicationList'
import ListSysAiOperators from '../sysAiOperator/ListSysAiOperators'
import ListSysAiPostStocks from '../sysAiPostStock/ListSysAiPostStocks'
import { useTranslation } from 'react-i18next'

const CommunityRole = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('admins')
  const [pendingCount, setPendingCount] = useState(0)

  const items = [
    {
      key: 'admins',
      label: (
        <span>
          <TeamOutlined />
          {t('管理员设置')}
        </span>
      ),
      children: <AdminList />,
    },
    {
      key: 'roles',
      label: (
        <span>
          <SettingOutlined />
          {t('角色管理')}
        </span>
      ),
      children: <RoleSettings />,
    },
    {
      key: 'applications',
      label: (
        <span>
          <FileTextOutlined />
          {t('用户申请')}
          {pendingCount > 0 && (
            <Badge count={pendingCount} style={{ marginLeft: 8 }} />
          )}
        </span>
      ),
      children: <ApplicationList onPendingCountChange={setPendingCount} />,
    },
    {
      key: 'aiOperators',
      label: (
        <span>
          <RobotOutlined />
          {t('AI运营配置管理') || 'AI运营配置管理'}
        </span>
      ),
      children: <ListSysAiOperators />,
    },
    {
      key: 'aiPostStock',
      label: (
        <span>
          <PictureOutlined />
          {t('AI运营发帖素材管理') || 'AI运营发帖素材管理'}
        </span>
      ),
      children: <ListSysAiPostStocks />,
    },
  ]

  return (
    <div className="community-role-management">
      <h2>{t('社区管理')}</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  )
}

export default CommunityRole

