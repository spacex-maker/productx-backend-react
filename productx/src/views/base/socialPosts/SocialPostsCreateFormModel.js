import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { 
  TwitterOutlined, 
  YoutubeOutlined, 
  RedditOutlined,
} from '@ant-design/icons';
import { FaTelegram } from 'react-icons/fa';

const { Option } = Select;
const { TextArea } = Input;

const SocialPostsCreateFormModal = ({
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
  ];

  const postTypeOptions = [
    { value: 'TEXT', label: '文本', color: 'blue' },
    { value: 'IMAGE', label: '图片', color: 'green' },
    { value: 'VIDEO', label: '视频', color: 'purple' },
    { value: 'LINK', label: '链接', color: 'orange' },
  ];

  return (
    <Modal
      title="新增帖子"
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
          label="账号名称"
          name="authorName"
          rules={[{ required: true, message: '请输入账号名称' }]}
        >
          <Input placeholder="请输入账号名称" />
        </Form.Item>

        <Form.Item
          label="帖子类型"
          name="postType"
          rules={[{ required: true, message: '请选择帖子类型' }]}
        >
          <Select placeholder="请选择帖子类型">
            {postTypeOptions.map(type => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="帖子内容"
          name="content"
          rules={[{ required: true, message: '请输入帖子内容' }]}
        >
          <TextArea rows={4} placeholder="请输入帖子内容" />
        </Form.Item>

        <Form.Item
          label="帖子链接"
          name="postUrl"
          rules={[{ required: true, message: '请输入帖子链接' }]}
        >
          <Input placeholder="请输入帖子链接" />
        </Form.Item>

        <Form.Item
          label="发布状态"
          name="status"
          rules={[{ required: true, message: '请选择发布状态' }]}
          initialValue={true}
        >
          <Select placeholder="请选择发布状态">
            <Option value={true}>已发布</Option>
            <Option value={false}>未发布</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SocialPostsCreateFormModal;
