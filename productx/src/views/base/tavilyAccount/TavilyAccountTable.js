import React from 'react';
import { Button, Tag, Space } from 'antd';
import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const TavilyAccountTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleSyncAccount,
  syncingIds,
  t
}) => {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th style={{ width: '50px' }}>
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
          <th style={{ width: '120px' }}>{t('apiKey') || 'API Key'}</th>
          <th style={{ width: '150px' }}>{t('accountAlias') || '账号别名'}</th>
          <th style={{ width: '100px' }}>{t('currentPlan') || '套餐计划'}</th>
          <th style={{ width: '100px' }}>{t('keyUsage') || 'Key用量'}</th>
          <th style={{ width: '100px' }}>{t('keyLimit') || 'Key限额'}</th>
          <th style={{ width: '100px' }}>{t('planUsage') || '计划用量'}</th>
          <th style={{ width: '100px' }}>{t('planLimit') || '计划限额'}</th>
          <th style={{ width: '80px' }}>{t('status') || '状态'}</th>
          <th style={{ width: '150px' }}>{t('lastCheckTime') || '最后检查时间'}</th>
          <th style={{ width: '150px' }}>{t('createTime') || '创建时间'}</th>
          <th className="fixed-column" style={{ width: '100px' }}>{t('operations') || '操作'}</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>
              {t('noData') || '暂无数据'}
            </td>
          </tr>
        ) : (
          data.map((item) => (
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
              <td className="text-truncate" title={item.apiKey}>
                {item.apiKey}
              </td>
              <td className="text-truncate">{item.accountAlias || '-'}</td>
              <td>
                <Tag color={item.currentPlan === 'Pro' ? 'blue' : item.currentPlan === 'Bootstrap' ? 'green' : 'default'}>
                  {item.currentPlan || 'Free'}
                </Tag>
              </td>
              <td className="text-truncate">{formatNumber(item.keyUsage)}</td>
              <td className="text-truncate">{formatNumber(item.keyLimit)}</td>
              <td className="text-truncate">{formatNumber(item.planUsage)}</td>
              <td className="text-truncate">{formatNumber(item.planLimit)}</td>
              <td>
                <Tag color={item.isActive ? 'success' : 'error'}>
                  {item.isActive ? (t('active') || '启用') : (t('inactive') || '禁用')}
                </Tag>
              </td>
              <td className="text-truncate">{formatDate(item.lastCheckTime)}</td>
              <td className="text-truncate">{formatDate(item.createTime)}</td>
              <td className="fixed-column">
                <Space>
                  <Button 
                    type="link" 
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(item)}
                  >
                    {t('edit') || '编辑'}
                  </Button>
                  <Button 
                    type="link" 
                    icon={<SyncOutlined spin={syncingIds.has(item.id)} />}
                    onClick={() => handleSyncAccount(item.id)}
                    disabled={syncingIds.has(item.id)}
                    loading={syncingIds.has(item.id)}
                  >
                    {t('sync') || '同步'}
                  </Button>
                </Space>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TavilyAccountTable;
