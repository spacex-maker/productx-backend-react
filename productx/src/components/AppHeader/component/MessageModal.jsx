import React, { useState, useEffect } from 'react';
import { Modal, Table, Form, Select, DatePicker, Row, Col, Button, Tag, Badge, message, Typography, Space, Descriptions, Radio, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import moment from 'moment';
import styles from './MessageModal.module.scss';
import SendMessageModal from './SendMessageModal';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const UserInfo = ({ avatar, username }) => (
  <div className={styles.userInfo}>
    {avatar ? (
      <img 
        src={avatar} 
        alt="avatar" 
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          objectFit: 'cover',
          boxShadow: '0 0 8px rgba(135, 208, 104, 0.8)',
          border: '2px solid #87d068'
        }}
      />
    ) : (
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#87d068',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '16px',
        boxShadow: '0 0 8px rgba(135, 208, 104, 0.8)',
        border: '2px solid #87d068'
      }}>
        {username?.[0]?.toUpperCase()}
      </div>
    )}
    <span className={styles.username}>{username}</span>
  </div>
);

const MessageDetailModal = ({ visible, message, onCancel, onRead, messageType }) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={
        <Space size={4} className={styles.detailTitle}>
          <Text strong>{message?.title}</Text>
          {message?.isFlagged && <Tag color="red">{t('important')}</Tag>}
          {message?.createdBySystem && <Tag color="blue">{t('system')}</Tag>}
          {messageType === 'received' ? (
            !message?.isRead && <Badge status="processing" text={t('unread')} />
          ) : (
            <Badge
              status={message?.isRead ? 'success' : 'default'}
              text={message?.isRead ? t('readByReceiver') : t('unreadByReceiver')}
            />
          )}
          {message?.isRetracted && <Tag color="red">{t('retracted')}</Tag>}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          {t('close')}
        </Button>,
        messageType === 'received' && !message?.isRead && !message?.isRetracted && (
          <Button key="read" type="primary" onClick={() => onRead(message?.id)}>
            {t('markRead')}
          </Button>
        ),
      ].filter(Boolean)}
      width={600}
      className={styles.detailModal}
    >
      <div className={styles.messageDetail}>
        <div className={styles.messageHeader}>
          <div className={styles.messageInfo}>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Text type="secondary">{messageType === 'received' ? '发送人：' : '接收人：'}</Text>
                <UserInfo
                  avatar={messageType === 'received' ? message?.senderAvatar : message?.receiverAvatar}
                  username={messageType === 'received' ? message?.senderUsername : message?.receiverUsername}
                />
              </div>
              <div className={styles.infoItem}>
                <Text type="secondary">消息类型：</Text>
                <Tag>{message?.messageType}</Tag>
              </div>
              <div className={styles.infoItem}>
                <Text type="secondary">发送时间：</Text>
                <Text>{message?.createTime}</Text>
              </div>
              {message?.expiresAt && (
                <div className={styles.infoItem}>
                  <Text type="secondary">过期时间：</Text>
                  <Text>{message?.expiresAt}</Text>
                </div>
              )}
              <div className={styles.infoItem}>
                <Text type="secondary">查看次数：</Text>
                <Text>{message?.viewCount || 0}</Text>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.messageContent}>
          {message?.tags && JSON.parse(message.tags).length > 0 && (
            <div className={styles.messageTags}>
              <Space size={4}>
                <Text type="secondary">标签：</Text>
                {JSON.parse(message.tags).map((tag, index) => (
                  <Tag key={index} color="blue">{tag}</Tag>
                ))}
              </Space>
            </div>
          )}
          <div className={styles.messageText}>
            {message?.messageText}
          </div>
          {message?.attachments && JSON.parse(message.attachments).length > 0 && (
            <div className={styles.attachments}>
              <Text type="secondary">附件：</Text>
              <div className={styles.attachmentList}>
                {JSON.parse(message.attachments).map((attachment, index) => (
                  <Button
                    key={index}
                    type="link"
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    附件 {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

const MessageModal = ({ visible, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState('received'); // 'received' or 'sent'
  const [searchParams, setSearchParams] = useState({
    messageType: undefined,
    isRead: undefined,
    isFlagged: undefined,
    startTime: undefined,
    endTime: undefined,
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [sendMessageVisible, setSendMessageVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== undefined)
      );

      const url = messageType === 'received' ?
        '/manage/admin-messages/received' :
        '/manage/admin-messages/sent';

      const response = await api.get(url, {
        params: {
          currentPage,
          size: pageSize,
          ...filteredParams,
        },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    onCancel();
    onSuccess?.();
  };

  const handleRead = async (messageId) => {
    try {
      await api.post(`/manage/admin-messages/read/${messageId}`);
      message.success(t('markReadSuccess'));
      fetchMessages();
      setDetailVisible(false);
      onSuccess?.();
    } catch (error) {
      console.error('标记已读失败:', error);
      message.error(t('markReadFailed'));
    }
  };

  const handleViewDetail = (record) => {
    setSelectedMessage(record);
    setDetailVisible(true);
  };

  useEffect(() => {
    if (visible) {
      fetchMessages();
    }
  }, [visible, currentPage, pageSize, searchParams, messageType]);

  const columns = [
    {
      title: t('status'),
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          {messageType === 'received' ? (
            <Tooltip
              title={record.readAt ? `${t('readTime')}: ${record.readAt}` : null}
              mouseEnterDelay={0.5}
            >
              <Badge
                status={record.isRead ? 'default' : 'processing'}
                text={record.isRead ? t('read') : t('unread')}
                className={record.isRead ? styles.readStatus : ''}
              />
            </Tooltip>
          ) : (
            <Tooltip
              title={record.readAt ? `${t('readTime')}: ${record.readAt}` : null}
              mouseEnterDelay={0.5}
            >
              <Badge
                status={record.isRead ? 'success' : 'default'}
                text={record.isRead ? t('readByReceiver') : t('unreadByReceiver')}
                className={record.isRead ? styles.readStatus : ''}
              />
            </Tooltip>
          )}
          {record.isRetracted && <Tag color="red">{t('retracted')}</Tag>}
          {record.createdBySystem && <Tag color="blue">{t('system')}</Tag>}
        </Space>
      ),
    },
    {
      title: messageType === 'received' ? t('sender') : t('receiver'),
      key: 'user',
      width: 120,
      render: (_, record) => (
        messageType === 'received' ? (
          <UserInfo
            avatar={record.senderAvatar}
            username={record.senderUsername}
          />
        ) : (
          <UserInfo
            avatar={record.receiverAvatar}
            username={record.receiverUsername}
          />
        )
      ),
    },
    {
      title: t('title'),
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <Space size={4}>
          <span>{record.title}</span>
          {record.isFlagged && <Tag color="red">{t('important')}</Tag>}
        </Space>
      ),
    },
    {
      title: t('content'),
      key: 'messageText',
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.messageText}>
          <span>{record.messageText?.slice(0, 10)}{record.messageText?.length > 10 ? '...' : ''}</span>
        </Tooltip>
      ),
    },
    {
      title: t('time'),
      key: 'time',
      width: 165,
      render: (_, record) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {record.createTime}
        </Text>
      ),
    },
    {
      title: t('action'),
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            {t('view')}
          </Button>
          {messageType === 'received' && !record.isRead && !record.isRetracted && (
            <Button type="link" onClick={() => handleRead(record.id)}>
              {t('markRead')}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleSearch = (values) => {
    if (values.timeRange) {
      values.startTime = values.timeRange[0].format('YYYY-MM-DD HH:mm:ss');
      values.endTime = values.timeRange[1].format('YYYY-MM-DD HH:mm:ss');
      delete values.timeRange;
    }
    setSearchParams(values);
    setCurrent(1);
  };

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          {isMobile ? (
            // 移动端布局
            <div className={styles.mobileHeader}>
              <div className={styles.topSection}>
                <Text strong className={styles.modalTitle}>{t('messageList')}</Text>
                <Button type="primary" onClick={() => setSendMessageVisible(true)}>
                  {t('sendMessage')}
                </Button>
              </div>
              <div className={styles.bottomSection}>
                <Radio.Group
                  value={messageType}
                  onChange={(e) => {
                    setMessageType(e.target.value);
                    setCurrent(1);
                  }}
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="received">{t('receivedMessages')}</Radio.Button>
                  <Radio.Button value="sent">{t('sentMessages')}</Radio.Button>
                </Radio.Group>
              </div>
            </div>
          ) : (
            // 桌面端布局
            <div className={styles.desktopHeader}>
              <div className={styles.leftSection}>
                <Text strong className={styles.modalTitle}>{t('messageList')}</Text>
                <Radio.Group
                  value={messageType}
                  onChange={(e) => {
                    setMessageType(e.target.value);
                    setCurrent(1);
                  }}
                  buttonStyle="solid"
                >
                  <Radio.Button value="received">{t('receivedMessages')}</Radio.Button>
                  <Radio.Button value="sent">{t('sentMessages')}</Radio.Button>
                </Radio.Group>
              </div>
              <div className={styles.rightSection}>
                <Button type="primary" onClick={() => setSendMessageVisible(true)}>
                  {t('sendMessage')}
                </Button>
              </div>
            </div>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={isMobile ? '100%' : 900}
      className={styles.listModal}
      footer={null}
    >
      <div className={styles.searchSection}>
        <Form onFinish={handleSearch} layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%', marginBottom: 16 }}>
            <Col>
              <Form.Item name="messageType" label={t('messageType')}>
                <Select
                  style={{ width: 120 }}
                  allowClear
                  options={[
                    { label: t('text'), value: 'text' },
                    { label: t('system'), value: 'system' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="isRead" label={t('readStatus')}>
                <Select
                  style={{ width: 120 }}
                  allowClear
                  options={[
                    { label: t('read'), value: true },
                    { label: t('unread'), value: false },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="isFlagged" label={t('important')}>
                <Select
                  style={{ width: 120 }}
                  allowClear
                  options={[
                    { label: t('important'), value: true },
                    { label: t('normal'), value: false },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col flex="auto">
              <Form.Item name="timeRange" label={t('timeRange')}>
                <RangePicker
                  showTime
                  style={{ width: '100%', minWidth: '360px' }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                {t('search')}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalNum,
          onChange: (page, size) => {
            setCurrent(page);
            setPageSize(size);
          },
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `${t('quantity')} ${total}`,
        }}
        className={styles.messageTable}
      />

      <MessageDetailModal
        visible={detailVisible}
        message={selectedMessage}
        onCancel={() => setDetailVisible(false)}
        onRead={handleRead}
        messageType={messageType}
      />

      <SendMessageModal
        visible={sendMessageVisible}
        onCancel={() => setSendMessageVisible(false)}
        onSuccess={() => {
          fetchMessages();
          onSuccess?.();
        }}
      />
    </Modal>
  );
};

export default MessageModal;
