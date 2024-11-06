import React from 'react';
import { Input, Modal, Form, Switch, Alert } from 'antd';
import api from 'src/axiosInstance';

const AddPermissionModal = ({ isVisible, onCancel, onFinish, parentId }) => {
  const [form] = Form.useForm();

  const handleAddPermissionOk = async () => {
    try {
      const values = await form.validateFields();

      const requestData = {
        permissionName: values.permissionName,
        permissionNameEn: values.permissionNameEn,
        parentId: parentId,
        description: values.description,
        type: values.type || 1, // 默认类型为 1（菜单）
        status: values.status || true,
      };

      await api.post('/manage/admin-permissions/create', requestData);
      form.resetFields();
      onFinish(parentId);
      onCancel();
    } catch (error) {
      console.error('Error adding permission:', error);
    }
  };

  return (
    <Modal
      title="新增权限"
      open={isVisible}
      onCancel={onCancel}
      onOk={handleAddPermissionOk}
      okText="提交"
      cancelText="取消"
      centered
    >
      {/* 提示消息 */}
      <Alert
        message="接口权限的新增一般由技术人员配置"
        type="warning"
        showIcon
        style={{ marginBottom: '16px' }}
      />

      <Form form={form} layout="vertical">
        <Form.Item
          name="permissionName"
          label="权限名称"
          rules={[{ required: true, message: '请输入权限名称' }]}
          style={{ marginBottom: '12px' }} // 缩小下方间距
        >
          <Input placeholder="权限名称" />
        </Form.Item>
        <Form.Item
          name="permissionNameEn"
          label="权限英文名"
          rules={[{ required: true, message: '请输入权限英文名' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="权限英文名" />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入权限描述' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="描述" />
        </Form.Item>
        <Form.Item
          name="type"
          label="类型"
          rules={[{ required: true, message: '请选择权限类型' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="类型（1表示菜单，2表示接口）" />
        </Form.Item>
        <Form.Item
          name="status"
          label="是否生效"
          valuePropName="checked"
          style={{ marginBottom: '12px' }}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPermissionModal;
