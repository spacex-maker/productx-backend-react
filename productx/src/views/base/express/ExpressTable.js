import React from 'react';
import { Button } from 'antd';

const ExpressTable = ({
                               data,
                               selectAll,
                               selectedRows,
                               handleSelectAll,
                               handleSelectRow,
                               handleStatusChange,
                               handleEditClick,
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
        {['ID', '快递公司名称', '运单格式', '网站', '联系电话', '状态'].map((field) => (
          <th key={field}>{field}</th>
        ))}
        <th className="fixed-column"
            key='操作'>操作
        </th>
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
          <td className="text-truncate">{item.name}</td>
          <td className="text-truncate">{item.trackingNumberFormat}</td>
          <td className="text-truncate">
            <a href={item.website} target="_blank" rel="noopener noreferrer">
              {item.website}
            </a>
          </td>
          <td className="text-truncate">{item.contactNumber}</td>
          <td>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={item.status}
                onChange={(e) => handleStatusChange(item.id, e)}
              />
              <span className="toggle-switch-slider"></span>
            </label>
          </td>
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

export default ExpressTable;
