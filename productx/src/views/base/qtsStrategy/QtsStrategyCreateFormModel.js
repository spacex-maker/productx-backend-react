import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const QtsStrategyCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增策略"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
      width={800}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="策略名称"
          name="strategyName"
          rules={[{ required: true, message: '请输入策略名称' }]}
        >
          <Input placeholder="请输入策略名称" />
        </Form.Item>

        <Form.Item
          label="交易对"
          name="symbol"
          rules={[{ required: true, message: '请输入交易对' }]}
        >
          <Input placeholder="请输入交易对" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
        >
          <TextArea rows={4} placeholder="请输入策略描述" />
        </Form.Item>

        <Form.Item
          label="执行间隔"
          name="runInterval"
          rules={[{ required: true, message: '请输入执行间隔' }]}
        >
          <Input placeholder="请输入执行间隔" />
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
          initialValue={true}
        >
          <Select placeholder="请选择状态">
            <Option value={true}>启用</Option>
            <Option value={false}>禁用</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QtsStrategyCreateFormModal; 