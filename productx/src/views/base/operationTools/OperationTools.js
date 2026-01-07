import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import { CalendarOutlined, FireOutlined, RobotOutlined } from '@ant-design/icons';
import HolidayPanel from './HolidayPanel';
import TrendingPanel from './TrendingPanel';
import AiDecisionPanel from './AiDecisionPanel';

const { TabPane } = Tabs;

const OperationTools = () => {
  const [activeTab, setActiveTab] = useState('holidays');

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title="AI 运营工具中心"
        bordered={false}
        style={{ borderRadius: '8px' }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
        >
          <TabPane
            tab={
              <span>
                <CalendarOutlined />
                节假日查询
              </span>
            }
            key="holidays"
          >
            <HolidayPanel />
          </TabPane>

          <TabPane
            tab={
              <span>
                <FireOutlined />
                热点新闻
              </span>
            }
            key="trending"
          >
            <TrendingPanel />
          </TabPane>

          <TabPane
            tab={
              <span>
                <RobotOutlined />
                AI 智能决策
              </span>
            }
            key="ai-decision"
          >
            <AiDecisionPanel />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default OperationTools;

