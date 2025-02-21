import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const UserProductHotSearchCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t
}) => {
  return (
    <Modal
      title={t('addHotSearch')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t('searchTerm')}
          name="searchTerm"
          rules={[{ required: true, message: t('pleaseInputSearchTerm') }]}
        >
          <Input placeholder={t('pleaseInputSearchTerm')} />
        </Form.Item>

        <Form.Item
          label={t('countryCode')}
          name="countryCode"
          rules={[{ required: true, message: t('pleaseInputCountryCode') }]}
        >
          <Input placeholder={t('pleaseInputCountryCode')} />
        </Form.Item>

        <Form.Item
          label={t('language')}
          name="language"
          rules={[{ required: true, message: t('pleaseInputLanguage') }]}
        >
          <Input placeholder={t('pleaseInputLanguage')} />
        </Form.Item>

        <Form.Item
          label={t('categoryId')}
          name="categoryId"
        >
          <InputNumber placeholder={t('pleaseInputCategoryId')} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserProductHotSearchCreateFormModal;
