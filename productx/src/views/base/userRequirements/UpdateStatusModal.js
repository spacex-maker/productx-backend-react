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
    { value: 'PENDING', label: t('待处理') },
    { value: 'IN_PROGRESS', label: t('进行中') },
    { value: 'COMPLETED', label: t('已完成') },
    { value: 'REJECTED', label: t('已拒绝') },
    { value: 'ARCHIVED', label: t('已归档') },
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
      title={t('更新状态')}
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
          label={t('状态')}
          name="status"
          rules={[{ required: true, message: t('请选择状态') }]}
        >
          <Select
            placeholder={t('请选择状态')}
            options={statusOptions}
          />
        </Form.Item>

        {status === 'REJECTED' && (
          <Form.Item
            label={t('拒绝原因')}
            name="rejectedReason"
            rules={[{ required: true, message: t('请输入拒绝原因') }]}
          >
            <Input.TextArea rows={2} placeholder={t('请输入拒绝原因')} />
          </Form.Item>
        )}

        {status === 'COMPLETED' && (
          <Form.Item
            label={t('完成说明')}
            name="completionNotes"
            rules={[{ required: true, message: t('请输入完成说明') }]}
          >
            <Input.TextArea rows={2} placeholder={t('请输入完成说明')} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateStatusModal; 