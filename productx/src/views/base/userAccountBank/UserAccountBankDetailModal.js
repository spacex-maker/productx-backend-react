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
        <span style={{ fontSize: '12px' }}>
          <BankOutlined style={{ fontSize: '12px', color: '#1890ff', marginRight: '4px' }} />
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
            size="small"
            title={<Text style={{ fontSize: '10px' }}><UserOutlined /> {t('userInfo')}</Text>}
            style={{ marginBottom: 8 }}
          >
            {userInfo && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={userInfo.avatar} icon={<UserOutlined />} size={40} />
                  <div style={{ marginLeft: '12px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{userInfo.username}</span>
                      {userInfo.isBelongSystem && (
                        <Tag color="blue" style={{ marginRight: '8px' }}>
                          {t('systemUser')}
                        </Tag>
                      )}
                      <Tag color={userInfo.isActive ? 'success' : 'error'}>
                        {userInfo.isActive ? t('active') : t('inactive')}
                      </Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {userInfo.nickname && `${userInfo.nickname} - `}
                      {[userInfo.city, userInfo.state, userInfo.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* 银行账户信息卡片 */}
          {selectedAccount && (
            <Card
              size="small"
              title={<Text style={{ fontSize: '10px' }}><BankOutlined /> {t('bankInfo')}</Text>}
            >
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <IconText
                  icon={<BankOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('bankName')}: ${selectedAccount.bankName}`}
                />
                <IconText
                  icon={<NumberOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('accountNumber')}: ${selectedAccount.accountNumber}`}
                />
                <IconText
                  icon={<UserOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('accountHolderName')}: ${selectedAccount.accountHolderName}`}
                />
                <IconText
                  icon={<SafetyCertificateOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('swiftCode')}: ${selectedAccount.swiftCode}`}
                />
                <IconText
                  icon={<DollarOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('currencyCode')}: ${selectedAccount.currencyCode}`}
                />
                <IconText
                  icon={<GlobalOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('isActive')}: ${selectedAccount.isActive ? t('yes') : t('no')}`}
                />
              </Space>
            </Card>
          )}
        </div>
      </Watermark>
    </Modal>
  );
};

export default UserAccountBankDetailModal;
