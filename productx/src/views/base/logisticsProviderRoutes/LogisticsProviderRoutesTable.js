import React from 'react';
import { Button, Tag, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const LogisticsProviderRoutesTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewDetails,
}) => {
  const renderTransportTypes = (record) => {
    const types = [];
    if (record.airFreight) types.push(<Tag color="blue" key="air">空运</Tag>);
    if (record.seaFreight) types.push(<Tag color="green" key="sea">海运</Tag>);
    if (record.landFreight) types.push(<Tag color="orange" key="land">陆运</Tag>);
    return <Space>{types}</Space>;
  };

  const renderServiceQualityTag = (quality) => {
    const colorMap = {
      '经济': 'blue',
      '标准': 'green',
      '优先': 'orange'
    };
    return <Tag color={colorMap[quality]}>{quality}</Tag>;
  };

  const renderStatus = (status) => {
    const statusMap = {
      0: { color: 'error', text: '禁用' },
      1: { color: 'success', text: '启用' },
      2: { color: 'processing', text: '内测中' },
      3: { color: 'warning', text: '暂停' }
    };
    
    const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th style={{ width: '50px' }}>
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
          <th>提供商ID</th>
          <th>路线ID</th>
          <th>运输方式</th>
          <th>服务质量</th>
          <th>估算费用</th>
          <th>创建时间</th>
          <th>更新时间</th>
          <th>状态</th>
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
            <td>{item.providerId}</td>
            <td>{item.routeId}</td>
            <td>{renderTransportTypes(item)}</td>
            <td>{renderServiceQualityTag(item.serviceQuality)}</td>
            <td>¥{item.estimatedCost.toFixed(2)}</td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
            <td>{renderStatus(item.status)}</td>
            <td className="fixed-column">
              <Space>
                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => handleViewDetails(item)}
                  style={{ padding: '0px' }}
                >
                  详情
                </Button>
                <Button 
                  type="link" 
                  onClick={() => handleEditClick(item)}
                  style={{ padding: '0px' }}
                >
                  修改
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LogisticsProviderRoutesTable;
