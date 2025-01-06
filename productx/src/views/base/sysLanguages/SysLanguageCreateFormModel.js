import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';

const SysLanguageCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增语言"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="语言代码"
          name="languageCode"
          rules={[{ required: true, message: '请输入语言代码' }]}
        >
          <Input placeholder="例如：en" />
        </Form.Item>

        <Form.Item
          label="英文名称"
          name="languageNameEn"
          rules={[{ required: true, message: '请输入英文名称' }]}
        >
          <Input placeholder="例如：English" />
        </Form.Item>

        <Form.Item
          label="中文名称"
          name="languageNameZh"
          rules={[{ required: true, message: '请输入中文名称' }]}
        >
          <Input placeholder="例如：英语" />
        </Form.Item>

        <Form.Item
          label="本地名称"
          name="languageNameNative"
          rules={[{ required: true, message: '请输入本地名称' }]}
        >
          <Input placeholder="例如：English" />
        </Form.Item>

        <Form.Item
          label="开发状态"
          name="isDeveloped"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SysLanguageCreateFormModal;
