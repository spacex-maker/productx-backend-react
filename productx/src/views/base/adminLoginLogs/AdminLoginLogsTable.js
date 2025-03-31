import React from 'react';
import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const AdminLoginLogsTable = ({ data }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>{t('userInfo')}</th>
          <th>{t('loginTime')}</th>
          <th>{t('loginIp')}</th>
          <th>{t('loginStatus')}</th>
          <th>{t('failedAttempts')}</th>
          <th>{t('userAgent')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.username}</div>
                <div style={{ color: '#666', fontSize: '12px' }}>ID: {item.adminId}</div>
              </div>
            </td>
            <td>{item.loginTime}</td>
            <td>{item.loginIp}</td>
            <td>
              <Tag color={getStatusColor(item.loginStatus)}>
                {item.loginStatus === 'success' ? t('success') : t('failed')}
              </Tag>
            </td>
            <td>{item.failedAttempts}</td>
            <td>{item.userAgent}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminLoginLogsTable;
