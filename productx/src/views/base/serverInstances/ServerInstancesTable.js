import React from 'react';
import { Button, Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const ServerInstancesTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusChange,
}) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'maintenance':
        return 'warning';
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
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          <th>{t('instanceName')}</th>
          <th>{t('host')}</th>
          <th>{t('status')}</th>
          <th>{t('os')}</th>
          <th>{t('region')}</th>
          <th>{t('instanceType')}</th>
          <th>{t('configuration')}</th>
          <th>{t('network')}</th>
          <th>{t('lastChecked')}</th>
          <th>{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`td_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td>
              <div style={{ marginBottom: '4px' }}>{item.instanceName}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{item.dns}</div>
            </td>
            <td>{item.host}</td>
            <td>
              <Tag color={getStatusColor(item.status)}>
                {t(item.status)}
              </Tag>
            </td>
            <td>{item.os}</td>
            <td>{item.region}</td>
            <td>{item.instanceType}</td>
            <td>
              <div>CPU: {item.cpuCores} {t('cores')}</div>
              <div>{t('memory')}: {item.memory}MB</div>
              <div>{t('disk')}: {item.diskSpace}GB</div>
            </td>
            <td>
              <div>{t('publicIp')}: {item.publicIp}</div>
              <div>{t('privateIp')}: {item.privateIp}</div>
              <div>{t('network')}: {item.network}</div>
            </td>
            <td>{moment(item.lastChecked).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
                <Button 
                  type="link" 
                  onClick={() => handleStatusChange(item.id, item.status === 'active' ? 'inactive' : 'active')}
                >
                  {item.status === 'active' ? t('disable') : t('enable')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ServerInstancesTable;
