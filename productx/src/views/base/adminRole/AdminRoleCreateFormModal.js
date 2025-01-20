import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import {
  UserOutlined,
  TranslationOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const AdminRoleCreateFormModal = ({ isVisible, onCancel, onFinish, form }) => {
  return (
    <Modal
      title={
        <div>
          <PlusOutlined style={{ marginRight: '4px' }} />
          新增角色
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={480}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="角色名称"
          name="roleName"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入角色名称"
          />
        </Form.Item>

        <Form.Item
          label="角色英文名称"
          name="roleNameEn"
          rules={[{ required: true, message: '请输入角色英文名称' }]}
        >
          <Input
            prefix={<TranslationOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入角色英文名称"
          />
        </Form.Item>

        <Form.Item
          label="角色描述"
          name="description"
          rules={[{ required: true, message: '请输入角色描述' }]}
        >
          <Input.TextArea 
            placeholder="请输入角色描述" 
            rows={3}
          />
        </Form.Item>

        <Form.Item
          label="启用状态"
          name="status"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren="×"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdminRoleCreateFormModal;
