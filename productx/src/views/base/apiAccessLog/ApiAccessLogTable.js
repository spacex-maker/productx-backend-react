import React, { useState } from 'react';
import { Tag, Tooltip, Button, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import ApiAccessLogDetailModal from './ApiAccessLogDetailModal';

const ApiAccessLogTable = ({ data, onRefresh }) => {
  const { t } = useTranslation();
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const getStatusCodeTag = (code) => {
    if (code >= 200 && code < 300) return <Tag color="success">{code}</Tag>;
    if (code >= 400 && code < 500) return <Tag color="warning">{code}</Tag>;
    if (code >= 500) return <Tag color="error">{code}</Tag>;
    return <Tag>{code}</Tag>;
  };

  const renderJsonPreview = (str) => {
    if (!str) return '-';
    try {
      const parsed = typeof str === 'string' ? JSON.parse(str) : str;
      const text = JSON.stringify(parsed);
      const short = text.length > 40 ? text.slice(0, 40) + '...' : text;
      return (
        <Tooltip title={<pre style={{ margin: 0, maxWidth: 400 }}>{JSON.stringify(parsed, null, 2)}</pre>}>
          <span style={{ cursor: 'pointer', color: '#1890ff' }}>{short}</span>
        </Tooltip>
      );
    } catch (e) {
      return str.length > 40 ? str.slice(0, 40) + '...' : str;
    }
  };

  const handleViewDetail = (record) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  return (
    <>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th style={{ minWidth: 160 }}>用户</th>
            <th>ID</th>
            <th>链路ID</th>
            <th>请求ID</th>
            <th>子系统</th>
            <th style={{ minWidth: 220 }}>接口路径</th>
            <th style={{ minWidth: 140 }}>方法 / IP / 来源</th>
            <th>状态码</th>
            <th>耗时(ms)</th>
            <th>请求参数</th>
            <th>错误信息</th>
            <th>访问时间</th>
            <th>{t('operation') || '操作'}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="record-font">
              <td style={{ minWidth: 160 }}>
                {item.userId != null ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap' }}>
                    <Avatar
                      src={item.avatar || undefined}
                      icon={<UserOutlined />}
                      size="small"
                      style={{ flexShrink: 0 }}
                    >
                      {item.username?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.username || '-'}
                      </div>
                      {item.nickname ? (
                        <div style={{ fontSize: 12, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.nickname}
                        </div>
                      ) : null}
                      <div style={{ fontSize: 12, color: '#999' }}>ID: {item.userId}</div>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#999' }}>—</span>
                )}
              </td>
              <td className="text-truncate">{item.id}</td>
              <td className="text-truncate" title={item.traceId}>
                {item.traceId || '-'}
              </td>
              <td className="text-truncate" title={item.requestId}>
                {item.requestId ? item.requestId.slice(0, 16) + (item.requestId.length > 16 ? '...' : '') : '-'}
              </td>
              <td className="text-truncate">{item.appCode || '-'}</td>
              <td style={{ minWidth: 220, wordBreak: 'break-all', whiteSpace: 'normal' }}>
                {item.apiPath || '-'}
              </td>
              <td style={{ minWidth: 140 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div>
                    <Tag>{item.method || '-'}</Tag>
                  </div>
                  <div style={{ fontSize: 12, color: '#555', display: 'flex', gap: 8, flexWrap: 'nowrap' }} title={`IP: ${item.clientIp || ''} | 地域: ${item.region || ''}`}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                      IP: {item.clientIp || '—'}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, color: '#888' }}>
                      地域: {item.region || '—'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }} title={item.frontendDomain}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {item.frontendDomain || '—'}
                    </span>
                  </div>
                </div>
              </td>
              <td>{getStatusCodeTag(item.statusCode)}</td>
              <td className="text-truncate">{item.duration ?? '-'}</td>
              <td className="text-truncate">{renderJsonPreview(item.requestParams)}</td>
              <td className="text-truncate" title={item.errorMsg}>
                {item.errorMsg ? (
                  <span style={{ color: '#ff4d4f' }}>
                    {item.errorMsg.length > 30 ? item.errorMsg.slice(0, 30) + '...' : item.errorMsg}
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td className="text-truncate">{item.createTime || '-'}</td>
              <td>
                <Button type="link" size="small" onClick={() => handleViewDetail(item)}>
                  {t('viewDetail') || '详情'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ApiAccessLogDetailModal
        visible={detailVisible}
        onClose={() => {
          setDetailVisible(false);
          setSelectedRecord(null);
        }}
        data={selectedRecord}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default ApiAccessLogTable;
