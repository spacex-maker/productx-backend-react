import React, { useState } from 'react';
import { Button } from 'antd';
import CryptoDetailModal from "src/views/base/sysCryptoCurrencies/CryptoDetailModel"; // 引入 CryptoDetailModal

const CryptoCurrencyTable = ({
                               data,
                               selectAll,
                               selectedRows,
                               handleSelectAll,
                               handleSelectRow,
                               handleStatusChange,
                               handleEditClick,
                             }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  const handleDetailClick = (crypto) => {
    setSelectedCrypto(crypto); // 设置选中的加密货币数据
    setIsModalVisible(true);    // 打开详情模态框
  };

  return (
    <div>
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
          {['Name', 'Symbol', 'Price', '24h Change', 'Market Cap', 'Total Supply', 'Status'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column" key="操作">
            操作
          </th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
          <tr key={index} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.name)}
                  onChange={() => handleSelectRow(item.name, data)}
                />
                <label className="custom-control-label" htmlFor={`td_checkbox_${item.name}`}></label>
              </div>
            </td>
            <td className="text-truncate">{item.name}</td>
            <td className="text-truncate">{item.symbol}</td>
            <td className="text-truncate">${item.price.toFixed(2)}</td>
            <td className="text-truncate">{item.value24hChange.toFixed(2)}%</td>
            <td className="text-truncate">${item.marketCap.toLocaleString()}</td>
            <td className="text-truncate">{item.totalSupply.toLocaleString()}</td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleStatusChange(item.name, e)}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                编辑
              </Button>
              <Button type="link" onClick={() => handleDetailClick(item)}>
                详情
              </Button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <CryptoDetailModal
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        selectedCrypto={selectedCrypto} // 直接传递选中的项
      />
    </div>
  );
};

export default CryptoCurrencyTable;
