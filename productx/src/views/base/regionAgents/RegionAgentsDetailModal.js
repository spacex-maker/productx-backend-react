import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Card, Tag, Row, Col, Spin, Tooltip } from 'antd';
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
import styled from 'styled-components';
import dayjs from 'dayjs';
import api from 'src/axiosInstance';
import { message } from 'antd';

const StyledCard = styled(Card)`
  .ant-card-head {
    min-height: 36px;
    padding: 0 12px;
    
    .ant-card-head-title {
      padding: 8px 0;
      font-size: 13px;
    }
  }
  
  .ant-card-body {
    padding: 12px;
  }

  & + & {
    margin-top: 8px;
  }
`;

const StyledDescriptions = styled(Descriptions)`
  .ant-descriptions-item-label {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
  }
  
  .ant-descriptions-item-content {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.85);
  }
`;

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

  // 在弹窗显示时获取代理类型数据
  useEffect(() => {
    if (isVisible) {
      fetchAgentTypes();
    }
  }, [isVisible]);

  // 获取代理类型名称
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
        <Row gutter={[0, 8]}>
          <Col span={24}>
            <StyledCard title="基本信息">
              <Descriptions column={3}>
                <Descriptions.Item label={<><UserOutlined /> 代理人ID</>}>
                  {data.agentId || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<><UserOutlined /> 代理人名称</>}>
                  {data.agentName || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<><AppstoreOutlined /> 代理类型</>}>
                  {getAgentTypeName(data.agentType)}
                </Descriptions.Item>
                <Descriptions.Item label={<><LockOutlined /> 是否独家代理</>}>
                  <Tag color={data.isExclusive ? 'green' : 'default'}>
                    {data.isExclusive ? '是' : '否'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<><CalendarOutlined /> 合作时间</>} 
                  span={3}
                >
                  {`${dayjs(data.startDate).format('YYYY-MM-DD HH:mm:ss')} ~ ${dayjs(data.endDate).format('YYYY-MM-DD HH:mm:ss')}`}
                </Descriptions.Item>
              </Descriptions>
            </StyledCard>
          </Col>

          <Col span={24}>
            <StyledCard title={<><EnvironmentOutlined /> 区域信息</>}>
              <StyledDescriptions column={3} size="small">
                <Descriptions.Item label="区域ID">{data.regionId}</Descriptions.Item>
                <Descriptions.Item label="区域编码">{data.regionCode}</Descriptions.Item>
                <Descriptions.Item label="区域名称">{data.regionName}</Descriptions.Item>
                <Descriptions.Item label="父区域ID">{data.parentRegionId || '-'}</Descriptions.Item>
                <Descriptions.Item label="代理层级">{data.agentLevel}</Descriptions.Item>
                <Descriptions.Item label="是否独家">{data.isExclusive ? '是' : '否'}</Descriptions.Item>
              </StyledDescriptions>
            </StyledCard>
          </Col>

          <Col span={24}>
            <StyledCard title="合同信息">
              <Descriptions column={3}>
                <Descriptions.Item label={<><ContainerOutlined /> 合同编号</>}>
                  {data.contractNo || '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<><DollarOutlined /> 合同金额</>}>
                  {data.contractAmount ? `¥${data.contractAmount}` : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<><ClockCircleOutlined /> 合同期限</>}>
                  {data.contractStartDate && data.contractEndDate 
                    ? `${data.contractStartDate} ~ ${data.contractEndDate}`
                    : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={<><FileTextOutlined /> 合同备注</>} span={3}>
                  {data.contractRemarks || '-'}
                </Descriptions.Item>
              </Descriptions>
            </StyledCard>
          </Col>

          <Col span={24}>
            <StyledCard title={<><DollarOutlined /> 业务信息</>}>
              <StyledDescriptions column={2} size="small">
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
              </StyledDescriptions>
            </StyledCard>
          </Col>

          <Col span={24}>
            <StyledCard title={<><TeamOutlined /> 团队表现</>}>
              <StyledDescriptions column={3} size="small">
                <Descriptions.Item label="团队规模">{data.teamSize}人</Descriptions.Item>
                <Descriptions.Item label="绩效评分">{data.performanceRating}</Descriptions.Item>
                <Descriptions.Item label="工作时间">{data.workingHours}</Descriptions.Item>
                <Descriptions.Item label="奖励积分">{data.rewardPoints}</Descriptions.Item>
                <Descriptions.Item label="处罚积分">{data.penaltyPoints}</Descriptions.Item>
                <Descriptions.Item label="审核状态">{getAuditStatusTag(data.auditStatus)}</Descriptions.Item>
              </StyledDescriptions>
            </StyledCard>
          </Col>

          {data.remarks && (
            <Col span={24}>
              <StyledCard title="备注">
                <p style={{ margin: 0, fontSize: '12px' }}>{data.remarks}</p>
              </StyledCard>
            </Col>
          )}
        </Row>
      </Spin>
    </Modal>
  );
};

export default RegionAgentsDetailModal; 