 import React from 'react';
import { Modal, Form, Input } from 'antd';

const CurrencyCreateFormModal = ({
                               isVisible,
                               onCancel,
                               onFinish,
                               form,
                             }) => {
  return (
    <Modal
      title="新增货币(create currency)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="货币名称(currency name)"
          name="currencyName"
          rules={[{ required: true, message: '请输入货币名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="货币代码(currency code)"
          name="currencyCode"
          rules={[{ required: true, message: '请输入货币代码(如：CNY，USD)' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="货币符号"
          name="symbol"
          rules={[{ required: true, message: '请输入货币符号(如：$，¥)' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CurrencyCreateFormModal;
