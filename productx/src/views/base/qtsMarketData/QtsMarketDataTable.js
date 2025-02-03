import React from 'react';
import { Button, Tag } from 'antd';
import moment from 'moment';

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
          <th>交易所</th>
          <th>交易对</th>
          <th>K线周期</th>
          <th>开始时间</th>
          <th>结束时间</th>
          <th>开盘价</th>
          <th>最高价</th>
          <th>最低价</th>
          <th>收盘价</th>
          <th>成交量</th>
          <th>成交额</th>
          <th>成交笔数</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.exchangeName || '-'}</td>
            <td>{item.symbol}</td>
            <td>{item.interval}</td>
            <td>{moment(item.openTime).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td>{moment(item.closeTime).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td>{item.openPrice}</td>
            <td>{item.highPrice}</td>
            <td>{item.lowPrice}</td>
            <td>{item.closePrice}</td>
            <td>{item.volume}</td>
            <td>{item.quoteVolume}</td>
            <td>{item.numberOfTrades}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QtsSupportedExchangesTable;
