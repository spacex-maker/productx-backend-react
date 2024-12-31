import React from 'react';
import { Button, Popconfirm, Tag } from 'antd';
import { MenuOutlined, ApiOutlined, ControlOutlined, AppstoreOutlined } from '@ant-design/icons';

const getTypeTag = (type) => {
  switch (type) {
    case 1:
      return (
        <Tag color="#1890ff" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
          <MenuOutlined style={{ marginRight: '4px' }} />菜单
        </Tag>
      );
    case 2:
      return (
        <Tag color="#52c41a" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
          <ApiOutlined style={{ marginRight: '4px' }} />接口
        </Tag>
      );
    case 3:
      return (
        <Tag color="#722ed1" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
          <ControlOutlined style={{ marginRight: '4px' }} />按钮
        </Tag>
      );
    case 4:
      return (
        <Tag color="#fa8c16" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
          <AppstoreOutlined style={{ marginRight: '4px' }} />业务
        </Tag>
      );
    default:
      return (
        <Tag color="#bfbfbf" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
          未知
        </Tag>
      );
  }
};

const PermissionTable = ({
                           data,
                           selectAll,
                           selectedRows,
                           handleSelectAll,
                           handleSelectRow,
                           handleStatusChange,
                           handleEditClick,
                           handleDeleteClick
                         }) => {
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
        <th className="fixed-column" key="操作">操作</th>
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
          <td className="text-truncate">{item.id}</td>
          <td className="text-truncate">{item.permissionName}</td>
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
          <td className="fixed-column">
            <Button type="link" onClick={() => handleEditClick(item)}>
              修改
            </Button>
            <Popconfirm
              title="确定要删除这个权限吗？"
              onConfirm={() => handleDeleteClick(item.id)}
              okText="是"
              cancelText="否"
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default PermissionTable;
