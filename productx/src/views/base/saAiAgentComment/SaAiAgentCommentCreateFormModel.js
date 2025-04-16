import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';

const SaAiAgentCommentCreateFormModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const statusOptions = [
    { value: 0, label: t('pending') },
    { value: 1, label: t('approved') },
    { value: 2, label: t('blocked') },
    { value: -1, label: t('deleted') },
  ];

  return (
    <Modal
      title={t('addTitle')}
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
        initialValues={{
          status: 0,
        }}
      >
        <Form.Item
          name="agentId"
          label={t('agentId')}
          rules={[{ required: true, message: t('pleaseInputAgentId') }]}
        >
          <Input placeholder={t('pleaseInputAgentId')} />
        </Form.Item>

        <Form.Item
          name="parentId"
          label={t('parentId')}
        >
          <Input placeholder={t('pleaseInputParentId')} />
        </Form.Item>

        <Form.Item
          name="userId"
          label={t('userId')}
          rules={[{ required: true, message: t('pleaseInputUserId') }]}
        >
          <Input placeholder={t('pleaseInputUserId')} />
        </Form.Item>

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

export default SaAiAgentCommentCreateFormModal;
