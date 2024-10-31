import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import WorkOrderStatus from './WorkOrderStatus'; // 确保导入 WorkOrderStatus

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
          label="工单状态(Status)"
          name="status"
          rules={[{ required: true, message: '请选择工单状态' }]}
          style={{ marginBottom: '8px' }}
        >
          <Select placeholder="请选择工单状态">
            {Object.values(WorkOrderStatus).map((status) => (
              <Select.Option key={status.value} value={status.value}>
                {status.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateWorkOrderModal;
