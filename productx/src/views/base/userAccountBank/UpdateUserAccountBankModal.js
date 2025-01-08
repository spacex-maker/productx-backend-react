import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, Typography, Divider, Avatar, Tag } from 'antd';
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
        <span style={{ fontSize: '12px' }}>
          <BankOutlined style={{ marginRight: '8px' }} />
          {t('editAccount')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={500}
      maskClosable={false}
    >
      <Form form={form} onFinish={handleUpdateAccount} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>

        <Title level={5} style={{ fontSize: '12px', marginBottom: '8px' }}>
          <UserOutlined style={{ marginRight: '8px' }} />
          {t('userInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        {userInfo && (
          <div style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
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

        <Title level={5} style={{ fontSize: '12px', marginBottom: '8px', marginTop: '16px' }}>
          <BankOutlined style={{ marginRight: '8px' }} />
          {t('bankInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('bankName')}
          name="bankName"
          rules={[{ required: true, message: t('pleaseEnterBankName') }]}
        >
          <Input
            prefix={<BankOutlined />}
            placeholder={t('enterBankName')}
          />
        </Form.Item>

        <Form.Item
          label={t('accountNumber')}
          name="accountNumber"
          rules={[{ required: true, message: t('pleaseEnterAccountNumber') }]}
        >
          <Input
            prefix={<NumberOutlined />}
            placeholder={t('enterAccountNumber')}
          />
        </Form.Item>

        <Form.Item
          label={t('accountHolderName')}
          name="accountHolderName"
          rules={[{ required: true, message: t('pleaseEnterAccountHolderName') }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('enterAccountHolderName')}
          />
        </Form.Item>

        <Form.Item
          label={t('swiftCode')}
          name="swiftCode"
          rules={[{ required: true, message: t('pleaseEnterSwiftCode') }]}
        >
          <Input
            prefix={<SafetyCertificateOutlined />}
            placeholder={t('enterSwiftCode')}
          />
        </Form.Item>

        <Form.Item
          label={t('currencyCode')}
          name="currencyCode"
          rules={[{ required: true, message: t('pleaseEnterCurrencyCode') }]}
        >
          <Input
            prefix={<DollarOutlined />}
            placeholder={t('enterCurrencyCode')}
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          valuePropName="checked"
        >
          <Checkbox>{t('isActive')}</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserAccountBankModal;
