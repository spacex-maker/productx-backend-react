import React from 'react';
import { Table, Button, Switch, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledTable = styled(Table)`
  .ant-table {
    font-size: 12px;
  }

  .ant-table-thead > tr > th {
    padding: 8px;
    font-weight: 500;
  }

  .ant-table-tbody > tr > td {
    padding: 8px;
  }

  .ant-btn {
    padding: 0 8px;
    height: 24px;
    font-size: 12px;
  }
`;

const UserProductCategoryTable = ({
  data,
  onEdit,
  onDelete,
  onStatusChange,
  loading
}) => {
  const { t } = useTranslation();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t('i18nKey'),
      dataIndex: 'i18nKey',
      key: 'i18nKey',
    },
    {
      title: t('categoryName'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t('parentCategory'),
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId) => {
        const parent = data.find(item => item.id === parentId);
        return parent ? parent.name : '-';
      }
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status, record) => (
        <Switch
          checked={status === 1}
          onChange={(checked) => onStatusChange(record.id, checked)}

        />
      ),
    },
    {
      title: t('action'),
      key: 'action',
      width: 150
    }
  ];

  return (
    <StyledTable
      dataSource={data}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10 }}
    >
      <Table.Column
        title={t('edit')}
        key="edit"
        width={100}
        render={(text, record) => (
          <Button type="primary" onClick={() => onEdit(record.id)}>
            {t('edit')}
          </Button>
        )}
      />
      <Table.Column
        title={t('delete')}
        key="delete"
        width={100}
        render={(text, record) => (
          <Popconfirm
            title={t('confirmDelete')}
            onConfirm={() => onDelete(record.id)}
            okText={t('ok')}
            cancelText={t('cancel')}
          >
            <Button type="danger">{t('delete')}</Button>
          </Popconfirm>
        )}
      />
    </StyledTable>
  );
};

export default UserProductCategoryTable;
