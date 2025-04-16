import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateSaAiAgentCommentModel = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const statusOptions = [
    { value: 0, label: t('pending') },
    { value: 1, label: t('approved') },
    { value: 2, label: t('blocked') },
    { value: -1, label: t('deleted') },
  ];

  return (
    <Modal
      title={t('editTitle')}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="content"
          label={t('content')}
          rules={[{ required: true, message: t('pleaseInputContent') }]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t('pleaseInputContent')}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t('status')}
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select
            placeholder={t('pleaseSelectStatus')}
            options={statusOptions}
          />
        </Form.Item>

        <Form.Item
          name="auditReason"
          label={t('auditReason')}
        >
          <Input.TextArea
            rows={2}
            placeholder={t('pleaseInputAuditReason')}
            showCount
            maxLength={200}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSaAiAgentCommentModel;
