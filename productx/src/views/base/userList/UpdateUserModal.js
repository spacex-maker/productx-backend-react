import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Row, Col, Divider, Typography, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  HomeOutlined,
  NumberOutlined,
  CheckSquareOutlined,
  BankOutlined,
  AimOutlined,
  TagOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const UpdateUserModal = ({ isVisible, onCancel, onOk, form, handleUpdateUser, selectedUser }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible && selectedUser) {
      form.setFieldsValue({
        id: selectedUser.id,
        description: selectedUser.description,
        email: selectedUser.email,
        status: selectedUser.status,
        nickname: selectedUser.nickname,
        phoneNumber: selectedUser.phoneNumber,
        fullName: selectedUser.fullName,
        address: selectedUser.address,
        creditScore: selectedUser.creditScore,
        city: selectedUser.city,
        state: selectedUser.state,
        postalCode: selectedUser.postalCode,
        country: selectedUser.country,
        isActive: selectedUser.isActive,
      });
    }
  }, [isVisible, selectedUser, form]);

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          {t('editUserInfo')}
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
        onFinish={handleUpdateUser}
        layout="vertical"

      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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
              label={t('email')}
              name="email"
            >
              <Input
                prefix={<MailOutlined />}
                placeholder={t('enterEmail')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('phoneNumber')}
              name="phoneNumber"
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder={t('enterPhoneNumber')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('description')}
              name="description"
            >
              <Input
                prefix={<InfoCircleOutlined />}
                placeholder={t('enterDescription')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
        </Row>

        <Form.Item
          label={t('status')}
          name="isActive"
        >
          <Space>
            {form.getFieldValue('isActive') ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                {t('active')}
              </Tag>
            ) : (
              <Tag color="error" icon={<CloseCircleOutlined />}>
                {t('inactive')}
              </Tag>
            )}
          </Space>
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
              rules={[{ required: true, message: t('countryRequired') }]}
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
              rules={[{ required: true, message: t('stateRequired') }]}
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
              rules={[{ required: true, message: t('cityRequired') }]}
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
              rules={[{ required: true, message: t('postalCodeRequired') }]}
            >
              <Input
                prefix={<TagOutlined />}
                placeholder={t('enterPostalCode')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('addressDetail')}
          name="address"
          rules={[{ required: true, message: t('addressDetailRequired') }]}
        >
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder={t('enterAddressDetail')}
          />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="isActive"
        >
          <Space>
            {form.getFieldValue('isActive') ? (
              <Tag color="success" icon={<CheckCircleOutlined />}>
                {t('active')}
              </Tag>
            ) : (
              <Tag color="error" icon={<CloseCircleOutlined />}>
                {t('inactive')}
              </Tag>
            )}
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
