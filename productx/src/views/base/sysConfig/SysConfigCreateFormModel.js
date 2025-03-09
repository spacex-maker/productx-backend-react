import React from 'react';
import { Modal, Form, Input } from 'antd';

const SysConfigCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t
}) => {
  return (
    <Modal
      title={t('addConfig')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t('configKey')}
          name="configKey"
          rules={[{ required: true, message: t('pleaseInputConfigKey') }]}
        >
          <Input placeholder={t('pleaseInputConfigKey')} />
        </Form.Item>

        <Form.Item
          label={t('configValue')}
          name="configValue"
          rules={[{ required: true, message: t('pleaseInputConfigValue') }]}
        >
          <Input.TextArea rows={4} placeholder={t('pleaseInputConfigValue')} />
        </Form.Item>

        <Form.Item
          label={t('description')}
          name="description"
        >
          <Input.TextArea rows={2} placeholder={t('pleaseInputDescription')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SysConfigCreateFormModel;
