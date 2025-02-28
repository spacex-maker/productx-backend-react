import React from 'react';
import { Table, Space, Button } from 'antd';
import moment from 'moment';

const UserRequirementsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusClick,
  t
}) => {
  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
        />
      ),
      dataIndex: 'select',
      width: 50,
      render: (_, record) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(record.id)}
          onChange={() => handleSelectRow(record.id)}
        />
      ),
    },
    {
      title: t('requirementTitle'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('requirementDescription'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('submitterId'),
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: t('priority'),
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const priorityMap = {
          'LOW': t('priorityLow'),
          'MEDIUM': t('priorityMedium'),
          'HIGH': t('priorityHigh'),
          'URGENT': t('priorityUrgent'),
        };
        return priorityMap[priority] || priority;
      },
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          'PENDING': t('statusPending'),
          'IN_PROGRESS': t('statusInProgress'),
          'COMPLETED': t('statusCompleted'),
          'REJECTED': t('statusRejected'),
          'ARCHIVED': t('statusArchived'),
        };
        return statusMap[status] || status;
      },
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const categoryMap = {
          '功能新增': t('categoryNewFeature'),
          'Bug修复': t('categoryBugFix'),
          '性能优化': t('categoryPerformance'),
          'UI优化': t('categoryUI'),
          '安全问题': t('categorySecurity'),
        };
        return categoryMap[category] || category;
      },
    },
    {
      title: t('expectedCompletionDate'),
      dataIndex: 'expectedCompletionDate',
      key: 'expectedCompletionDate',
      render: (date) => date ? moment(date).format('YYYY-MM-DD') : '',
    },
    {
      title: t('rejectionReason'),
      dataIndex: 'rejectedReason',
      key: 'rejectedReason',
    },
    {
      title: t('completionNotes'),
      dataIndex: 'completionNotes',
      key: 'completionNotes',
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('updateTime'),
      dataIndex: 'updateTime',
      key: 'updateTime',
      render: (time) => moment(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('operation'),
      key: 'operation',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEditClick(record)}>
            {t('edit')}
          </Button>
          <Button type="link" onClick={() => handleStatusClick(record)}>
            {t('updateStatus')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      scroll={{ x: true }}
    />
  );
};

export default UserRequirementsTable;
