import React from 'react';
import { Button, Tag } from 'antd';

const QtsSupportedExchangesTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusChange,
  loadingStatus,
}) => {
  const getStatusTag = (status) => {
    return status ? (
      <Tag color="success">启用</Tag>
    ) : (
      <Tag color="error">禁用</Tag>
    );
  };

  const formatFeatures = (features) => {
    try {
      const featuresObj = JSON.parse(features);
      return Object.entries(featuresObj)
        .filter(([_, value]) => value === true)
        .map(([key]) => {
          const featureMap = {
            spot: '现货',
            margin: '杠杆',
            futures: '期货',
            options: '期权',
            swap: '永续'
          };
          return (
            <Tag color="blue" key={key}>
              {featureMap[key] || key}
            </Tag>
          );
        });
    } catch (error) {
      return '无';
    }
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
          <th>交易所名称</th>
          <th>API地址</th>
          <th>描述信息</th>
          <th>支持功能</th>
          <th>状态</th>
          <th>是否启用</th>
          <th className="fixed-column">操作</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.exchangeName} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`td_checkbox_${item.exchangeName}`}
                  checked={selectedRows.includes(item.exchangeName)}
                  onChange={() => handleSelectRow(item.exchangeName, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.exchangeName}`}
                ></label>
              </div>
            </td>
            <td>{item.exchangeName}</td>
            <td>{item.apiUrl}</td>
            <td>{item.info}</td>
            <td>{formatFeatures(item.features)}</td>
            <td>{getStatusTag(item.status)}</td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleStatusChange(item.id, e)}
                  disabled={loadingStatus === item.id}
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

export default QtsSupportedExchangesTable;
