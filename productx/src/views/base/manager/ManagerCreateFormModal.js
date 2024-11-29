import React from 'react';
import { Modal, Form, Input } from 'antd';
import RoleSelect from "src/views/base/adminRole/RoleSelect";
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 12px;
    color: #000000;
  }

  .ant-form {
    .ant-form-item-label > label {
      font-size: 10px;
      color: #666666;
      height: 20px;
    }

    .ant-input,
    .ant-select-selection-item,
    .ant-select-item-option-content,
    .ant-select-dropdown .ant-select-item,
    .ant-input-password input,
    .ant-select-item,
    .ant-select-selection-search-input,
    .ant-autocomplete-input {
      font-size: 10px !important;
      color: #000000 !important;
    }

    .ant-select-dropdown {
      .ant-select-item {
        color: #000000 !important;
        
        &-option-selected {
          color: #000000 !important;
          font-weight: 600;
        }
        
        &-option-active {
          color: #000000 !important;
        }
      }
    }

    .ant-input-password {
      input {
        color: #000000 !important;
      }
    }

    .ant-input::placeholder,
    .ant-select-selection-placeholder,
    .ant-select-selection-search-input::placeholder {
      color: #999999 !important;
      font-size: 10px !important;
    }

    .ant-form-item {
      margin-bottom: 8px;
    }
  }
`

const ManagerCreateFormModal = ({ isVisible, onCancel, onFinish, form }) => {
  const handleSubmit = async (values) => {
    try {
      const formData = {
        ...values,
        roleIds: Array.isArray(values.roleIds) ? values.roleIds : [values.roleIds],
        departmentId: 1,
        status: true
      };
      await onFinish(formData);
    } catch (error) {
      console.error('Failed to create manager:', error);
    }
  };

  return (
    <StyledModal
      title="新增管理员用户"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
    >
      <Form 
        form={form} 
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          label="用户名 (Username)"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="密码 (Password)"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          label="邮箱 (Email)"
          name="email"
          rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          label="电话 (Phone)"
          name="phone"
          rules={[{ required: true, message: '请输入电话' }]}
        >
          <Input placeholder="请输入电话" />
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
          />
        </Form.Item>

        <Form.Item
          name="departmentId"
          initialValue={1}
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          initialValue={true}
          hidden
        >
          <Input />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default ManagerCreateFormModal;
