import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { TwitterOutlined, YoutubeOutlined, RedditOutlined } from '@ant-design/icons';
import { FaTelegram } from 'react-icons/fa';

const { Option } = Select;
const { TextArea } = Input;

const SocialMonitoredAccountsCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  return (
    <Modal
      title="新增监控账号"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
    >
      <Form 
        form={form} 
        onFinish={onFinish}
      >
        <Form.Item
          label="平台"
          name="platform"
          rules={[{ required: true, message: '请选择平台' }]}
        >
          <Select placeholder="请选择平台">
            <Option value="Twitter">
              <TwitterOutlined style={{ color: '#1DA1F2', marginRight: 8 }} />
              Twitter
            </Option>
            <Option value="Telegram">
              <FaTelegram style={{ color: '#0088cc', marginRight: 8 }} />
              Telegram
            </Option>
            <Option value="YouTube">
              <YoutubeOutlined style={{ color: '#FF0000', marginRight: 8 }} />
              YouTube
            </Option>
            <Option value="Reddit">
              <RedditOutlined style={{ color: '#FF4500', marginRight: 8 }} />
              Reddit
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="账号ID"
          name="accountId"
          rules={[{ required: true, message: '请输入账号ID' }]}
        >
          <Input placeholder="请输入账号ID" />
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
          initialValue={true}
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

export default SocialMonitoredAccountsCreateFormModal;
