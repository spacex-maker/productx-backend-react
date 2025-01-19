import React from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;

const WebsiteApplicationReviewModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  applicationData,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('reviewApplication')}
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
        initialValues={{
          id: applicationData?.id,
          status: undefined,
          reviewComments: ''
        }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('reviewStatus')}
          name="status"
          rules={[{ required: true, message: t('pleaseSelectReviewStatus') }]}
        >
          <Select placeholder={t('pleaseSelectReviewStatus')}>
            <Option value="approved">{t('approved')}</Option>
            <Option value="rejected">{t('rejected')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('reviewComments')}
          name="reviewComments"
          rules={[{ required: true, message: t('pleaseInputReviewComments') }]}
        >
          <TextArea 
            rows={4} 
            placeholder={t('pleaseInputReviewComments')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WebsiteApplicationReviewModal; 