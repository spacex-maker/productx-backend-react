import React from 'react';
import { Tag, Button, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import DefaultAvatar from 'src/components/DefaultAvatar';

const ObjectStorageTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDetailClick,
}) => {
  const { t } = useTranslation();

  // 状态标签颜色映射
  const getStatusTagColor = (status) => {
    const colorMap = {
      ACTIVE: 'success',
      INACTIVE: 'warning',
      ERROR: 'error',
    };
    return colorMap[status] || 'default';
  };

  const columns = [
    t('storageInfo'),
    t('storageProvider'),
    t('storageType'),
    t('region'),
    t('accountName'),
    t('isActive'),
    t('isDefault'),
    t('status'),
    t('createTime'),
    t('updateTime'),
  ];

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
          <th className="fixed-column">{t('operations')}</th>
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
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label className="custom-control-label"></label>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.previewUrl ? (
                  <Image
                    src={item.previewUrl}
                    alt={item.bucketName}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                ) : (
                  <DefaultAvatar name={item.bucketName} size={40} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500' }}>{item.bucketName}</span>
                  <span style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {item.id}</span>
                </div>
              </div>
            </td>
            <td className="text-truncate">{item.storageProvider}</td>
            <td className="text-truncate">{item.storageType}</td>
            <td className="text-truncate">{item.region}</td>
            <td className="text-truncate">{item.accountName}</td>
            <td className="text-center">
              <Tag color={item.isActive ? 'success' : 'default'}>
                {item.isActive ? t('yes') : t('no')}
              </Tag>
            </td>
            <td className="text-center">
              <Tag color={item.isDefault ? 'blue' : 'default'}>
                {item.isDefault ? t('yes') : t('no')}
              </Tag>
            </td>
            <td className="text-center">
              <Tag color={getStatusTagColor(item.status)}>{t(item.status)}</Tag>
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleDetailClick(item)}>
                {t('detail')}
              </Button>
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

export default ObjectStorageTable;
