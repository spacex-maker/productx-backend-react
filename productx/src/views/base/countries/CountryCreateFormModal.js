import React from 'react';
import { Modal, Form, Input } from 'antd';

const CountryCreateFormModal = ({
                                  isVisible,
                                  onCancel,
                                  onFinish,
                                  form,
                                }) => {
  return (
    <Modal
      title="新增国家(create country)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="国家名称(country name)"
          name="countryName"
          rules={[{ required: true, message: '请输入国家名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="国家代码(country code)"
          name="countryCode"
          rules={[{ required: true, message: '请输入国家代码(如：CN，US)' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="大陆(continent)"
          name="continent"
          rules={[{ required: true, message: '请输入大陆(如：亚洲，欧洲)' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CountryCreateFormModal;
