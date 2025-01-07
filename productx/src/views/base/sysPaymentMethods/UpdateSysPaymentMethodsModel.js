import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateSysPaymentMethodsModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  selectedPaymentMethod
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (visible && selectedPaymentMethod) {
      form.setFieldsValue({
        id: selectedPaymentMethod.id,
        paymentMethodName: selectedPaymentMethod.paymentMethodName,
        descriptionEn: selectedPaymentMethod.descriptionEn,
        descriptionZh: selectedPaymentMethod.descriptionZh,
      });
    }
  }, [visible, selectedPaymentMethod, form]);

  return (
    <Modal
      title={t('editPaymentMethod')}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="paymentMethodName"
          label={t('paymentMethodName')}
          rules={[{ required: true, message: t('pleaseInputPaymentMethodName') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="descriptionEn"
          label={t('englishDescription')}
          rules={[{ required: true, message: t('pleaseInputEnglishDescription') }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="descriptionZh"
          label={t('chineseDescription')}
          rules={[{ required: true, message: t('pleaseInputChineseDescription') }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSysPaymentMethodsModal;
