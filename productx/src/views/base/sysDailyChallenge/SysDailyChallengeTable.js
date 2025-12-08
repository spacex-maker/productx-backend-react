import React from 'react';
import { Button, Tag, Image } from 'antd';
import PropTypes from 'prop-types';
import { formatDate } from 'src/components/common/Common';

const SysDailyChallengeTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  t,
}) => {
  const getStatusLabel = (status) => {
    const statusMap = {
      0: { label: '未开始', color: 'default' },
      1: { label: '进行中', color: 'processing' },
      2: { label: '评审中', color: 'warning' },
      3: { label: '已结束', color: 'success' },
    };
    return statusMap[status] || { label: '未知', color: 'default' };
  };

  const renderChallengeInfo = (item) => {
    const statusInfo = getStatusLabel(item.status);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {item.coverUrl ? (
          <Image
            src={item.coverUrl}
            alt="封面"
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
            preview={false}
          />
        ) : (
          <div style={{ width: 60, height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: 4 }}>
            <span style={{ color: '#999' }}>-</span>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '4px', fontWeight: 500 }} title={item.title}>
            {item.title || '-'}
          </div>
          <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
        </div>
      </div>
    );
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
          {[
            'ID',
            '挑战信息',
            '开始时间',
            '结束时间',
            '投票截止时间',
            t('createTime'),
            t('operations')
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          return (
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
              <td className="text-truncate">{item.id}</td>
              <td style={{ minWidth: '200px' }}>{renderChallengeInfo(item)}</td>
              <td className="text-truncate">{item.startTime ? formatDate(item.startTime) : '-'}</td>
              <td className="text-truncate">{item.endTime ? formatDate(item.endTime) : '-'}</td>
              <td className="text-truncate">{item.votingEndTime ? formatDate(item.votingEndTime) : '-'}</td>
              <td className="text-truncate">{item.createTime}</td>
              <td className="fixed-column">
                <Button type="link" onClick={() => handleEditClick(item)}>
                  {t('edit') || '编辑'}
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

SysDailyChallengeTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default SysDailyChallengeTable;

