import React, { useState } from 'react'
import { Tabs } from 'antd'
import { ShoppingOutlined, UnorderedListOutlined, TagsOutlined } from '@ant-design/icons'
import PromptMarketListing from '../promptMarketListing/PromptMarketListing'
import PromptTagLibrary from '../promptTagLibrary/PromptTagLibrary'
import { useTranslation } from 'react-i18next'

const PromptMarket = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('listing')

  const items = [
    {
      key: 'listing',
      label: (
        <span>
          <UnorderedListOutlined />
          {t('提示词管理')}
        </span>
      ),
      children: <PromptMarketListing />,
    },
    {
      key: 'tagLibrary',
      label: (
        <span>
          <TagsOutlined />
          {t('标签库管理')}
        </span>
      ),
      children: <PromptTagLibrary />,
    },
  ]

  return (
    <div className="prompt-market">
      <h2>
        <ShoppingOutlined style={{ marginRight: 8 }} />
        {t('提示词商城')}
      </h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  )
}

export default PromptMarket
