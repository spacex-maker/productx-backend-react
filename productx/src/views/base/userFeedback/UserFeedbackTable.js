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
      'suggestion': t('suggestion'),
      'bug': t('bug'),
      'question': t('question'),
      'other': t('other')
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
      'PENDING': t('pending'),
      'PROCESSING': t('processing'),
      'RESOLVED': t('resolved'),
      'CLOSED': t('closed')
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
          <th>{t('userId')}</th>
          <th>{t('feedbackType')}</th>
          <th>{t('title')}</th>
          <th>{t('priority')}</th>
          <th>{t('status')}</th>
          <th>{t('contact')}</th>
          <th>{t('createTime')}</th>
          <th className="fixed-column">{t('actions')}</th>
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
            <td>{item.userId || t('anonymous')}</td>
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
                <Option value="PENDING">{t('pending')}</Option>
                <Option value="PROCESSING">{t('processing')}</Option>
                <Option value="RESOLVED">{t('resolved')}</Option>
                <Option value="CLOSED">{t('closed')}</Option>
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

