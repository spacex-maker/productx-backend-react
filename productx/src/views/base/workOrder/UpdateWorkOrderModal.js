import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Switch } from 'antd';

const UpdateWorkOrderModal = ({
                                isVisible,
                                onCancel,
                                onOk,
                                form,
                                handleUpdateWorkOrder,
                                selectedWorkOrder // 用于传递选中的工单信息
                              }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedWorkOrder) {
      form.setFieldsValue({
        id: selectedWorkOrder.id,
        title: selectedWorkOrder.title,
        description: selectedWorkOrder.description,
        createdAt: selectedWorkOrder.createdAt,
        status: selectedWorkOrder.status,
      });
    }
  }, [isVisible, selectedWorkOrder, form]);

  return (
    <Modal
      title="修改工单(Update Work Order)"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateWorkOrder}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="工单标题(Work Order Title)"
          name="title"
          rules={[{ required: true, message: '请输入工单标题' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="工单描述(Description)"
          name="description"
          rules={[{ required: true, message: '请输入工单描述' }]}
          style={{ marginBottom: '8px' }}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="创建时间(Creation Date)"
          name="createdAt"
          rules={[{ required: true, message: '请选择创建时间' }]}
          style={{ marginBottom: '8px' }}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="是否启用(Enabled)"
          name="status"
          valuePropName="checked"
          style={{ marginBottom: '8px' }}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateWorkOrderModal;
