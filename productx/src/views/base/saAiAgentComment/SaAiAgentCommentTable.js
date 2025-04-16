import React from 'react';
import { Button, Avatar, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../utils/dateUtils';

const SaAiAgentCommentTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusChange,
}) => {
  const { t } = useTranslation();

  const getStatusTag = (status) => {
    switch (status) {
      case 0:
        return <Tag color="warning">{t('pending')}</Tag>;
      case 1:
        return <Tag color="success">{t('approved')}</Tag>;
      case 2:
        return <Tag color="error">{t('blocked')}</Tag>;
      case -1:
        return <Tag color="default">{t('deleted')}</Tag>;
      default:
        return <Tag>{t('unknown')}</Tag>;
    }
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
          <th>{t('user')}</th>
          <th>{t('content')}</th>
          <th>{t('agentId')}</th>
          <th>{t('parentId')}</th>
          <th>{t('interaction')}</th>
          <th>{t('ipInfo')}</th>
          <th>{t('createTime')}</th>
          <th>{t('status')}</th>
          <th>{t('operation')}</th>
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
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar src={item.avatar} size="small" />
                <span>{item.nickname}</span>
                <span style={{ color: '#999', fontSize: '12px' }}>({item.userId})</span>
              </div>
            </td>
            <td>
              <div style={{ maxWidth: '300px', wordBreak: 'break-all' }}>
                {item.content}
              </div>
            </td>
            <td>{item.agentId}</td>
            <td>{item.parentId || '-'}</td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>点赞: {item.likeCount}</span>
                <span>回复: {item.replyCount}</span>
                <span>热度: {item.hotScore}</span>
              </div>
            </td>
            <td>
              <Tooltip title={item.userAgent}>
                <div>{item.ipAddress}</div>
              </Tooltip>
            </td>
            <td>{formatDate(item.createTime)}</td>
            <td>{getStatusTag(item.status)}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
              {item.status !== 1 && (
                <Button
                  type="link"
                  onClick={() => handleStatusChange(item.id, 1)}
                >
                  {t('approve')}
                </Button>
              )}
              {item.status !== 2 && (
                <Button
                  type="link"
                  onClick={() => handleStatusChange(item.id, 2)}
                >
                  {t('block')}
                </Button>
              )}
              {item.status !== -1 && (
                <Button
                  type="link"
                  onClick={() => handleStatusChange(item.id, -1)}
                >
                  {t('delete')}
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SaAiAgentCommentTable;
