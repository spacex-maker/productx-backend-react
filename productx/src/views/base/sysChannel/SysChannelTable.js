import React from 'react';
import { Button, Tag } from 'antd';
import PropTypes from 'prop-types';

const SysChannelTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  t,
}) => {
  const getTypeLabel = (type) => {
    const typeMap = {
      'SYSTEM': t('systemRecommend') || '系统推荐',
      'TAG': t('tagAggregation') || '标签聚合',
      'MANUAL': t('manualMaintenance') || '人工维护',
    };
    return typeMap[type] || type;
  };

  const getLayoutModeLabel = (layoutMode) => {
    const layoutMap = {
      'MASONRY': t('masonry') || '瀑布流',
      'GRID': t('grid') || '网格',
      'FEED': t('feed') || '单列视频流',
    };
    return layoutMap[layoutMode] || layoutMode;
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
            t('channelKey') || '频道标识',
            t('name') || '显示名称',
            t('type') || '类型',
            t('layoutMode') || '布局模式',
            t('isVipOnly') || t('vipOnly') || 'VIP专属',
            t('allowUserPost') || '允许用户发布',
            t('sortOrder') || '排序',
            t('status'),
            t('createTime'),
            t('updateTime'),
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
            <td className="text-truncate">
              <div style={{ fontWeight: 500 }}>{item.channelKey}</div>
            </td>
            <td className="text-truncate" title={item.name}>
              {item.name || '-'}
            </td>
            <td className="text-truncate">
              <Tag>{getTypeLabel(item.type)}</Tag>
            </td>
            <td className="text-truncate">
              {getLayoutModeLabel(item.layoutMode)}
            </td>
            <td className="text-truncate">
              {item.isVipOnly ? (
                <Tag color="gold">{t('yes') || '是'}</Tag>
              ) : (
                <Tag>{t('no') || '否'}</Tag>
              )}
            </td>
            <td className="text-truncate">
              {item.allowUserPost ? (
                <Tag color="success">{t('yes') || '是'}</Tag>
              ) : (
                <Tag color="default">{t('no') || '否'}</Tag>
              )}
            </td>
            <td className="text-truncate">{item.sortOrder || 0}</td>
            <td className="text-truncate">
              {item.isActive ? (
                <Tag color="success">{t('active') || '启用'}</Tag>
              ) : (
                <Tag color="warning">{t('inactive') || '禁用'}</Tag>
              )}
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
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

SysChannelTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default SysChannelTable;

