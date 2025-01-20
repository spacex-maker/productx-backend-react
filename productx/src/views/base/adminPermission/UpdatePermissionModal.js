import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Tooltip } from 'antd';
import {
  UserOutlined,
  TranslationOutlined,
  CheckCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const UpdatePermissionModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdatePermission,
  selectedPermission,
}) => {
  useEffect(() => {
    if (isVisible && selectedPermission) {
      form.setFieldsValue({
        id: selectedPermission.id,
        permissionName: selectedPermission.permissionName,
        permissionNameEn: selectedPermission.permissionNameEn,
        description: selectedPermission.description,
        status: selectedPermission.status,
        isSystem: selectedPermission.isSystem,
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
      <Form
        form={form}
        onFinish={handleUpdatePermission}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="权限名称"
          name="permissionName"
          rules={[{ required: true, message: '请输入权限名称' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入权限名称"
          />
        </Form.Item>

        <Form.Item
          label="英文权限名称"
          name="permissionNameEn"
          rules={[{ required: true, message: '请输入英文权限名称' }]}
        >
          <Input
            prefix={<TranslationOutlined />}
            placeholder="请输入英文权限名称"
          />
        </Form.Item>

        <Form.Item
          label="权限描述"
          name="description"
          rules={[{ required: true, message: '请输入权限描述' }]}
        >
          <Input.TextArea placeholder="请输入权限描述" rows={3} />
        </Form.Item>

        <Form.Item
          label="启用状态"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren={<CheckCircleOutlined />} unCheckedChildren="×" />
        </Form.Item>

        <Form.Item
          label="系统权限"
          name="isSystem"
          valuePropName="checked"
        >
          <Switch
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
            disabled
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePermissionModal;
