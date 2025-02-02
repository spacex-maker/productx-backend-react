import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { 
  TwitterOutlined, 
  YoutubeOutlined, 
  RedditOutlined,
  InstagramOutlined,
  FacebookOutlined,
  LinkedinOutlined,
  GithubOutlined,
  MediumOutlined,
  WeiboOutlined
} from '@ant-design/icons';
import { 
  FaTelegram, 
  FaDiscord, 
  FaTiktok, 
  FaWhatsapp,
  FaSlack,
  FaPinterest,
  FaSnapchat
} from 'react-icons/fa';
import { SiSubstack } from 'react-icons/si';

const { Option } = Select;
const { TextArea } = Input;

const SocialMonitoredAccountsCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const platformOptions = [
    { value: 'Twitter', icon: <TwitterOutlined style={{ color: '#1DA1F2' }} /> },
    { value: 'Telegram', icon: <FaTelegram style={{ color: '#0088cc' }} /> },
    { value: 'YouTube', icon: <YoutubeOutlined style={{ color: '#FF0000' }} /> },
    { value: 'Reddit', icon: <RedditOutlined style={{ color: '#FF4500' }} /> },
    { value: 'Discord', icon: <FaDiscord style={{ color: '#5865F2' }} /> },
    { value: 'Instagram', icon: <InstagramOutlined style={{ color: '#E4405F' }} /> },
    { value: 'Facebook', icon: <FacebookOutlined style={{ color: '#1877F2' }} /> },
    { value: 'LinkedIn', icon: <LinkedinOutlined style={{ color: '#0A66C2' }} /> },
    { value: 'TikTok', icon: <FaTiktok style={{ color: '#000000' }} /> },
    { value: 'GitHub', icon: <GithubOutlined style={{ color: '#181717' }} /> },
    { value: 'Medium', icon: <MediumOutlined style={{ color: '#000000' }} /> },
    { value: 'WhatsApp', icon: <FaWhatsapp style={{ color: '#25D366' }} /> },
    { value: 'Slack', icon: <FaSlack style={{ color: '#4A154B' }} /> },
    { value: 'Pinterest', icon: <FaPinterest style={{ color: '#BD081C' }} /> },
    { value: 'Snapchat', icon: <FaSnapchat style={{ color: '#FFFC00' }} /> },
    { value: 'Weibo', icon: <WeiboOutlined style={{ color: '#E6162D' }} /> },
    { value: 'Substack', icon: <SiSubstack style={{ color: '#FF6719' }} /> },
  ];

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
          <Select 
            placeholder="请选择平台"
            showSearch
            optionFilterProp="children"
          >
            {platformOptions.map(platform => (
              <Option key={platform.value} value={platform.value}>
                {React.cloneElement(platform.icon, { 
                  style: { 
                    ...platform.icon.props.style,
                    marginRight: 8 
                  }
                })}
                {platform.value}
              </Option>
            ))}
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
