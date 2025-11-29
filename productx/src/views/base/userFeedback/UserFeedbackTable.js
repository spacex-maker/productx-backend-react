import React from 'react';
import { Button, Space, Tag, Select } from 'antd';

const { Option } = Select;

const UserFeedbackTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewDetail,
  handleReply,
  handleStatusChange,
  t
}) => {
  const getFeedbackTypeLabel = (type) => {
    const typeMap = {
      'suggestion': '功能建议',
      'bug': '缺陷反馈',
      'question': '使用咨询',
      'other': '其他'
    };
    return typeMap[type] || type;
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      'LOW': 'default',
      'MEDIUM': 'processing',
      'HIGH': 'error'
    };
    return colorMap[priority] || 'default';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'default',
      'PROCESSING': 'processing',
      'RESOLVED': 'success',
      'CLOSED': 'error'
    };
    return colorMap[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': '待处理',
      'PROCESSING': '处理中',
      'RESOLVED': '已解决',
      'CLOSED': '已关闭'
    };
    return statusMap[status] || status;
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
          <th>ID</th>
          <th>用户ID</th>
          <th>反馈类型</th>
          <th>标题</th>
          <th>优先级</th>
          <th>状态</th>
          <th>联系方式</th>
          <th>创建时间</th>
          <th className="fixed-column">操作</th>
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
            <td>{item.id}</td>
            <td>{item.userId || '匿名'}</td>
            <td>{getFeedbackTypeLabel(item.feedbackType)}</td>
            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title}
            </td>
            <td>
              <Tag color={getPriorityColor(item.priority)}>
                {item.priority}
              </Tag>
            </td>
            <td>
              <Select
                value={item.status}
                onChange={(value) => handleStatusChange(item.id, value)}
                style={{ width: 100 }}
                size="small"
              >
                <Option value="PENDING">待处理</Option>
                <Option value="PROCESSING">处理中</Option>
                <Option value="RESOLVED">已解决</Option>
                <Option value="CLOSED">已关闭</Option>
              </Select>
            </td>
            <td>{item.contact || '-'}</td>
            <td>{item.createTime}</td>
            <td className="fixed-column">
              <Space>
                <Button type="link" onClick={() => handleViewDetail(item)}>
                  {t('view')}
                </Button>
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit')}
                </Button>
              </Space>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserFeedbackTable;

