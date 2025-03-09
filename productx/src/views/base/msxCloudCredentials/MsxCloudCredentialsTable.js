import React from 'react';
import { Button, Tag, Space } from 'antd';
import PropTypes from 'prop-types';

const MsxCloudCredentialsTable = ({
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
            t('name'),
            t('accessKey'),
            t('secretKey'),
            t('type'),
            t('status'),
            t('createTime'),
            t('updateTime'),
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
            <td className="text-truncate">{item.name}</td>
            <td className="text-truncate">{item.accessKey}</td>
            <td className="text-truncate">{item.secretKey}</td>
            <td className="text-truncate">{item.type}</td>
            <td className="text-truncate">
              <Tag color={item.status ? 'success' : 'warning'}>
                {item.status ? t('enabled') : t('disabled')}
              </Tag>
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
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

MsxCloudCredentialsTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default MsxCloudCredentialsTable;
