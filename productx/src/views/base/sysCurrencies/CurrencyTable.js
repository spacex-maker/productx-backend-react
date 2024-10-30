import React from 'react';
import { Button } from 'antd';

const CurrencyTable = ({
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
        {['ID', 'English Name', '中文名称', '货币代码', '符号', '状态'].map((field) => (
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
          <td className="text-truncate">{item.currencyName}</td>
          <td className="text-truncate">{item.descriptionZh}</td>
          <td className="text-truncate">{item.currencyCode}</td>
          <td className="text-truncate">{item.symbol}</td>
          <td>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={item.status === 1}
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

export default CurrencyTable;
