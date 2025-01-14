import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const UpdateWalletModal = ({
                             isVisible,
                             onCancel,
                             onOk,
                             form,
                             handleUpdateWallet,
                             selectedWallet,
                             cryptoCurrencies
                           }) => {
  useEffect(() => {
    if (isVisible && selectedWallet) {
      form.setFieldsValue({
        address: selectedWallet.address,
        type: selectedWallet.type,
        label: selectedWallet.label,
        countryCode: selectedWallet.countryCode,
        balance: selectedWallet.balance,
      });
    }
  }, [isVisible, selectedWallet, form]);

  return (
    <Modal
      title="修改钱包"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateWallet}>
        <Form.Item name="address" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="钱包地址"
          name="address"
          rules={[{ required: true, message: '请输入钱包地址' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="钱包类型"
          name="type"
          rules={[{ required: true, message: '请选择钱包类型' }]}
          style={{ marginBottom: '8px' }}
        >
          <Select placeholder="请选择钱包类型" allowClear>
            {cryptoCurrencies.map((crypto) => (
              <Option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="钱包标签/别名"
          name="label"
          rules={[{ required: true, message: '请输入钱包标签或别名' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="国家码"
          name="countryCode"
          rules={[{ required: true, message: '请输入国家码' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="余额"
          name="balance"
          rules={[{ required: true, message: '请输入余额' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateWalletModal; 