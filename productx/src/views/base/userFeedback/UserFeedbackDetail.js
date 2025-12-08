import React, { useState } from 'react';
import { Descriptions, Tag, Button, Input, Space, message, Modal, List, Card, theme, Image } from 'antd';
import { PaperClipOutlined, DownloadOutlined, EyeOutlined, FileImageOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

const UserFeedbackDetail = ({ feedback, onReply, onStatusChange, t }) => {
  const { t: translate } = useTranslation();
  const { token } = theme.useToken();
  const [replyVisible, setReplyVisible] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const getFeedbackTypeLabel = (type) => {
    const typeMap = {
      'suggestion': t('suggestion'),
      'bug': t('bug'),
      'question': t('question'),
      'other': t('other')
    };
    return typeMap[type] || type;
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      'LOW': 'default',
      'MEDIUM': 'processing',
      'HIGH': 'error'
    };
    return colorMap[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'default',
      'PROCESSING': 'processing',
      'RESOLVED': 'success',
      'CLOSED': 'error'
    };
    return colorMap[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': t('pending'),
      'PROCESSING': t('processing'),
      'RESOLVED': t('resolved'),
      'CLOSED': t('closed')
    };
    return statusMap[status] || status;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  // 判断是否为图片文件
  const isImageFile = (attachment) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'];
    const extension = attachment.fileExtension?.toLowerCase();
    if (extension && imageExtensions.includes(extension)) {
      return true;
    }
    // 也可以通过 fileType 判断
    if (attachment.fileType && attachment.fileType.startsWith('image/')) {
      return true;
    }
    return false;
  };

  const handleReplySubmit = () => {
    if (!replyContent.trim()) {
      message.warning(t('pleaseInputReplyContent'));
      return;
    }
    onReply(feedback.id, replyContent);
    setReplyVisible(false);
    setReplyContent('');
  };

  return (
    <div>
      <Descriptions bordered column={2}>
        <Descriptions.Item label={t('feedbackId')}>{feedback.id}</Descriptions.Item>
        <Descriptions.Item label={t('userId')}>{feedback.userId || t('anonymous')}</Descriptions.Item>
        <Descriptions.Item label={t('feedbackType')}>
          {getFeedbackTypeLabel(feedback.feedbackType)}
        </Descriptions.Item>
        <Descriptions.Item label={t('priority')}>
          <Tag color={getPriorityColor(feedback.priority)}>
            {feedback.priority}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t('processingStatus')}>
          <Tag color={getStatusColor(feedback.status)}>
            {getStatusLabel(feedback.status)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label={t('contact')}>{feedback.contact || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('feedbackTitle')} span={2}>
          {feedback.title}
        </Descriptions.Item>
        <Descriptions.Item label={t('feedbackContent')} span={2}>
          <div style={{ whiteSpace: 'pre-wrap', maxHeight: '200px', overflow: 'auto' }}>
            {feedback.content}
          </div>
        </Descriptions.Item>
        {feedback.adminReply && (
          <>
            <Descriptions.Item label={t('adminReply')} span={2}>
              <div style={{ whiteSpace: 'pre-wrap', maxHeight: '200px', overflow: 'auto' }}>
                {feedback.adminReply}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label={t('adminReplyTime')}>
              {feedback.adminReplyTime || '-'}
            </Descriptions.Item>
          </>
        )}
        <Descriptions.Item label={t('createTime')}>{feedback.createTime}</Descriptions.Item>
        <Descriptions.Item label={t('updateTime')}>{feedback.updateTime || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('createdBy')}>{feedback.createBy || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('updatedBy')}>{feedback.updateBy || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('attachmentList')} span={2}>
          {feedback.attachments && feedback.attachments.length > 0 ? (
            <Card 
              size="small" 
              style={{ marginTop: '8px', background: token.colorFillQuaternary }}
              bodyStyle={{ padding: '12px' }}
            >
              <List
                dataSource={feedback.attachments}
                renderItem={(attachment) => {
                  const isImage = isImageFile(attachment);
                  return (
                    <List.Item
                      style={{ 
                        padding: '12px',
                        border: `1px solid ${token.colorBorderSecondary}`,
                        borderRadius: '6px',
                        marginBottom: '8px',
                        background: token.colorBgContainer
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          isImage ? (
                            <FileImageOutlined 
                              style={{ 
                                fontSize: '20px', 
                                color: token.colorPrimary,
                                marginTop: '4px'
                              }} 
                            />
                          ) : (
                            <PaperClipOutlined 
                              style={{ 
                                fontSize: '20px', 
                                color: token.colorPrimary,
                                marginTop: '4px'
                              }} 
                            />
                          )
                        }
                        title={
                          <a 
                            href={attachment.filePath} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              fontSize: '14px',
                              fontWeight: 500,
                              color: token.colorPrimary
                            }}
                          >
                            {attachment.fileName}
                          </a>
                        }
                        description={
                          <div style={{ marginTop: '4px' }}>
                            <Tag color="blue" style={{ marginRight: '8px' }}>
                              {attachment.fileExtension?.toUpperCase() || 'FILE'}
                            </Tag>
                            <span style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
                              {formatFileSize(attachment.fileSize)}
                            </span>
                            {attachment.fileType && (
                              <span style={{ color: token.colorTextTertiary, fontSize: '12px', marginLeft: '8px' }}>
                                {attachment.fileType}
                              </span>
                            )}
                            {isImage && (
                              <div style={{ marginTop: '8px' }}>
                                <Image
                                  src={attachment.filePath}
                                  alt={attachment.fileName}
                                  width={120}
                                  height={120}
                                  style={{
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: `1px solid ${token.colorBorderSecondary}`,
                                    cursor: 'pointer',
                                    backgroundColor: token.colorFillQuaternary
                                  }}
                                  preview={{
                                    src: attachment.filePath,
                                    mask: t('clickToPreview'),
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        }
                      />
                      <Space>
                        {!isImage && (
                          <Button
                            type="link"
                            icon={<EyeOutlined />}
                            href={attachment.filePath}
                            target="_blank"
                            size="small"
                          >
                            {t('preview')}
                          </Button>
                        )}
                        <Button
                          type="link"
                          icon={<DownloadOutlined />}
                          href={attachment.filePath}
                          download
                          size="small"
                        >
                          {t('download')}
                        </Button>
                      </Space>
                    </List.Item>
                  );
                }}
              />
            </Card>
          ) : (
            <span style={{ color: token.colorTextTertiary }}>{t('noAttachments')}</span>
          )}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Space>
          <Button 
            type="primary" 
            onClick={() => setReplyVisible(true)}
            disabled={feedback.status === 'CLOSED'}
          >
            {t('replyFeedback')}
          </Button>
          <Button 
            onClick={() => {
              const newStatus = feedback.status === 'RESOLVED' ? 'CLOSED' : 'RESOLVED';
              onStatusChange(feedback.id, newStatus);
            }}
          >
            {feedback.status === 'RESOLVED' ? t('closeFeedback') : t('markResolved')}
          </Button>
        </Space>
      </div>

      <Modal
        title={t('replyFeedback')}
        open={replyVisible}
        onOk={handleReplySubmit}
        onCancel={() => {
          setReplyVisible(false);
          setReplyContent('');
        }}
        okText={t('confirm')}
        cancelText={t('cancel')}
      >
        <TextArea
          rows={6}
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder={t('pleaseInputReplyContent')}
        />
      </Modal>
    </div>
  );
};

export default UserFeedbackDetail;

