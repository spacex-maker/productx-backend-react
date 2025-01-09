import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Typography, Divider, DatePicker, Row, Col, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserOutlined, MailOutlined, PhoneOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const UpdateUserProfileModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateProfile,
  selectedProfile
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible && selectedProfile) {
      form.setFieldsValue({
        preferredCategories: selectedProfile.preferredCategories,
        preferredBrands: selectedProfile.preferredBrands
      });
    }
  }, [isVisible, selectedProfile, form]);

  return (
    <Modal
      title={
        <span>
          <UserOutlined /> {t('editProfile')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={600}
      maskClosable={false}
    >
      <Form form={form} onFinish={handleUpdateProfile} layout="vertical">
        <Title level={5}>{t('basicInfo')}</Title>
        <Descriptions column={2} size="small">
          <Descriptions.Item label={t('userId')}>
            {selectedProfile?.userId}
          </Descriptions.Item>
          <Descriptions.Item label={t('name')}>
            {selectedProfile?.name}
          </Descriptions.Item>
          <Descriptions.Item label={t('age')}>
            {selectedProfile?.age}
          </Descriptions.Item>
          <Descriptions.Item label={t('gender')}>
            {t(selectedProfile?.gender)}
          </Descriptions.Item>
          <Descriptions.Item label={t('location')}>
            {selectedProfile?.location}
          </Descriptions.Item>
          <Descriptions.Item label={t('registrationDate')}>
            {selectedProfile?.registrationDate}
          </Descriptions.Item>
        </Descriptions>

        <Title level={5} style={{ marginTop: 24 }}>{t('preferences')}</Title>
        <Form.Item
          label={t('preferredCategories')}
          name="preferredCategories"
          rules={[{ required: true, message: t('pleaseEnterPreferredCategories') }]}
        >
          <Select
            mode="tags"
            placeholder={t('enterPreferredCategories')}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label={t('preferredBrands')}
          name="preferredBrands"
          rules={[{ required: true, message: t('pleaseEnterPreferredBrands') }]}
        >
          <Select
            mode="tags"
            placeholder={t('enterPreferredBrands')}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserProfileModal;
