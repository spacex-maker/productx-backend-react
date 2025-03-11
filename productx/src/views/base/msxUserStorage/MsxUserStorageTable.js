import React from 'react';
import { Button, Tag, Space } from 'antd';
import PropTypes from 'prop-types';
import { formatBytes } from 'src/utils/format';

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
            t('isDefault'),
            t('storageLimit'),
            t('storageUsed'),
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
            <td className="text-truncate">{item.userId}</td>
            <td className="text-truncate">{item.nodeName}</td>
            <td className="text-truncate">{item.nodeCloud}</td>
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
            <td className="text-truncate">
              <Tag color={item.isDefault ? 'blue' : 'default'}>
                {item.isDefault ? t('yes') : t('no')}
              </Tag>
            </td>
            <td className="text-truncate">{formatBytes(item.storageLimit)}</td>
            <td className="text-truncate">{formatBytes(item.storageUsed)}</td>
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
