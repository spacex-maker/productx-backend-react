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
        <div style={{ fontSize: '12px', fontWeight: 500 }}>
          <PlusOutlined style={{ marginRight: '4px' }} />
          新增角色
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={480}
      styles={{ padding: '12px 24px' }}
    >
      <Form form={form} onFinish={onFinish} layout="vertical" size="small">
        <Form.Item
          label={<span style={{ fontSize: '10px' }}>角色名称</span>}
          name="roleName"
          rules={[{ required: true, message: '请输入角色名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入角色名称"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '10px' }}>角色英文名称</span>}
          name="roleNameEn"
          rules={[{ required: true, message: '请输入角色英文名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input
            prefix={<TranslationOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入角色英文名称"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '10px' }}>角色描述</span>}
          name="description"
          rules={[{ required: true, message: '请输入角色描述' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input.TextArea placeholder="请输入角色描述" rows={3} style={{ fontSize: '10px' }} />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontSize: '10px' }}>启用状态</span>}
          name="status"
          valuePropName="checked"
          initialValue={true}
          style={{ marginBottom: '8px' }}
        >
          <Switch
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren="×"
            style={{ fontSize: '10px' }}
          />
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

        .ant-form-item-label > label {
          font-size: 10px !important;
          height: 24px !important;
        }

        .ant-form-item-explain-error {
          font-size: 10px !important;
        }

        .ant-input {
          font-size: 10px !important;
          padding: 4px 8px !important;
        }

        .ant-input-textarea textarea {
          font-size: 10px !important;
          padding: 4px 8px !important;
        }

        .ant-switch {
          min-width: 40px !important;
        }

        .ant-switch-inner {
          font-size: 10px !important;
        }

        .ant-form-item {
          margin-bottom: 8px !important;
        }

        .ant-input::placeholder {
          font-size: 10px !important;
        }

        .ant-form-item-required {
          font-size: 10px !important;
        }

        .ant-modal-close {
          height: 40px !important;
          width: 40px !important;
          line-height: 40px !important;
        }

        .ant-modal-close-x {
          font-size: 10px !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
        }
      `}</style>
    </Modal>
  );
};

export default AdminRoleCreateFormModal;
