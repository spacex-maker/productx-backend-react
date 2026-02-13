import React from 'react';
import { Button, Popconfirm } from 'antd';
import { formatDate } from 'src/components/common/Common';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const UserInviteStatsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDeleteClick,
}) => {
  const getLevelText = (level) => {
    const levelMap = {
      1: '青铜',
      2: '白银',
      3: '黄金',
      4: '铂金',
      5: '钻石',
      6: '王者',
    };
    return levelMap[level] || level;
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
          <th>用户UID</th>
          <th>总邀请人数</th>
          <th>有效邀请人数</th>
          <th>累计获得积分</th>
          <th>邀请等级</th>
          <th>创建时间</th>
          <th>更新时间</th>
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
            <td>{item.uid || '-'}</td>
            <td>{item.totalInvitedCount || 0}</td>
            <td>{item.validInvitedCount || 0}</td>
            <td>{item.totalRewardPoints || 0}</td>
            <td>{getLevelText(item.currentLevel)}</td>
            <td>{formatDate(item.createTime) || '-'}</td>
            <td>{formatDate(item.updateTime) || '-'}</td>
            <td>
              <Button type="link" onClick={() => handleEditClick(item)}>
                <EditOutlined /> 修改
              </Button>
              <Popconfirm
                title="确定要删除这条统计吗？"
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

export default UserInviteStatsTable;

