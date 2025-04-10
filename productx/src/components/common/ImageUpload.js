import React, { useState, useRef, useEffect } from 'react';
import { Upload, message, Image } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
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
  const [previewVisible, setPreviewVisible] = useState(false);
  const containerRef = useRef(null);
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

  // 处理上传
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await api.post('/manage/image/upload', formData);
      if (response) {
        onImageChange(response);
        message.success(t('uploadSuccess'));
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
    }
  };

  // 预览处理
  const handlePreview = (e) => {
    e.stopPropagation();
    setPreviewVisible(true);
  };
  
  const iconSize = type === 'avatar' ? 24 : 30;

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
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {imageUrl ? (
          <div style={avatarContainerStyle}>
            <img src={imageUrl} alt="Avatar" style={avatarImageStyle} />
            <div className="hover-overlay" style={overlayStyle}>
              <button
                type="button"
                onClick={handlePreview}
                style={buttonStyle}
              >
                <EyeOutlined style={{ fontSize: 16, color: '#1890ff' }} />
              </button>
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={({ file }) => handleUpload(file)}
                className="full-width-upload"
              >
                <div style={buttonStyle}>
                  <EditOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                </div>
              </Upload>
            </div>
            {/* 隐藏的Image组件用于预览 */}
            <Image
              style={{ display: 'none' }}
              src={imageUrl}
              preview={{
                visible: previewVisible,
                onVisibleChange: setPreviewVisible,
                src: imageUrl,
              }}
            />
          </div>
        ) : (
          <Upload
            name="file"
            accept="image/*"
            showUploadList={false}
            customRequest={({ file }) => handleUpload(file)}
            className="full-width-upload"
          >
            <div style={avatarPlaceholderStyle}>
              <PlusOutlined style={{ fontSize: iconSize, color: '#1890ff' }} />
              <div style={{ marginTop: 4, fontSize: 12, color: '#1890ff' }}>
                {t('upload')}
              </div>
            </div>
          </Upload>
        )}
        {tipText && <div style={{ color: '#999', fontSize: 12 }}>{tipText}</div>}
      </div>
    );
  }
  
  // 渲染背景图片上传组件
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', display: 'block' }}>
        {imageUrl ? (
          <div className="bg-upload-container" style={{ width: '100%', height: `${containerHeight}px` }}>
            <Image
              src={imageUrl}
              alt="background"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              preview={{ visible: previewVisible, onVisibleChange: setPreviewVisible }}
            />
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
                accept="image/*"
                showUploadList={false}
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
          </div>
        ) : (
          <Upload
            name="file"
            accept="image/*"
            showUploadList={false}
            customRequest={({ file }) => handleUpload(file)}
            style={{ width: '100%', display: 'block' }}
            className="full-width-upload"
          >
            <div className="bg-upload-container upload-placeholder" style={{ width: '100%', height: `${containerHeight}px` }}>
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
            </div>
          </Upload>
        )}
      </div>
      {tipText && <div style={{ color: '#999', fontSize: 12 }}>{tipText}</div>}
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