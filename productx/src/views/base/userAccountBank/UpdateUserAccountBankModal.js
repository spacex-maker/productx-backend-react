import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, Typography, Divider, Avatar, Tag, Card, Space, Row, Col, Switch } from 'antd';
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
      title={<Space><BankOutlined />{t('editAccount')}</Space>}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={800}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateAccount} 
        layout="vertical"
      >
        <Form.Item name="id" hidden><Input /></Form.Item>
        <Form.Item name="userId" hidden><Input /></Form.Item>

        {/* 用户信息部分 */}
        <Card
          size="small"
          title={<Space><UserOutlined />{t('userInfo')}</Space>}
          style={{ marginBottom: 16 }}
        >
          {userInfo && (
            <Space align="start">
              <Avatar size={64} src={userInfo.avatar} icon={<UserOutlined />} />
              <Space direction="vertical" size={4}>
                <Space>
                  <Typography.Text strong>{userInfo.username}</Typography.Text>
                  {userInfo.isBelongSystem && (
                    <Tag color="blue">{t('systemUser')}</Tag>
                  )}
                  <Tag color={userInfo.isActive ? 'success' : 'error'}>
                    {userInfo.isActive ? t('active') : t('inactive')}
                  </Tag>
                </Space>
                {(userInfo.nickname || userInfo.city || userInfo.state || userInfo.country) && (
                  <Typography.Text type="secondary">
                    {[
                      userInfo.nickname,
                      [userInfo.city, userInfo.state, userInfo.country].filter(Boolean).join(', ')
                    ].filter(Boolean).join(' - ')}
                  </Typography.Text>
                )}
              </Space>
            </Space>
          )}
        </Card>

        {/* 银行信息部分 */}
        <Card
          size="small"
          title={<Space><BankOutlined />{t('bankInfo')}</Space>}
        >
          <Row gutter={[24, 16]}>
            <Col span={12}>
              <Form.Item
                label={t('bankName')}
                name="bankName"
                rules={[{ required: true, message: t('pleaseEnterBankName') }]}
              >
                <Input
                  prefix={<BankOutlined />}
                  placeholder={t('enterBankName')}
                  allowClear
                  size="middle"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('accountNumber')}
                name="accountNumber"
                rules={[{ required: true, message: t('pleaseEnterAccountNumber') }]}
              >
                <Input
                  prefix={<NumberOutlined />}
                  placeholder={t('enterAccountNumber')}
                  allowClear
                  size="middle"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t('accountHolderName')}
                name="accountHolderName"
                rules={[{ required: true, message: t('pleaseEnterAccountHolderName') }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder={t('enterAccountHolderName')}
                  allowClear
                  size="middle"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('swiftCode')}
                name="swiftCode"
                rules={[{ required: true, message: t('pleaseEnterSwiftCode') }]}
              >
                <Input
                  prefix={<SafetyCertificateOutlined />}
                  placeholder={t('enterSwiftCode')}
                  allowClear
                  size="middle"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={t('currencyCode')}
                name="currencyCode"
                rules={[{ required: true, message: t('pleaseEnterCurrencyCode') }]}
              >
                <Input
                  prefix={<DollarOutlined />}
                  placeholder={t('enterCurrencyCode')}
                  allowClear
                  size="middle"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isActive"
                valuePropName="checked"
                label={<Typography.Text type="secondary">{t('status')}</Typography.Text>}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default UpdateUserAccountBankModal;
