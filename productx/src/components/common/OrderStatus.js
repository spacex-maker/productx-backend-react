import React from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  CarOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const StyledTag = styled(Tag)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 16px;
  margin: 0;
  
  .anticon {
    font-size: 12px;
  }
`;

const OrderStatus = ({ status }) => {
  const { t } = useTranslation();

  const statusConfig = {
    PENDING: {
      color: '#faad14',
      icon: <ClockCircleOutlined />,
      text: t('pending')
    },
    PAID: {
      color: '#1890ff',
      icon: <DollarCircleOutlined />,
      text: t('paid')
    },
    SHIPPED: {
      color: '#722ed1',
      icon: <CarOutlined />,
      text: t('shipped')
    },
    ARRIVED: {
      color: '#13c2c2',
      icon: <HomeOutlined />,
      text: t('arrived')
    },
    COMPLETED: {
      color: '#52c41a',
      icon: <CheckCircleOutlined />,
      text: t('completed')
    },
    CANCELLED: {
      color: '#ff4d4f',
      icon: <CloseCircleOutlined />,
      text: t('cancelled')
    },
    RETURNING: {
      color: '#fa8c16',
      icon: <SyncOutlined spin />,
      text: t('returning')
    },
    RETURNED: {
      color: '#cf1322',
      icon: <RollbackOutlined />,
      text: t('returned')
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <StyledTag color={config.color}>
      {config.icon}
      {config.text}
    </StyledTag>
  );
};

export default OrderStatus; 