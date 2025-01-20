import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { UserOutlined, TranslationOutlined, CheckCircleOutlined, EditOutlined } from '@ant-design/icons';

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
        <div>
          <EditOutlined style={{ marginRight: '4px' }} />
          编辑角色
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
      width={480}
    >
      <Form
        form={form}
        onFinish={handleUpdateRole}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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
          label="英文角色名称"
          name="roleNameEn"
          rules={[{ required: true, message: '请输入英文角色名称' }]}
        >
          <Input
            prefix={<TranslationOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="请输入英文角色名称"
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

export default UpdateRoleModal;
