import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const UpdateMsxCloudProvidersModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateProvider,
  selectedProvider,
  t,
  statusOptions,
  serviceTypeOptions
}) => {
  useEffect(() => {
    if (isVisible && selectedProvider) {
      form.setFieldsValue({
        id: selectedProvider.id,
        providerName: selectedProvider.providerName,
        countryCode: selectedProvider.countryCode,
        serviceType: selectedProvider.serviceType,
        status: selectedProvider.status,
        website: selectedProvider.website,
        iconImg: selectedProvider.iconImg,
      });
    }
  }, [isVisible, selectedProvider, form]);

  return (
    <Modal
      title={t('editProvider')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleUpdateProvider}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('providerName')}
          name="providerName"
          rules={[{ required: true, message: t('pleaseInputProviderName') }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label={t('countryCode')}
          name="countryCode"
          rules={[{ required: true, message: t('pleaseInputCountryCode') }]}
        >
          <Input placeholder={t('pleaseInputCountryCode')} />
        </Form.Item>

        <Form.Item
          label={t('serviceType')}
          name="serviceType"
          rules={[{ required: true, message: t('pleaseSelectServiceType') }]}
        >
          <Select
            placeholder={t('pleaseSelectServiceType')}
            options={serviceTypeOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select
            placeholder={t('pleaseSelectStatus')}
            options={statusOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('website')}
          name="website"
          rules={[
            { required: true, message: t('pleaseInputWebsite') },
            { type: 'url', message: t('pleaseInputValidUrl') }
          ]}
        >
          <Input placeholder={t('pleaseInputWebsite')} />
        </Form.Item>

        <Form.Item
          label={t('iconImg')}
          name="iconImg"
        >
          <Input placeholder={t('pleaseInputIconUrl')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateMsxCloudProvidersModel;
