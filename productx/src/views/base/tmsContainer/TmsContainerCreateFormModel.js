import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';

const TmsContainerCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增集装箱"
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
          label="集装箱类型"
          name="containerType"
          rules={[{ required: true, message: '请输入集装箱类型' }]}
        >
          <Input placeholder="请输入集装箱类型" />
        </Form.Item>

        <Form.Item
          label="内部长度(mm)"
          name="internalLength"
          rules={[{ required: true, message: '请输入内部长度' }]}
        >
          <InputNumber placeholder="请输入内部长度" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="内部宽度(mm)"
          name="internalWidth"
          rules={[{ required: true, message: '请输入内部宽度' }]}
        >
          <InputNumber placeholder="请输入内部宽度" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="内部高度(mm)"
          name="internalHeight"
          rules={[{ required: true, message: '请输入内部高度' }]}
        >
          <InputNumber placeholder="请输入内部高度" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="外部长度(mm)"
          name="externalLength"
          rules={[{ required: true, message: '请输入外部长度' }]}
        >
          <InputNumber placeholder="请输入外部长度" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="外部宽度(mm)"
          name="externalWidth"
          rules={[{ required: true, message: '请输入外部宽度' }]}
        >
          <InputNumber placeholder="请输入外部宽度" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="外部高度(mm)"
          name="externalHeight"
          rules={[{ required: true, message: '请输入外部高度' }]}
        >
          <InputNumber placeholder="请输入外部高度" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="门宽(mm)"
          name="doorWidth"
          rules={[{ required: true, message: '请输入门宽' }]}
        >
          <InputNumber placeholder="请输入门宽" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="门高(mm)"
          name="doorHeight"
          rules={[{ required: true, message: '请输入门高' }]}
        >
          <InputNumber placeholder="请输入门高" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="体积(m³)"
          name="volume"
          rules={[{ required: true, message: '请输入体积' }]}
        >
          <InputNumber placeholder="请输入体积" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="最大载重(kg)"
          name="maxPayload"
          rules={[{ required: true, message: '请输入最大载重' }]}
        >
          <InputNumber placeholder="请输入最大载重" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="自重(kg)"
          name="tareWeight"
          rules={[{ required: true, message: '请输入自重' }]}
        >
          <InputNumber placeholder="请输入自重" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TmsContainerCreateFormModal;
