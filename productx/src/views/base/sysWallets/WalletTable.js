import React from 'react';
import {Button, message, Space} from 'antd';
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
                       countries = [],
                       t
                     }) => {

  // 复制到剪贴板的功能
  const handleCopy = (address) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        message.success(t('addressCopied'));
      })
      .catch((err) => {
        console.error(t('copyFailed'), err);
        message.error(t('copyFailed'));
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
        {[t('walletAddress'), t('walletType'), t('walletLabel'), t('countryCode'), t('status')].map((field) => (
          <th key={field}>{field}</th>
        ))}
        <th className="fixed-column" key="操作">{t('operations')}</th>
      </tr>
      </thead>
      <tbody>
      {data.map((item) => (
        <tr key={item.address} className="record-font">
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
          <td>
            <div style={{display: 'flex', alignItems: 'center', whiteSpace: 'nowrap'}}>
              <div style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {item.address}
              </div>
              <Button
                icon={<CopyOutlined/>}
                onClick={() => handleCopy(item.address)}
                style={{marginLeft: '8px'}}
              />
            </div>
          </td>
          <td className="text-truncate">{item.typeName}</td>
          <td className="text-truncate">{item.label}</td>
          <td className="text-truncate">
            <Space>
              <img
                src={countries.find(country => country.code === item.countryCode)?.flagImageUrl}
                alt={countries.find(country => country.code === item.countryCode)?.name}
                style={{
                  width: 20,
                  height: 15,
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid #f0f0f0'
                }}
              />
              <span>
                {countries.find(country => country.code === item.countryCode)?.name || item.countryCode}
              </span>
            </Space>
          </td>
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
              {t('edit')}
            </Button>
            <Button
              type="link"
              onClick={() => handleBlockchainQuery(item.address)}
            >
              {t('blockchainBrowser')}
            </Button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default WalletTable;
