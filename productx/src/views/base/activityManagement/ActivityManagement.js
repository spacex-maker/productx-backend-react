import React, { useState } from 'react';
import { Tabs } from 'antd';
import InviteRecord from './InviteRecord';
import ActivityConfig from './ActivityConfig';
import UserInviteStats from './UserInviteStats';

const { TabPane } = Tabs;

const ActivityManagement = () => {
  const [activeTab, setActiveTab] = useState('invite-record');

  return (
    <div style={{ padding: '20px' }}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
      >
        <TabPane tab="邀请记录" key="invite-record">
          <InviteRecord />
        </TabPane>
        <TabPane tab="活动配置" key="activity-config">
          <ActivityConfig />
        </TabPane>
        <TabPane tab="用户邀请统计" key="user-invite-stats">
          <UserInviteStats />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ActivityManagement;

