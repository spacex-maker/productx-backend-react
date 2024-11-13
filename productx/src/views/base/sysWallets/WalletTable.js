import React from 'react';
import { Button } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

const WalletTable = ({
                       data,
                       selectAll,
                       selectedRows,
                       handleSelectAll,
                       handleSelectRow,
                       handleStatusChange,
                       handleEditClick,
                     }) => {

  // 复制到剪贴板的功能
  const handleCopy = (address) => {
    navigator.clipboard.writeText(address)
      .catch((err) => {
        console.error('复制失败:', err);
      });
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
        {['钱包地址', '钱包类型', '钱包标签/别名', '国家码', '状态'].map((field) => (
          <th key={field}>{field}</th>
        ))}
        <th className="fixed-column" key="操作">操作</th>
      </tr>
      </thead>
      <tbody>
      {data.map((item) => (
        <tr key={item.address} className="record-font">
          <td>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                checked={selectedRows.includes(item.address)}
                onChange={() => handleSelectRow(item.address, data)}
              />
              <label
                className="custom-control-label"
                htmlFor={`td_checkbox_${item.address}`}
              ></label>
            </div>
          </td>
          <td className="text-truncate">
            {item.address}
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => handleCopy(item.address)}
              style={{ marginLeft: '8px' }}
            />
          </td>
          <td className="text-truncate">{item.type === 1 ? '类型 1' : '类型 2'}</td>
          <td className="text-truncate">{item.label}</td>
          <td className="text-truncate">{item.countryCode}</td>
          <td>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={item.status}
                onChange={(e) => handleStatusChange(item.address, e)}
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

export default WalletTable;
