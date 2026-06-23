import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateSaAiVoiceCommentModal = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const statusOptions = [
    { value: 0, label: t('pending') },
    { value: 1, label: t('approved') },
    { value: -1, label: t('deleted') },
  ];

  return (
    <Modal
      title={t('editCommentTitle')}
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => onOk({ ...values, id: initialValues?.id }))
          .catch(() => {});
      }}
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="voiceId" label={t('voiceId')}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="userId" label={t('userId')}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="content" label={t('content')} rules={[{ required: true, message: t('pleaseInputContent') }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="status" label={t('status')} rules={[{ required: true }]}>
          <Select options={statusOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSaAiVoiceCommentModal;
