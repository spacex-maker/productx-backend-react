import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const CurrencyCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('createCurrency')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label={t('currencyCode')}
          name="currencyCode"
          rules={[{ required: true, message: t('pleaseInput') + t('currencyCode') }]}
          tooltip={t('currencyCodeExample')}
        >
          <Input placeholder="CNY, USD, EUR..." />
        </Form.Item>

        <Form.Item
          label={t('currencyName')}
          name="currencyName"
          rules={[{ required: true, message: t('pleaseInput') + t('currencyName') }]}
          tooltip={t('currencyNameExample')}
        >
          <Input placeholder="Chinese Yuan, US Dollar..." />
        </Form.Item>

        <Form.Item
          label={t('currencySymbol')}
          name="symbol"
          rules={[{ required: true, message: t('pleaseInput') + t('currencySymbol') }]}
          tooltip={t('currencySymbolExample')}
        >
          <Input placeholder="¥, $, €..." />
        </Form.Item>

        <Form.Item
          label={t('description')}
          name="description"
          tooltip={t('currencyDescriptionTip')}
        >
          <Input.TextArea 
            placeholder={t('currencyDescriptionPlaceholder')}
            rows={2}
          />
        </Form.Item>

        <Form.Item
          label={t('descriptionZh')}
          name="descriptionZh"
          tooltip={t('currencyDescriptionZhTip')}
        >
          <Input.TextArea 
            placeholder={t('currencyDescriptionZhPlaceholder')}
            rows={2}
          />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CurrencyCreateFormModal;
