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
                             cryptoCurrencies,
                             t
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
      title={t('editWallet')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleUpdateWallet}>
        <Form.Item name="address" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('walletAddress')}
          name="address"
          rules={[{ required: true, message: t('pleaseInputWalletAddress') }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('walletType')}
          name="type"
          rules={[{ required: true, message: t('pleaseSelectWalletType') }]}
          style={{ marginBottom: '8px' }}
        >
          <Select placeholder={t('pleaseSelectWalletType')} allowClear>
            {cryptoCurrencies.map((crypto) => (
              <Option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('walletLabel')}
          name="label"
          rules={[{ required: true, message: t('pleaseInputWalletLabel') }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('countryCode')}
          name="countryCode"
          rules={[{ required: true, message: t('pleaseInputCountryCode') }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('balance')}
          name="balance"
          rules={[{ required: true, message: t('pleaseInputBalance') }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateWalletModal; 