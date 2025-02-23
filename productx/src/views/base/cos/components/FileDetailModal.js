import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CBadge,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilCopy, cilFile, cilLink } from '@coreui/icons';
import { message } from 'antd';
import { DetailModalWrapper } from './styles';
import styled from 'styled-components';

const isImageUrl = (filename) => {
  const ext = filename?.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext);
};

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || isNaN(bytes)) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const ModernDetailWrapper = styled.div`
  .file-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    
    .file-icon {
      font-size: 32px;
      margin-right: 16px;
      color: #666;
    }
    
    .file-info {
      .file-name {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .file-meta {
        color: #666;
        font-size: 13px;
        
        span {
          margin-right: 16px;
        }
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;

    .info-item {
      .label {
        font-size: 13px;
        color: #666;
        margin-bottom: 4px;
      }

      .value {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  .url-box {
    margin-bottom: 24px;
    
    .url-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      
      .title {
        font-size: 14px;
        font-weight: 500;
      }
    }

    .url-content {
      position: relative;
      display: flex;
      align-items: center;
      border: 1px solid #e8e8e8;
      border-radius: 6px;
      padding: 10px 12px;
      
      .url-text {
        flex: 1;
        font-family: monospace;
        font-size: 13px;
        margin-right: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .url-hint {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
  }

  .preview-box {
    text-align: center;
    border-radius: 6px;
    overflow: hidden;
    
    img {
      max-width: 100%;
      max-height: 300px;
      object-fit: contain;
    }
  }
`;

const FileDetailModal = ({ visible, file, onClose, onDownload }) => {
  if (!file) return null;
  
  console.log('完整的文件信息:', file);  // 检查完整文件对象
  console.log('Size:', file.Size);       // 检查 Size 属性
  console.log('size:', file.size);       // 检查 size 属性
  
  const fileSize = file.Size || file.size;
  console.log('最终使用的大小:', fileSize);  // 检查最终使用的大小

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      message.success('链接已复制到剪贴板');
    });
  };

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader>
        <CModalTitle className="modal-title">
          文件详情
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <ModernDetailWrapper>
          <div className="file-header">
            <CIcon icon={cilFile} className="file-icon" />
            <div className="file-info">
              <div className="file-name">{file.name}</div>
              <div className="file-meta">
                <span>{formatBytes(fileSize)}</span>
                <span>·</span>
                <span>{formatDate(file.lastModified)}</span>
              </div>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="label">存储类型</div>
              <div className="value">
                <CBadge color="info" style={{ padding: '4px 8px' }}>
                  {file.storageClass || 'STANDARD'}
                </CBadge>
              </div>
            </div>
            <div className="info-item">
              <div className="label">存储状态</div>
              <div className="value">
                <CBadge color="success" style={{ padding: '4px 8px' }}>
                  {file.status || '正常'}
                </CBadge>
              </div>
            </div>
            <div className="info-item">
              <div className="label">ETag</div>
              <div className="value">{file.etag?.replace(/"/g, '') || '-'}</div>
            </div>
            <div className="info-item">
              <div className="label">所有者</div>
              <div className="value">
                {file.owner?.DisplayName || '-'}
              </div>
            </div>
          </div>

          <div className="url-box">
            <div className="url-header">
              <div className="title">访问链接</div>
              <CButton
                color="primary"
                variant="ghost"
                size="sm"
                onClick={() => handleCopyUrl(file.url)}
              >
                <CIcon icon={cilCopy} className="me-1" />
                复制链接
              </CButton>
            </div>
            <div className="url-content">
              <CIcon icon={cilLink} style={{ marginRight: '8px', color: '#666' }} />
              <div className="url-text">{file.url}</div>
            </div>
            <div className="url-hint">
              * 链接有效期为24小时，过期后需要重新获取
            </div>
          </div>

          {isImageUrl(file.key) && (
            <div className="preview-box">
              <img 
                src={file.url} 
                alt={file.name}
              />
            </div>
          )}
        </ModernDetailWrapper>
      </CModalBody>
      <CModalFooter style={{ borderTop: '1px solid #e8e8e8' }}>
        <CButton 
          color="primary"
          onClick={() => onDownload(file)}
        >
          <CIcon icon={cilCloudDownload} className="me-1" />
          下载文件
        </CButton>
        <CButton 
          color="secondary"
          variant="ghost"
          onClick={onClose}
        >
          关闭
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default FileDetailModal; 