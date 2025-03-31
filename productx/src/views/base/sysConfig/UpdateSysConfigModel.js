import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateSysConfigModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateConfig,
  selectedConfig,
  t
}) => {
  const [isConfigValueModified, setIsConfigValueModified] = useState(false);

  useEffect(() => {
    if (isVisible && selectedConfig) {
      form.setFieldsValue({
        id: selectedConfig.id,
        configKey: selectedConfig.configKey,
        configValue: selectedConfig.configValue,
        description: selectedConfig.description,
      });
      setIsConfigValueModified(false);
    }
  }, [isVisible, selectedConfig, form]);

  const handleFormSubmit = (values) => {
    // 只有当配置值被修改过时，才包含在提交数据中
    const submitData = {
      id: values.id,
      configKey: values.configKey,
      description: values.description,
    };

    if (isConfigValueModified) {
      submitData.configValue = values.configValue;
    }

    handleUpdateConfig(submitData);
  };

  const handleConfigValueChange = () => {
    setIsConfigValueModified(true);
  };

  return (
    <Modal
      title={t('editConfig')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={handleFormSubmit}>
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
          <Input.TextArea 
            rows={4} 
            placeholder={t('pleaseInputConfigValue')}
            onChange={handleConfigValueChange}
          />
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

export default UpdateSysConfigModel;
