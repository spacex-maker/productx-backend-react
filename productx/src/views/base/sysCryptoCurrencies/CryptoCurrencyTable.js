import React, { useState } from 'react';
import { Button } from 'antd';
import CryptoDetailModal from "src/views/base/sysCryptoCurrencies/CryptoDetailModel"; // 引入 CryptoDetailModal
import { useTranslation } from 'react-i18next'; // 导入 useTranslation
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
  const { t } = useTranslation(); // 使用 useTranslation 获取 t 函数
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
          {['name', 'symbol', 'price', '24hChange', 'marketCap', 'totalSupply', 'status'].map((field) => (
            <th key={field}>{t(field)}</th>
          ))}
          <th className="fixed-column" key='操作'>{t('action')}</th>
        </tr>
        </thead>
        <tbody>
        {data.map((item, index) => (
          <tr key={index} className="record-font">
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
                  onChange={(e) => handleStatusChange(item.id, e)}
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
