import React from 'react';
import { Button, Tag, Space, Popconfirm } from 'antd';
import PropTypes from 'prop-types';

const MsxStorageBucketTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDetailClick,
  handleDeleteClick,
  providers,
  t,
}) => {
  // 根据providerId获取提供商信息
  const getProviderInfo = (providerId) => {
    return providers.find((p) => p.id === providerId);
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '-';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
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
          {[
            t('bucketName'),
            t('providerId'),
            t('regionName'),
            t('storageType'),
            t('status'),
            t('objectCount'),
            t('totalSize'),
            t('remark'),
            t('createTime'),
            t('operations')
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
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.bucketName}</td>
            <td className="text-truncate">
              {(() => {
                const provider = getProviderInfo(item.providerId);
                if (provider) {
                  const iconUrl = provider.providerIcon || provider.iconImg;
                  return (
                    <Space>
                      {iconUrl && (
                        <img 
                          src={iconUrl} 
                          alt={provider.providerName || ''}
                          style={{ 
                            width: 20, 
                            height: 20, 
                            objectFit: 'contain',
                            verticalAlign: 'middle'
                          }}
                        />
                      )}
                      <span>{provider.providerName || item.providerId}</span>
                    </Space>
                  );
                }
                return item.providerId;
              })()}
            </td>
            <td className="text-truncate">{item.regionName}</td>
            <td className="text-truncate">{item.storageType}</td>
            <td className="text-truncate">
              <Tag color={item.status ? 'success' : 'warning'}>
                {item.status ? t('enabled') : t('disabled')}
              </Tag>
            </td>
            <td className="text-truncate">
              {item.objectCount !== undefined ? item.objectCount.toLocaleString() : '-'}
            </td>
            <td className="text-truncate">
              {formatFileSize(item.totalSize)}
            </td>
            <td className="text-truncate">{item.remark}</td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleDetailClick(item)}>
                  {t('detail')}
                </Button>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
                <Popconfirm
                  title={t('confirmDelete?')}
                  onConfirm={() => handleDeleteClick(item.id)}
                  okText={t('yes')}
                  cancelText={t('no')}
                >
                  <Button type="link" danger>
                    {t('delete')}
                  </Button>
                </Popconfirm>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

MsxStorageBucketTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  handleDetailClick: PropTypes.func.isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
  providers: PropTypes.array,
  t: PropTypes.func.isRequired,
};

export default MsxStorageBucketTable;
