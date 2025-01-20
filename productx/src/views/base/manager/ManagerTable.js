import React from 'react';
import { Button, Popconfirm, Avatar, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const ManagerTable = ({
                          data,
                          selectAll,
                          selectedRows,
                          handleSelectAll,
                          handleSelectRow,
                          handleStatusChange,
                          handleEditClick,
                          handleDeleteClick,
                          handleDetailClick
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
                checked={selectAll}
                onChange={(e) => handleSelectAll(e, data)}
              />
              <label className="custom-control-label"></label>
            </div>
          </th>
          {['头像', '用户名', '邮箱', '电话', '角色ID', '状态'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
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
            <td>
              <Avatar 
                size={24} 
                icon={<UserOutlined />} 
                src={item.avatar} 
                style={{ backgroundColor: '#87d068' }}
              />
            </td>
            <td>
              <Tooltip title={`ID: ${item.id}`}>
                {item.username || '—'}
              </Tooltip>
            </td>
            <td>{item.email || '—'}</td>
            <td>{item.phone || '—'}</td>
            <td>{item.roleId || '—'}</td>
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
            <td>
              <Button type="link" onClick={() => handleDetailClick(item)}>
                详情
              </Button>
              <Button type="link" onClick={() => handleEditClick(item)}>
                修改
              </Button>
              <Popconfirm
                title="确定要删除这个用户吗？"
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

export default ManagerTable;
