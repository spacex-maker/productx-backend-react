import React from 'react';
import { Button, Tag, Tooltip, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';

const LogisticsRoutesTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewDetails,
  countries,
}) => {
  const renderTransportTag = (isSupported, type, transitTime) => {
    if (!isSupported) {
      return <Tag color="default">不支持</Tag>;
    }
    return (
      <Tooltip title={transitTime ? `时效: ${transitTime}` : '未设置时效'}>
        <Tag color="processing" style={{ cursor: 'pointer' }}>
          支持
        </Tag>
      </Tooltip>
    );
  };

  const renderStatus = (status) => {
    return status ? (
      <Tag icon={<CheckCircleOutlined />} color="success">
        启用
      </Tag>
    ) : (
      <Tag icon={<CloseCircleOutlined />} color="error">
        禁用
      </Tag>
    );
  };

  const renderCountry = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    if (!country) return countryCode;
    
    return (
      <Space>
        <img
          src={country.flagImageUrl}
          alt={country.name}
          style={{
            width: 20,
            height: 15,
            objectFit: 'cover',
            borderRadius: 2,
            border: '1px solid #f0f0f0'
          }}
        />
        <span>{country.name}</span>
      </Space>
    );
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
          <th style={{ width: '120px' }}>起始国家</th>
          <th style={{ width: '120px' }}>目的国家</th>
          <th style={{ width: '100px' }}>空运</th>
          <th style={{ width: '100px' }}>海运</th>
          <th style={{ width: '100px' }}>陆运</th>
          <th style={{ width: '100px' }}>状态</th>
          <th style={{ width: '180px' }}>创建时间</th>
          <th style={{ width: '180px' }}>更新时间</th>
          <th style={{ width: '100px' }} className="fixed-column">操作</th>
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
            <td>{renderCountry(item.originCountry)}</td>
            <td>{renderCountry(item.destinationCountry)}</td>
            <td>{renderTransportTag(item.airFreight, '空运', item.airTransitTime)}</td>
            <td>{renderTransportTag(item.seaFreight, '海运', item.seaTransitTime)}</td>
            <td>{renderTransportTag(item.landFreight, '陆运', item.landTransitTime)}</td>
            <td>{renderStatus(item.status)}</td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
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

export default LogisticsRoutesTable;
