import React, { useState } from 'react'
import { Tabs } from 'antd'
import { ThunderboltOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import SaAiGenTask from '../saAiGenTask/SaAiGenTask'

const AiGenManage = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('task')

  const items = [
    {
      key: 'task',
      label: (
        <span>
          <UnorderedListOutlined />
          {t('任务管理')}
        </span>
      ),
      children: <SaAiGenTask />,
    },
  ]

  return (
    <div className="ai-gen-manage">
      <h2>
        <ThunderboltOutlined style={{ marginRight: 8 }} />
        {t('AI生成管理')}
      </h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  )
}

export default AiGenManage
