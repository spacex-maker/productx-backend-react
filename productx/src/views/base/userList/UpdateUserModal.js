import React, {useEffect} from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateUserModal = ({
                           isVisible,
                           onCancel,
                           onOk,
                           form,
                           handleUpdateUser,
                           selectedUser // 新增的 props，用于传递选中的用户信息
                         }) => {

  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedUser) {
      form.setFieldsValue({
        id: selectedUser.id,
        nickname: selectedUser.nickname,
        country: selectedUser.country,
        state: selectedUser.state,
        city: selectedUser.city,
        address: selectedUser.address,
        postalCode: selectedUser.postalCode,
      });
    }
  }, [isVisible, selectedUser, form]);

  return (
    <Modal
      title="修改用户"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form form={form} onFinish={handleUpdateUser}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="用户昵称"
          name="nickname"
          rules={[{ required: true, message: '请输入用户昵称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="国家"
          name="country"
          rules={[{ required: true, message: '请输入国家' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="州"
          name="state"
          rules={[{ required: true, message: '请输入州' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="城市"
          name="city"
          rules={[{ required: true, message: '请输入城市' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="默认地址"
          name="address"
          rules={[{ required: true, message: '请输入默认地址' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮政编码"
          name="postalCode"
          rules={[{ required: true, message: '请输入邮政编码' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
