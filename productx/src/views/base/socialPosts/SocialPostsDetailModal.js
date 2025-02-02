import React from 'react';
import { Modal, Descriptions, Typography, Divider, Space } from 'antd';
import { 
  TwitterOutlined, 
  YoutubeOutlined, 
  RedditOutlined,
  UserOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { FaTelegram } from 'react-icons/fa';

const { Link } = Typography;

const SocialPostsDetailModal = ({
  isVisible,
  onCancel,
  post
}) => {
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Twitter':
        return <TwitterOutlined style={{ color: '#1DA1F2' }} />;
      case 'Telegram':
        return <FaTelegram style={{ color: '#0088cc' }} />;
      case 'YouTube':
        return <YoutubeOutlined style={{ color: '#FF0000' }} />;
      case 'Reddit':
        return <RedditOutlined style={{ color: '#FF4500' }} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <Space>
          {post && getPlatformIcon(post?.platform)}
          <span>帖子详情</span>
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {post && (
        <>
          <Descriptions column={2}>
            <Descriptions.Item 
              label={
                <Space>
                  <UserOutlined />
                  <span>账号名称</span>
                </Space>
              }
            >
              {post.authorName}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <FileTextOutlined />
                  <span>帖子类型</span>
                </Space>
              }
            >
              {post.postType}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <FileTextOutlined />
                  <span>帖子ID</span>
                </Space>
              }
            >
              {post.postId}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <LinkOutlined />
                  <span>帖子链接</span>
                </Space>
              }
            >
              <Link href={post.postUrl} target="_blank">
                {post.postUrl}
              </Link>
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: '12px 0' }} />

          <Descriptions column={1}>
            <Descriptions.Item 
              label={
                <Space>
                  <FileTextOutlined />
                  <span>帖子内容</span>
                </Space>
              }
              contentStyle={{ whiteSpace: 'pre-wrap' }}
            >
              {post.content}
            </Descriptions.Item>
          </Descriptions>

          <Divider style={{ margin: '12px 0' }} />

          <Descriptions column={2}>
            <Descriptions.Item 
              label={
                <Space>
                  <ClockCircleOutlined />
                  <span>创建时间</span>
                </Space>
              }
            >
              {post.createTime}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <ClockCircleOutlined />
                  <span>更新时间</span>
                </Space>
              }
            >
              {post.updateTime}
            </Descriptions.Item>
            <Descriptions.Item 
              label={
                <Space>
                  <ClockCircleOutlined />
                  <span>采集时间</span>
                </Space>
              }
            >
              {post.collectedAt}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default SocialPostsDetailModal; 