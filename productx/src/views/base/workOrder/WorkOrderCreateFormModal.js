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
      </Form>
    </Modal>
  );
};

export default WorkOrderCreateFormModal;
