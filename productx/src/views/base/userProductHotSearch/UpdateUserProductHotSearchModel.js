import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const UpdateUserProductHotSearchModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdate,
  selectedRecord,
  t
}) => {
  useEffect(() => {
    if (isVisible && selectedRecord) {
      form.setFieldsValue({
        id: selectedRecord.id,
        searchTerm: selectedRecord.searchTerm,
        countryCode: selectedRecord.countryCode,
        language: selectedRecord.language,
        categoryId: selectedRecord.categoryId,
      });
    }
  }, [isVisible, selectedRecord, form]);

  return (
    <Modal
      title={t('editHotSearch')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleUpdate}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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

export default UpdateUserProductHotSearchModal;
