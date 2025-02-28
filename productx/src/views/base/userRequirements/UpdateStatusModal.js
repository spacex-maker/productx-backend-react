import React, { useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd';

const UpdateStatusModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  selectedRequirement,
  t
}) => {
  const statusOptions = [
    { value: 'PENDING', label: t('statusPending') },
    { value: 'IN_PROGRESS', label: t('statusInProgress') },
    { value: 'COMPLETED', label: t('statusCompleted') },
    { value: 'REJECTED', label: t('statusRejected') },
    { value: 'ARCHIVED', label: t('statusArchived') },
  ];

  useEffect(() => {
    if (isVisible && selectedRequirement) {
      form.setFieldsValue({
        id: selectedRequirement.id,
        status: selectedRequirement.status,
        rejectedReason: selectedRequirement.rejectedReason,
        completionNotes: selectedRequirement.completionNotes,
      });
    }
  }, [isVisible, selectedRequirement, form]);

  const status = Form.useWatch('status', form);

  return (
    <Modal
      title={t('updateStatus')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select
            placeholder={t('pleaseSelectStatus')}
            options={statusOptions}
          />
        </Form.Item>

        {status === 'REJECTED' && (
          <Form.Item
            label={t('rejectionReason')}
            name="rejectedReason"
            rules={[{ required: true, message: t('pleaseEnterRejectionReason') }]}
          >
            <Input.TextArea rows={2} placeholder={t('pleaseEnterRejectionReason')} />
          </Form.Item>
        )}

        {status === 'COMPLETED' && (
          <Form.Item
            label={t('completionNotes')}
            name="completionNotes"
            rules={[{ required: true, message: t('pleaseEnterCompletionNotes') }]}
          >
            <Input.TextArea rows={2} placeholder={t('pleaseEnterCompletionNotes')} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateStatusModal; 