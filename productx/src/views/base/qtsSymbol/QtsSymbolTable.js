import React from 'react';
import { Button, Tag } from 'antd';

const QtsSymbolTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewDetails,
}) => {
  const getStatusTag = (status) => {
    const statusConfig = {
      1: { color: 'success', text: '交易中' },
      2: { color: 'warning', text: '暂停交易' },
      3: { color: 'error', text: '已下架' },
    };
    
    const config = statusConfig[status] || { color: 'default', text: '未知状态' };
    
    return (
      <Tag color={config.color}>
        {config.text}
      </Tag>
    );
  };

  const getSyncStatusTag = (syncStatus) => {
    const statusConfig = {
      0: { color: 'default', text: '未同步' },
      1: { color: 'processing', text: '同步中' },
      2: { color: 'success', text: '同步成功' },
      3: { color: 'error', text: '同步失败' },
    };
    
    const config = statusConfig[syncStatus] || { color: 'default', text: '未知状态' };
    
    return (
      <Tag color={config.color}>
        {config.text}
      </Tag>
    );
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
          {[
            '交易所', '交易对', '基础币种', '计价币种', '状态',
            '同步状态', '同步开关'
          ].map((field) => (
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
            <td>{item.exchangeName}</td>
            <td>{item.symbol}</td>
            <td>{item.baseAsset}</td>
            <td>{item.quoteAsset}</td>
            <td>{getStatusTag(item.status)}</td>
            <td>{getSyncStatusTag(item.syncStatus)}</td>
            <td>
              <Tag color={item.syncEnabled ? 'green' : 'red'}>
                {item.syncEnabled ? '启用' : '禁用'}
              </Tag>
            </td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                修改
              </Button>
              <Button type="link" onClick={() => handleViewDetails(item)}>
                详情
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsSymbolTable;
