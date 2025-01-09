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

  return (
    <Modal
      title={
        <span>
          <UserOutlined />
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
        <Title level={5}>
          {t('basicInfo')}
        </Title>
        <Divider />

        <Form.Item
          label={t('name')}
          name="name"
          rules={[{ required: true, message: t('pleaseEnterName') }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('enterName')}
          />
        </Form.Item>

        <Form.Item
          label={t('age')}
          name="age"
          rules={[{ required: false }]}
        >
          <Input
            type="number"
            placeholder={t('enterAge')}
          />
        </Form.Item>

        <Form.Item
          label={t('gender')}
          name="gender"
          rules={[{ required: false }]}
        >
          <Select
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
        >
          <Input
            placeholder={t('enterLocation')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserProfileCreateFormModal;
