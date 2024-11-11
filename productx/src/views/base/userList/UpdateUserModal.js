import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Row, Col, Divider, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const UpdateUserModal = ({
                           isVisible,
                           onCancel,
                           onOk,
                           form,
                           handleUpdateUser,
                           selectedUser
                         }) => {
  const { t } = useTranslation();

  // 当模态框打开时，设置表单字段的值
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
      title={t('editUserInfo')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={500} // 设置模态框宽度为500px
    >
      <Form
        form={form}
        onFinish={handleUpdateUser}
        layout="vertical"
        style={{ gap: '8px' }} // 使用 gap 控制输入框之间的间距
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 基本信息部分 */}
        <Title level={5} style={{ marginBottom: '16px' }}>{t('basicInfo')}</Title>
        <Divider style={{ margin: '8px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('nickname')}
              name="nickname"
              rules={[{ required: true, message: t('nicknameRequired') }]}
              style={{ marginBottom: '12px' }} // 缩小下边距
            >
              <Input placeholder={t('enterNickname')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('fullName')} name="fullName" style={{ marginBottom: '12px' }}>
              <Input placeholder={t('enterFullName')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('email')} name="email" style={{ marginBottom: '12px' }}>
              <Input placeholder={t('enterEmail')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('phoneNumber')} name="phoneNumber" style={{ marginBottom: '12px' }}>
              <Input placeholder={t('enterPhoneNumber')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('description')} name="description" style={{ marginBottom: '12px' }}>
              <Input placeholder={t('enterDescription')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('creditScore')} name="creditScore" style={{ marginBottom: '12px' }}>
              <Input type="number" placeholder={t('enterCreditScore')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t('status')} name="status" valuePropName="checked" style={{ marginBottom: '12px' }}>
          <Checkbox>{t('active')}</Checkbox>
        </Form.Item>

        {/* 地址信息部分 */}
        <Title level={5} style={{ marginBottom: '16px' }}>{t('addressInfo')}</Title>
        <Divider style={{ margin: '8px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('country')}
              name="country"
              rules={[{ required: true, message: t('countryRequired') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder={t('enterCountry')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('state')}
              name="state"
              rules={[{ required: true, message: t('stateRequired') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder={t('enterState')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('city')}
              name="city"
              rules={[{ required: true, message: t('cityRequired') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder={t('enterCity')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('postalCode')}
              name="postalCode"
              rules={[{ required: true, message: t('postalCodeRequired') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder={t('enterPostalCode')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('addressDetail')}
          name="address"
          rules={[{ required: true, message: t('addressDetailRequired') }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder={t('enterAddressDetail')} />
        </Form.Item>

        <Form.Item label={t('isActive')} name="isActive" style={{ marginBottom: '0px' }}>
          <Input disabled placeholder={t('isActive')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
