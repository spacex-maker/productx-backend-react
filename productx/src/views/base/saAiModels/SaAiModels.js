import React, { useState } from 'react';
import { Tabs } from 'antd';
import {
  ApiOutlined,
  CommentOutlined,
  RobotOutlined,
  SoundOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import SaAiModelsList from './SaAiModelsList';
import SaAiVoiceModels from '../saAiVoiceModels/SaAiVoiceModels';
import SaAiVoiceComment from '../saAiVoiceComment/SaAiVoiceComment';
import SaI2iOfficialPlay from '../saI2iOfficialPlay/SaI2iOfficialPlay';

const SaAiModels = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('models');

  const items = [
    {
      key: 'models',
      label: (
        <span>
          <RobotOutlined />
          {t('aiModelsTab')}
        </span>
      ),
      children: <SaAiModelsList excludeModelType="t2a" />,
    },
    {
      key: 'ttsEngines',
      label: (
        <span>
          <ApiOutlined />
          {t('ttsEngineTab')}
        </span>
      ),
      children: <SaAiModelsList fixedModelType="t2a" />,
    },
    {
      key: 'voices',
      label: (
        <span>
          <SoundOutlined />
          {t('voiceModelsTab')}
        </span>
      ),
      children: <SaAiVoiceModels />,
    },
    {
      key: 'voiceComments',
      label: (
        <span>
          <CommentOutlined />
          {t('voiceCommentsTab')}
        </span>
      ),
      children: <SaAiVoiceComment />,
    },
    {
      key: 'i2iOfficialPlay',
      label: (
        <span>
          <AppstoreOutlined />
          {t('i2iOfficialPlayTab')}
        </span>
      ),
      children: <SaI2iOfficialPlay />,
    },
  ];

  return (
    <div className="sa-ai-models">
      <h2>
        <RobotOutlined style={{ marginRight: 8 }} />
        {t('AI模型管理')}
      </h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
    </div>
  );
};

export default SaAiModels;
