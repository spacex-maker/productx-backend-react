import React from 'react';
import { Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../utils/dateUtils';

const SaAiTokenUsageLogTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
}) => {
  const { t } = useTranslation();

  const getSuccessTag = (success) => {
    if (success) {
      return <Tag color="success">{t('success')}</Tag>;
    }
    return <Tag color="error">{t('failed')}</Tag>;
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
          <th>{t('agentId')}</th>
          <th>{t('modelName')}</th>
          <th>{t('tokens')}</th>
          <th>{t('cost')}</th>
          <th>{t('duration')}</th>
          <th>{t('ipInfo')}</th>
          <th>{t('createTime')}</th>
          <th>{t('status')}</th>
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
                <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={item.avatar}
                  alt="avatar"
                  style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{item.nickname}</span>
                  <span style={{ color: '#666', fontSize: '12px' }}>{item.username}</span>
                </div>
                <span style={{ color: '#999', fontSize: '12px' }}>({item.userId})</span>
              </div>
            </td>
            <td>{item.agentId}</td>
            <td>{item.modelName}</td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Prompt: {item.promptTokens}</span>
                <span>Completion: {item.completionTokens}</span>
                <span>Total: {item.totalTokens}</span>
              </div>
            </td>
            <td>
              {item.cost} {item.currency || 'USD'}
            </td>
            <td>{item.durationMs}ms</td>
            <td>
              <Tooltip title={item.errorMessage || ''}>
                <div>{item.ipAddress}</div>
              </Tooltip>
            </td>
            <td>{formatDate(item.createTime)}</td>
            <td>{getSuccessTag(item.success)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SaAiTokenUsageLogTable;
