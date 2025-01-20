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
      <td className="fixed-column">
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
                id="select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          {['ID', '权限名称', '权限英文名', '描述', '类型', '状态'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column" key="操作">
            操作
          </th>
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
                  disabled={item.isSystem}
                />
                <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">
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
            <td className="text-truncate">{item.permissionNameEn}</td>
            <td className="text-truncate">{item.description}</td>
            <td className="text-truncate" style={{ textAlign: 'center' }}>
              {getTypeTag(item.type)}
            </td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.checked)}
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
