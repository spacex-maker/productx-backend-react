import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const UpdateGlobalBankModal = ({
                           isVisible,
                           onCancel,
                           onOk,
                           form,
                           handleUpdateBank,
                           selectedBank // 用于传递选中的银行信息
                         }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedBank) {
      form.setFieldsValue({
        id: selectedBank.id,
        name: selectedBank.name,
        accountBank: selectedBank.accountBank,
        website: selectedBank.website,
        contactNumber: selectedBank.contactNumber,
      });
    }
  }, [isVisible, selectedBank, form]);

  return (
    <Modal
      title="修改银行信息"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateBank}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="银行名称"
          name="name"
          rules={[{ required: true, message: '请输入银行名称' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="开户行"
          name="accountBank"
          rules={[{ required: true, message: '请输入开户行' }]}
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

export default UpdateGlobalBankModal;
