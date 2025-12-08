import React from 'react';
import { Button, Tag, Image, Avatar } from 'antd';
import PropTypes from 'prop-types';

const CommunityPostTable = ({
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
      0: { label: '审核中', color: 'processing' },
      1: { label: '公开', color: 'success' },
      2: { label: '私有', color: 'default' },
      9: { label: '违规下架', color: 'error' },
    };
    return statusMap[status] || { label: '未知', color: 'default' };
  };

  const getMediaTypeLabel = (mediaType) => {
    const typeMap = {
      'IMAGE': '图片',
      'VIDEO': '视频',
    };
    return typeMap[mediaType] || mediaType;
  };

  const renderMediaPreview = (item) => {
    if (!item.coverUrl && !item.mediaUrls) return '-';
    
    const mediaUrl = item.coverUrl || (Array.isArray(item.mediaUrls) ? item.mediaUrls[0] : null);
    if (!mediaUrl) return '-';

    return (
      <Image
        src={mediaUrl}
        alt="预览"
        width={60}
        height={60}
        style={{ objectFit: 'cover', borderRadius: 4 }}
        preview={false}
      />
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
            '预览',
            '用户',
            '标题',
            '媒体类型',
            '状态',
            '是否精选',
            '频道ID',
            '浏览量',
            '点赞数',
            '评论数',
            '收藏数',
            t('createTime'),
            t('operations')
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => {
          const statusInfo = getStatusLabel(item.status);
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
              <td>{renderMediaPreview(item)}</td>
              <td className="text-truncate">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar 
                    src={item.avatar} 
                    size={40}
                    style={{ flexShrink: 0 }}
                  >
                    {item.username ? item.username.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span title={item.username}>{item.username || '-'}</span>
                    <span style={{ fontSize: '12px', color: '#999' }}>ID: {item.userId || '-'}</span>
                  </div>
                </div>
              </td>
              <td className="text-truncate" title={item.title}>
                {item.title || '-'}
              </td>
              <td className="text-truncate">
                <Tag>{getMediaTypeLabel(item.mediaType)}</Tag>
              </td>
              <td className="text-truncate">
                <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
              </td>
              <td className="text-truncate">
                {item.isFeatured ? (
                  <Tag color="gold">是</Tag>
                ) : (
                  <Tag>否</Tag>
                )}
              </td>
              <td className="text-truncate">{item.channelId || '-'}</td>
              <td className="text-truncate">{item.viewCount || 0}</td>
              <td className="text-truncate">{item.likeCount || 0}</td>
              <td className="text-truncate">{item.commentCount || 0}</td>
              <td className="text-truncate">{item.collectCount || 0}</td>
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

CommunityPostTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default CommunityPostTable;

