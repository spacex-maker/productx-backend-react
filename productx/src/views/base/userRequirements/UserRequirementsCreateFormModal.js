import React from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

const UserRequirementsCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t
}) => {
  const priorityOptions = [
    { value: 'LOW', label: t('priorityLow') },
    { value: 'MEDIUM', label: t('priorityMedium') },
    { value: 'HIGH', label: t('priorityHigh') },
    { value: 'URGENT', label: t('priorityUrgent') },
  ];

  const statusOptions = [
    { value: 'PENDING', label: t('statusPending') },
    { value: 'IN_PROGRESS', label: t('statusInProgress') },
    { value: 'COMPLETED', label: t('statusCompleted') },
    { value: 'REJECTED', label: t('statusRejected') },
    { value: 'ARCHIVED', label: t('statusArchived') },
  ];

  const categoryOptions = [
    { value: '功能新增', label: t('categoryNewFeature') },
    { value: 'Bug修复', label: t('categoryBugFix') },
    { value: '性能优化', label: t('categoryPerformance') },
    { value: 'UI优化', label: t('categoryUI') },
    { value: '安全问题', label: t('categorySecurity') },
  ];

  return (
    <Modal
      title={t('addRequirement')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t('requirementTitle')}
          name="title"
          rules={[{ required: true, message: t('pleaseEnterTitle') }]}
        >
          <Input placeholder={t('pleaseEnterTitle')} />
        </Form.Item>

        <Form.Item
          label={t('requirementDescription')}
          name="description"
          rules={[{ required: true, message: t('pleaseEnterDescription') }]}
        >
          <Input.TextArea rows={4} placeholder={t('pleaseEnterDescription')} />
        </Form.Item>

        <Form.Item
          label={t('submitterId')}
          name="userId"
        >
          <Input placeholder={t('pleaseEnterSubmitterId')} />
        </Form.Item>

        <Form.Item
          label={t('priority')}
          name="priority"
          rules={[{ required: true, message: t('pleaseSelectPriority') }]}
        >
          <Select
            placeholder={t('pleaseSelectPriority')}
            options={priorityOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
          initialValue="PENDING"
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select
            placeholder={t('pleaseSelectStatus')}
            options={statusOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('category')}
          name="category"
          rules={[{ required: true, message: t('pleaseSelectCategory') }]}
        >
          <Select
            placeholder={t('pleaseSelectCategory')}
            options={categoryOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('expectedCompletionDate')}
          name="expectedCompletionDate"
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder={t('pleaseSelectExpectedDate')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserRequirementsCreateFormModal;
