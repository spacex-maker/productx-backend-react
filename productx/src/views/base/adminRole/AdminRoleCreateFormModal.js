import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';

const AdminRoleCreateFormModal = ({
                               isVisible,
                               onCancel,
                               onFinish,
                               form,
                             }) => {
  return (
    <Modal
      title="新增角色 (Create Role)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        {/* 角色名称 */}
        <Form.Item
          label="角色名称 (Role Name)"
          name="roleName"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        {/* 角色英文名称 */}
        <Form.Item
          label="角色英文名称 (Role Name En)"
          name="roleNameEn"
          rules={[{ required: true, message: '请输入角色英文名称' }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        {/* 角色描述 */}
        <Form.Item
          label="角色描述 (Role Description)"
          name="description"
          rules={[{ required: true, message: '请输入角色描述' }]}
        >
          <Input.TextArea placeholder="请输入角色描述" rows={3} />
        </Form.Item>

        {/* 角色状态 */}
        <Form.Item
          label="启用状态 (Status)"
          name="status"
          valuePropName="checked"
          rules={[{ required: true, message: '请选择角色状态' }]}
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdminRoleCreateFormModal;
