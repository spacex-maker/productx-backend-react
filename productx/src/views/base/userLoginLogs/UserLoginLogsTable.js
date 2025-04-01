import React, { useState } from 'react';
import { Tag, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import UserLoginLogDetail from './UserLoginLogDetail';

const UserLoginLogsTable = ({ data }) => {
  const { t } = useTranslation();
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const getStatusColor = (status) => {
    return status ? 'success' : 'error';
  };

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
            <th>{t('loginStatus')}</th>
            <th>{t('operation')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="record-font">
              <td>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.username}</div>
                  <div style={{ color: '#666', fontSize: '12px' }}>ID: {item.userId}</div>
                </div>
              </td>
              <td>{item.loginTime}</td>
              <td>{item.loginIp}</td>
              <td>
                <Tag color={getStatusColor(item.status)}>
                  {item.status ? t('success') : t('failed')}
                </Tag>
              </td>
              <td>
                <Button type="link" onClick={() => handleViewDetail(item)}>
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
