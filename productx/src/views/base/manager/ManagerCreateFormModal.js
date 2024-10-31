import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const ManagerCreateFormModal = ({
                                    isVisible,
                                    onCancel,
                                    onFinish,
                                    form,
                                  }) => {
  return (
    <Modal
      title="新增管理员用户 (Create Admin User)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="用户名 (Username)"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="邮箱 (Email)"
          name="email"
          rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="电话 (Phone)"
          name="phone"
          rules={[{ required: true, message: '请输入电话' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码 (Password)"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="角色ID (Role ID)"
          name="roleId"
          rules={[{ required: true, message: '请选择角色ID' }]}
        >
          <Select placeholder="请选择角色ID">
            {/* 假设角色ID为数字类型，提供一些示例 */}
            <Select.Option value={0}>普通用户</Select.Option>
            <Select.Option value={1}>管理员</Select.Option>
            <Select.Option value={2}>超级管理员</Select.Option>
            <Select.Option value={3}>其他角色</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManagerCreateFormModal;
