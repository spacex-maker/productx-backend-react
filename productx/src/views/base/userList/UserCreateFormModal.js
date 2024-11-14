import React from 'react';
import { Modal, Form, Input, Row, Col, Divider, Typography, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import { commonStyles } from './styles';

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
      title={<span style={commonStyles.modalStyle.title}>{t('createUser')}</span>}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      cancelText={<span style={commonStyles.modalStyle.button}>{t('cancel')}</span>}
      okText={<span style={commonStyles.modalStyle.button}>{t('save')}</span>}
      width={400}
      bodyStyle={commonStyles.modalStyle.bodyPadding}
    >
      <Form 
        form={form} 
        onFinish={onFinish} 
        layout="vertical" 
        size="small"
        style={commonStyles.formStyle}
      >
        <Title level={5} style={commonStyles.formStyle.title}>
          {t('basicInfo')}
        </Title>
        <Divider style={commonStyles.formStyle.divider} />
        
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              label={<span style={commonStyles.formStyle.label}>{t('nickname')}</span>}
              name="nickname"
              rules={[{ required: true, message: '请输入用户昵称' }]}
              style={commonStyles.formStyle.item}
            >
              <Input 
                style={commonStyles.formStyle.input} 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('fullName')}
              name="fullName"
              rules={[{ required: true, message: '请输入用户全名' }]}
              style={commonStyles.formStyle.item}
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
              style={commonStyles.formStyle.item}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('phoneNumber')}
              name="phoneNumber"
              rules={[{ required: true, message: '请输入用户电话号码' }]}
              style={commonStyles.formStyle.item}
            >
              <Input placeholder="请输入电话号码" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t('email')} name="email" style={commonStyles.formStyle.item}>
          <Input placeholder="请输入用户电子邮件" />
        </Form.Item>

        <Form.Item label={t('description')} name="description" style={commonStyles.formStyle.item}>
          <Input placeholder="请输入用户介绍" />
        </Form.Item>

        <Form.Item label={t('status')} name="status" valuePropName="checked" style={commonStyles.formStyle.item}>
          <Checkbox>{t('active')}</Checkbox>
        </Form.Item>

        {/* 地址信息部分 */}
        <Title level={5} style={commonStyles.formStyle.title}>{t('addressInfo')}</Title>
        <Divider style={commonStyles.formStyle.divider} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('country')} name="country" style={commonStyles.formStyle.item}>
              <Input placeholder="请输入国家" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('state')} name="state" style={commonStyles.formStyle.item}>
              <Input placeholder="请输入州/省" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={t('city')} name="city" style={commonStyles.formStyle.item}>
              <Input placeholder="请输入城市" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('postalCode')} name="postalCode" style={commonStyles.formStyle.item}>
              <Input placeholder="请输入邮政编码" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t('address')} name="address" style={commonStyles.formStyle.item}>
          <Input placeholder="请输入详细地址" />
        </Form.Item>

        {/* 其他信息部分 */}
        <Form.Item label={t('creditScore')} name="creditScore" style={commonStyles.formStyle.item}>
          <Input type="number" placeholder="请输入信誉分" defaultValue={1000} />
        </Form.Item>

        <Form.Item label={t('isActive')} name="isActive" valuePropName="checked" style={commonStyles.formStyle.item}>
          <Checkbox>{t('isAccountActive')}</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateFormModal;
