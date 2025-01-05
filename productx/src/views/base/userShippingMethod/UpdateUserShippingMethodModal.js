import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateShippingMethodModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateMethod,
  selectedMethod
}) => {
  useEffect(() => {
    if (isVisible && selectedMethod) {
      form.setFieldsValue(selectedMethod);
    }
  }, [isVisible, selectedMethod, form]);

  return (
    <Modal
      title="修改配送方式"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateMethod}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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

export default UpdateShippingMethodModal;
