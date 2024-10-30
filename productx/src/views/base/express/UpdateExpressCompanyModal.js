import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateExpressCompanyModal = ({
                                     isVisible,
                                     onCancel,
                                     onOk,
                                     form,
                                     handleUpdateExpressCompany,
                                     selectedExpressCompany // 用于传递选中的快递公司信息
                                   }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedExpressCompany) {
      form.setFieldsValue({
        id: selectedExpressCompany.id,
        name: selectedExpressCompany.name,
        trackingNumberFormat: selectedExpressCompany.trackingNumberFormat,
        website: selectedExpressCompany.website,
        contactNumber: selectedExpressCompany.contactNumber,
      });
    }
  }, [isVisible, selectedExpressCompany, form]);

  return (
    <Modal
      title="修改快递公司"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateExpressCompany}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="快递公司名称"
          name="name"
          rules={[{ required: true, message: '请输入快递公司名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="运单格式"
          name="trackingNumberFormat"
          rules={[{ required: true, message: '请输入运单格式' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="官网网址"
          name="website"
          rules={[{ required: true, message: '请输入官网网址' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="联系电话"
          name="contactNumber"
          rules={[{ required: true, message: '请输入联系电话' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateExpressCompanyModal;
