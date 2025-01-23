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
    <div className={styles.avatarWrapper}>
      {avatar ? (
        <img 
          src={avatar} 
          alt="avatar" 
        />
      ) : (
        <div className={styles.avatarPlaceholder}>
          {username?.[0]?.toUpperCase()}
        </div>
      )}
    </div>
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

const SearchForm = ({ onFinish }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Form onFinish={onFinish} layout="inline" form={form}>
      <Row gutter={[16, 16]} style={{ width: '100%', marginBottom: 16 }}>
        <Col xs={12} sm={8}>
          <Form.Item 
            name="messageType" 
            label={!isMobile ? t('messageType') : ''}
            style={{ width: '100%' }}
          >
            <Select
              style={{ width: '100%' }}
              allowClear
              placeholder={t('messageType')}
              options={[
                { label: t('text'), value: 'text' },
                { label: t('system'), value: 'system' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8}>
          <Form.Item 
            name="isRead" 
            label={!isMobile ? t('readStatus') : ''}
            style={{ width: '100%' }}
          >
            <Select
              style={{ width: '100%' }}
              allowClear
              placeholder={t('readStatus')}
              options={[
                { label: t('read'), value: true },
                { label: t('unread'), value: false },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8}>
          <Form.Item 
            name="isFlagged" 
            label={!isMobile ? t('important') : ''}
            style={{ width: '100%' }}
          >
            <Select
              style={{ width: '100%' }}
              allowClear
              placeholder={t('important')}
              options={[
                { label: t('important'), value: true },
                { label: t('normal'), value: false },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={18} sm={16}>
          <Form.Item 
            name="timeRange" 
            label={!isMobile ? t('timeRange') : ''}
            style={{ width: '100%' }}
          >
            <RangePicker
              showTime
              style={{ width: '100%' }}
              placeholder={[t('startTime'), t('endTime')]}
            />
          </Form.Item>
        </Col>
        <Col xs={6} sm={8}>
          <Form.Item style={{ width: '100%', textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              {!isMobile && t('search')}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
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
      width: 120,
      render: (_, record) => (
        <div className={styles.statusColumn}>
          {messageType === 'received' ? (
            <div className={styles.statusWrapper}>
              <div className={styles.statusBadge}>
                <Tooltip
                  title={record.readAt ? `${t('readTime')}: ${record.readAt}` : null}
                  mouseEnterDelay={0.5}
                >
                  <Badge
                    status={record.isRead ? 'default' : 'processing'}
                    text={record.isRead ? t('read') : t('unread')}
                    className={record.isRead ? styles.readStatus : styles.unreadStatus}
                  />
                </Tooltip>
                {!record.isRead && !record.isRetracted && (
                  <Button 
                    type="link" 
                    size="small" 
                    className={styles.markReadButton}
                    onClick={() => handleRead(record.id)}
                  >
                    {t('markRead')}
                  </Button>
                )}
              </div>
              <div className={styles.tags}>
                {record.isRetracted && <Tag color="red">{t('retracted')}</Tag>}
                {record.createdBySystem && <Tag color="blue">{t('system')}</Tag>}
              </div>
            </div>
          ) : (
            <div className={styles.statusWrapper}>
              <div className={styles.statusBadge}>
                <Tooltip
                  title={record.readAt ? `${t('readTime')}: ${record.readAt}` : null}
                  mouseEnterDelay={0.5}
                >
                  <Badge
                    status={record.isRead ? 'success' : 'default'}
                    text={record.isRead ? t('readByReceiver') : t('unreadByReceiver')}
                    className={record.isRead ? styles.readStatus : styles.unreadStatus}
                  />
                </Tooltip>
              </div>
              <div className={styles.tags}>
                {record.isRetracted && <Tag color="red">{t('retracted')}</Tag>}
                {record.createdBySystem && <Tag color="blue">{t('system')}</Tag>}
              </div>
            </div>
          )}
        </div>
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
      width: 80,
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          {t('view')}
        </Button>
      ),
    },
  ];

  const handleSearch = (values) => {
    const params = { ...values };
    
    // 处理时间范围，直接传递 moment 对象
    if (values.timeRange) {
      const [start, end] = values.timeRange;
      params.startTime = start.toDate(); // 转换为 JavaScript Date 对象
      params.endTime = end.toDate();     // 转换为 JavaScript Date 对象
      delete params.timeRange;
    }

    setSearchParams(params);
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
        <SearchForm onFinish={handleSearch} />
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
