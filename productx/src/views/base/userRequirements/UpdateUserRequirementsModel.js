import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import moment from 'moment';

const UpdateUserRequirementsModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateRequirement,
  selectedRequirement,
  t
}) => {
  const priorityOptions = [
    { value: '低', label: t('低') },
    { value: '中', label: t('中') },
    { value: '高', label: t('高') },
    { value: '紧急', label: t('紧急') },
  ];

  const statusOptions = [
    { value: 'PENDING', label: t('待处理') },
    { value: 'IN_PROGRESS', label: t('进行中') },
    { value: 'COMPLETED', label: t('已完成') },
    { value: 'REJECTED', label: t('已拒绝') },
    { value: 'ARCHIVED', label: t('已归档') },
  ];

  const categoryOptions = [
    { value: '功能新增', label: t('功能新增') },
    { value: 'Bug修复', label: t('Bug修复') },
    { value: '性能优化', label: t('性能优化') },
    { value: 'UI优化', label: t('UI优化') },
    { value: '安全问题', label: t('安全问题') },
  ];

  useEffect(() => {
    if (isVisible && selectedRequirement) {
      form.setFieldsValue({
        id: selectedRequirement.id,
        title: selectedRequirement.title,
        description: selectedRequirement.description,
        userId: selectedRequirement.userId,
        priority: selectedRequirement.priority,
        status: selectedRequirement.status,
        category: selectedRequirement.category,
        expectedCompletionDate: selectedRequirement.expectedCompletionDate ? moment(selectedRequirement.expectedCompletionDate) : null,
        rejectedReason: selectedRequirement.rejectedReason,
        completionNotes: selectedRequirement.completionNotes,
      });
    }
  }, [isVisible, selectedRequirement, form]);

  return (
    <Modal
      title={t('编辑需求')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleUpdateRequirement}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('需求标题')}
          name="title"
          rules={[{ required: true, message: t('请输入需求标题') }]}
        >
          <Input placeholder={t('请输入需求标题')} />
        </Form.Item>

        <Form.Item
          label={t('需求描述')}
          name="description"
          rules={[{ required: true, message: t('请输入需求描述') }]}
        >
          <Input.TextArea rows={4} placeholder={t('请输入需求描述')} />
        </Form.Item>

        <Form.Item
          label={t('提交用户ID')}
          name="userId"
        >
          <Input placeholder={t('请输入提交用户ID')} />
        </Form.Item>

        <Form.Item
          label={t('优先级')}
          name="priority"
          rules={[{ required: true, message: t('请选择优先级') }]}
        >
          <Select
            placeholder={t('请选择优先级')}
            options={priorityOptions}
          />
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

        <Form.Item
          label={t('类别')}
          name="category"
          rules={[{ required: true, message: t('请选择类别') }]}
        >
          <Select
            placeholder={t('请选择类别')}
            options={categoryOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('预计完成日期')}
          name="expectedCompletionDate"
        >
          <DatePicker
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            placeholder={t('请选择预计完成日期')}
          />
        </Form.Item>

        <Form.Item
          label={t('拒绝原因')}
          name="rejectedReason"
        >
          <Input.TextArea rows={2} placeholder={t('请输入拒绝原因')} />
        </Form.Item>

        <Form.Item
          label={t('完成说明')}
          name="completionNotes"
        >
          <Input.TextArea rows={2} placeholder={t('请输入完成说明')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserRequirementsModal;
