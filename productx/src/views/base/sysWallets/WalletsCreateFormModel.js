import React from 'react';
import { Modal, Form, Input } from 'antd';

const WalletCreateFormModal = ({
                                 isVisible,
                                 onCancel,
                                 onFinish,
                                 form,
                               }) => {
  return (
    <Modal
      title="新增钱包"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="钱包类型"
          name="type"
          rules={[{ required: true, message: '请选择钱包类型' }]}
        >
          <Input placeholder="请选择钱包类型" />
        </Form.Item>
        <Form.Item
          label="钱包标签"
          name="label"
          rules={[{ required: true, message: '请输入钱包标签' }]}
        >
          <Input placeholder="例如：My Wallet" />
        </Form.Item>
        <Form.Item
          label="国家码"
          name="countryCode"
          rules={[{ required: true, message: '请输入国家码' }]}
        >
          <Input placeholder="例如：US" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入钱包密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WalletCreateFormModal;
