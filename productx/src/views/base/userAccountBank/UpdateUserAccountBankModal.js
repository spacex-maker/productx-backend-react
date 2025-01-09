import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, Typography, Divider, Avatar, Tag, Card, Space, Row, Col } from 'antd';
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

const { Title } = Typography;
const { Option } = Select;

const UpdateUserAccountBankModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateAccount,
  selectedAccount
}) => {
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

  useEffect(() => {
    if (isVisible && selectedAccount) {
      form.setFieldsValue({
        id: selectedAccount.id,
        userId: selectedAccount.userId,
        bankName: selectedAccount.bankName,
        accountNumber: selectedAccount.accountNumber,
        accountHolderName: selectedAccount.accountHolderName,
        swiftCode: selectedAccount.swiftCode,
        currencyCode: selectedAccount.currencyCode,
        isActive: selectedAccount.isActive
      });
    }
  }, [isVisible, selectedAccount, form]);

  return (
    <Modal
      title={
        <Space size="small">
          <BankOutlined />
          {t('editAccount')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={600}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateAccount} 
        layout="vertical"
        size="small"
        colon={false}
      >
        <Form.Item name="id" hidden><Input /></Form.Item>
        <Form.Item name="userId" hidden><Input /></Form.Item>

        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Typography.Title level={5} style={{ marginBottom: 8 }}>
            <Space size="small">
              <UserOutlined />
              {t('userInfo')}
            </Space>
          </Typography.Title>
          <Divider style={{ margin: '8px 0' }} />

          {userInfo && (
            <Card size="small" bodyStyle={{ padding: 8 }}>
              <Space align="start" size="small">
                <Avatar size="small" src={userInfo.avatar} icon={<UserOutlined />} />
                <div>
                  <Space size={4}>
                    <Typography.Text strong>{userInfo.username}</Typography.Text>
                    {userInfo.isBelongSystem && (
                      <Tag color="blue" style={{ marginInlineEnd: 0 }}>{t('systemUser')}</Tag>
                    )}
                    <Tag color={userInfo.isActive ? 'success' : 'error'} style={{ marginInlineEnd: 0 }}>
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
            </Card>
          )}

          <Typography.Title level={5} style={{ marginTop: 16, marginBottom: 8 }}>
            <Space size="small">
              <BankOutlined />
              {t('bankInfo')}
            </Space>
          </Typography.Title>
          <Divider style={{ margin: '8px 0' }} />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('bankName')}
                name="bankName"
                rules={[{ required: true, message: t('pleaseEnterBankName') }]}
              >
                <Input prefix={<BankOutlined />} placeholder={t('enterBankName')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('accountNumber')}
                name="accountNumber"
                rules={[{ required: true, message: t('pleaseEnterAccountNumber') }]}
              >
                <Input prefix={<NumberOutlined />} placeholder={t('enterAccountNumber')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('accountHolderName')}
                name="accountHolderName"
                rules={[{ required: true, message: t('pleaseEnterAccountHolderName') }]}
              >
                <Input prefix={<UserOutlined />} placeholder={t('enterAccountHolderName')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('swiftCode')}
                name="swiftCode"
                rules={[{ required: true, message: t('pleaseEnterSwiftCode') }]}
              >
                <Input prefix={<SafetyCertificateOutlined />} placeholder={t('enterSwiftCode')} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('currencyCode')}
                name="currencyCode"
                rules={[{ required: true, message: t('pleaseEnterCurrencyCode') }]}
              >
                <Input prefix={<DollarOutlined />} placeholder={t('enterCurrencyCode')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                valuePropName="checked"
                style={{ marginTop: 29 }}
              >
                <Checkbox>{t('isActive')}</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Space>
      </Form>
    </Modal>
  );
};

export default UpdateUserAccountBankModal;
