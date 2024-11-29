import React from 'react';
import { Modal, Form, Input, Upload, Button } from 'antd';
import RoleSelect from "src/views/base/adminRole/RoleSelect";
import styled from 'styled-components';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  TeamOutlined,
  PlusOutlined,
  UploadOutlined 
} from '@ant-design/icons';

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
    <StyledModal
      title={
        <div style={{ fontSize: '12px', fontWeight: 500 }}>
          <PlusOutlined style={{ marginRight: '4px' }} />
          新增管理员用户
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={400}
      styles={{ padding: '12px 24px' }}
    >
      <Form 
        form={form} 
        onFinish={handleSubmit}
        layout="vertical"
        size="small"
      >
        <Form.Item
          label={<span style={{ fontSize: '10px', color: '#666666' }}>用户名 (Username)</span>}
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input 
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入用户名" 
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '10px', color: '#666666' }}>密码 (Password)</span>}
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input.Password 
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入密码" 
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '10px', color: '#666666' }}>邮箱 (Email)</span>}
          name="email"
          rules={[{ required: true, message: '请输入邮箱', type: 'email' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input 
            prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入邮箱" 
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '10px', color: '#666666' }}>电话 (Phone)</span>}
          name="phone"
          rules={[{ required: true, message: '请输入电话' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input 
            prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入电话" 
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '10px', color: '#666666' }}>角色 (Roles)</span>}
          name="roleIds"
          rules={[{ required: true, message: '请选择角色' }]}
          style={{ marginBottom: '8px' }}
        >
          <RoleSelect 
            mode="multiple"
            placeholder="请选择角色"
            style={{ width: '100%', fontSize: '10px' }}
            prefix={<TeamOutlined style={{ color: '#bfbfbf' }} />}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '10px', color: '#666666' }}>头像 (Avatar)</span>}
          name="avatar"
          style={{ marginBottom: '8px' }}
        >
          <Upload {...uploadProps}>
            <Button 
              icon={<UploadOutlined />} 
              size="small"
              style={{ fontSize: '10px', height: '24px' }}
            >
              上传头像
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item name="departmentId" initialValue={1} hidden>
          <Input />
        </Form.Item>

        <Form.Item name="status" initialValue={true} hidden>
          <Input />
        </Form.Item>
      </Form>

      <style jsx global>{`
        .ant-modal-header {
          padding: 12px 24px !important;
          border-bottom: 1px solid #f0f0f0;
        }

        .ant-modal-footer {
          padding: 8px 16px !important;
          border-top: 1px solid #f0f0f0;
        }

        .ant-modal-footer .ant-btn {
          font-size: 10px !important;
          height: 24px !important;
          padding: 0 12px !important;
        }

        .ant-input-affix-wrapper {
          height: 24px !important;
        }

        .ant-input-affix-wrapper-focused {
          box-shadow: none !important;
        }

        .ant-form-item-explain-error {
          font-size: 10px !important;
        }

        .ant-select-selector {
          height: 24px !important;
        }

        .ant-select-selection-item {
          line-height: 22px !important;
        }

        .ant-select-selection-overflow-item {
          height: 22px !important;
        }

        .ant-form-item-label {
          padding: 0 0 4px !important;
        }

        .ant-form-item-label > label {
          height: 16px !important;
        }

        .ant-form-vertical .ant-form-item-label {
          padding-bottom: 4px !important;
        }

        .ant-upload-list {
          margin-top: 4px !important;
        }

        .ant-upload-list-item {
          height: 44px !important;
          font-size: 10px !important;
        }

        .ant-upload-list-item-name {
          font-size: 10px !important;
        }

        .ant-upload-list-item-card-actions {
          right: -8px !important;
        }

        .ant-upload-list-item-thumbnail {
          width: 36px !important;
          height: 36px !important;
        }

        .ant-upload-list-item-thumbnail img {
          object-fit: cover !important;
        }
      `}</style>
    </StyledModal>
  );
};

export default ManagerCreateFormModal;
