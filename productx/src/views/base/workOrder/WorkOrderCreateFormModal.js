import React from 'react';
import { Modal, Form, Input, DatePicker, Switch } from 'antd';

const WorkOrderCreateFormModal = ({
                                    isVisible,
                                    onCancel,
                                    onFinish,
                                    form,
                                  }) => {
  return (
    <Modal
      title="新增工单(Create Work Order)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="工单标题(Work Order Title)"
          name="title"
          rules={[{ required: true, message: '请输入工单标题' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="工单描述(Description)"
          name="description"
          rules={[{ required: true, message: '请输入工单描述' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="创建时间(Creation Date)"
          name="createdAt"
          rules={[{ required: true, message: '请选择创建时间' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="是否启用(Enabled)"
          name="status"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WorkOrderCreateFormModal;
