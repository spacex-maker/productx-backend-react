import React from 'react';
import { Modal, Descriptions, Tag, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ApiAccessLogDetailModal = ({ visible, onClose, data }) => {
  if (!data) return null;

  const renderJson = (str) => {
    if (!str) return '-';
    try {
      const parsed = typeof str === 'string' ? JSON.parse(str) : str;
      return (
        <pre style={{ margin: 0, fontSize: 12, maxHeight: 200, overflow: 'auto' }}>
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    } catch (e) {
      return str;
    }
  };

  return (
    <Modal
      title="API 访问日志详情"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
        <Descriptions.Item label="链路追踪ID">{data.traceId || '-'}</Descriptions.Item>
        <Descriptions.Item label="请求ID">{data.requestId || '-'}</Descriptions.Item>
        <Descriptions.Item label="子系统标识">{data.appCode || '-'}</Descriptions.Item>
        <Descriptions.Item label="接口路径">{data.apiPath || '-'}</Descriptions.Item>
        <Descriptions.Item label="接口版本">{data.apiVersion || '-'}</Descriptions.Item>
        <Descriptions.Item label="请求方法">
          <Tag>{data.method || '-'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="用户">
          {data.userId != null ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar src={data.avatar || undefined} icon={<UserOutlined />} size="small">
                {data.username?.[0]?.toUpperCase()}
              </Avatar>
              <div>
                <div>{data.username || '-'}</div>
                {data.nickname && <div style={{ fontSize: 12, color: '#888' }}>{data.nickname}</div>}
                <div style={{ fontSize: 12, color: '#999' }}>ID: {data.userId}</div>
              </div>
            </div>
          ) : (
            '—'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="访问者IP">{data.clientIp || '-'}</Descriptions.Item>
        <Descriptions.Item label="地域">{data.region || '-'}</Descriptions.Item>
        <Descriptions.Item label="前端域名">{data.frontendDomain || '-'}</Descriptions.Item>
        <Descriptions.Item label="User-Agent">
          <span style={{ wordBreak: 'break-all' }}>{data.userAgent || '-'}</span>
        </Descriptions.Item>
        <Descriptions.Item label="状态码">{data.statusCode}</Descriptions.Item>
        <Descriptions.Item label="耗时(ms)">{data.duration}</Descriptions.Item>
        <Descriptions.Item label="请求参数">{renderJson(data.requestParams)}</Descriptions.Item>
        <Descriptions.Item label="错误信息">
          {data.errorMsg ? (
            <span style={{ color: '#ff4d4f', wordBreak: 'break-all' }}>{data.errorMsg}</span>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="访问时间">{data.createTime || '-'}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{data.updateTime || '-'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ApiAccessLogDetailModal;
