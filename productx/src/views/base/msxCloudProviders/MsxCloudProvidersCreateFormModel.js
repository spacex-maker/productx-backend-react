import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const MsxCloudProvidersCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
  statusOptions,
  serviceTypeOptions
}) => {
  return (
    <Modal
      title={t('addProvider')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t('providerName')}
          name="providerName"
          rules={[{ required: true, message: t('pleaseInputProviderName') }]}
        >
          <Input placeholder={t('pleaseInputProviderName')} />
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

export default MsxCloudProvidersCreateFormModel;
