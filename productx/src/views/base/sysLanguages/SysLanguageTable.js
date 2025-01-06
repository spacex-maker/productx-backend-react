import React from 'react';
import { Button } from 'antd';

const SysLanguageTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusChange,
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
          {['语言代码', '英文名称', '中文名称', '本地名称', '开发状态'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column">操作</th>
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
            <td className="text-truncate">{item.languageCode}</td>
            <td className="text-truncate">{item.languageNameEn}</td>
            <td className="text-truncate">{item.languageNameZh}</td>
            <td className="text-truncate">{item.languageNameNative}</td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.isDeveloped}
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

export default SysLanguageTable;
