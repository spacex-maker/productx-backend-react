import React from 'react';
import { Button, Popconfirm } from 'antd';
import { formatDate } from 'src/components/common/Common';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const InviteRecordTable = ({
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
      0: '已点击/待注册',
      1: '已注册',
      2: '已达标',
      9: '风控冻结',
    };
    return statusMap[status] || '未知';
  };

  const getRewardIssuedText = (rewardIssued) => {
    return rewardIssued === 1 ? '已发放' : '未发放';
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
          <th>邀请人UID</th>
          <th>被邀请人UID</th>
          <th>邀请码</th>
          <th>来源渠道</th>
          <th>状态</th>
          <th>奖励状态</th>
          <th>注册IP</th>
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
            <td>{item.inviterUid || '-'}</td>
            <td>{item.inviteeUid || '-'}</td>
            <td>{item.inviteCode || '-'}</td>
            <td>{item.channel || '-'}</td>
            <td>{getStatusText(item.status)}</td>
            <td>{getRewardIssuedText(item.rewardIssued)}</td>
            <td>{item.clientIp || '-'}</td>
            <td>{formatDate(item.createTime) || '-'}</td>
            <td>
              <Button type="link" onClick={() => handleEditClick(item)}>
                <EditOutlined /> 修改
              </Button>
              <Popconfirm
                title="确定要删除这条记录吗？"
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

export default InviteRecordTable;

