import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateSysConfigModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateConfig,
  selectedConfig,
  t
}) => {
  useEffect(() => {
    if (isVisible && selectedConfig) {
      form.setFieldsValue({
        id: selectedConfig.id,
        configKey: selectedConfig.configKey,
        configValue: selectedConfig.configValue,
        description: selectedConfig.description,
      });
    }
  }, [isVisible, selectedConfig, form]);

  return (
    <Modal
      title={t('editConfig')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleUpdateConfig}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('configKey')}
          name="configKey"
          rules={[{ required: true, message: t('pleaseInputConfigKey') }]}
        >
          <Input disabled />
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

export default UpdateSysConfigModal;
