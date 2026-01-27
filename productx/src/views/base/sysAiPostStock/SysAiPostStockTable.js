import React from 'react';
import { Button, Tag, Image } from 'antd';
import PropTypes from 'prop-types';

const SysAiPostStockTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  agentList,
  t,
}) => {
  /**
   * 添加腾讯云图片压缩后缀
   * @param {string} url - 图片URL
   * @param {number} width - 缩略图宽度
   * @returns {string} 添加压缩后缀的URL
   */
  const addImageCompressSuffix = (url, width = 200) => {
    if (!url) return '';
    // 如果已经包含压缩参数或是base64图片，直接返回
    if (url.includes('imageMogr2') || url.startsWith('data:')) return url;
    // 添加腾讯云万象压缩参数
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}imageMogr2/format/webp/quality/80/thumbnail/${width}x`;
  };

  const getStatusTag = (status) => {
    const statusMap = {
      0: { label: t('pendingReview') || '待审核', color: 'processing' },
      1: { label: t('pendingPublish') || '待发布', color: 'default' },
      2: { label: t('published') || '已发布', color: 'success' },
      3: { label: t('rejected') || '废弃', color: 'error' },
    };
    const statusInfo = statusMap[status] || { label: t('unknown') || '未知', color: 'default' };
    return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
  };

  const getAgentName = (agentId) => {
    if (!agentId) return '-';
    const agent = agentList.find(a => a.id === agentId);
    return agent ? agent.internalName : `ID: ${agentId}`;
  };

  const renderCategoryTags = (tagsJson) => {
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
      return '-';
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
            t('preview') || '预览',
            t('imageUrl') || '图片地址',
            t('assignedAgent') || '指定AI',
            t('status') || '状态',
            t('width') || '宽度',
            t('height') || '高度',
            t('categoryTags') || '分类标签',
            t('publishTime') || '发布时间',
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
            <td>
              {item.imageUrl ? (
                <Image
                  src={addImageCompressSuffix(item.imageUrl, 400)}
                  alt={t('preview') || '预览'}
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                  preview={{
                    src: addImageCompressSuffix(item.imageUrl, 1200),
                    mask: <div style={{ fontSize: '12px' }}>点击查看大图</div>
                  }}
                />
              ) : (
                '-'
              )}
            </td>
            <td className="text-truncate" title={item.imageUrl}>
              {item.imageUrl ? (
                <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
                  {item.imageUrl.length > 50 ? `${item.imageUrl.substring(0, 50)}...` : item.imageUrl}
                </a>
              ) : (
                '-'
              )}
            </td>
            <td className="text-truncate">{getAgentName(item.assignedAgentId)}</td>
            <td className="text-truncate">{getStatusTag(item.status)}</td>
            <td className="text-truncate">{item.width || '-'}</td>
            <td className="text-truncate">{item.height || '-'}</td>
            <td className="text-truncate">{renderCategoryTags(item.categoryTags)}</td>
            <td className="text-truncate">{item.publishTime || '-'}</td>
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

SysAiPostStockTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  agentList: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default SysAiPostStockTable;

