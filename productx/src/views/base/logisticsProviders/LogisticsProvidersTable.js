import React from 'react';
import { Button, Tag, Space, Rate } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, NodeIndexOutlined } from '@ant-design/icons';

const LogisticsProvidersTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewDetails,
  handleManageRoutes,
}) => {
  const renderStatus = (isActive) => {
    return isActive ? (
      <Tag icon={<CheckCircleOutlined />} color="success">
        运营中
      </Tag>
    ) : (
      <Tag icon={<CloseCircleOutlined />} color="error">
        未运营
      </Tag>
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
          <th>提供商名称</th>
          <th>总部所在地</th>
          <th>联系电话</th>
          <th>评分</th>
          <th>最近审核日期</th>
          <th>运营状态</th>
          <th>创建时间</th>
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
            <td>{item.providerName}</td>
            <td>{item.headquarters}</td>
            <td>{item.contactPhone}</td>
            <td>
              <Rate disabled defaultValue={item.rating} allowHalf />
              <span className="ml-2">{item.rating}</span>
            </td>
            <td>{item.lastAuditDate}</td>
            <td>{renderStatus(item.isActive)}</td>
            <td>{item.createTime}</td>
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
                <Button 
                  type="link"
                  icon={<NodeIndexOutlined />}
                  onClick={() => handleManageRoutes(item)}
                  style={{ padding: '0px' }}
                >
                  线路管理
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LogisticsProvidersTable;
