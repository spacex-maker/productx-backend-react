import React, { useState } from 'react';
import { Tag, Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import UserLoginLogDetail from './UserLoginLogDetail';
import DefaultAvatar from 'src/components/DefaultAvatar';

const UserLoginLogsTable = ({ data }) => {
  const { t } = useTranslation();
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const getStatusColor = (status) => (status ? 'success' : 'error');
  const cell = (v) => (v != null && v !== '' ? String(v) : '—');

  const handleViewDetail = (record) => {
    setSelectedLog(record);
    setDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setSelectedLog(null);
  };

  return (
    <>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>{t('userInfo')}</th>
            <th>{t('loginTime')}</th>
            <th>{t('loginIp')}</th>
            <th>地点</th>
            <th>前端域名</th>
            <th>登录方式</th>
            <th>渠道</th>
            <th>设备类型</th>
            <th>国家</th>
            <th>设备/浏览器</th>
            <th>{t('loginStatus')}</th>
            <th>失败原因</th>
            <th>{t('operation')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="record-font">
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt=""
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                    />
                  ) : (
                    <DefaultAvatar name={item.username} size={36} />
                  )}
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.username || '—'}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>ID: {item.userId}</div>
                  </div>
                </div>
              </td>
              <td className="text-truncate">{item.loginTime || '—'}</td>
              <td className="text-truncate">{item.loginIp || '—'}</td>
              <td className="text-truncate" title={item.location}>{cell(item.location)}</td>
              <td className="text-truncate" title={item.frontendDomain}>{cell(item.frontendDomain)}</td>
              <td className="text-truncate">{cell(item.loginMethod)}</td>
              <td className="text-truncate">{cell(item.loginChannel)}</td>
              <td className="text-truncate">{cell(item.deviceType)}</td>
              <td className="text-truncate">{cell(item.countryCode)}</td>
              <td className="text-truncate">
                <Tooltip title={[item.device, item.browser].filter(Boolean).join(' | ') || '—'}>
                  <span>
                    {item.device ? (item.device.length > 20 ? item.device.slice(0, 20) + '…' : item.device) : ''}
                    {item.device && item.browser ? ' / ' : ''}
                    {item.browser ? (item.browser.length > 15 ? item.browser.slice(0, 15) + '…' : item.browser) : ''}
                    {!item.device && !item.browser ? '—' : ''}
                  </span>
                </Tooltip>
              </td>
              <td>
                <Tag color={getStatusColor(item.status)}>
                  {item.status ? t('success') : t('failed')}
                </Tag>
              </td>
              <td className="text-truncate" title={item.failReason}>
                {item.status ? '—' : (item.failReason || '—')}
              </td>
              <td>
                <Button type="link" size="small" onClick={() => handleViewDetail(item)}>
                  {t('viewDetail')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UserLoginLogDetail
        visible={detailVisible}
        onClose={handleCloseDetail}
        data={selectedLog}
      />
    </>
  );
};

export default UserLoginLogsTable;
