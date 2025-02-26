import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateWalletModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateWallet,
  selectedWallet,
  t
}) => {
  useEffect(() => {
    if (isVisible && selectedWallet) {
      form.setFieldsValue({
        id: selectedWallet.id,
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
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="address" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="type" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="countryCode" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="balance" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('walletAddress')}
          style={{ marginBottom: '16px' }}
        >
          <Input value={selectedWallet?.address} disabled />
        </Form.Item>

        <Form.Item
          label={t('walletLabel')}
          name="label"
          rules={[{ required: true, message: t('pleaseInputWalletLabel') }]}
          style={{ marginBottom: '16px' }}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateWalletModal; 