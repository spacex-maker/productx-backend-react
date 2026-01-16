import React from 'react';
import { Button, Tag, Switch } from 'antd';
import PropTypes from 'prop-types';

const SysAiOperatorTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusChange,
  t,
}) => {
  const getStatusTag = (status) => {
    if (status) {
      return <Tag color="success">{t('running') || '运行中'}</Tag>;
    }
    return <Tag color="default">{t('paused') || '已暂停'}</Tag>;
  };

  const getPostSourceTypeLabel = (type) => {
    const typeMap = {
      'STOCK_POOL': t('stockPool') || '素材库',
      'AI_GENERATE': t('aiGenerate') || 'AI生成',
    };
    return typeMap[type] || type || '-';
  };

  const getLanguageStyleLabel = (style) => {
    const styleMap = {
      'CASUAL': t('casual') || '休闲',
      'FORMAL': t('formal') || '正式',
      'FRIENDLY': t('friendly') || '友好',
      'PROFESSIONAL': t('professional') || '专业',
    };
    return styleMap[style] || style || '-';
  };

  const renderTags = (tagsJson) => {
    if (!tagsJson) return '-';
    try {
      const tags = typeof tagsJson === 'string' ? JSON.parse(tagsJson) : tagsJson;
      if (Array.isArray(tags) && tags.length > 0) {
        return tags.slice(0, 3).map((tag, index) => (
          <Tag key={index} style={{ marginBottom: 4 }}>
            {tag}
          </Tag>
        ));
      }
      return '-';
    } catch (e) {
      return tagsJson;
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
            t('userId') || '用户ID',
            t('internalName') || '内部代号',
            t('languageStyle') || '语言风格',
            t('status') || '状态',
            t('canPost') || '自动发帖',
            t('canComment') || '自动评论',
            t('canLike') || '自动点赞',
            t('postSourceType') || '发帖来源',
            t('actionsPerDay') || '每日互动数',
            t('totalLikesGiven') || '累计点赞',
            t('totalCommentsGiven') || '累计评论',
            t('lastActionTime') || '最后操作时间',
            t('createTime'),
            t('operations')
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
            <td className="text-truncate">{item.userId || '-'}</td>
            <td className="text-truncate" title={item.internalName}>
              {item.internalName || '-'}
            </td>
            <td className="text-truncate">
              <Tag>{getLanguageStyleLabel(item.languageStyle)}</Tag>
            </td>
            <td className="text-truncate">
              <Switch
                checked={item.status}
                onChange={(checked) => handleStatusChange(item.id, checked)}
                size="small"
              />
            </td>
            <td className="text-truncate">
              {item.canPost ? (
                <Tag color="green">{t('yes') || '是'}</Tag>
              ) : (
                <Tag>{t('no') || '否'}</Tag>
              )}
            </td>
            <td className="text-truncate">
              {item.canComment ? (
                <Tag color="green">{t('yes') || '是'}</Tag>
              ) : (
                <Tag>{t('no') || '否'}</Tag>
              )}
            </td>
            <td className="text-truncate">
              {item.canLike ? (
                <Tag color="green">{t('yes') || '是'}</Tag>
              ) : (
                <Tag>{t('no') || '否'}</Tag>
              )}
            </td>
            <td className="text-truncate">
              <Tag>{getPostSourceTypeLabel(item.postSourceType)}</Tag>
            </td>
            <td className="text-truncate">{item.actionsPerDay || 0}</td>
            <td className="text-truncate">{item.totalLikesGiven || 0}</td>
            <td className="text-truncate">{item.totalCommentsGiven || 0}</td>
            <td className="text-truncate">{item.lastActionTime || '-'}</td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit') || '编辑'}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

SysAiOperatorTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default SysAiOperatorTable;

