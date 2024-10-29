import React from 'react';
import { Modal, Form, Input } from 'antd';

const UserCreateFormModal = ({
                               isVisible,
                               onCancel,
                               onFinish,
                               form,
                             }) => {
  return (
    <Modal
      title="创建用户"
      visible={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="用户昵称"
          name="nickname"
          rules={[{ required: true, message: '请输入用户昵称' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserCreateFormModal;
