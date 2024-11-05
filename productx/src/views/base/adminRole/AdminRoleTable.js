import React from 'react';
import { Button, Popconfirm } from 'antd';

const AdminRoleTable = ({
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
        {['ID', '角色名称', '英文名称', '状态', '描述', '创建者', '创建时间', '更新者', '更新时间'].map((field) => (
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
          <td className="text-truncate">{item.roleName}</td>
          <td className="text-truncate">{item.roleNameEn}</td>
          <td>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={item.status === 1}
                onChange={(e) => handleStatusChange(item.id, e.target.checked ? 1 : 0)}
              />
              <span className="toggle-switch-slider"></span>
            </label>
          </td>
          <td className="text-truncate">{item.description || '无'}</td>
          <td className="text-truncate">{item.createBy || '无'}</td>
          <td className="text-truncate">{item.createTime || '无'}</td>
          <td className="text-truncate">{item.updateBy || '无'}</td>
          <td className="text-truncate">{item.updateTime || '无'}</td>
          <td className="fixed-column">
            <Button type="link" onClick={() => handleEditClick(item)}>
              修改
            </Button>
            <Popconfirm
              title="确定要删除这个角色吗？"
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

export default AdminRoleTable;
