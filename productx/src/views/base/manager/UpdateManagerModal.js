import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const UpdateManagerModal = ({
                              isVisible,
                              onCancel,
                              onOk,
                              form,
                              handleUpdateManager,
                              selectedManager // 用于传递选中的管理员信息
                            }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedManager) {
      form.setFieldsValue({
        id: selectedManager.id,
        username: selectedManager.username,
        email: selectedManager.email,
        phone: selectedManager.phone,
        password: '', // 密码一般不显示
        roleId: selectedManager.roleId,
      });
    }
  }, [isVisible, selectedManager, form]);

  return (
    <Modal
      title="修改管理员用户"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateManager}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="电话"
          name="phone"
          rules={[{ required: true, message: '请输入电话' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="角色ID"
          name="roleId"
          rules={[{ required: true, message: '请选择角色ID' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Select placeholder="请选择角色ID">
            {/* 假设角色ID为数字类型，提供一些示例 */}
            <Select.Option value={0}>普通用户</Select.Option>
            <Select.Option value={1}>管理员</Select.Option>
            <Select.Option value={2}>超级管理员</Select.Option>
            <Select.Option value={3}>其他角色</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="密码 (留空不修改)"
          name="password"
          rules={[{ required: false, message: '请输入新密码（如果需要修改）' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateManagerModal;
