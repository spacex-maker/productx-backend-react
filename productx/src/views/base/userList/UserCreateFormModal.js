import React from 'react';
import { Modal, Form, Input, Row, Col, Divider, Typography, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';

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
      title={t('createUser')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      cancelText={t('cancel')}
      okText={t('save')}
      width={500} // 设置模态框宽度为500px
    >
      <Form form={form} onFinish={onFinish} layout="vertical" style={{ gap: '8px' }}>

        {/* 基本信息部分 */}
        <Title level={5} style={{ marginBottom: '16px' }}>{t('basicInfo')}</Title>
        <Divider style={{ margin: '8px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('nickname')}
              name="nickname"
              rules={[{ required: true, message: '请输入用户昵称' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="请输入用户昵称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('fullName')}
              name="fullName"
              rules={[{ required: true, message: '请输入用户全名' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="请输入用户全名" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('password')}
              name="password"
              rules={[{ required: true, message: '请输入用户密码' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('phoneNumber')}
              name="phoneNumber"
              rules={[{ required: true, message: '请输入用户电话号码' }]}
              style={{ marginBottom: '12px' }}
            >
              <Input placeholder="请输入电话号码" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t('email')} name="email" style={{ marginBottom: '12px' }}>
          <Input placeholder="请输入用户电子邮件" />
        </Form.Item>

        <Form.Item label={t('description')} name="description" style={{ marginBottom: '12px' }}>
          <Input placeholder="请输入用户介绍" />
        </Form.Item>

        <Form.Item label={t('status')} name="status" valuePropName="checked" style={{ marginBottom: '12px' }}>
          <Checkbox>{t('active')}</Checkbox>
        </Form.Item>

        {/* 地址信息部分 */}
        <Title level={5} style={{ marginBottom: '16px' }}>{t('addressInfo')}</Title>
        <Divider style={{ margin: '8px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('country')} name="country" style={{ marginBottom: '12px' }}>
              <Input placeholder="请输入国家" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('state')} name="state" style={{ marginBottom: '12px' }}>
              <Input placeholder="请输入州/省" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('city')} name="city" style={{ marginBottom: '12px' }}>
              <Input placeholder="请输入城市" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('postalCode')} name="postalCode" style={{ marginBottom: '12px' }}>
              <Input placeholder="请输入邮政编码" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t('address')} name="address" style={{ marginBottom: '12px' }}>
          <Input placeholder="请输入详细地址" />
        </Form.Item>

        {/* 其他信息部分 */}
        <Form.Item label={t('creditScore')} name="creditScore" style={{ marginBottom: '12px' }}>
          <Input type="number" placeholder="请输入信誉分" defaultValue={1000} />
        </Form.Item>

        <Form.Item label={t('isActive')} name="isActive" valuePropName="checked" style={{ marginBottom: '0px' }}>
          <Checkbox>{t('isAccountActive')}</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateFormModal;
