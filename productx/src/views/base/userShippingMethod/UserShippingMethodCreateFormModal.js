import React from 'react';
import { Modal, Form, Input } from 'antd';

const ShippingMethodCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增配送方式"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="配送方式名称"
          name="shippingMethod"
          rules={[{ required: true, message: '请输入配送方式名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="配送方式描述"
          name="description"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShippingMethodCreateFormModal;
