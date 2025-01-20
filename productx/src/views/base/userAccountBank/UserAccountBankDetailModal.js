import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Card, Watermark, Avatar, Tag } from 'antd';
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
    <Text>{text}</Text>
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
        <span>
          <BankOutlined style={{ color: '#1890ff', marginRight: '4px' }} />
          {t('accountDetails')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={500}
      maskClosable={false}
    >
      <Watermark content={`ID: ${userInfo?.id || ''} ${userInfo?.username || ''}`}>
        <div style={{ padding: '8px' }}>
          {/* 用户信息卡片 */}
          <Card

            title={<Text strong><UserOutlined /> {t('userInfo')}</Text>}
            style={{ marginBottom: 16 }}
          >
            {userInfo && (
              <Space direction="vertical" style={{ width: '100%' }} size={24}>
                {/* 基本信息区域 */}
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar src={userInfo.avatar} icon={<UserOutlined />} size={80} />
                  <div style={{ marginLeft: 24, flex: 1 }}>
                    <div style={{ marginBottom: 12 }}>
                      <Text strong style={{ fontSize: 18, marginRight: 12 }}>{userInfo.username}</Text>
                      <Space>
                        {userInfo.isBelongSystem && (
                          <Tag color="blue">{t('systemUser')}</Tag>
                        )}
                        <Tag color={userInfo.isActive ? 'success' : 'error'}>
                          {userInfo.isActive ? t('active') : t('inactive')}
                        </Tag>
                      </Space>
                    </div>

                    {/* 详细信息网格布局 */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: '12px 24px',
                      alignItems: 'baseline'
                    }}>
                      {userInfo.nickname && (
                        <>
                          <Text type="secondary">{t('nickname')}:</Text>
                          <Text>{userInfo.nickname}</Text>
                        </>
                      )}

                      {userInfo.email && (
                        <>
                          <Text type="secondary">{t('email')}:</Text>
                          <Text>{userInfo.email}</Text>
                        </>
                      )}

                      {userInfo.phone && (
                        <>
                          <Text type="secondary">{t('phone')}:</Text>
                          <Text>{userInfo.phone}</Text>
                        </>
                      )}

                      {(userInfo.city || userInfo.state || userInfo.country) && (
                        <>
                          <Text type="secondary">{t('location')}:</Text>
                          <Text>
                            {[userInfo.city, userInfo.state, userInfo.country]
                              .filter(Boolean)
                              .join(', ')}
                          </Text>
                        </>
                      )}

                      {userInfo.createdAt && (
                        <>
                          <Text type="secondary">{t('registrationDate')}:</Text>
                          <Text>{new Date(userInfo.createdAt).toLocaleDateString()}</Text>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Space>
            )}
          </Card>

          {/* 银行账户信息卡片 */}
          {selectedAccount && (
            <Card

              title={<Text strong><BankOutlined /> {t('bankInfo')}</Text>}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px 24px', alignItems: 'center' }}>
                <Text type="secondary">{t('bankName')}:</Text>
                <Text strong>{selectedAccount.bankName}</Text>

                <Text type="secondary">{t('accountNumber')}:</Text>
                <Text strong>{selectedAccount.accountNumber}</Text>

                <Text type="secondary">{t('accountHolderName')}:</Text>
                <Text strong>{selectedAccount.accountHolderName}</Text>

                <Text type="secondary">{t('swiftCode')}:</Text>
                <Text strong>{selectedAccount.swiftCode}</Text>

                <Text type="secondary">{t('currencyCode')}:</Text>
                <Text strong>{selectedAccount.currencyCode}</Text>

                <Text type="secondary">{t('isActive')}:</Text>
                <Tag color={selectedAccount.isActive ? 'success' : 'error'}>
                  {selectedAccount.isActive ? t('yes') : t('no')}
                </Tag>
              </div>
            </Card>
          )}
        </div>
      </Watermark>
    </Modal>
  );
};

export default UserAccountBankDetailModal;
