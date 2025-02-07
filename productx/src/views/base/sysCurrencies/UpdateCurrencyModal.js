import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateCurrencyModal = ({
                               isVisible,
                               onCancel,
                               onOk,
                               form,
                               handleUpdateCurrency,
                               selectedCurrency // 用于传递选中的货币信息
                             }) => {
  const { t } = useTranslation();

  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedCurrency) {
      form.setFieldsValue({
        id: selectedCurrency.id,
        name: selectedCurrency.name,
        code: selectedCurrency.code,
        exchangeRate: selectedCurrency.exchangeRate,
      });
    }
  }, [isVisible, selectedCurrency, form]);

  return (
    <Modal
      title={t('updateCurrency')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleUpdateCurrency}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('currencyName')}
          name="name"
          rules={[{ required: true, message: t('pleaseInputCurrencyName') }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('currencyCode')}
          name="code"
          rules={[{ required: true, message: t('pleaseInputCurrencyCode') }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('exchangeRate')}
          name="exchangeRate"
          rules={[{ required: true, message: t('pleaseInputExchangeRate') }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCurrencyModal;
