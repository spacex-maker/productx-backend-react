import React from 'react';
import { Button, Avatar, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const SaAiAgentTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleEnableStatusChange,
}) => {
  const { t } = useTranslation();

  const getModelTypeColor = (modelType) => {
    switch (modelType) {
      case 'gpt-4-turbo':
        return 'purple';
      case 'gpt-4':
        return 'blue';
      case 'gpt-3.5-turbo':
        return 'green';
      default:
        return 'default';
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
          <th>{t('agentInfo')}</th>
          <th>{t('modelType')}</th>
          <th>{t('roles')}</th>
          <th>{t('mbtiCode')}</th>
          <th>{t('temperature')}</th>
          <th>{t('maxTokens')}</th>
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
                <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar src={item.avatarUrl} size={40} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  {item.userId && <div style={{ color: '#666', fontSize: '12px' }}>ID: {item.userId}</div>}
                </div>
              </div>
            </td>
            <td>
              <Tag color={getModelTypeColor(item.modelType)}>{item.modelType}</Tag>
            </td>
            <td>{item.roles}</td>
            <td>{item.mbtiCode}</td>
            <td>{item.temperature}</td>
            <td>{item.maxTokens}</td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status === 'active'}
                  onChange={(e) => handleEnableStatusChange(item.id, e)}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SaAiAgentTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    modelType: PropTypes.string,
    roles: PropTypes.string,
    mbtiCode: PropTypes.string,
    temperature: PropTypes.number,
    maxTokens: PropTypes.number,
    status: PropTypes.string
  })).isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.arrayOf(PropTypes.number).isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  handleEnableStatusChange: PropTypes.func.isRequired
};

export default SaAiAgentTable;
