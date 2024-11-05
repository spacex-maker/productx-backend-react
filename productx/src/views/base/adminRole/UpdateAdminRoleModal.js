import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';

const UpdateRoleModal = ({
                           isVisible,
                           onCancel,
                           onOk,
                           form,
                           handleUpdateRole,
                           selectedRole // 用于传递选中的角色信息
                         }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedRole) {
      form.setFieldsValue({
        id: selectedRole.id,
        roleName: selectedRole.roleName,
        roleNameEn: selectedRole.roleNameEn,
        description: selectedRole.description,
        status: selectedRole.status,
      });
    }
  }, [isVisible, selectedRole, form]);

  return (
    <Modal
      title="修改角色信息"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateRole}>
        {/* 隐藏ID字段 */}
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 角色名称 */}
        <Form.Item
          label="角色名称"
          name="roleName"
          rules={[{ required: true, message: '请输入角色名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          label="英文角色名称"
          name="roleNameEn"
          rules={[{ required: true, message: '请输入英文角色名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input placeholder="请输入英文角色名称" />
        </Form.Item>
        {/* 角色描述 */}
        <Form.Item
          label="角色描述"
          name="description"
          rules={[{ required: true, message: '请输入角色描述' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input.TextArea placeholder="请输入角色描述" rows={3} />
        </Form.Item>

        {/* 角色状态 */}
        <Form.Item
          label="启用状态"
          name="status"
          valuePropName="checked"
          style={{ marginBottom: '8px' }}
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateRoleModal;
