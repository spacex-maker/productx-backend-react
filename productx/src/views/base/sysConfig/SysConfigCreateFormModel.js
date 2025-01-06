import React from 'react';
import { Modal, Form, Input } from 'antd';

const SysConfigCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增配置"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="配置键"
          name="configKey"
          rules={[{ required: true, message: '请输入配置键' }]}
        >
          <Input placeholder="请输入配置键" />
        </Form.Item>

        <Form.Item
          label="配置值"
          name="configValue"
          rules={[{ required: true, message: '请输入配置值' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入配置值" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
        >
          <Input.TextArea rows={2} placeholder="请输入描述信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SysConfigCreateFormModal;
