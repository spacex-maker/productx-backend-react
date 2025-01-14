import React from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';
import RoleSelect from "src/views/base/adminRole/RoleSelect";
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  TeamOutlined,
  PlusOutlined,
  UploadOutlined 
} from '@ant-design/icons';

const ManagerCreateFormModal = ({ isVisible, onCancel, onFinish, form }) => {
  const handleSubmit = async (values) => {
    try {
      const formData = {
        ...values,
        roleIds: Array.isArray(values.roleIds) ? values.roleIds : [values.roleIds],
        departmentId: 1,
        status: true,
        avatar: values.avatar?.fileList?.[0]?.response?.data || ''
      };
      await onFinish(formData);
    } catch (error) {
      console.error('Failed to create manager:', error);
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/manage/upload/image',
    headers: {
      authorization: 'authorization-text',
    },
    maxCount: 1,
    accept: 'image/*',
    showUploadList: true,
    listType: "picture",
  };

  return (
    <Modal
      title={
        <div>
          <PlusOutlined />
          新增管理员用户
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={850}
    >
      <Form 
        form={form} 
        onFinish={handleSubmit}
        layout="vertical"
      >
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="用户名 (Username)"
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input 
                prefix={<UserOutlined />}
                placeholder="请输入用户名" 
              />
            </Form.Item>

            <Form.Item
              label="密码 (Password)"
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />}
                placeholder="请输入密码" 
              />
            </Form.Item>

            <Form.Item
              label="邮箱 (Email)"
              name="email"
              rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}
            >
              <Input 
                prefix={<MailOutlined />}
                placeholder="请输入邮箱" 
              />
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item
              label="电话 (Phone)"
              name="phone"
              rules={[{ required: true, message: '请输入电话' }]}
            >
              <Input 
                prefix={<PhoneOutlined />}
                placeholder="请输入电话" 
              />
            </Form.Item>

            <Form.Item
              label="角色 (Roles)"
              name="roleIds"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <RoleSelect 
                mode="multiple"
                placeholder="请选择角色"
                style={{ width: '100%' }}
                prefix={<TeamOutlined />}
              />
            </Form.Item>

            <Form.Item
              label="头像 (Avatar)"
              name="avatar"
            >
              <Upload {...uploadProps}>
                <Button 
                  icon={<UploadOutlined />} 
                  size="small"
                >
                  上传头像
                </Button>
              </Upload>
            </Form.Item>
          </div>
        </div>

        <Form.Item name="departmentId" initialValue={1} hidden>
          <Input />
        </Form.Item>

        <Form.Item name="status" initialValue={true} hidden>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManagerCreateFormModal;
