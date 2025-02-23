import React from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCloudDownload, cilCheckCircle, cilClock } from '@coreui/icons';
import { 
  FileOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  FileZipOutlined,
  FileTextOutlined,
  FileMarkdownOutlined,
  FileUnknownOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const ProgressWrapper = styled.div`
  .total-progress {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--cui-border-color);
  }

  .progress-card {
    padding: 16px 0;
    border-bottom: 1px solid var(--cui-border-color);
    
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    &:first-child {
      padding-top: 0;
    }
  }

  .file-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .file-name {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--cui-body-color);

    .file-icon {
      color: var(--cui-text-muted);
      flex-shrink: 0;
    }
  }

  .download-info {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 13px;
    color: var(--cui-text-muted);
  }

  .progress-bar {
    height: 6px;
    border-radius: 3px;
    margin: 8px 0;
    background-color: var(--cui-progress-bg);

    .progress-inner {
      height: 100%;
      border-radius: 3px;
      background-color: var(--cui-primary);
      transition: width 0.3s ease;
    }

    &.complete .progress-inner {
      background-color: var(--cui-success);
    }
  }

  .progress-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    margin-top: 8px;
    color: var(--cui-text-muted);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
    
    &.downloading {
      background-color: var(--cui-primary-bg-subtle);
      color: var(--cui-primary);
    }
    
    &.complete {
      background-color: var(--cui-success-bg-subtle);
      color: var(--cui-success);
    }
  }

  .file-type {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    background-color: var(--cui-gray-100);
    color: var(--cui-gray-600);
    margin-left: 8px;
    text-transform: uppercase;
  }
`;

const DownloadProgressModal = ({ visible, downloading, progress, speeds, onClose }) => {
  const calculateTotalProgress = () => {
    if (!progress || Object.keys(progress).length === 0) return 0;
    const total = Object.values(progress).reduce((acc, curr) => acc + curr, 0);
    return Math.round(total / Object.keys(progress).length);
  };

  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    if (parts.length <= 1) return '未知';
    return parts[parts.length - 1].toUpperCase();
  };

  const getFileIcon = (filename) => {
    const ext = getFileExtension(filename).toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#ff4d4f' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#1677ff' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'ppt':
      case 'pptx':
        return <FilePptOutlined style={{ color: '#fa8c16' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return <FileImageOutlined style={{ color: '#13c2c2' }} />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileZipOutlined style={{ color: '#722ed1' }} />;
      case 'txt':
        return <FileTextOutlined style={{ color: '#8c8c8c' }} />;
      case 'md':
        return <FileMarkdownOutlined style={{ color: '#1677ff' }} />;
      default:
        return <FileOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const totalProgress = calculateTotalProgress();
  const isComplete = totalProgress === 100;
  const totalFiles = Object.keys(progress || {}).length;
  const completedFiles = Object.values(progress || {}).filter(p => p === 100).length;

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader className="border-bottom-0">
        <CModalTitle className="d-flex align-items-center gap-2">
          <CIcon icon={cilCloudDownload} className="text-primary" />
          文件下载进度
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <ProgressWrapper>
          <div className="total-progress">
            <div className="file-info">
              <div className="file-name">
                <div className={`status-badge ${isComplete ? 'complete' : 'downloading'}`}>
                  {downloading ? (
                    <CSpinner size="sm" className="spinner" />
                  ) : isComplete ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : null}
                  {downloading ? '正在下载' : isComplete ? '下载完成' : '准备下载'}
                </div>
              </div>
              <div className="download-info">
                <span>总文件：{completedFiles}/{totalFiles}</span>
              </div>
            </div>
            <div className={`progress-bar ${isComplete ? 'complete' : ''}`}>
              <div 
                className="progress-inner" 
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <div className="progress-details">
              <span>总进度：{totalProgress}%</span>
              <span>已完成：{completedFiles} / {totalFiles}</span>
            </div>
          </div>

          {progress && Object.entries(progress).map(([filename, percent]) => (
            <div key={filename} className="progress-card">
              <div className="file-info">
                <div className="file-name">
                  {getFileIcon(filename)}
                  <span className="ms-2">{filename}</span>
                  <span className="file-type">{getFileExtension(filename)}</span>
                </div>
                <div className="download-info">
                  {speeds && speeds[filename] && (
                    <span>{speeds[filename]}/s</span>
                  )}
                </div>
              </div>
              <div className={`progress-bar ${percent === 100 ? 'complete' : ''}`}>
                <div 
                  className="progress-inner" 
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="progress-details">
                <span>{percent}%</span>
                {percent === 100 && (
                  <span className="success-icon">
                    <CIcon icon={cilCheckCircle} /> 完成
                  </span>
                )}
              </div>
            </div>
          ))}
        </ProgressWrapper>
      </CModalBody>
      <CModalFooter className="border-top-0">
        <CButton 
          color={downloading ? "secondary" : "primary"}
          onClick={onClose}
          disabled={downloading}
        >
          {downloading ? '下载中...' : '关闭'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default DownloadProgressModal; 