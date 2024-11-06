import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';

const UpdatePermissionModal = ({
                                 isVisible,
                                 onCancel,
                                 onOk,
                                 form,
                                 handleUpdatePermission,
                                 selectedPermission // 用于传递选中的权限信息
                               }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedPermission) {
      form.setFieldsValue({
        id: selectedPermission.id,
        permissionName: selectedPermission.permissionName,
        permissionNameEn: selectedPermission.permissionNameEn,
        description: selectedPermission.description,
        status: selectedPermission.status,
      });
    }
  }, [isVisible, selectedPermission, form]);

  return (
    <Modal
      title="修改权限信息"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdatePermission}>
        {/* 隐藏ID字段 */}
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 权限名称 */}
        <Form.Item
          label="权限名称"
          name="permissionName"
          rules={[{ required: true, message: '请输入权限名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input placeholder="请输入权限名称" />
        </Form.Item>

        {/* 英文权限名称 */}
        <Form.Item
          label="英文权限名称"
          name="permissionNameEn"
          rules={[{ required: true, message: '请输入英文权限名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input placeholder="请输入英文权限名称" />
        </Form.Item>

        {/* 权限描述 */}
        <Form.Item
          label="权限描述"
          name="description"
          rules={[{ required: true, message: '请输入权限描述' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input.TextArea placeholder="请输入权限描述" rows={3} />
        </Form.Item>

        {/* 权限状态 */}
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

export default UpdatePermissionModal;
