import React from 'react';
import { Button, Popconfirm } from 'antd';
import { formatDate } from 'src/components/common/Common';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const ActivityConfigTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDeleteClick,
}) => {
  const getStatusText = (status) => {
    const statusMap = {
      0: '草稿',
      1: '上线中',
      2: '已下线',
      3: '暂停',
    };
    return statusMap[status] || '未知';
  };

  const getActivityTypeText = (type) => {
    const typeMap = {
      invite_friend: '邀请好友',
      recharge: '充值',
      sign_in: '签到',
      content_creation: '创作激励',
    };
    return typeMap[type] || type;
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
          <th>ID</th>
          <th>活动名称</th>
          <th>展示名称</th>
          <th>活动类型</th>
          <th>状态</th>
          <th>优先级</th>
          <th>开始时间</th>
          <th>结束时间</th>
          <th>创建时间</th>
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
            <td>{item.id}</td>
            <td>{item.title || '-'}</td>
            <td>{item.displayName || '-'}</td>
            <td>{getActivityTypeText(item.activityType)}</td>
            <td>{getStatusText(item.status)}</td>
            <td>{item.priority || 0}</td>
            <td>{formatDate(item.startTime) || '-'}</td>
            <td>{formatDate(item.endTime) || '-'}</td>
            <td>{formatDate(item.createTime) || '-'}</td>
            <td>
              <Button type="link" onClick={() => handleEditClick(item)}>
                <EditOutlined /> 修改
              </Button>
              <Popconfirm
                title="确定要删除这个活动吗？"
                onConfirm={() => handleDeleteClick(item.id)}
                okText="是"
                cancelText="否"
              >
                <Button type="link" danger>
                  <DeleteOutlined /> 删除
                </Button>
              </Popconfirm>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ActivityConfigTable;

