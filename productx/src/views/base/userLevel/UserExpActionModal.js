import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const CATEGORY_OPTIONS = [
  { value: 'login', label: '登录' },
  { value: 'community', label: '社区互动' },
  { value: 'challenge', label: '挑战活动' },
  { value: 'ai', label: 'AI 创作' },
  { value: 'growth', label: '成长任务' },
  { value: 'general', label: '其他' },
];

const UserExpActionModal = ({ open, title, onCancel, onFinish, form, initialValues, isEdit }) => {
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (open && !isEdit) {
      form.resetFields();
      form.setFieldsValue({ status: 1, sortOrder: 0, dailyLimit: 0, totalLimit: 0, expValue: 1 });
    }
  }, [open, initialValues, form, isEdit]);

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {isEdit && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="actionCode"
          label="行为编码"
          rules={[{ required: true, message: '请输入行为编码' }]}
        >
          <Input placeholder="如 POST_LIKE、DAILY_LOGIN" disabled={isEdit} />
        </Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nameEn" label="英文名称">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="说明">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="category" label="分类" rules={[{ required: true }]}>
          <Select options={CATEGORY_OPTIONS} />
        </Form.Item>
        <Form.Item name="expValue" label="经验值" rules={[{ required: true }]}>
          <InputNumber min={0} max={99999} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="dailyLimit" label="每日上限（0=不限）">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="totalLimit" label="终身上限（0=不限）">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="sortOrder" label="排序">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="icon" label="图标标识">
          <Input placeholder="前端展示用，可选" />
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true }]}>
          <Select
            options={[
              { value: 1, label: '启用' },
              { value: 0, label: '禁用' },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserExpActionModal;
