import React from 'react';
import { Button, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from 'src/components/common/Common';

const CATEGORY_MAP = {
  login: '登录',
  community: '社区',
  challenge: '挑战',
  ai: 'AI创作',
  growth: '成长',
  general: '其他',
};

const UserExpActionTable = ({
  data,
  selectedRows,
  selectAll,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDeleteClick,
}) => (
  <table className="table table-bordered table-striped">
    <thead>
      <tr>
        <th>
          <input type="checkbox" checked={selectAll} onChange={(e) => handleSelectAll(e, data)} />
        </th>
        <th>ID</th>
        <th>行为编码</th>
        <th>名称</th>
        <th>英文名</th>
        <th>分类</th>
        <th>经验值</th>
        <th>每日上限</th>
        <th>终身上限</th>
        <th>状态</th>
        <th>排序</th>
        <th>更新时间</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.id}>
          <td>
            <input
              type="checkbox"
              checked={selectedRows.includes(item.id)}
              onChange={() => handleSelectRow(item.id)}
            />
          </td>
          <td>{item.id}</td>
          <td><code>{item.actionCode}</code></td>
          <td>{item.name}</td>
          <td>{item.nameEn || '-'}</td>
          <td>{CATEGORY_MAP[item.category] || item.category}</td>
          <td><strong>{item.expValue}</strong></td>
          <td>{item.dailyLimit || '不限'}</td>
          <td>{item.totalLimit || '不限'}</td>
          <td>
            {item.status === 1 ? <Tag color="green">启用</Tag> : <Tag>禁用</Tag>}
          </td>
          <td>{item.sortOrder}</td>
          <td>{formatDate(item.updateTime)}</td>
          <td>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditClick(item)} />
            <Popconfirm title="确认删除？" onConfirm={() => handleDeleteClick(item.id)}>
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default UserExpActionTable;
