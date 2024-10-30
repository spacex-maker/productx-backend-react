import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateCountryModal = ({
                              isVisible,
                              onCancel,
                              onOk,
                              form,
                              handleUpdateCountry,
                              selectedCountry // 用于传递选中的国家信息
                            }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedCountry) {
      form.setFieldsValue({
        id: selectedCountry.id,
        countryName: selectedCountry.name,
        countryCode: selectedCountry.code,
        continent: selectedCountry.continent,
      });
    }
  }, [isVisible, selectedCountry, form]);

  return (
    <Modal
      title="修改国家"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateCountry}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="国家名称(country name)"
          name="countryName"
          rules={[{ required: true, message: '请输入国家名称' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="国家代码(country code)"
          name="countryCode"
          rules={[{ required: true, message: '请输入国家代码' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="大陆(continent)"
          name="continent"
          rules={[{ required: true, message: '请输入大陆' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCountryModal;
