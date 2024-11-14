import React from 'react';
import {Button, message} from 'antd';
import {CopyOutlined} from '@ant-design/icons';
import api from 'src/axiosInstance';

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
      .then(() => {
        message.success('地址已复制到剪贴板');
      })
      .catch((err) => {
        console.error('复制失败:', err);
        message.error('复制失败');
      });
  };
  const handleBlockchainQuery = (address) => {
    // Blockchain browser query logic
    const blockchainUrl = `https://etherscan.io/address/${address}`; // Example for Ethereum
    window.open(blockchainUrl, '_blank');
  }

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
          <td>
            <div style={{display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
              <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {item.address}
              </div>
              <Button
                icon={<CopyOutlined/>}
                size="small"
                onClick={() => handleCopy(item.address)}
                style={{marginLeft: '8px'}}
              />
            </div>
          </td>
          <td className="text-truncate">{item.typeName}</td>
          <td className="text-truncate">{item.label}</td>
          <td className="text-truncate">{item.countryCode}</td>
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
            <Button
              type="link"
              size="small"
              onClick={() => handleBlockchainQuery(item.address)}
            >
              区块链浏览器
            </Button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default WalletTable;
