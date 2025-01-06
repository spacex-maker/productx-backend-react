import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateSysConfigModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateConfig,
  selectedConfig,
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
      title="修改配置"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateConfig}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="配置键"
          name="configKey"
          rules={[{ required: true, message: '请输入配置键' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="配置值"
          name="configValue"
          rules={[{ required: true, message: '请输入配置值' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
        >
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSysConfigModal;
