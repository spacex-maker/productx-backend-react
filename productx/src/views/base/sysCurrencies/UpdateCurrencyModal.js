import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const UpdateCurrencyModal = ({
                               isVisible,
                               onCancel,
                               onOk,
                               form,
                               handleUpdateCurrency,
                               selectedCurrency // 用于传递选中的货币信息
                             }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedCurrency) {
      form.setFieldsValue({
        id: selectedCurrency.id,
        name: selectedCurrency.name,
        code: selectedCurrency.code,
        exchangeRate: selectedCurrency.exchangeRate,
      });
    }
  }, [isVisible, selectedCurrency, form]);

  return (
    <Modal
      title="修改货币"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateCurrency}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="货币名称"
          name="name"
          rules={[{ required: true, message: '请输入货币名称' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="货币代码"
          name="code"
          rules={[{ required: true, message: '请输入货币代码' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="汇率"
          name="exchangeRate"
          rules={[{ required: true, message: '请输入汇率' }]}
          style={{ marginBottom: '8px' }} // 调整上下间距
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCurrencyModal;
