import React from 'react';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const TYPE_MAP = { 1: '充值', 2: '订阅', 3: '活动' };
const STATUS_MAP = { 0: '下架', 1: '上架' };

const AppProductPackagesTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
}) => {
  const { t } = useTranslation();

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e, data)}
              />
              <label className="custom-control-label" />
            </div>
          </th>
          <th>{t('id')}</th>
          <th>SKU</th>
          <th>{t('type') || '类型'}</th>
          <th>{t('packageName') || '套餐名称'}</th>
          <th>售价</th>
          <th>Token</th>
          <th>{t('status')}</th>
          <th>{t('sort') || '排序'}</th>
          <th>{t('createTime')}</th>
          <th>{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id)}
                />
                <label className="custom-control-label" />
              </div>
            </td>
            <td>{item.id}</td>
            <td>{item.skuCode}</td>
            <td>{TYPE_MAP[item.type] ?? item.type}</td>
            <td>{item.name}</td>
            <td>{item.currency} {item.price}</td>
            <td>{(item.points || 0) + (item.giftPoints || 0)}</td>
            <td>{STATUS_MAP[item.status] ?? item.status}</td>
            <td>{item.sort}</td>
            <td>{item.createTime}</td>
            <td>
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

AppProductPackagesTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
};

export default AppProductPackagesTable;
