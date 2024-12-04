import React from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  CarOutlined,
  RocketOutlined,
  SmileOutlined,
  GlobalOutlined,
  SendOutlined,
  ManOutlined,
  StopOutlined,
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

const DeliveryMethod = ({ method }) => {
  const { t } = useTranslation();

  const methodConfig = {
    BUYER_PICKUP: {
      color: '#faad14',
      icon: <UserOutlined />,
      text: t('buyerPickup')
    },
    SELLER_DELIVERY: {
      color: '#1890ff',
      icon: <CarOutlined />,
      text: t('sellerDelivery')
    },
    PLATFORM_SPECIAL_DELIVERY: {
      color: '#722ed1',
      icon: <RocketOutlined />,
      text: t('platformSpecialDelivery')
    },
    FACE_TO_FACE: {
      color: '#13c2c2',
      icon: <SmileOutlined />,
      text: t('faceToFace')
    },
    LOGISTICS: {
      color: '#52c41a',
      icon: <GlobalOutlined />,
      text: t('logistics')
    },
    EXPRESS: {
      color: '#ff4d4f',
      icon: <SendOutlined />,
      text: t('express')
    },
    COURIER: {
      color: '#fa8c16',
      icon: <ManOutlined />,
      text: t('courier')
    },
    NO_DELIVERY: {
      color: '#cf1322',
      icon: <StopOutlined />,
      text: t('noDelivery')
    }
  };

  const config = methodConfig[method] || methodConfig.NO_DELIVERY;

  return (
    <StyledTag color={config.color}>
      {config.icon}
      {config.text}
    </StyledTag>
  );
};

export default DeliveryMethod; 