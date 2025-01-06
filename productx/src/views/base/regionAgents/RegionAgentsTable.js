import React from 'react';
import { Button, Tag, Space, Select } from 'antd';
import { useTranslation } from 'react-i18next';

const RegionAgentsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleViewDetail,
}) => {
  const { t } = useTranslation();

  const getAuditStatusTag = (status) => {
    const statusMap = {
      0: { color: 'default', text: '待审核' },
      1: { color: 'success', text: '已通过' },
      2: { color: 'error', text: '已拒绝' },
    };
    const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '代理人ID',
      dataIndex: 'agentId',
      key: 'agentId',
    },
    {
      title: '代理人名称',
      dataIndex: 'agentName',
      key: 'agentName',
    },
    {
      title: '代理类型',
      dataIndex: 'agentType',
      key: 'agentType',
    },
    {
      title: '区域名称',
      dataIndex: 'regionName',
      key: 'regionName',
    },
    {
      title: '区域编码',
      dataIndex: 'regionCode',
      key: 'regionCode',
    },
    {
      title: '是否独家代理',
      dataIndex: 'isExclusive',
      key: 'isExclusive',
      render: (isExclusive) => (
        <Tag color={isExclusive ? 'green' : 'default'}>
          {isExclusive ? '是' : '否'}
        </Tag>
      ),
    },
    {
      title: '授权开始时间',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: '授权结束时间',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            {t('detail')}
          </Button>
          <Button type="link" size="small" onClick={() => handleEditClick(record)}>
            {t('edit')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => handleSelectAll(e, data)}
            />
          </th>
          <th>{t('agentName')}</th>
          <th>{t('agentType')}</th>
          <th>{t('regionCode')}</th>
          <th>{t('regionName')}</th>
          <th>{t('agentLevel')}</th>
          <th>{t('isExclusive')}</th>
          <th>{t('auditStatus')}</th>
          <th>{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>
              <input
                type="checkbox"
                checked={selectedRows.includes(item.id)}
                onChange={() => handleSelectRow(item.id, data)}
              />
            </td>
            <td>{item.agentName}</td>
            <td>{item.agentType}</td>
            <td>{item.regionCode}</td>
            <td>{item.regionName}</td>
            <td>
              {(() => {
                switch (item.agentLevel) {
                  case 1:
                    return t('primaryAgent');
                  case 2:
                    return t('secondaryAgent');
                  case 3:
                    return t('tertiaryAgent');
                  default:
                    return '-';
                }
              })()}
            </td>
            <td>{item.isExclusive ? '是' : '否'}</td>
            <td>{getAuditStatusTag(item.auditStatus)}</td>
            <td>
              <Space size="small">
                <Button type="link" size="small" onClick={() => handleViewDetail(item)}>
                  {t('detail')}
                </Button>
                <Button type="link" size="small" onClick={() => handleEditClick(item)}>
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

export default RegionAgentsTable;