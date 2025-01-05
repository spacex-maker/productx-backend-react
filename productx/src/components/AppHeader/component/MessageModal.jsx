import React, { useState, useEffect } from 'react';
import { Modal, Table, Form, Select, DatePicker, Row, Col, Button, Tag, Badge, message, Typography, Space, Descriptions, Radio, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import moment from 'moment';
import styles from './MessageModal.module.scss';
import SendMessageModal from './SendMessageModal';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const UserInfo = ({ avatar, username }) => (
  <div className={styles.userInfo}>
    {avatar ? (
      <img src={avatar} alt="avatar" className={styles.avatar} />
    ) : (
      <div className={styles.avatar} style={{ background: '#ccc' }}>
        {username?.[0]?.toUpperCase()}
      </div>
    )}
    <span className={styles.username}>{username}</span>
  </div>
);

const MessageDetailModal = ({ visible, message, onCancel, onRead, messageType }) => {
  return (
    <Modal
      title={
        <Space size="middle" className={styles.detailTitle}>
          <Text strong>{message?.title}</Text>
          {message?.isFlagged && <Tag color="red">重要</Tag>}
          {message?.createdBySystem && <Tag color="blue">系统</Tag>}
          {messageType === 'received' ? (
            !message?.isRead && <Badge status="processing" text="未读" />
          ) : (
            <Badge 
              status={message?.isRead ? 'success' : 'default'} 
              text={message?.isRead ? '对方已读' : '对方未读'} 
            />
          )}
          {message?.isRetracted && <Tag color="red">已撤回</Tag>}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        messageType === 'received' && !message?.isRead && !message?.isRetracted && (
          <Button key="read" type="primary" onClick={() => onRead(message?.id)}>
            标记已读
          </Button>
        ),
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
      width={700}
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
      message.success('标记已读成功');
      fetchMessages();
      setDetailVisible(false);
      onSuccess?.();
    } catch (error) {
      console.error('标记已读失败:', error);
      message.error('标记已读失败');
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
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Space size={4}>
          {messageType === 'received' ? (
            <Tooltip 
              title={record.readAt ? `读取时间：${record.readAt}` : null}
              mouseEnterDelay={0.5}
            >
              <Badge 
                status={record.isRead ? 'default' : 'processing'} 
                text={record.isRead ? '已读' : '未读'}
                className={record.isRead ? styles.readStatus : ''}
              />
            </Tooltip>
          ) : (
            <Tooltip 
              title={record.readAt ? `对方读取时间：${record.readAt}` : null}
              mouseEnterDelay={0.5}
            >
              <Badge 
                status={record.isRead ? 'success' : 'default'} 
                text={record.isRead ? '对方已读' : '对方未读'}
                className={record.isRead ? styles.readStatus : ''}
              />
            </Tooltip>
          )}
          {record.isRetracted && <Tag color="red">已撤回</Tag>}
          {record.createdBySystem && <Tag color="blue">系统</Tag>}
        </Space>
      ),
    },
    {
      title: messageType === 'received' ? '发送人' : '接收人',
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
      title: '标题',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <Space size={4}>
          <span>{record.title}</span>
          {record.isFlagged && <Tag color="red">重要</Tag>}
        </Space>
      ),
    },
    {
      title: '内容',
      key: 'messageText',
      ellipsis: true,
      render: (_, record) => (
        <Tooltip title={record.messageText}>
          <span>{record.messageText?.slice(0, 10)}{record.messageText?.length > 10 ? '...' : ''}</span>
        </Tooltip>
      ),
    },
    {
      title: '时间',
      key: 'time',
      width: 165,
      render: (_, record) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {record.createTime}
        </Text>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {messageType === 'received' && !record.isRead && !record.isRetracted && (
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleRead(record.id)}
            >
              标记已读
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
    <>
      <Modal
        title={
          <div className={styles.modalHeader}>
            <Space size="large">
              <Text strong className={styles.modalTitle}>消息列表</Text>
              <Radio.Group 
                value={messageType} 
                onChange={(e) => {
                  setMessageType(e.target.value);
                  setCurrent(1);
                }}
                buttonStyle="solid"
              >
                <Radio.Button value="received">收到的消息</Radio.Button>
                <Radio.Button value="sent">发送的消息</Radio.Button>
              </Radio.Group>
            </Space>
            <Button 
              type="primary" 
              onClick={() => setSendMessageVisible(true)}
            >
              发送消息
            </Button>
          </div>
        }
        open={visible}
        onCancel={onCancel}
        width={900}
        className={styles.listModal}
        footer={null}
      >
        <div className={styles.searchSection}>
          <Form
            onFinish={handleSearch}
            layout="inline"
            size="small"
          >
            <Row gutter={[16, 16]} style={{ width: '100%', marginBottom: 16 }}>
              <Col>
                <Form.Item name="messageType" label="消息类型">
                  <Select
                    style={{ width: 120 }}
                    allowClear
                    options={[
                      { label: '文本', value: 'text' },
                      { label: '系统', value: 'system' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="isRead" label="阅读状态">
                  <Select
                    style={{ width: 120 }}
                    allowClear
                    options={[
                      { label: '已读', value: true },
                      { label: '未读', value: false },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="isFlagged" label="重要标记">
                  <Select
                    style={{ width: 120 }}
                    allowClear
                    options={[
                      { label: '重要', value: true },
                      { label: '普通', value: false },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col flex="auto">
                <Form.Item name="timeRange" label="时间范围">
                  <RangePicker 
                    showTime 
                    style={{ width: '100%', minWidth: '360px' }} 
                  />
                </Form.Item>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
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
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="small"
          className={styles.messageTable}
        />
      </Modal>

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
    </>
  );
};

export default MessageModal; 