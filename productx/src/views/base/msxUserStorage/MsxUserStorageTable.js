import React from 'react';
import { Button, Tag, Space, Progress } from 'antd';
import PropTypes from 'prop-types';
import { formatBytes } from 'src/utils/format';
import DefaultAvatar from 'src/components/DefaultAvatar';

const MsxUserStorageTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  t,
}) => {
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
          {[
            t('userId'),
            t('nodeName'),
            t('nodeCloud'),
            t('nodeType'),
            t('nodeRegion'),
            t('status'),
            t('storageUsage'),
            t('createTime'),
            t('operations'),
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.nickname || item.fullName || '用户头像'}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div style={{ flexShrink: 0 }}>
                    <DefaultAvatar name={item.nickname || item.fullName || String(item.userId || '?')} size={40} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  {(item.nickname || item.fullName) ? (
                    <>
                      {item.nickname && (
                        <span style={{ fontWeight: '500', fontSize: '14px', lineHeight: '1.4' }}>
                          {item.nickname}
                        </span>
                      )}
                      {item.fullName && (
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#666', 
                          marginTop: item.nickname ? '2px' : 0,
                          lineHeight: '1.4'
                        }}>
                          {item.fullName}
                        </span>
                      )}
                    </>
                  ) : null}
                  <span style={{ fontSize: '12px', color: '#8c8c8c', marginTop: (item.nickname || item.fullName) ? '2px' : 0, lineHeight: '1.4' }}>
                    ID: {item.userId}
                  </span>
                </div>
              </div>
            </td>
            <td className="text-truncate">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{item.nodeName}</span>
                {item.isDefault && (
                  <Tag color="blue">{t('default')}</Tag>
                )}
              </div>
            </td>
            <td className="text-truncate">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.providerIcon && (
                  <img
                    src={item.providerIcon}
                    alt={item.nodeCloud || 'Provider'}
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      if (e.target && e.target instanceof HTMLImageElement) {
                        e.target.style.display = 'none';
                      }
                    }}
                  />
                )}
                <span>{item.nodeCloud}</span>
              </div>
            </td>
            <td className="text-truncate">{item.nodeType}</td>
            <td className="text-truncate">{item.nodeRegion}</td>
            <td className="text-truncate">
              <Tag color={
                item.status === 'ACTIVE' ? 'success' :
                item.status === 'INACTIVE' ? 'warning' :
                'error'
              }>
                {item.status}
              </Tag>
            </td>
            <td style={{ minWidth: '200px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: '#666' }}>
                    {formatBytes(item.storageUsed)} / {formatBytes(item.storageLimit)}
                  </span>
                  <span style={{ 
                    fontWeight: '500',
                    color: item.storageLimit > 0 
                      ? (item.storageUsed / item.storageLimit > 0.9 ? '#ff4d4f' : 
                         item.storageUsed / item.storageLimit > 0.7 ? '#faad14' : '#52c41a')
                      : '#666'
                  }}>
                    {item.storageLimit > 0 
                      ? `${((item.storageUsed / item.storageLimit) * 100).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
                <Progress
                  percent={item.storageLimit > 0 ? (item.storageUsed / item.storageLimit) * 100 : 0}
                  showInfo={false}
                  strokeColor={
                    item.storageLimit > 0
                      ? (item.storageUsed / item.storageLimit > 0.9 ? '#ff4d4f' :
                         item.storageUsed / item.storageLimit > 0.7 ? '#faad14' : '#52c41a')
                      : '#d9d9d9'
                  }
                  size="small"
                />
              </div>
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MsxUserStorageTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default MsxUserStorageTable;
