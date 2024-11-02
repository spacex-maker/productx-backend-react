import React, { useState } from 'react';
import { Input, Modal, Form, Switch } from 'antd';
import api from 'src/axiosInstance';
import ManagerSearchInput from "src/views/common/ManagerSearchInput";

const AddDepartmentManagerModal = ({ isVisible, onClose, onAddSuccess, parentId }) => {
  const [form] = Form.useForm();
  const [managerUsername, setManagerUsername] = useState(""); // 用于存储部门经理名称

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // 验证表单

      const requestData = {
        managerName: managerUsername, // 部门经理的名称
        departmentId: parentId, // 父部门 ID
        status: values.status, // 从表单获取状态
      };

      const response = await api.post('/manage/admin-manager-departments/add', requestData); // 调用添加员工的 API
      console.log('新增员工成功:', response);
      onAddSuccess(parentId); // 刷新员工列表
      onClose(); // 关闭模态框
    } catch (error) {
      console.error('新增员工失败:', error);
    }
  };

  return (
    <Modal
      title="加入员工"
      open={isVisible}
      onCancel={onClose}
      onOk={handleOk}
      okText="加入"
      cancelText="取消"
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="managerName"
          label="员工名称"
          rules={[{ required: true, message: '请输入管理员名称' }]}
        >
          <ManagerSearchInput
            onSelect={(value) => {
              form.setFieldsValue({ managerName: value });
              setManagerUsername(value); // 更新状态
            }}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label="状态"
          valuePropName="checked"
          initialValue={true} // 默认状态为 true
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDepartmentManagerModal;
