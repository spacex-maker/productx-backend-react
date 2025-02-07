import React, { useState } from 'react';
import { Tabs } from 'antd';
import BasicInfo from './components/BasicInfo';
import LoadingSimulation from './components/LoadingSimulation';

const TmsContainerDetail = ({ container }) => {
  const [activeTab, setActiveTab] = useState('1');

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab}>
      <Tabs.TabPane tab="基本信息" key="1">
        <BasicInfo container={container} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="装箱模拟" key="2">
        <LoadingSimulation container={container} />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default TmsContainerDetail; 