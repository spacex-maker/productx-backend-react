import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { TextArea } = Input;

const UserFeedbackCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('createFeedback')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={800}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label={t('userId')}
          name="userId"
        >
          <InputNumber 
            placeholder={t('anonymousFeedback')} 
            style={{ width: '100%' }} 
            min={1}
          />
        </Form.Item>

        <Form.Item
          label={t('feedbackType')}
          name="feedbackType"
          rules={[{ required: true, message: t('pleaseSelectFeedbackType') }]}
        >
          <Select placeholder={t('pleaseSelectFeedbackType')}>
            <Option value="suggestion">{t('suggestion')}</Option>
            <Option value="bug">{t('bug')}</Option>
            <Option value="question">{t('question')}</Option>
            <Option value="other">{t('other')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('feedbackTitle')}
          name="title"
          rules={[{ required: true, message: t('pleaseInputFeedbackTitle') }]}
        >
          <Input placeholder={t('pleaseInputFeedbackTitle')} />
        </Form.Item>

        <Form.Item
          label={t('feedbackContent')}
          name="content"
          rules={[{ required: true, message: t('pleaseInputFeedbackContent') }]}
        >
          <TextArea 
            placeholder={t('pleaseInputFeedbackContent')} 
            rows={6}
          />
        </Form.Item>

        <Form.Item
          label={t('priority')}
          name="priority"
          initialValue="MEDIUM"
        >
          <Select placeholder={t('pleaseSelectPriority')}>
            <Option value="LOW">{t('low')}</Option>
            <Option value="MEDIUM">{t('medium')}</Option>
            <Option value="HIGH">{t('high')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('contact')}
          name="contact"
        >
          <Input placeholder={t('contactPlaceholder')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFeedbackCreateFormModal;

