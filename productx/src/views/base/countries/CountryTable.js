import React, { useState } from 'react';
import { Button } from 'antd';
import WorldMap from './WorldMap';

const CountryTable = ({
                        allData,
                        data,
                        selectAll,
                        selectedRows,
                        handleSelectAll,
                        handleSelectRow,
                        handleStatusChange,
                        handleEditClick,
                      }) => {

  const handleSelectRowWrapper = (id, data) => {
    handleSelectRow(id, data);
  };

  return (
    <>
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
          {['国家名称', '国家代码', '大陆', '状态'].map((field) => (
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
                  onChange={() => handleSelectRowWrapper(item.id, data)}
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
      <WorldMap countries={allData} />
    </>
  );
};

export default CountryTable;
