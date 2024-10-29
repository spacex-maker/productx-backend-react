import React from 'react';
import { Button } from 'antd';

const CountryTable = ({
                        data,
                        selectAll,
                        selectedRows,
                        handleSelectAll,
                        handleSelectRow,
                        handleStatusChange,
                        handleEditClick,
                        handleDetailClick,
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
              onChange={handleSelectAll}
            />
            <label className="custom-control-label" htmlFor="select_all"></label>
          </div>
        </th>
        {['ID', '国家名称', '国家代码', '大陆', '状态', '操作'].map((field) => (
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
                onChange={() => handleSelectRow(item.id)}
              />
              <label
                className="custom-control-label"
                htmlFor={`td_checkbox_${item.id}`}
              ></label>
            </div>
          </td>
          <td className="text-truncate">{item.name}</td>
          <td className="text-truncate">{item.code}</td>
          <td className="text-truncate">{item.continent}</td>
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
          <td>
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

export default CountryTable;
