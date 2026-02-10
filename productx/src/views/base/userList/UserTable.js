import React from 'react';
import { Button, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import DefaultAvatar from 'src/components/DefaultAvatar';

const KYC_STATUS_MAP = { 0: '未认证', 1: '审核中', 2: '已通过', 3: '审核失败', 4: '需重新认证' };
const KYC_COLOR = { 0: 'default', 1: 'processing', 2: 'success', 3: 'error', 4: 'warning' };

const UserTable = ({
                     data,
                     selectAll,
                     selectedRows,
                     handleSelectAll,
                     handleSelectRow,
                     handleStatusChange,
                     handleEditClick,
                     handleDetailClick
                   }) => {
  const { t } = useTranslation();

  const columns = [
    t('userInfo'),
    t('nickname'),
    t('email'),
    '手机号',
    'Token余额',
    'CNY余额',
    '会员等级',
    '等级',
    '国家',
    '实名状态',
    '激活',
    t('status'),
    '创建时间',
  ];

  const showNum = (v) => (v != null && v !== '' ? String(v) : '—');

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
        {columns.map((field) => (
          <th key={field}>{field}</th>
        ))}
        <th className="fixed-column" key="action">{t('action')}</th>
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
              <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
            </div>
          </td>
          <td>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {item.avatar ? (
                <img
                  src={item.avatar}
                  alt={`${item.username}的头像`}
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <DefaultAvatar name={item.username} size={40} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '500' }}>{item.username || '—'}</span>
                <span style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {item.id}</span>
              </div>
            </div>
          </td>
          <td className="text-truncate" title={item.nickname}>{item.nickname || '—'}</td>
          <td className="text-truncate" title={item.email}>{item.email || '—'}</td>
          <td className="text-truncate" title={item.phoneNumber}>{item.phoneNumber || '—'}</td>
          <td className="text-truncate">{showNum(item.tokenBalance)}</td>
          <td className="text-truncate">{showNum(item.balance)}</td>
          <td className="text-truncate">{item.memberLevel != null ? item.memberLevel : '—'}</td>
          <td className="text-truncate">{item.level != null ? item.level : '—'}</td>
          <td className="text-truncate" title={item.countryCode}>{item.countryCode || '—'}</td>
          <td>
            {item.kycStatus != null ? (
              <Tag color={KYC_COLOR[item.kycStatus] ?? 'default'}>
                {KYC_STATUS_MAP[item.kycStatus] ?? item.kycStatus}
              </Tag>
            ) : '—'}
          </td>
          <td>
            {item.isActive != null ? (
              item.isActive ? <Tag color="success">是</Tag> : <Tag color="default">否</Tag>
            ) : '—'}
          </td>
          <td>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={!!item.status}
                onChange={(e) => handleStatusChange(item.id, e)}
              />
              <span className="toggle-switch-slider"></span>
            </label>
          </td>
          <td className="text-truncate">{item.createTime || '—'}</td>
          <td className="fixed-column">
            <Button type="link" size="small" onClick={() => handleEditClick(item)}>{t('update')}</Button>
            <Button type="link" size="small" onClick={() => handleDetailClick(item)}>{t('detail')}</Button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default UserTable;
