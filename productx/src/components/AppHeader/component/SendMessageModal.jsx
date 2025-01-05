import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, message, Upload, Button } from 'antd';
import { UploadOutlined, UserOutlined, FileTextOutlined, TagsOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import moment from 'moment';
import debounce from 'lodash/debounce';

const { TextArea } = Input;
const { Option } = Select;

const SendMessageModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [fetching, setFetching] = useState(false);

  // 使用 debounce 优化搜索请求
  const debouncedFetchManagers = debounce(async (search) => {
    if (!search) {
      setManagers([]);
      return;
    }

    setFetching(true);
    try {
      const response = await api.get('/manage/manager/list', {
        params: { username: search }
      });
      if (response?.data) {
        const formattedManagers = response.data.map(manager => ({
          label: manager.username,
          value: manager.id,
          avatar: manager.avatar,
        }));
        setManagers(formattedManagers);
      }
    } catch (error) {
      console.error('获取管理员列表失败:', error);
    } finally {
      setFetching(false);
    }
  }, 500);

  // 清理 debounce
  useEffect(() => {
    return () => {
      debouncedFetchManagers.cancel();
    };
  }, []);

  // 模态框关闭时重置状态
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setFileList([]);
      setManagers([]);
    }
  }, [visible]);

  const handleSearch = (search) => {
    debouncedFetchManagers(search);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // 处理附件列表
      const attachments = fileList.map(file => file.response?.url || file.url);
      
      // 处理过期时间
      const expiresAt = values.expiresAt ? 
        values.expiresAt.format('YYYY-MM-DD HH:mm:ss') : 
        undefined;

      await api.post('/manage/admin-messages/create', {
        ...values,
        attachments: JSON.stringify(attachments),
        tags: JSON.stringify(values.tags),
        expiresAt
      });

      message.success('发送成功');
      form.resetFields();
      setFileList([]);
      onSuccess?.();
      onCancel();
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error('发送失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  return (
    <Modal
      title="发送消息"
      open={visible}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="receiverId"
          label="接收人"
          rules={[{ required: true, message: '请选择接收人' }]}
        >
          <Select
            showSearch
            placeholder="搜索用户名"
            filterOption={false}
            onSearch={handleSearch}
            loading={fetching}
            options={managers}
            notFoundContent={fetching ? '加载中...' : (managers.length === 0 ? '未找到' : null)}
            allowClear
          >
            {managers.map(manager => (
              <Select.Option key={manager.value} value={manager.value}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {manager.avatar && (
                    <img 
                      src={manager.avatar} 
                      alt="avatar" 
                      style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }} 
                    />
                  )}
                  <span>{manager.label}</span>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label={
            <span>
              <FileTextOutlined /> 消息标题
            </span>
          }
          rules={[{ required: true, message: '请输入消息标题' }]}
        >
          <Input placeholder="请输入消息标题" maxLength={100} />
        </Form.Item>

        <Form.Item
          name="messageText"
          label={
            <span>
              <FileTextOutlined /> 消息内容
            </span>
          }
          rules={[{ required: true, message: '请输入消息内容' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="请输入消息内容"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="messageType"
          label="消息类型"
          initialValue="text"
        >
          <Select>
            <Option value="text">文本消息</Option>
            <Option value="system">系统消息</Option>
            <Option value="notification">通知</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tags"
          label={
            <span>
              <TagsOutlined /> 标签
            </span>
          }
        >
          <Select
            mode="tags"
            placeholder="输入标签后回车"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="expiresAt"
          label={
            <span>
              <ClockCircleOutlined /> 过期时间
            </span>
          }
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择过期时间"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="附件"
        >
          <Upload
            action="/api/upload" // 替换为实际的上传接口
            fileList={fileList}
            onChange={handleUploadChange}
            multiple
          >
            <Button icon={<UploadOutlined />}>上传附件</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SendMessageModal; 