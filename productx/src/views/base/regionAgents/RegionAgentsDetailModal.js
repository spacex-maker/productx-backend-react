import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Card, Tag, Row, Col, Spin, Tooltip, Space, Typography } from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  ContainerOutlined,
  DollarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  NumberOutlined,
  LockOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from 'src/axiosInstance';
import { message } from 'antd';

const RegionAgentsDetailModal = ({ isVisible, onCancel, data }) => {
  const [agentTypes, setAgentTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取代理类型列表
  const fetchAgentTypes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/manage/region-agents/list-type');
      if (response) {
        setAgentTypes(response);
      }
    } catch (error) {
      console.error('获取代理类型失败:', error);
      message.error('获取代理类型失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchAgentTypes();
    }
  }, [isVisible]);

  const getAgentTypeName = (code) => {
    const agentType = agentTypes.find(type => type.code === code);
    return agentType ? (
      <Tooltip title={agentType.description}>
        <span>{agentType.name}</span>
      </Tooltip>
    ) : code;
  };

  if (!data) return null;

  const contactInfo = data.contactInfo ? JSON.parse(data.contactInfo) : {};
  const assignedProducts = data.assignedProducts ? JSON.parse(data.assignedProducts) : {};

  const getAuditStatusTag = (status) => {
    const statusMap = {
      0: { color: 'default', text: '待审核' },
      1: { color: 'success', text: '已通过' },
      2: { color: 'error', text: '已拒绝' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  const formatMoney = (value, currency) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency || 'CNY'
    }).format(value);
  };

  return (
    <Modal
      title="代理详情"
      open={isVisible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Card    title={
            <Space>
              <UserOutlined />
              基本信息
            </Space>
          }>
            <Descriptions    column={3}>
              <Descriptions.Item label="代理人ID">
                <Space>
                  <UserOutlined />
                  {data.agentId || '-'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="代理人名称">
                <Space>
                  <UserOutlined />
                  {data.agentName || '-'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="代理类型">
                <Space>
                  <AppstoreOutlined />
                  {getAgentTypeName(data.agentType)}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="是否独家代理">
                <Space>
                  <LockOutlined />
                  <Tag color={data.isExclusive ? 'green' : 'default'}>
                    {data.isExclusive ? '是' : '否'}
                  </Tag>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="合作时间" span={2}>
                <Space>
                  <CalendarOutlined />
                  {`${dayjs(data.startDate).format('YYYY-MM-DD')} ~ ${dayjs(data.endDate).format('YYYY-MM-DD')}`}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card    title={
            <Space>
              <EnvironmentOutlined />
              区域信息
            </Space>
          }>
            <Descriptions   column={3}>
              <Descriptions.Item label="区域ID">{data.regionId}</Descriptions.Item>
              <Descriptions.Item label="区域编码">{data.regionCode}</Descriptions.Item>
              <Descriptions.Item label="区域名称">{data.regionName}</Descriptions.Item>
              <Descriptions.Item label="父区域ID">{data.parentRegionId || '-'}</Descriptions.Item>
              <Descriptions.Item label="代理层级">{data.agentLevel}</Descriptions.Item>
              <Descriptions.Item label="是否独家">
                <Tag color={data.isExclusive ? 'green' : 'default'}>
                  {data.isExclusive ? '是' : '否'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card   title={
            <Space>
              <ContainerOutlined />
              合同信息
            </Space>
          }>
            <Descriptions   column={3}>
              <Descriptions.Item label="合同编号">
                <Space>
                  <ContainerOutlined />
                  {data.contractNo || '-'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="合同金额">
                <Space>
                  <DollarOutlined />
                  {data.contractAmount ? formatMoney(data.contractAmount) : '-'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="合同期限">
                <Space>
                  <ClockCircleOutlined />
                  {data.contractStartDate && data.contractEndDate
                    ? `${data.contractStartDate} ~ ${data.contractEndDate}`
                    : '-'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="合同备注" span={3}>
                <Space>
                  <FileTextOutlined />
                  {data.contractRemarks || '-'}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card   title={
            <Space>
              <DollarOutlined />
              业务信息
            </Space>
          }>
            <Descriptions   column={2}>
              <Descriptions.Item label="销售任务额度">{formatMoney(data.salesQuota, data.currency)}</Descriptions.Item>
              <Descriptions.Item label="佣金比例">{data.commissionRate}%</Descriptions.Item>
              <Descriptions.Item label="累计销售额">{formatMoney(data.totalSales, data.currency)}</Descriptions.Item>
              <Descriptions.Item label="累计佣金">{formatMoney(data.totalCommission, data.currency)}</Descriptions.Item>
              <Descriptions.Item label="运营预算">{formatMoney(data.operatingBudget, data.currency)}</Descriptions.Item>
              <Descriptions.Item label="代理产品">
                {assignedProducts.categories?.map(category => (
                  <Tag key={category}>{category}</Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card   title={
            <Space>
              <TeamOutlined />
              团队表现
            </Space>
          }>
            <Descriptions   column={3}>
              <Descriptions.Item label="团队规模">{data.teamSize}人</Descriptions.Item>
              <Descriptions.Item label="绩效评分">{data.performanceRating}</Descriptions.Item>
              <Descriptions.Item label="工作时间">{data.workingHours}</Descriptions.Item>
              <Descriptions.Item label="奖励积分">{data.rewardPoints}</Descriptions.Item>
              <Descriptions.Item label="处罚积分">{data.penaltyPoints}</Descriptions.Item>
              <Descriptions.Item label="审核状态">{getAuditStatusTag(data.auditStatus)}</Descriptions.Item>
            </Descriptions>
          </Card>

          {data.remarks && (
            <Card   title={
              <Space>
                <FileTextOutlined />
                备注
              </Space>
            }>
              <Typography.Text>{data.remarks}</Typography.Text>
            </Card>
          )}
        </Space>
      </Spin>
    </Modal>
  );
};

export default RegionAgentsDetailModal;
