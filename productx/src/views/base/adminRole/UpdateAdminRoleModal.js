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
      title={
        <div style={{ fontSize: '12px', fontWeight: 500 }}>修改角色信息</div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
      width={480}
      styles={{ padding: '12px 24px' }}
    >
      <Form
        form={form}
        onFinish={handleUpdateRole}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        size="small"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="角色名称"
          name="roleName"
          rules={[{ required: true, message: '请输入角色名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input
            placeholder="请输入角色名称"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label="英文角色名称"
          name="roleNameEn"
          rules={[{ required: true, message: '请输入英文角色名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input
            placeholder="请输入英文角色名称"
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label="角色描述"
          name="description"
          rules={[{ required: true, message: '请输入角色描述' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input.TextArea
            placeholder="请输入角色描述"
            rows={3}
            style={{ fontSize: '10px' }}
          />
        </Form.Item>

        <Form.Item
          label="启用状态"
          name="status"
          valuePropName="checked"
          style={{ marginBottom: '8px' }}
        >
          <Switch
            checkedChildren="启用"
            unCheckedChildren="禁用"
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
          height: 16px !important;
          line-height: 16px !important;
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

export default UpdateRoleModal;
