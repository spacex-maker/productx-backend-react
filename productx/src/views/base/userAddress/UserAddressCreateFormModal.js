import React from 'react';
import { Modal, Form, Input, Checkbox, Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const UserAddressCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  const { t } = useTranslation();

  // 统一的样式配置
  const styles = {
    label: {
      fontSize: '10px',
      height: '16px',
      lineHeight: '16px',
      marginBottom: '2px'
    },
    input: {
      height: '24px',
      fontSize: '10px',
      padding: '0 8px'
    },
    formItem: {
      marginBottom: '8px'
    },
    icon: {
      fontSize: '12px',
      color: '#1890ff',
      marginRight: '4px'
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '12px' }}>
          <HomeOutlined style={styles.icon} />
          {t('createAddress')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      maskClosable={false}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Title level={5} style={{ fontSize: '12px', marginBottom: '8px' }}>
          <UserOutlined style={styles.icon} />
          {t('basicInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('contactName')}
          name="contactName"
          rules={[{ required: true, message: t('pleaseEnterContactName') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<UserOutlined />}
            style={styles.input}
            placeholder={t('enterContactName')}
          />
        </Form.Item>

        <Form.Item
          label={t('phoneNum')}
          name="phoneNum"
          rules={[{ required: true, message: t('pleaseEnterPhoneNum') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<PhoneOutlined />}
            style={styles.input}
            placeholder={t('enterPhoneNum')}
          />
        </Form.Item>

        <Form.Item
          label={t('contactAddress')}
          name="contactAddress"
          rules={[{ required: true, message: t('pleaseEnterContactAddress') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<EnvironmentOutlined />}
            style={styles.input}
            placeholder={t('enterContactAddress')}
          />
        </Form.Item>

        <Form.Item
          name="currentUse"
          valuePropName="checked"
          style={styles.formItem}
        >
          <Checkbox>{t('setAsDefault')}</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserAddressCreateFormModal;
