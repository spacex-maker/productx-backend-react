import React from 'react';
import { Modal, Form, Input, Row, Col, Divider, Typography, Checkbox, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  IdcardOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  HomeOutlined,
  NumberOutlined,
  CheckSquareOutlined,
  BankOutlined,
  AimOutlined,
  SafetyCertificateOutlined,
  TagOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const UserCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          {t('createUser')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"

      >
        {/* 基本信息部分 */}
        <Title level={5}>
          <Space>
            <IdcardOutlined />
            {t('basicInfo')}
          </Space>
        </Title>
        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('nickname')}
              name="nickname"
              rules={[{ required: true, message: t('nicknameRequired') }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder={t('enterNickname')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('fullName')}
              name="fullName"
              rules={[{ required: true, message: t('fullNameRequired') }]}
            >
              <Input
                prefix={<IdcardOutlined />}
                placeholder={t('enterFullName')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('password')}
              name="password"
              rules={[{ required: true, message: t('passwordRequired') }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('enterPassword')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('phoneNumber')}
              name="phoneNumber"
              rules={[{ required: true, message: t('phoneNumberRequired') }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder={t('enterPhoneNumber')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('email')}
          name="email"
        >
          <Input
            prefix={<MailOutlined />}
            placeholder={t('enterEmail')}
          />
        </Form.Item>

        <Form.Item
          label={t('description')}
          name="description"
        >
          <Input
            prefix={<InfoCircleOutlined />}
            placeholder={t('enterDescription')}
          />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
          valuePropName="checked"
        >
          <Checkbox>{t('active')}</Checkbox>
        </Form.Item>

        {/* 地址信息部分 */}
        <Title level={5}>
          <Space>
            <HomeOutlined />
            {t('addressInfo')}
          </Space>
        </Title>
        <Divider />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('country')}
              name="country"
            >
              <Input
                prefix={<GlobalOutlined />}
                placeholder={t('enterCountry')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('state')}
              name="state"
            >
              <Input
                prefix={<BankOutlined />}
                placeholder={t('enterState')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('city')}
              name="city"
            >
              <Input
                prefix={<AimOutlined />}
                placeholder={t('enterCity')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('postalCode')}
              name="postalCode"
            >
              <Input
                prefix={<TagOutlined />}
                placeholder={t('enterPostalCode')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('address')}
          name="address"
        >
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder={t('enterAddress')}
          />
        </Form.Item>

        <Form.Item
          label={t('creditScore')}
          name="creditScore"
        >
          <Input
            prefix={<NumberOutlined />}
            type="number"
            placeholder={t('enterCreditScore')}
          />
        </Form.Item>

        <Form.Item
          label={t('isActive')}
          name="isActive"
          valuePropName="checked"
        >
          <Checkbox>{t('isAccountActive')}</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateFormModal;
