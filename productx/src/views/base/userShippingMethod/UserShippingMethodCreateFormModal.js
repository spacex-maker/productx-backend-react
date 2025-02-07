import React from 'react';
import { Modal, Form, Input } from 'antd';

const ShippingMethodCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t
}) => {
  return (
    <Modal
      title={t('addShippingMethod')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t('shippingMethodName')}
          name="shippingMethod"
          rules={[{ required: true, message: t('pleaseInputShippingMethod') }]}
        >
          <Input placeholder={t('pleaseInputShippingMethod')} />
        </Form.Item>
        <Form.Item
          label={t('shippingMethodDesc')}
          name="description"
        >
          <Input.TextArea placeholder={t('pleaseInputShippingMethodDesc')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShippingMethodCreateFormModal;
