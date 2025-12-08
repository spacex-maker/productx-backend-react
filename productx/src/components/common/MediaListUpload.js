import React, { useState, useEffect } from 'react';
import { Upload, message, Image, Button, Space, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, EyeOutlined, LinkOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import api from 'src/axiosInstance';

const MediaListUpload = ({
  mediaUrls = [],
  onChange,
  maxCount = 10,
}) => {
  const [mediaList, setMediaList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingUrl, setEditingUrl] = useState('');

  useEffect(() => {
    // 初始化媒体列表
    let urls = [];
    if (mediaUrls) {
      if (typeof mediaUrls === 'string') {
        try {
          const parsed = JSON.parse(mediaUrls);
          if (Array.isArray(parsed)) {
            urls = parsed;
          } else {
            // 如果不是数组，按换行符分割
            urls = String(mediaUrls).split('\n').filter(url => url && url.trim());
          }
        } catch (e) {
          // 解析失败，按换行符分割
          urls = String(mediaUrls).split('\n').filter(url => url && url.trim());
        }
      } else if (Array.isArray(mediaUrls)) {
        urls = mediaUrls;
      }
    }
    setMediaList(urls.filter(url => url && url.trim()));
  }, [mediaUrls]);

  // 判断是否为视频
  const isVideo = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // 更新媒体列表并通知父组件
  const updateMediaList = (newList) => {
    setMediaList(newList);
    if (onChange) {
      onChange(JSON.stringify(newList));
    }
  };

  // 添加新媒体（通过上传）
  const handleAddMedia = (url) => {
    if (mediaList.length >= maxCount) {
      message.warning(`最多只能添加${maxCount}个媒体`);
      return;
    }
    const newList = [...mediaList, url];
    updateMediaList(newList);
  };

  // 替换某个媒体（通过上传）
  const handleReplaceMedia = (index, url) => {
    const newList = [...mediaList];
    newList[index] = url;
    updateMediaList(newList);
    setEditingIndex(-1);
  };

  // 删除媒体
  const handleDeleteMedia = (index) => {
    const newList = mediaList.filter((_, i) => i !== index);
    updateMediaList(newList);
  };

  // 开始编辑URL
  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditingUrl(mediaList[index]);
  };

  // 保存编辑的URL
  const handleSaveEdit = () => {
    if (!editingUrl.trim()) {
      message.warning('请输入有效的媒体地址');
      return;
    }
    const newList = [...mediaList];
    newList[editingIndex] = editingUrl.trim();
    updateMediaList(newList);
    setEditingIndex(-1);
    setEditingUrl('');
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingIndex(-1);
    setEditingUrl('');
  };

  // 手动添加URL
  const handleAddUrl = () => {
    if (mediaList.length >= maxCount) {
      message.warning(`最多只能添加${maxCount}个媒体`);
      return;
    }
    setEditingIndex(mediaList.length);
    setEditingUrl('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {mediaList.map((url, index) => (
          <div
            key={index}
            style={{
              width: '120px',
              height: '120px',
              position: 'relative',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            {editingIndex === index ? (
              <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Input
                  value={editingUrl}
                  onChange={(e) => setEditingUrl(e.target.value)}
                  placeholder="输入媒体地址"
                  size="small"
                  style={{ flex: 1 }}
                />
                <Space size="small" style={{ justifyContent: 'flex-end' }}>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleSaveEdit}
                  >
                    保存
                  </Button>
                  <Button
                    size="small"
                    onClick={handleCancelEdit}
                  >
                    取消
                  </Button>
                </Space>
              </div>
            ) : (
              <>
                {isVideo(url) ? (
                  <video
                    src={url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={url}
                    alt={`媒体 ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    preview={{
                      mask: (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <EyeOutlined />
                        </div>
                      ),
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    gap: '8px',
                  }}
                  className="media-hover-overlay"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                >
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    style={{ color: '#fff' }}
                    onClick={() => handleStartEdit(index)}
                    title="编辑链接"
                  />
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    style={{ color: '#fff' }}
                    onClick={() => handleDeleteMedia(index)}
                    title="删除"
                  />
                </div>
              </>
            )}
          </div>
        ))}

        {/* 添加媒体按钮 */}
        {mediaList.length < maxCount && editingIndex !== mediaList.length && (
          <Upload
            accept="image/*,video/*"
            showUploadList={false}
            customRequest={({ file, onSuccess, onError }) => {
              const formData = new FormData();
              formData.append('file', file);
              api.post('/manage/image/upload', formData)
                .then((response) => {
                  if (response) {
                    handleAddMedia(response);
                    onSuccess(response);
                  } else {
                    onError(new Error('上传失败'));
                  }
                })
                .catch((error) => {
                  onError(error);
                  message.error('上传失败');
                });
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                border: '1px dashed #d9d9d9',
                borderRadius: '4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                gap: '8px',
                backgroundColor: '#fafafa',
              }}
            >
              <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
                上传媒体
              </div>
              <Button
                type="link"
                size="small"
                icon={<LinkOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddUrl();
                }}
                style={{ fontSize: '12px' }}
              >
                输入链接
              </Button>
            </div>
          </Upload>
        )}

        {/* 手动输入URL的输入框 */}
        {editingIndex === mediaList.length && (
          <div
            style={{
              width: '120px',
              height: '120px',
              border: '1px dashed #1890ff',
              borderRadius: '4px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <Input
              value={editingUrl}
              onChange={(e) => setEditingUrl(e.target.value)}
              placeholder="输入媒体地址"
              size="small"
              style={{ flex: 1 }}
            />
            <Space size="small" style={{ justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                size="small"
                onClick={handleSaveEdit}
              >
                添加
              </Button>
              <Button
                size="small"
                onClick={handleCancelEdit}
              >
                取消
              </Button>
            </Space>
          </div>
        )}
      </div>

      {/* 替换媒体上传组件（当编辑时显示） */}
      {editingIndex >= 0 && editingIndex < mediaList.length && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
            或上传新文件替换：
          </div>
          <Upload
            accept="image/*,video/*"
            showUploadList={false}
            customRequest={({ file, onSuccess, onError }) => {
              const formData = new FormData();
              formData.append('file', file);
              api.post('/manage/image/upload', formData)
                .then((response) => {
                  if (response) {
                    handleReplaceMedia(editingIndex, response);
                    onSuccess(response);
                  } else {
                    onError(new Error('上传失败'));
                  }
                })
                .catch((error) => {
                  onError(error);
                  message.error('上传失败');
                });
            }}
          >
            <Button icon={<PlusOutlined />}>上传文件替换</Button>
          </Upload>
        </div>
      )}
    </div>
  );
};

MediaListUpload.propTypes = {
  mediaUrls: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  onChange: PropTypes.func.isRequired,
  maxCount: PropTypes.number,
};

export default MediaListUpload;

