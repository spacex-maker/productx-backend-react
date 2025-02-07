import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateShippingMethodModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateMethod,
  selectedMethod,
  t
}) => {
  useEffect(() => {
    if (isVisible && selectedMethod) {
      form.setFieldsValue(selectedMethod);
    }
  }, [isVisible, selectedMethod, form]);

  return (
    <Modal
      title={t('editShippingMethod')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleUpdateMethod}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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

export default UpdateShippingMethodModal;
