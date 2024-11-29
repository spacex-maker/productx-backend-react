import React from 'react';
import { Button, Popconfirm } from 'antd';

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
  // 处理全选
  const onSelectAll = (event) => {
    const checked = event.target.checked;
    if (checked) {
      // 如果是全选，传递所有数据的 id
      const allIds = data.map(item => item.id);
      handleSelectAll(event, allIds);
    } else {
      // 如果是取消全选，传递空数组
      handleSelectAll(event, []);
    }
  };

  // 处理单行选择
  const onSelectRow = (id) => {
    handleSelectRow(id);
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
              onChange={onSelectAll}
            />
            <label className="custom-control-label" htmlFor="select_all"></label>
          </div>
        </th>
        {['ID', '用户名', '邮箱', '电话', '角色ID', '状态'].map((field) => (
          <th key={field}>{field}</th>
        ))}
        <th className="fixed-column" key='操作'>操作</th>
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
                onChange={() => onSelectRow(item.id)}
              />
              <label
                className="custom-control-label"
                htmlFor={`td_checkbox_${item.id}`}
              ></label>
            </div>
          </td>
          <td className="text-truncate">{item.id}</td>
          <td className="text-truncate">{item.username}</td>
          <td className="text-truncate">{item.email || '无'}</td>
          <td className="text-truncate">{item.phone || '无'}</td>
          <td className="text-truncate">{item.roleId}</td>
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
