import React from 'react';
import { Tag, Button } from 'antd';
import { useTranslation } from 'react-i18next';

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
            'id',
            'storageProvider',
            'storageType',
            'region',
            'bucketName',
            'accountName',
            'isActive',
            'isDefault',
            'status',
            'createTime',
            'updateTime',
          ].map((field) => (
            <th key={field}>{t(field)}</th>
          ))}
          <th>{t('operations')}</th>
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
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">{item.storageProvider}</td>
            <td className="text-truncate">{item.storageType}</td>
            <td className="text-truncate">{item.region}</td>
            <td className="text-truncate">{item.bucketName}</td>
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
            <td>
              <Button type="link"    onClick={() => handleDetailClick(item)}>
                {t('detail')}
              </Button>
              <Button type="link"    onClick={() => handleEditClick(item)}>
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
