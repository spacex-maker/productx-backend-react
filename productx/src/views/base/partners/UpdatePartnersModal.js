import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdatePartnersModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdatePartner,
  selectedPartner
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible && selectedPartner) {
      form.setFieldsValue(selectedPartner);
    }
  }, [isVisible, selectedPartner, form]);

  return (
    <Modal
      title={t('updatePartner')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleUpdatePartner}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('partnerName')}
          name="name"
          rules={[{ required: true, message: t('pleaseInputPartnerName') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Logo URL"
          name="logoUrl"
          rules={[{ required: true, message: t('pleaseInputLogoUrl') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('websiteUrl')}
          name="websiteUrl"
          rules={[{ required: true, message: t('pleaseInputWebsiteUrl') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('description')}
          name="description"
          rules={[{ required: true, message: t('pleaseInputDescription') }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdatePartnersModal;
