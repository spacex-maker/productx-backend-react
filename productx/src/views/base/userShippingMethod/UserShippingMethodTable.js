import React from 'react';
import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { InfoCircleOutlined } from '@ant-design/icons';

const ShippingMethodTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
}) => {
  const { t } = useTranslation();

  const columns = [
    'ID',
    '配送方式名称',
    <span key="description">
      配送方式描述 
      <Tooltip title="此字段已做国际化处理">
        <InfoCircleOutlined style={{ marginLeft: '4px' }} />
      </Tooltip>
    </span>,
    '操作'
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
          {columns.map((column) => (
            <th key={typeof column === 'string' ? column : 'description'}>{column}</th>
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
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">{item.shippingMethod}</td>
            <td className="text-truncate">{t(`${item.description}`)}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                修改
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ShippingMethodTable;
