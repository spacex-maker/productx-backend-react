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

  const extractSentimentScore = (score) => {
    if (score === null || score === undefined) return null;
    
    // 如果是数字类型，直接返回
    if (typeof score === 'number') return score;
    
    // 处理字符串类型
    if (typeof score === 'string') {
      // 如果包含冒号，提取冒号后的数字
      if (score.includes(':')) {
        const [, value] = score.split(':');
        return Number(value);
      }
      // 否则尝试直接转换为数字
      return Number(score);
    }
    
    return null;
  };

  const getSentimentColor = (score) => {
    const numScore = extractSentimentScore(score);
    if (numScore === null || isNaN(numScore)) return '#999';
    if (numScore >= 0.7) return '#52c41a';
    if (numScore >= 0.3) return '#1890ff';
    if (numScore >= -0.3) return '#faad14';
    if (numScore >= -0.7) return '#fa8c16';
    return '#f5222d';
  };

  const formatSentimentScore = (score) => {
    const numScore = extractSentimentScore(score);
    if (numScore === null || isNaN(numScore)) return 'N/A';
    return numScore.toFixed(2);
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
                  <FileTextOutlined />
                  <span>情绪得分</span>
                </Space>
              }
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px' 
              }}>
                <div style={{
                  width: '50px',
                  height: '24px',
                  backgroundColor: getSentimentColor(post.sentimentScore),
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px'
                }}>
                  {formatSentimentScore(post.sentimentScore)}
                </div>
              </div>
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