import React from 'react';
import { Input, Modal, Form, Switch } from 'antd';
import api from 'src/axiosInstance';
import ManagerSearchInput from "src/views/common/ManagerSearchInput";

const AddDepartmentModal = ({ visible, onClose, onAddSuccess, parentId }) => {
  const [form] = Form.useForm();

  const handleAddDepartmentOk = async () => {
    try {
      const values = await form.validateFields();

      if (!values.managerName) {
        form.setFields([
          {
            name: 'managerName',
            errors: ['请输入有效的部门经理'],
          },
        ]);
        return;
      }

      const requestData = {
        name: values.departmentName,
        parentId: parentId,
        description: values.description,
        managerName: values.managerName, // 使用部门经理名称
        contactNumber: values.contactNumber || null,
        email: values.email || null,
        location: values.location || null,
        status: values.status || true,
      };

      await api.post('/manage/admin-departments/create', requestData);
      form.resetFields();
      onAddSuccess(parentId);
      onClose();
    } catch (error) {
      console.error('Error adding department:', error);
    }
  };

  return (
    <Modal
      title="新增部门"
      open={visible}
      onCancel={onClose}
      onOk={handleAddDepartmentOk}
      okText="提交"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="departmentName"
          label="部门名称"
          rules={[{ required: true, message: '请输入部门名称' }]}
        >
          <Input placeholder="部门名称" />
        </Form.Item>
        <Form.Item label="上级部门 ID">
          <Input value={parentId} readOnly placeholder="上级部门 ID" />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入部门描述' }]}
        >
          <Input placeholder="描述" />
        </Form.Item>
        <Form.Item
          name="managerName"
          label="部门经理"
          rules={[{ required: true, message: '请输入有效的部门经理' }]}
        >
          <ManagerSearchInput
            onSelect={(value) => form.setFieldsValue({ managerName: value })}
          />
        </Form.Item>
        <Form.Item
          name="contactNumber"
          label="联系电话"
        >
          <Input placeholder="联系电话" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ type: 'email', message: '请输入有效的邮箱地址' }]}
        >
          <Input placeholder="部门邮箱" />
        </Form.Item>
        <Form.Item
          name="location"
          label="所在位置"
        >
          <Input placeholder="位置" />
        </Form.Item>
        <Form.Item
          name="status"
          label="是否生效"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDepartmentModal;
