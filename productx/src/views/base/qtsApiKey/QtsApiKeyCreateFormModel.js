import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const QtsApiKeyCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增API密钥"
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
          label="交易所"
          name="exchangeName"
          rules={[{ required: true, message: '请输入交易所名称' }]}
        >
          <Input placeholder="请输入交易所名称" />
        </Form.Item>

        <Form.Item
          label="API密钥标识"
          name="apiKeyName"
          rules={[{ required: true, message: '请输入API密钥标识' }]}
        >
          <Input placeholder="请输入API密钥标识" />
        </Form.Item>

        <Form.Item
          label="API密钥"
          name="apiKey"
          rules={[{ required: true, message: '请输入API密钥' }]}
        >
          <Input placeholder="请输入API密钥" />
        </Form.Item>

        <Form.Item
          label="API密钥秘钥"
          name="apiSecret"
          rules={[{ required: true, message: '请输入API密钥秘钥' }]}
        >
          <Input.Password placeholder="请输入API密钥秘钥" />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <TextArea rows={4} placeholder="请输入备注" />
        </Form.Item>

        <Form.Item
          label="权限"
          name="permissions"
          rules={[{ required: true, message: '请输入权限' }]}
        >
          <Input placeholder="请输入权限，多个权限用逗号分隔" />
        </Form.Item>

        <Form.Item
          label="IP白名单"
          name="ipWhitelist"
        >
          <Input placeholder="请输入IP白名单，多个IP用逗号分隔" />
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

export default QtsApiKeyCreateFormModal; 