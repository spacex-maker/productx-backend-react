import React from 'react';
import { Modal, Form, Input } from 'antd';

const ExpressCompanyCreateFormModal = ({
                                         isVisible,
                                         onCancel,
                                         onFinish,
                                         form,
                                       }) => {
  return (
    <Modal
      title="新增快递公司(Create Express Company)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="快递公司名称(Company Name)"
          name="name"
          rules={[{ required: true, message: '请输入快递公司名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="运单格式(Tracking Number Format)"
          name="trackingNumberFormat"
          rules={[{ required: true, message: '请输入运单格式(如：^\\d{12}$)' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="官网网址(Website)"
          name="website"
          rules={[{ required: true, message: '请输入官网网址' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="联系电话(Contact Number)"
          name="contactNumber"
          rules={[{ required: true, message: '请输入联系电话' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExpressCompanyCreateFormModal;
