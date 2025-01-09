import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Card, Watermark, Avatar, Tag, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  BankOutlined,
  NumberOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  DollarOutlined
} from '@ant-design/icons';
import api from 'src/axiosInstance';

const { Text } = Typography;

// IconText 组件定义
const IconText = ({ icon, text }) => (
  <Space size={4}>
    {icon}
    <Text style={{ fontSize: '10px' }}>{text}</Text>
  </Space>
);

const UserAccountBankDetailModal = ({ isVisible, onCancel, selectedAccount }) => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState(null);

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (selectedAccount?.userId) {
        try {
          const response = await api.get(`/manage/user/summary?id=${selectedAccount.userId}`);
          if (response) {
            setUserInfo(response);
          }
        } catch (error) {
          console.error('获取用户信息失败:', error);
        }
      }
    };

    if (isVisible) {
      fetchUserInfo();
    }
  }, [isVisible, selectedAccount]);

  return (
    <Modal
      title={
        <Space>
          <BankOutlined />
          {t('accountDetails')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={500}
      maskClosable={false}
    >
      <Watermark content={`ID: ${userInfo?.id || ''} ${userInfo?.username || ''}`}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {/* 用户信息卡片 */}
          <Card
            size="small"
            title={
              <Space>
                <UserOutlined />
                {t('userInfo')}
              </Space>
            }
          >
            {userInfo && (
              <Space align="start">
                <Avatar src={userInfo.avatar} icon={<UserOutlined />} />
                <div>
                  <Space wrap>
                    <Typography.Text strong>{userInfo.username}</Typography.Text>
                    {userInfo.isBelongSystem && (
                      <Tag color="blue">{t('systemUser')}</Tag>
                    )}
                    <Tag color={userInfo.isActive ? 'success' : 'error'}>
                      {userInfo.isActive ? t('active') : t('inactive')}
                    </Tag>
                  </Space>
                  <br />
                  <Typography.Text type="secondary">
                    {userInfo.nickname && `${userInfo.nickname} - `}
                    {[userInfo.city, userInfo.state, userInfo.country].filter(Boolean).join(', ')}
                  </Typography.Text>
                </div>
              </Space>
            )}
          </Card>

          {/* 银行账户信息卡片 */}
          {selectedAccount && (
            <Card
              size="small"
              title={
                <Space>
                  <BankOutlined />
                  {t('bankInfo')}
                </Space>
              }
            >
              <Descriptions size="small" column={1}>
                <Descriptions.Item label={t('bankName')}>
                  <Space>
                    <BankOutlined />
                    {selectedAccount.bankName}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={t('accountNumber')}>
                  <Space>
                    <NumberOutlined />
                    {selectedAccount.accountNumber}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={t('accountHolderName')}>
                  <Space>
                    <UserOutlined />
                    {selectedAccount.accountHolderName}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={t('swiftCode')}>
                  <Space>
                    <SafetyCertificateOutlined />
                    {selectedAccount.swiftCode}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={t('currencyCode')}>
                  <Space>
                    <DollarOutlined />
                    {selectedAccount.currencyCode}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={t('isActive')}>
                  <Space>
                    <GlobalOutlined />
                    {selectedAccount.isActive ? t('yes') : t('no')}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </Space>
      </Watermark>
    </Modal>
  );
};

export default UserAccountBankDetailModal;
