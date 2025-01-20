import React, { useState } from 'react';
import { Input, Modal, Form, Switch } from 'antd';
import api from 'src/axiosInstance';
import ManagerSearchInput from "src/views/common/ManagerSearchInput";
import { UserOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

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
      title={<><UserOutlined style={{ marginRight: '8px' }} />加入员工</>}
      open={isVisible}
      onCancel={onClose}
      onOk={handleOk}
      okText={<><CheckCircleOutlined />加入</>}
      cancelText={<><CloseCircleOutlined />取消</>}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="managerName"
          label={<><UserOutlined style={{ marginRight: '4px' }} />员工名称</>}
          rules={[{ required: true, message: '请输入管理员名称' }]}
        >
          <ManagerSearchInput
            prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            onSelect={(value) => {
              form.setFieldsValue({ managerName: value });
              setManagerUsername(value);
            }}
          />
        </Form.Item>
        <Form.Item
          name="status"
          label={<><CheckCircleOutlined style={{ marginRight: '4px' }} />状态</>}
          valuePropName="checked"
          initialValue={true}
        >
          <Switch 
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren={<CloseCircleOutlined />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDepartmentManagerModal;
