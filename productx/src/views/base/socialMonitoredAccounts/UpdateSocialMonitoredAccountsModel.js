import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const UpdateSocialMonitoredAccountsModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateAccount,
  selectedAccount,
}) => {
  useEffect(() => {
    if (isVisible && selectedAccount) {
      form.setFieldsValue(selectedAccount);
    }
  }, [isVisible, selectedAccount, form]);

  return (
    <Modal
      title="修改监控账号"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form 
        form={form} 
        onFinish={handleUpdateAccount}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label="平台"
          name="platform"
          rules={[{ required: true, message: '请选择平台' }]}
        >
          <Select placeholder="请选择平台" disabled>
            <Option value="Twitter">Twitter</Option>
            <Option value="Telegram">Telegram</Option>
            <Option value="YouTube">YouTube</Option>
            <Option value="Reddit">Reddit</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="账号ID"
          name="accountId"
          rules={[{ required: true, message: '请输入账号ID' }]}
        >
          <Input placeholder="请输入账号ID" disabled />
        </Form.Item>

        <Form.Item
          label="账号名称"
          name="accountName"
          rules={[{ required: true, message: '请输入账号名称' }]}
        >
          <Input placeholder="请输入账号名称" />
        </Form.Item>

        <Form.Item
          label="账号链接"
          name="profileUrl"
          rules={[{ required: true, message: '请输入账号链接' }]}
        >
          <Input placeholder="请输入账号链接" />
        </Form.Item>

        <Form.Item
          label="账号描述"
          name="accountDescription"
        >
          <TextArea rows={4} placeholder="请输入账号描述" />
        </Form.Item>

        <Form.Item
          label="监控状态"
          name="status"
          rules={[{ required: true, message: '请选择监控状态' }]}
        >
          <Select placeholder="请选择监控状态">
            <Option value={true}>监控中</Option>
            <Option value={false}>已停止</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSocialMonitoredAccountsModal;
