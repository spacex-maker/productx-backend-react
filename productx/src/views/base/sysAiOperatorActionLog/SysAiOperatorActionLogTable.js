import React from 'react';
import { Tag, Tooltip, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const SysAiOperatorActionLogTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  t,
  actionTypeOptions,
  actionResultOptions,
}) => {
  const getActionTypeLabel = (type) => {
    const option = actionTypeOptions.find((opt) => opt.value === type);
    return option ? option.label : type || '-';
  };

  const getActionResultTag = (result) => {
    if (result === 'SUCCESS') {
      return <Tag color="success">{t('success') || '成功'}</Tag>;
    } else if (result === 'FAILED') {
      return <Tag color="error">{t('failed') || '失败'}</Tag>;
    }
    return <Tag>{result || '-'}</Tag>;
  };

  const getActionTypeTag = (type) => {
    const colorMap = {
      'GENERATE_IMAGE': 'blue',
      'POST_PUBLISH': 'green',
      'POST_LIKE': 'orange',
      'POST_COMMENT': 'purple',
    };
    return (
      <Tag color={colorMap[type] || 'default'}>
        {getActionTypeLabel(type)}
      </Tag>
    );
  };

  const renderActionDetails = (details) => {
    if (!details) return '-';
    try {
      const parsed = typeof details === 'string' ? JSON.parse(details) : details;
      return (
        <Tooltip title={JSON.stringify(parsed, null, 2)}>
          <span style={{ cursor: 'pointer', color: '#1890ff' }}>
            {t('viewDetails') || '查看详情'}
          </span>
        </Tooltip>
      );
    } catch (e) {
      return details;
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
          {[
            t('id') || 'ID',
            t('operatorId') || '机器人ID',
            t('user') || '用户信息',
            t('actionType') || '行为类型',
            t('actionResult') || '行为结果',
            t('actionDescription') || '行为描述',
            t('resourceId') || '资源ID',
            t('errorMessage') || '错误信息',
            t('actionDetails') || '行为详情',
            t('createTime') || '创建时间',
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
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
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">{item.operatorId || '-'}</td>
            <td className="text-truncate">
              <Space size="small">
                <Avatar
                  src={item.avatar}
                  icon={<UserOutlined />}
                  size="small"
                >
                  {item.username?.[0]?.toUpperCase() || '?'}
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.4 }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{item.username || '-'}</span>
                    {item.nickname && (
                      <span style={{ color: '#999', marginLeft: 4 }}>({item.nickname})</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    ID: {item.userId || '-'}
                  </div>
                </div>
              </Space>
            </td>
            <td className="text-truncate">
              {getActionTypeTag(item.actionType)}
            </td>
            <td className="text-truncate">
              {getActionResultTag(item.actionResult)}
            </td>
            <td className="text-truncate" title={item.actionDescription}>
              {item.actionDescription || '-'}
            </td>
            <td className="text-truncate">{item.resourceId || '-'}</td>
            <td className="text-truncate" title={item.errorMessage}>
              {item.errorMessage ? (
                <Tooltip title={item.errorMessage}>
                  <span style={{ color: '#ff4d4f', cursor: 'pointer' }}>
                    {item.errorMessage.length > 30 
                      ? item.errorMessage.substring(0, 30) + '...' 
                      : item.errorMessage}
                  </span>
                </Tooltip>
              ) : '-'}
            </td>
            <td className="text-truncate">
              {renderActionDetails(item.actionDetails)}
            </td>
            <td className="text-truncate">{item.createTime || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SysAiOperatorActionLogTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  actionTypeOptions: PropTypes.array.isRequired,
  actionResultOptions: PropTypes.array.isRequired,
};

export default SysAiOperatorActionLogTable;
