import React, { useState, useRef, useEffect } from 'react';
import { Upload, message, Image, Spin, Progress, Modal, Switch } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, LoadingOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import api from 'src/axiosInstance';
import 'src/views/base/saAiAgent/updateSaAiAgentStyle.css';

const ImageUpload = ({
  imageUrl,
  onImageChange,
  type = 'background',
  tipText,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [enableCompress, setEnableCompress] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(type === 'avatar' ? 100 : 120);

  // 监听容器宽度变化，保持2:1宽高比
  useEffect(() => {
    if (type === 'background' && containerRef.current) {
      const updateHeight = () => {
        const width = containerRef.current.clientWidth;
        setContainerHeight(width / 2);
      };
      updateHeight();
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(containerRef.current);
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, [type]);

  // 文件上传前验证
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      message.error(t('pleaseUploadImageOrVideoFile') || '只能上传图片或视频文件！');
      return false;
    }
    return true;
  };

  // 图片压缩函数
  const compressImage = (file, targetSizeKB = 500, minSizeKB = 300, maxSizeKB = 700) => {
    return new Promise((resolve, reject) => {
      const fileSizeKB = file.size / 1024;
      
      // 如果文件大小已经在目标范围内，直接返回
      if (fileSizeKB >= minSizeKB && fileSizeKB <= maxSizeKB) {
        resolve(file);
        return;
      }

      // 如果文件小于最小目标大小，也不压缩
      if (fileSizeKB < minSizeKB) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 计算压缩后的尺寸（保持宽高比）
          let width = img.width;
          let height = img.height;
          const maxDimension = 1920; // 最大尺寸限制
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // 绘制图片
          ctx.drawImage(img, 0, 0, width, height);
          
          // 尝试不同的质量值来达到目标文件大小
          const tryCompress = (quality) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('压缩失败'));
                  return;
                }
                
                const blobSizeKB = blob.size / 1024;
                
                // 如果文件大小在目标范围内，或者质量已经很低了，就使用这个结果
                if ((blobSizeKB >= minSizeKB && blobSizeKB <= maxSizeKB) || quality <= 0.1) {
                  const compressedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                } else if (blobSizeKB > maxSizeKB && quality > 0.1) {
                  // 如果还是太大，继续降低质量
                  tryCompress(Math.max(0.1, quality - 0.1));
                } else if (blobSizeKB < minSizeKB && quality < 0.9) {
                  // 如果太小了，稍微提高质量
                  tryCompress(Math.min(0.9, quality + 0.1));
                } else {
                  // 其他情况直接使用
                  const compressedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                  });
                  resolve(compressedFile);
                }
              },
              file.type,
              quality
            );
          };
          
          // 从0.8开始尝试
          tryCompress(0.8);
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  };

  // 处理上传
  const handleUpload = async (file) => {
    try {
      setLoading(true);
      setUploadProgress(0);
      setUploadSuccess(false);
      
      // 如果是图片文件且启用了压缩，先压缩
      let fileToUpload = file;
      if (file.type.startsWith('image/') && enableCompress) {
        try {
          fileToUpload = await compressImage(file);
        } catch (error) {
          console.error('图片压缩失败:', error);
          message.warning(t('imageCompressFailed') || '图片压缩失败，将上传原图');
        }
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      
      const response = await api.post('/manage/image/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      
      if (response) {
        onImageChange(response);
        setUploadSuccess(true);
        message.success(t('uploadSuccess'));
        // 2秒后隐藏成功状态
        setTimeout(() => {
          setUploadSuccess(false);
        }, 2000);
      } else {
        message.error(t('responseFormatError'));
      }
      return false;
    } catch (error) {
      console.error('Upload failed:', error);
      message.error(t('uploadFailed'));
      return false;
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // 判断是否为视频文件
  const isVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp', '.ogv'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // 预览处理
  const handlePreview = (e) => {
    e.stopPropagation();
    setPreviewVisible(true);
  };

  // 关闭预览时暂停视频
  const handlePreviewCancel = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setPreviewVisible(false);
  };
  
  const iconSize = type === 'avatar' ? 24 : 30;
  const isVideo = isVideoFile(imageUrl);

  // 渲染头像上传组件
  if (type === 'avatar') {
    const avatarContainerStyle = {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      overflow: 'hidden',
      position: 'relative',
      margin: '0 auto',
      border: '1px solid #1890ff',
    };
    
    const avatarImageStyle = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    };
    
    const avatarPlaceholderStyle = {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      overflow: 'hidden',
      position: 'relative',
      margin: '0 auto',
      border: '1px dashed #1890ff',
      backgroundColor: 'rgba(24, 144, 255, 0.04)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    };
    
    const overlayStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 10,
    };
    
    const buttonStyle = {
      width: 32,
      height: 32,
      margin: '0 4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.8)',
      border: 'none',
      borderRadius: '50%',
      cursor: 'pointer',
    };

    const loadingOverlayStyle = {
      ...overlayStyle,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      flexDirection: 'column',
      gap: '8px',
    };
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {imageUrl ? (
          <div style={avatarContainerStyle}>
            {isVideo ? (
              <video
                src={imageUrl}
                style={avatarImageStyle}
                muted
                playsInline
              />
            ) : (
              <img src={imageUrl} alt="Avatar" style={avatarImageStyle} />
            )}
            {loading ? (
              <div style={loadingOverlayStyle}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#1890ff' }} spin />} />
              </div>
            ) : uploadSuccess ? (
              <div style={loadingOverlayStyle}>
                <CheckCircleFilled style={{ fontSize: 32, color: '#52c41a' }} />
              </div>
            ) : (
              <div className="hover-overlay" style={overlayStyle}>
                <button
                  type="button"
                  onClick={handlePreview}
                  style={buttonStyle}
                >
                  <EyeOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                </button>
                <Upload
                  accept="image/*,video/*"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={({ file }) => handleUpload(file)}
                  className="full-width-upload"
                >
                  <div style={buttonStyle}>
                    <EditOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                  </div>
                </Upload>
              </div>
            )}
            {!isVideo && (
              <Image
                style={{ display: 'none' }}
                src={imageUrl}
                preview={{
                  visible: previewVisible,
                  onVisibleChange: setPreviewVisible,
                  src: imageUrl,
                }}
              />
            )}
            {isVideo && (
              <Modal
                open={previewVisible}
                footer={null}
                onCancel={handlePreviewCancel}
                width="90%"
                style={{ maxWidth: '1200px' }}
                zIndex={2000}
              >
                <video
                  ref={videoRef}
                  controls
                  style={{ width: '100%' }}
                  src={imageUrl}
                />
              </Modal>
            )}
          </div>
        ) : (
          <Upload
            name="file"
            accept="image/*,video/*"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={({ file }) => handleUpload(file)}
            className="full-width-upload"
          >
            <div style={avatarPlaceholderStyle}>
              {loading ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#1890ff' }} spin />} />
              ) : uploadSuccess ? (
                <CheckCircleFilled style={{ fontSize: 32, color: '#52c41a' }} />
              ) : (
                <>
                  <PlusOutlined style={{ fontSize: iconSize, color: '#1890ff' }} />
                  <div style={{ marginTop: 4, fontSize: 12, color: '#1890ff' }}>
                    {t('upload')}
                  </div>
                </>
              )}
            </div>
          </Upload>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tipText && <div style={{ color: '#999', fontSize: 12 }}>{tipText}</div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Switch
              checked={enableCompress}
              onChange={setEnableCompress}
              size="small"
            />
            <span style={{ fontSize: 12, color: '#666' }}>
              {t('enableImageCompress') || '压缩图片 (300-700KB)'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  // 渲染背景图片上传组件
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', display: 'block' }}>
        {imageUrl ? (
          <div className="bg-upload-container" style={{ width: '100%', height: `${containerHeight}px`, position: 'relative' }}>
            {isVideo ? (
              <video
                src={imageUrl}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                muted
                playsInline
              />
            ) : (
              <Image
                src={imageUrl}
                alt="background"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                preview={{ visible: previewVisible, onVisibleChange: setPreviewVisible }}
              />
            )}
            {loading ? (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 20,
                gap: '16px',
              }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#1890ff' }} spin />} />
                <Progress type="line" percent={uploadProgress} style={{ width: '80%' }} />
              </div>
            ) : (
              <div
                className="hover-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <button
                  type="button"
                  onClick={handlePreview}
                  style={{
                    width: 32,
                    height: 32,
                    margin: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                >
                  <EyeOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                </button>
                <Upload
                  accept="image/*,video/*"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={({ file }) => handleUpload(file)}
                  className="full-width-upload"
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    margin: '0 4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}>
                    <EditOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                  </div>
                </Upload>
              </div>
            )}
            {isVideo && (
              <Modal
                open={previewVisible}
                footer={null}
                onCancel={handlePreviewCancel}
                width="90%"
                style={{ maxWidth: '1200px' }}
                zIndex={2000}
              >
                <video
                  ref={videoRef}
                  controls
                  style={{ width: '100%' }}
                  src={imageUrl}
                />
              </Modal>
            )}
          </div>
        ) : (
          <Upload
            name="file"
            accept="image/*,video/*"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={({ file }) => handleUpload(file)}
            style={{ width: '100%', display: 'block' }}
            className="full-width-upload"
          >
            <div className="bg-upload-container upload-placeholder" style={{ width: '100%', height: `${containerHeight}px` }}>
              {loading ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#1890ff' }} spin />} />
                  <Progress type="line" percent={uploadProgress} style={{ width: '80%' }} />
                </div>
              ) : (
                <>
                  <PlusOutlined style={{ fontSize: iconSize, color: '#1890ff' }} />
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 14,
                      color: '#1890ff',
                    }}
                  >
                    {t('upload')}
                  </div>
                </>
              )}
            </div>
          </Upload>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {tipText && <div style={{ color: '#999', fontSize: 12 }}>{tipText}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch
            checked={enableCompress}
            onChange={setEnableCompress}
            size="small"
          />
          <span style={{ fontSize: 12, color: '#666' }}>
            {t('enableImageCompress') || '压缩图片 (300-700KB)'}
          </span>
        </div>
      </div>
    </div>
  );
};

ImageUpload.propTypes = {
  imageUrl: PropTypes.string,
  onImageChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['background', 'avatar']),
  tipText: PropTypes.string,
};

export default ImageUpload;