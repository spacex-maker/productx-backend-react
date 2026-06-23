import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Statistic, Tabs, Tag, message } from 'antd';
import api from 'src/axiosInstance';
import InviteRecord from '../activityManagement/InviteRecord';
import ActivityConfig from '../activityManagement/ActivityConfig';
import UserInviteStats from '../activityManagement/UserInviteStats';

const { TabPane } = Tabs;

const InviteSystem = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await api.get('/manage/invite-system/dashboard');
      if (response) {
        setDashboard(response);
      }
    } catch (error) {
      console.error(error);
      message.error('获取邀请看板失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
        <TabPane tab="邀请看板" key="dashboard">
          <Spin spinning={loading}>
            {dashboard && (
              <>
                <div style={{ marginBottom: 16 }}>
                  {dashboard.activeActivityName ? (
                    <Tag color="green">当前活动：{dashboard.activeActivityName}</Tag>
                  ) : (
                    <Tag color="orange">暂无上线活动</Tag>
                  )}
                  {dashboard.autoIssueOnRegister !== undefined && (
                    <Tag color={dashboard.autoIssueOnRegister ? 'blue' : 'gold'}>
                      {dashboard.autoIssueOnRegister ? '注册自动发放' : '需审核/手动领取'}
                    </Tag>
                  )}
                </div>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={6}>
                    <Card><Statistic title="邀请记录总数" value={dashboard.totalRecords || 0} /></Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card><Statistic title="待审核奖励" value={dashboard.pendingReviewCount || 0} valueStyle={{ color: '#faad14' }} /></Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card><Statistic title="已发放奖励" value={dashboard.issuedRewardCount || 0} valueStyle={{ color: '#52c41a' }} /></Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card><Statistic title="风控冻结" value={dashboard.frozenCount || 0} valueStyle={{ color: '#ff4d4f' }} /></Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card><Statistic title="累计邀请用户" value={dashboard.totalInvitedUsers || 0} /></Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card><Statistic title="累计发放积分" value={dashboard.totalRewardPoints || 0} /></Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card><Statistic title="待领取积分" value={dashboard.pendingRewardPoints || 0} /></Card>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <Card>
                      <Statistic title="奖励规则" value={`${dashboard.registerRewardInviter || 0}/${dashboard.registerRewardInvitee || 0}`} suffix="邀请人/被邀请人" />
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Spin>
        </TabPane>
        <TabPane tab="邀请记录" key="invite-record">
          <InviteRecord onReviewChange={fetchDashboard} />
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

export default InviteSystem;
