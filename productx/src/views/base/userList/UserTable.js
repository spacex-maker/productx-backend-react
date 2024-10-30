import React from 'react';
import { Button } from 'antd';

const UserTable = ({
                     data,
                     selectAll,
                     selectedRows,
                     handleSelectAll,
                     handleSelectRow,
                     handleStatusChange,
                     handleEditClick,
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
              id="select_all"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <label className="custom-control-label" htmlFor="select_all"></label>
          </div>
        </th>
        {['ID', '头像', '用户名', '昵称', '邮箱', '地址', '状态'].map((field) => (
          <th key={field}>{field}</th>
        ))}
        <th className="fixed-column"
            key='操作'>操作
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
                onChange={() => handleSelectRow(item.id)}
              />
              <label
                className="custom-control-label"
                htmlFor={`td_checkbox_${item.id}`}
              ></label>
            </div>
          </td>
          <td className="text-truncate">{item.id}</td>
          <td className="text-truncate">
            <img
              src={item.avatar} // 假设 user.avatar 是头像的 URL
              alt={`${item.nickname}的头像`}
              style={{width: '40px', height: '40px', borderRadius: '25%'}} // 设置为40px的图片并圆形显示
            />
          </td>
          <td className="text-truncate">{item.username}</td>
          <td className="text-truncate">{item.nickname}</td>
          <td className="text-truncate">{item.email}</td>
          <td className="text-truncate">{item.address}</td>
          <td>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={item.status === 1}
                onChange={(e) => handleStatusChange(item.id, e)}
              />
              <span className="toggle-switch-slider"></span>
            </label>
          </td>
          <td className="fixed-column">
            <Button type="link" onClick={() => handleEditClick(item)}>
              修改
            </Button>
            <Button type="link" onClick={() => handleDetailClick(item)}>
              详情
            </Button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default UserTable;
