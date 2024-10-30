import React from 'react';
import { Modal, Form, Input } from 'antd';

const BankCreateFormModal = ({
                               isVisible,
                               onCancel,
                               onFinish,
                               form,
                             }) => {
  return (
    <Modal
      title="新增银行(Bank Create)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="银行名称(Bank Name)"
          name="name"
          rules={[{ required: true, message: '请输入银行名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="开户行(Account Bank)"
          name="accountBank"
          rules={[{ required: true, message: '请输入开户行' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="官网网址(Website)"
          name="website"
          rules={[{ required: true, message: '请输入官网网址' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="联系电话(Contact Number)"
          name="contactNumber"
          rules={[{ required: true, message: '请输入联系电话' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BankCreateFormModal;
