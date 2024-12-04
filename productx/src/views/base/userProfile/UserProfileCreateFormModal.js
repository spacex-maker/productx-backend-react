import React from 'react';
import { Modal, Form, Input, Select, Typography, Divider, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserOutlined, MailOutlined, PhoneOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const UserProfileCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  const { t } = useTranslation();

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
          <UserOutlined style={styles.icon} />
          {t('createProfile')}
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
          {t('basicInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('name')}
          name="name"
          rules={[{ required: true, message: t('pleaseEnterName') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<UserOutlined />}
            style={styles.input}
            placeholder={t('enterName')}
          />
        </Form.Item>

        <Form.Item
          label={t('age')}
          name="age"
          rules={[{ required: false }]}
          style={styles.formItem}
        >
          <Input
            type="number"
            style={styles.input}
            placeholder={t('enterAge')}
          />
        </Form.Item>

        <Form.Item
          label={t('gender')}
          name="gender"
          rules={[{ required: false }]}
          style={styles.formItem}
        >
          <Select
            style={styles.input}
            placeholder={t('selectGender')}
          >
            <Option value="MALE"><ManOutlined /> {t('male')}</Option>
            <Option value="FEMALE"><WomanOutlined /> {t('female')}</Option>
            <Option value="OTHER">{t('other')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('location')}
          name="location"
          rules={[{ required: false }]}
          style={styles.formItem}
        >
          <Input
            style={styles.input}
            placeholder={t('enterLocation')}
          />
        </Form.Item>
      </Form>

      <style jsx global>{`
        .ant-input::placeholder {
          color: #bfbfbf;
        }
        .ant-select-selection-placeholder {
          color: #bfbfbf;
        }
      `}</style>
    </Modal>
  );
};

export default UserProfileCreateFormModal;
