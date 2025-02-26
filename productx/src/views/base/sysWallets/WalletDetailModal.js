import React, { useState } from 'react';
import { Modal, Tabs, Descriptions, Button, Input, Form, message, Spin, Space, Typography } from 'antd';
import { LockOutlined, EyeOutlined, EyeInvisibleOutlined, CopyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { TabPane } = Tabs;
const { Text } = Typography;

const WalletDetailModal = ({ isVisible, onCancel, wallet, countries = [] }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const handleViewPrivateKey = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/manage/sys-wallets/pk', {
        walletId: wallet.id,
        password: values.password
      });
      
      if (response) {
        setPrivateKey(response);
        message.success(t('privateKeyRetrieved'));
      } else {
        message.error(t('failedToRetrievePrivateKey'));
      }
    } catch (error) {
      console.error('获取私钥失败:', error);
      message.error(t('incorrectPassword'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrivateKey = () => {
    if (!privateKey) return;
    
    navigator.clipboard.writeText(privateKey)
      .then(() => {
        message.success(t('privateKeyCopied'));
      })
      .catch(() => {
        message.error(t('copyFailed'));
      });
  };

  const handleTogglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const handleModalClose = () => {
    setPrivateKey('');
    setShowPrivateKey(false);
    form.resetFields();
    onCancel();
  };

  const country = countries.find(c => c.code === wallet?.countryCode);

  return (
    <Modal
      title={t('walletDetails')}
      open={isVisible}
      onCancel={handleModalClose}
      footer={null}
      width={700}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab={t('basicInfo')} key="1">
          {wallet && (
            <Descriptions bordered column={2}>
              <Descriptions.Item label={t('walletAddress')} span={2}>
                {wallet.address}
              </Descriptions.Item>
              <Descriptions.Item label={t('walletType')}>
                {wallet.typeName}
              </Descriptions.Item>
              <Descriptions.Item label={t('walletLabel')}>
                {wallet.label}
              </Descriptions.Item>
              <Descriptions.Item label={t('countryCode')}>
                <Space>
                  {country && (
                    <img
                      src={country.flagImageUrl}
                      alt={country.name}
                      style={{
                        width: 20,
                        height: 15,
                        objectFit: 'cover',
                        borderRadius: 2,
                        border: '1px solid #f0f0f0'
                      }}
                    />
                  )}
                  <span>{country?.name || wallet.countryCode}</span>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label={t('status')}>
                {wallet.status ? t('enabled') : t('disabled')}
              </Descriptions.Item>
              <Descriptions.Item label={t('createTime')} span={2}>
                {wallet.createTime}
              </Descriptions.Item>
              <Descriptions.Item label={t('updateTime')} span={2}>
                {wallet.updateTime}
              </Descriptions.Item>
            </Descriptions>
          )}
        </TabPane>
        
        <TabPane tab={t('privateKey')} key="2">
          <div style={{ padding: '20px 0' }}>
            <Form form={form} onFinish={handleViewPrivateKey} layout="horizontal">
              <Form.Item
                name="password"
                label={t('enterPassword')}
                rules={[{ required: true, message: t('pleaseEnterPassword') }]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder={t('passwordPlaceholder')}
                  style={{ width: '300px' }}
                  addonAfter={
                    <Button 
                      type="link" 
                      htmlType="submit" 
                      loading={loading}
                      style={{ margin: '-6px -12px', height: '32px' }}
                    >
                      {t('retrievePrivateKey')}
                    </Button>
                  }
                />
              </Form.Item>
            </Form>
            
            {privateKey && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                  <Text strong style={{ marginRight: 10 }}>{t('privateKey')}:</Text>
                  <Button 
                    icon={showPrivateKey ? <EyeInvisibleOutlined /> : <EyeOutlined />} 
                    onClick={handleTogglePrivateKeyVisibility}
                    size="small"
                    style={{ marginRight: 10 }}
                  />
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={handleCopyPrivateKey}
                    size="small"
                  />
                </div>
                
                <div 
                  style={{ 
                    padding: 10, 
                    borderRadius: 4,
                    wordBreak: 'break-all',
                    fontFamily: 'monospace'
                  }}
                >
                  {showPrivateKey ? privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </div>
                
                <div style={{ marginTop: 10 }}>
                  <Text type="danger">{t('privateKeyWarning')}</Text>
                </div>
              </div>
            )}
          </div>
        </TabPane>
        
        <TabPane tab={t('transactionHistory')} key="3">
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            {t('transactionHistoryComingSoon')}
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default WalletDetailModal; 