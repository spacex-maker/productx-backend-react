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
import { cilCloudUpload, cilCheckCircle, cilClock } from '@coreui/icons';
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
  FolderOutlined,
} from '@ant-design/icons';
import { formatBytes, formatDate } from 'src/utils';
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

  .upload-info {
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

  .success-icon {
    color: var(--cui-success);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .time-info {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--cui-text-muted);
  }

  .spinner {
    color: var(--cui-primary);
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
    
    &.uploading {
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

const UploadProgressModal = ({ 
  visible, 
  uploading, 
  progress, 
  speeds, 
  startTimes = {}, 
  fileSizes = {}, 
  onClose 
}) => {
  const calculateTotalProgress = () => {
    if (!progress || Object.keys(progress).length === 0) return 0;
    const total = Object.values(progress).reduce((acc, curr) => acc + curr, 0);
    return Math.round(total / Object.keys(progress).length);
  };

  const calculateTimeElapsed = (startTime) => {
    if (!startTime) return '0秒';
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    if (seconds < 60) return `${seconds}秒`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分${seconds % 60}秒`;
  };

  const calculateRemainingTime = (speed, percent, filename) => {
    if (percent >= 100) return '0秒';
    if (!speed || !uploading) return '0秒';
    
    const speedValue = parseFloat(speed);
    if (isNaN(speedValue) || speedValue <= 0) return '计算中...';

    const totalSize = fileSizes[filename];
    if (!totalSize) return '计算中...';

    const uploadedBytes = totalSize * (percent / 100);
    const remainingBytes = totalSize - uploadedBytes;
    
    if (remainingBytes <= 0) return '0秒';
    
    const remainingSeconds = Math.ceil(remainingBytes / (speedValue * 1024 * 1024));
    
    if (remainingSeconds < 0 || remainingSeconds > 86400) return '计算中...';

    if (remainingSeconds < 60) {
      return `${remainingSeconds}秒`;
    } else if (remainingSeconds < 3600) {
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      return `${minutes}分${seconds}秒`;
    } else {
      const hours = Math.floor(remainingSeconds / 3600);
      const minutes = Math.floor((remainingSeconds % 3600) / 60);
      const seconds = remainingSeconds % 60;
      return `${hours}时${minutes}分${seconds}秒`;
    }
  };

  const formatSpeed = (speed, percent) => {
    if (percent >= 100) return '0 MB/s';
    if (!speed) return '0 MB/s';
    
    const speedValue = parseFloat(speed);
    if (isNaN(speedValue) || speedValue <= 0) return '计算中...';
    
    if (speed.includes('MB')) {
      return speed.replace(' MB', ' MB/s');
    }
    return speed + '/s';
  };

  const getFileExtension = (filename) => {
    if (!filename) return '';
    const parts = filename.split('.');
    if (parts.length <= 1) return '未知';
    return parts[parts.length - 1].toUpperCase();
  };

  const getFileIcon = (filename) => {
    const ext = getFileExtension(filename).toLowerCase();
    // 根据文件类型返回不同的图标组件
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
      case '':
        return <FileUnknownOutlined style={{ color: '#8c8c8c' }} />;
      default:
        return <FileOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const totalProgress = calculateTotalProgress();
  const isComplete = totalProgress === 100;
  const totalFiles = Object.keys(progress || {}).length;
  const completedFiles = Object.values(progress || {}).filter(p => p === 100).length;
  const earliestStartTime = startTimes && Object.values(startTimes).length > 0 
    ? Math.min(...Object.values(startTimes))
    : null;

  return (
    <CModal visible={visible} onClose={onClose} size="lg">
      <CModalHeader className="border-bottom-0">
        <CModalTitle className="d-flex align-items-center gap-2">
          <CIcon icon={cilCloudUpload} className="text-primary" />
          文件上传进度
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <ProgressWrapper>
          {/* 总进度 */}
          <div className="total-progress">
            <div className="file-info">
              <div className="file-name">
                <div className={`status-badge ${isComplete ? 'complete' : 'uploading'}`}>
                  {uploading ? (
                    <CSpinner size="sm" className="spinner" />
                  ) : isComplete ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : null}
                  {uploading ? '正在上传' : isComplete ? '上传完成' : '准备上传'}
                </div>
              </div>
              <div className="upload-info">
                <span>总文件：{completedFiles}/{totalFiles}</span>
                {uploading && earliestStartTime && (
                  <span className="time-info">
                    <CIcon icon={cilClock} size="sm" />
                    已用时：{calculateTimeElapsed(earliestStartTime)}
                  </span>
                )}
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

          {/* 单个文件进度 */}
          {progress && Object.entries(progress).map(([filename, percent]) => (
            <div key={filename} className="progress-card">
              <div className="file-info">
                <div className="file-name">
                  {getFileIcon(filename)}
                  <span className="ms-2">{filename}</span>
                  <span className="file-type">{getFileExtension(filename)}</span>
                </div>
                <div className="upload-info">
                  {speeds && speeds[filename] && (
                    <>
                      <span>{formatSpeed(speeds[filename], percent)}</span>
                      {percent < 100 && uploading && (
                        <span className="time-info">
                          <CIcon icon={cilClock} size="sm" />
                          剩余：{calculateRemainingTime(speeds[filename], percent, filename)}
                        </span>
                      )}
                    </>
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
                <span className="time-info">
                  开始：{formatDate(startTimes[filename])}
                </span>
              </div>
            </div>
          ))}
        </ProgressWrapper>
      </CModalBody>
      <CModalFooter className="border-top-0">
        <CButton 
          color={uploading ? "secondary" : "primary"}
          onClick={onClose}
          disabled={uploading}
        >
          {uploading ? '上传中...' : '关闭'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default UploadProgressModal; 