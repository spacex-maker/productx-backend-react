import React from 'react';
import { Button, Popconfirm, Tag } from 'antd';
import {
  MenuOutlined,
  ApiOutlined,
  ControlOutlined,
  AppstoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const PermissionTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleDeleteClick,
  handleViewDetail,
}) => {
  const renderActionButtons = (item) => {
    return (
      <td>
        <Button type="link" onClick={() => handleViewDetail(item)}>
          <EyeOutlined /> 详情
        </Button>
        <Button type="link" onClick={() => handleEditClick(item)}>
          <EditOutlined /> 修改
        </Button>
        {!item.isSystem && (
          <Popconfirm
            title="确定要删除这个权限吗？"
            onConfirm={() => handleDeleteClick(item.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" danger>
              <DeleteOutlined /> 删除
            </Button>
          </Popconfirm>
        )}
      </td>
    );
  };

  const getTypeTag = (type) => {
    switch (type) {
      case 1:
        return (
          <Tag color="#1890ff" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <MenuOutlined style={{ marginRight: '4px' }} />菜单
          </Tag>
        );
      case 2:
        return (
          <Tag color="#52c41a" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <ApiOutlined style={{ marginRight: '4px' }} />接口
          </Tag>
        );
      case 3:
        return (
          <Tag color="#722ed1" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <ControlOutlined style={{ marginRight: '4px' }} />按钮
          </Tag>
        );
      case 4:
        return (
          <Tag color="#fa8c16" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <AppstoreOutlined style={{ marginRight: '4px' }} />业务
          </Tag>
        );
      default:
        return (
          <Tag color="#bfbfbf" style={{ display: 'inline-flex', alignItems: 'center' }}>
            未知
          </Tag>
        );
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
                checked={selectAll}
                onChange={(e) => handleSelectAll(e, data)}
              />
              <label className="custom-control-label"></label>
            </div>
          </th>
          {['ID', '权限名称', '权限英文名', '描述', '类型', '状态'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th>操作</th>
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
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id)}
                />
                <label className="custom-control-label"></label>
              </div>
            </td>
            <td>{item.id}</td>
            <td>
              {item.permissionName}
              {item.isSystem && (
                <span
                  style={{
                    marginLeft: '4px',
                    fontSize: '10px',
                    color: '#1890ff',
                    border: '1px solid #1890ff',
                    padding: '1px 4px',
                    borderRadius: '2px',
                  }}
                >
                  系统权限
                </span>
              )}
            </td>
            <td>{item.permissionNameEn}</td>
            <td>{item.description}</td>
            <td style={{ textAlign: 'center' }}>
              {getTypeTag(item.type)}
            </td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleStatusChange(item.id, e)}
                  disabled={item.isSystem}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            {renderActionButtons(item)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PermissionTable;
