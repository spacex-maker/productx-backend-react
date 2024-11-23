import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CInputGroup,
  CFormInput,
  CButtonGroup,
  CPopover,
  CProgress,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormCheck,
  CTooltip
} from '@coreui/react';
import {Upload, message, Progress} from 'antd';
import CIcon from '@coreui/icons-react';
import {
  cilCloudUpload,
  cilTrash,
  cilMagnifyingGlass,
  cilFile,
  cilFolder,
  cilCloudDownload,
  cilHistory,
  cilCopy,
  cilPause,
  cilPlay,
  cilX
} from '@coreui/icons';
import COS from 'cos-js-sdk-v5';
import api from 'src/axiosInstance';
import styled from 'styled-components';
import { CopyOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons';

const SearchWrapper = styled(CCard)`
  margin-bottom: 20px;
`;

const TableWrapper = styled(CCard)`
  .ant-table-wrapper {
    background: white;
    border-radius: 4px;
  }
`;

// 修改全局样式组件
const GlobalStyle = styled.div`
  font-size: 10px !important;
  
  // 表格样式优化
  .table {
    font-size: 10px !important;
    margin-bottom: 0;
    
    th, td {
      padding: 8px 12px;
      vertical-align: middle;
    }
  }
  
  // 按钮样式优化
  .btn {
    font-size: 10px !important;
    padding: 4px 8px;
    
    &.btn-sm {
      padding: 2px 6px;
    }
  }
  
  // Badge 样式优化
  .badge {
    font-size: 10px !important;
    font-weight: normal !important;
    padding: 4px 8px !important;
  }
  
  // Space 件间距优化
  .ant-space {
    gap: 4px !important;
  }
  
  // 卡片内边距优化
  .card-body {
    padding: 12px;
  }
`;

const Cos = () => {
  const [cosInstance, setCosInstance] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';
  const [currentPath, setCurrentPath] = useState('');
  const [uploadProgress, setUploadProgress] = useState({
    visible: false,
    files: {},  // { fileName: { progress: number, status: string, speed: string, loaded: number, total: number, xhr: XMLHttpRequest } }
    total: 0,
    completed: 0
  });
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isFileDetailVisible, setIsFileDetailVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreateFolderVisible, setIsCreateFolderVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [deletingProgress, setDeletingProgress] = useState({
    visible: false,
    total: 0,
    current: 0,
    folderName: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState({
    visible: false,
    files: {},  // { fileName: { progress: number, status: 'pending' | 'downloading' | 'completed' | 'error', error?: string } }
    total: 0,
    completed: 0
  });
  const [uploadPaused, setUploadPaused] = useState({});  // { fileName: boolean }
  const [uploadTasks, setUploadTasks] = useState({});  // { fileName: { taskId: string, chunks: array } }

  // 初始化 COS 实例
  const initCOS = async () => {
    try {
      const response = await api.get(`/manage/tencent/cos-credential?bucketName=${bucketName}`);
      console.log('COS credentials response:', response); // 调试用

      const { secretId, secretKey, sessionToken, expiredTime } = response;

      if (!secretId || !secretKey || !sessionToken) {
        throw new Error('获取临时密钥失败：密钥信息完整');
      }

      const cos = new COS({
        getAuthorization: function (options, callback) {
          callback({
            TmpSecretId: secretId,
            TmpSecretKey: secretKey,
            SecurityToken: sessionToken,
            ExpiredTime: expiredTime || Math.floor(Date.now() / 1000) + 1800, // 如果没有过期时间，默认30分钟
          });
        },
        Region: region,
      });

      setCosInstance(cos);
      return cos;
    } catch (error) {
      console.error('初始化 COS 失败:', error); // 调用
      message.error('初始化 COS 失败：' + error.message);
      return null;
    }
  };

  // 格式化文件大小的函数
  const formatSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return sizeInBytes + ' B';
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(2) + ' KB';
    } else if (sizeInBytes < 1024 * 1024 * 1024) {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (sizeInBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  };

  // 获取文件列表
  const getFileList = async (cos, path = currentPath) => {
    setLoading(true);
    try {
      const instance = cos || cosInstance;
      if (!instance) {
        const newCos = await initCOS();
        if (!newCos) {
          throw new Error('COS 实例未初始化');
        }
        instance = newCos;
      }

      const result = await instance.getBucket({
        Bucket: bucketName,
        Region: region,
        Prefix: path,
        Delimiter: '/',  // 使用分隔符来模拟文件夹结构
        MaxKeys: 1000
      });

      // 处理文件夹
      const folders = (result.CommonPrefixes || []).map(prefix => ({
        key: prefix.Prefix,
        isFolder: true,
        name: prefix.Prefix.slice(path.length).replace('/', '')
      }));

      // 处理文件
      const files = (result.Contents || [])
        .filter(item => !item.Key.endsWith('/'))
        .map(item => ({
          key: item.Key,
          isFolder: false,
          name: item.Key.slice(path.length),
          size: formatSize(item.Size),
          lastModified: new Date(item.LastModified).toLocaleString(),
          url: `https://${bucketName}.cos.${region}.myqcloud.com/${item.Key}`,
          contentType: item.ContentType || '未知类型',
          storageClass: item.StorageClass || '标准存储'
        }));

      setFiles([...folders, ...files]);
    } catch (error) {
      console.error('获取文件列表失败:', error);
      message.error('获取文件列表失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 处理文件夹点击
  const handleFolderClick = (folderPath) => {
    setCurrentPath(folderPath);
    getFileList(null, folderPath);
  };

  // 处理返回上级目录
  const handleBackClick = () => {
    const parentPath = currentPath.split('/').slice(0, -2).join('/');
    setCurrentPath(parentPath ? parentPath + '/' : '');
    getFileList(null, parentPath ? parentPath + '/' : '');
  };

  // 处理文件下载
  const handleDownload = async (file) => {
    try {
      const url = file.url;
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      message.error('下载失败：' + error.message);
    }
  };

  // 修改删除处理函数
  const handleDelete = async (key, isFolder) => {
    try {
      if (isFolder) {
        // 获取文件夹下的所有文件
        const result = await cosInstance.getBucket({
          Bucket: bucketName,
          Region: region,
          Prefix: key,
          MaxKeys: 1000
        });

        const totalFiles = result.Contents.length;
        setDeletingProgress({
          visible: true,
          total: totalFiles,
          current: 0,
          folderName: key.split('/').slice(-2)[0]
        });

        // 删除文件夹下的所有文件
        for (let i = 0; i < result.Contents.length; i++) {
          const item = result.Contents[i];
          await cosInstance.deleteObject({
            Bucket: bucketName,
            Region: region,
            Key: item.Key
          });
          
          setDeletingProgress(prev => ({
            ...prev,
            current: i + 1
          }));
        }

        message.success('文件夹删除成功');
        setDeletingProgress(prev => ({ ...prev, visible: false }));
      } else {
        // 删除单个文件
        await cosInstance.deleteObject({
          Bucket: bucketName,
          Region: region,
          Key: key
        });
        message.success('文件删除成功');
      }
      getFileList();
    } catch (error) {
      setDeletingProgress(prev => ({ ...prev, visible: false }));
      message.error('删除失败：' + error.message);
    }
  };

  // 添加上传记录
  const addUploadHistory = (file, status, path) => {
    const historyItem = {
      id: Date.now(),
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + ' KB',
      uploadTime: new Date().toLocaleString(),
      status: status,
      path: path || '根目录'
    };
    setUploadHistory(prev => [historyItem, ...prev].slice(0, 100)); // 只保留最近100条记录
  };

  // 修改上传文件函数
  const handleUpload = async (files) => {
    const fileList = Array.isArray(files) ? files : [files];
    setUploading(true);
    setUploadModalVisible(true);
    
    // 初始化所有文件的进度
    const initialProgress = {};
    fileList.forEach(file => {
      initialProgress[file.name] = {
        progress: 0,
        status: 'pending',
        speed: '0 KB/s',
        loaded: 0,
        total: file.size,
        startTime: Date.now()
      };
    });
    
    setUploadProgress({
      visible: true,
      files: initialProgress,
      total: fileList.length,
      completed: 0
    });

    try {
      await Promise.all(fileList.map(file => startMultipartUpload(file)));
    } catch (error) {
      message.error('部分文件上传失败：' + error.message);
    }
  };

  // 实现分片上传
  const startMultipartUpload = async (file) => {
    const key = currentPath + file.name;
    
    try {
      // 初始化分片上传
      const initResult = await new Promise((resolve, reject) => {
        cosInstance.multipartInit({
          Bucket: bucketName,
          Region: region,
          Key: key,
          onProgress: function(progressData) {
            console.log('初始化进度:', JSON.stringify(progressData));
          }
        }, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      const uploadId = initResult.UploadId;
      const chunkSize = 1024 * 1024; // 1MB per chunk
      const totalChunks = Math.ceil(file.size / chunkSize);
      const chunks = [];

      // 保存任务信息
      setUploadTasks(prev => ({
        ...prev,
        [file.name]: {
          taskId: uploadId,
          chunks: new Array(totalChunks).fill(false), // false表示未上传
          file: file,
          key: key
        }
      }));

      // 上传分片
      for (let i = 0; i < totalChunks && !uploadPaused[file.name]; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const blob = file.slice(start, end);

        try {
          const partNumber = i + 1;
          const result = await uploadChunk(file.name, key, uploadId, blob, partNumber, totalChunks);
          chunks.push({
            PartNumber: partNumber,
            ETag: result.ETag
          });

          // 更新分片状态
          setUploadTasks(prev => ({
            ...prev,
            [file.name]: {
              ...prev[file.name],
              chunks: prev[file.name].chunks.map((chunk, index) => 
                index === i ? true : chunk
              )
            }
          }));
        } catch (error) {
          if (uploadPaused[file.name]) {
            // 暂停时不视为错误
            return;
          }
          throw error;
        }
      }

      // 如果没有暂停，完成上传
      if (!uploadPaused[file.name]) {
        await completeMultipartUpload(file.name, key, uploadId, chunks);
        
        setUploadProgress(prev => ({
          ...prev,
          files: {
            ...prev.files,
            [file.name]: {
              ...prev.files[file.name],
              progress: 100,
              status: 'completed',
              speed: '0 KB/s'
            }
          },
          completed: prev.completed + 1
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(prev => ({
        ...prev,
        files: {
          ...prev.files,
          [file.name]: {
            ...prev.files[file.name],
            status: 'error',
            error: error.message
          }
        },
        completed: prev.completed + 1
      }));
    }
  };

  // 上传单个分片
  const uploadChunk = (fileName, key, uploadId, blob, partNumber, totalChunks) => {
    return new Promise((resolve, reject) => {
      cosInstance.multipartUpload({
        Bucket: bucketName,
        Region: region,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: blob,
        onProgress: function(progressData) {
          // 计算单个分片的进度
          const chunkProgress = progressData.percent;
          const totalProgress = ((partNumber - 1 + chunkProgress) / totalChunks) * 100;
          
          // 计算速度
          const currentTime = Date.now();
          const startTime = uploadProgress.files[fileName].startTime;
          const elapsedTime = (currentTime - startTime) / 1000;
          const loaded = progressData.loaded;
          const speed = loaded / elapsedTime;
          
          // 格式化速度
          let formattedSpeed;
          if (speed < 1024) {
            formattedSpeed = `${speed.toFixed(1)} B/s`;
          } else if (speed < 1024 * 1024) {
            formattedSpeed = `${(speed / 1024).toFixed(1)} KB/s`;
          } else {
            formattedSpeed = `${(speed / (1024 * 1024)).toFixed(1)} MB/s`;
          }

          setUploadProgress(prev => ({
            ...prev,
            files: {
              ...prev.files,
              [fileName]: {
                ...prev.files[fileName],
                progress: totalProgress,
                speed: formattedSpeed,
                loaded: progressData.loaded,
                status: 'uploading'
              }
            }
          }));
        }
      }, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  // 完成分片上传
  const completeMultipartUpload = (fileName, key, uploadId, parts) => {
    return new Promise((resolve, reject) => {
      cosInstance.multipartComplete({
        Bucket: bucketName,
        Region: region,
        Key: key,
        UploadId: uploadId,
        Parts: parts
      }, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  // 修改暂停处理函数
  const handlePauseUpload = async (fileName, pause) => {
    if (pause) {
      // 暂停上传
      setUploadPaused(prev => ({ ...prev, [fileName]: true }));
      setUploadProgress(prev => ({
        ...prev,
        files: {
          ...prev.files,
          [fileName]: {
            ...prev.files[fileName],
            status: 'paused',
            speed: '0 KB/s'
          }
        }
      }));
    } else {
      // 继续上传
      setUploadPaused(prev => ({ ...prev, [fileName]: false }));
      const task = uploadTasks[fileName];
      if (task) {
        // 重新开始未完成的分片上传
        const unfinishedChunks = task.chunks.map((isUploaded, index) => 
          !isUploaded ? index : null
        ).filter(index => index !== null);
        
        if (unfinishedChunks.length > 0) {
          startMultipartUpload(task.file);
        }
      }
    }
  };

  // 修改取消上传函数
  const handleCancelUpload = async (fileName) => {
    const task = uploadTasks[fileName];
    if (task) {
      // 取消分片上传
      await new Promise((resolve, reject) => {
        cosInstance.multipartAbort({
          Bucket: bucketName,
          Region: region,
          Key: task.key,
          UploadId: task.taskId
        }, function(err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      // 更新状态
      setUploadProgress(prev => ({
        ...prev,
        files: {
          ...prev.files,
          [fileName]: {
            ...prev.files[fileName],
            status: 'cancelled',
            speed: '0 KB/s'
          }
        },
        completed: prev.completed + 1
      }));

      // 清理任务信息
      setUploadTasks(prev => {
        const newTasks = { ...prev };
        delete newTasks[fileName];
        return newTasks;
      });
    }
  };

  // 复制到剪贴板的功能
  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        message.success('链接已复制到剪贴板');
      })
      .catch((err) => {
        console.error('复制失败:', err);
        message.error('复制失败');
      });
  };

  useEffect(() => {
    const initialize = async () => {
      const cos = await initCOS();
      if (cos) {
        await getFileList(cos);
      }
    };
    initialize();

    // 缩短刷新间隔，避免临时密钥过期
    const refreshInterval = setInterval(async () => {
      const cos = await initCOS();
      if (cos) {
        await getFileList(cos);
      }
    }, 1500000); // 25分钟刷新一次

    return () => clearInterval(refreshInterval);
  }, []);

  // 搜索文件
  const handleSearch = () => {
    getFileList();
  };

  // 添加文件详情弹窗处理函数
  const handleFileClick = (file) => {
    setSelectedFile(file);
    setIsFileDetailVisible(true);
  };

  // 修改文件详情弹窗组件
  const FileDetailModal = () => (
    <CModal
      visible={isFileDetailVisible}
      onClose={() => setIsFileDetailVisible(false)}
      size="lg"
    >
      <CModalHeader onClose={() => setIsFileDetailVisible(false)}>
        <CModalTitle>文件详情</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* 文件详情内容 */}
      </CModalBody>
    </CModal>
  );

  // 上传历史记录弹窗
  const HistoryModal = () => (
    <CModal
      visible={isHistoryVisible}
      onClose={() => setIsHistoryVisible(false)}
      size="lg"
    >
      <CModalHeader onClose={() => setIsHistoryVisible(false)}>
        <CModalTitle>上传历史</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {/* 历史记录内容 */}
      </CModalBody>
    </CModal>
  );

  // 添加创建文件夹的处理函数
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      message.error('文件夹名称不能为空');
      return;
    }

    try {
      const folderKey = currentPath 
        ? `${currentPath}${newFolderName.trim()}/`
        : `${newFolderName.trim()}/`;

      await cosInstance.putObject({
        Bucket: bucketName,
        Region: region,
        Key: folderKey,
        Body: ''  // 创建空文件夹
      });

      message.success('文件夹创建成功');
      setIsCreateFolderVisible(false);
      setNewFolderName('');
      getFileList();
    } catch (error) {
      console.error('创建文件夹失败:', error);
      message.error('创建文件夹失败：' + error.message);
    }
  };

  // 添加删除进度显示组件
  const DeleteProgress = () => {
    if (!deletingProgress.visible) return null;

    const percent = Math.round((deletingProgress.current / deletingProgress.total) * 100);

    return (
      <CModal 
        visible={deletingProgress.visible} 
        backdrop="static"
        keyboard={false}
      >
        <CModalHeader>
          <CModalTitle>正在删除文件夹</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            正在删除文件夹 "{deletingProgress.folderName}"
          </div>
          <div className="mb-2 text-center">
            {deletingProgress.current} / {deletingProgress.total}
          </div>
          <CProgress value={percent} className="mb-3">
            {percent}%
          </CProgress>
          <div className="text-muted small">
            请勿关闭窗口，删除过程中请耐心等待...
          </div>
        </CModalBody>
      </CModal>
    );
  };

  // 修改上传进度弹窗组件
  const UploadProgressModal = () => {
    const totalPercent = Math.round(
      (uploadProgress.completed / uploadProgress.total) * 100
    );

    // 处理全部取消
    const handleCancelAll = () => {
      Object.entries(uploadProgress.files).forEach(([fileName, progress]) => {
        if (progress.status === 'uploading' || progress.status === 'paused') {
          handleCancelUpload(fileName);
        }
      });
    };

    // 处理全部暂停/继续
    const handlePauseAll = () => {
      const hasRunning = Object.values(uploadProgress.files).some(
        file => file.status === 'uploading'
      );
      
      Object.entries(uploadProgress.files).forEach(([fileName, progress]) => {
        if (progress.status === 'uploading' || progress.status === 'paused') {
          handlePauseUpload(fileName, !hasRunning);
        }
      });
    };

    return (
      <CModal 
        visible={uploadModalVisible} 
        onClose={() => {
          if (!uploading) {
            setUploadModalVisible(false);
            setUploadProgress({
              visible: false,
              files: {},
              total: 0,
              completed: 0
            });
            setUploadPaused({});
          }
        }}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>文件上传进度</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <span>总体进度：{uploadProgress.completed}/{uploadProgress.total}</span>
              </div>
              <div>
                <CButtonGroup size="sm">
                  <CButton 
                    color="warning" 
                    variant="outline"
                    onClick={handlePauseAll}
                    disabled={uploadProgress.completed === uploadProgress.total}
                  >
                    <CIcon icon={Object.values(uploadProgress.files).some(
                      file => file.status === 'uploading'
                    ) ? cilPause : cilPlay} className="me-1" />
                    {Object.values(uploadProgress.files).some(
                      file => file.status === 'uploading'
                    ) ? '全部暂停' : '全部继续'}
                  </CButton>
                  <CButton 
                    color="danger" 
                    variant="outline"
                    onClick={handleCancelAll}
                    disabled={uploadProgress.completed === uploadProgress.total}
                  >
                    <CIcon icon={cilX} className="me-1" />
                    全部取消
                  </CButton>
                </CButtonGroup>
              </div>
            </div>
            <CProgress value={totalPercent} className="mb-3">
              {totalPercent}%
            </CProgress>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {Object.entries(uploadProgress.files).map(([fileName, progress]) => (
              <div key={fileName} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="text-truncate me-2" style={{ fontSize: '12px' }}>
                    {fileName}
                  </div>
                  <div style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {formatSize(progress.loaded)}/{formatSize(progress.total)} - {progress.speed}
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <CProgress 
                    value={progress.progress}
                    color={
                      progress.status === 'error' ? 'danger' : 
                      progress.status === 'completed' ? 'success' :
                      progress.status === 'paused' ? 'warning' :
                      progress.status === 'cancelled' ? 'secondary' : 'primary'
                    }
                    className="flex-grow-1 me-2"
                  >
                    {Math.round(progress.progress)}%
                  </CProgress>
                  {(progress.status === 'uploading' || progress.status === 'paused') && (
                    <CButtonGroup size="sm">
                      <CButton 
                        color="warning" 
                        variant="ghost"
                        onClick={() => handlePauseUpload(fileName, !uploadPaused[fileName])}
                      >
                        <CIcon icon={uploadPaused[fileName] ? cilPlay : cilPause} size="sm" />
                      </CButton>
                      <CButton 
                        color="danger" 
                        variant="ghost"
                        onClick={() => handleCancelUpload(fileName)}
                      >
                        <CIcon icon={cilX} size="sm" />
                      </CButton>
                    </CButtonGroup>
                  )}
                </div>
                {progress.status === 'error' && (
                  <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
                    {progress.error}
                  </div>
                )}
                {progress.status === 'cancelled' && (
                  <div className="text-secondary mt-1" style={{ fontSize: '12px' }}>
                    已取消上传
                  </div>
                )}
                {progress.status === 'paused' && (
                  <div className="text-warning mt-1" style={{ fontSize: '12px' }}>
                    已暂停上传
                  </div>
                )}
              </div>
            ))}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              if (!uploading) {
                setUploadModalVisible(false);
                setUploadProgress({
                  visible: false,
                  files: {},
                  total: 0,
                  completed: 0
                });
                setUploadPaused({});
              }
            }}
            disabled={uploading}
          >
            {uploading ? '上传中...' : '关闭'}
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  // 添加选择处理函数
  const handleSelect = (key) => {
    setSelectedFiles(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // 添加全选处理函
  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.key));
    }
  };

  // 添加批量删除处理函数
  const handleBatchDelete = async () => {
    try {
      const folderKeys = selectedFiles.filter(key => files.find(f => f.key === key)?.isFolder);
      const fileKeys = selectedFiles.filter(key => !files.find(f => f.key === key)?.isFolder);
      
      // 设置删除进度初始状态
      let totalFiles = fileKeys.length;
      let foldersContent = [];
      
      // 获取文件夹内的文件
      for (const folderKey of folderKeys) {
        const result = await cosInstance.getBucket({
          Bucket: bucketName,
          Region: region,
          Prefix: folderKey,
          MaxKeys: 1000
        });
        foldersContent = [...foldersContent, ...result.Contents];
        totalFiles += result.Contents.length;
      }
      
      setDeletingProgress({
        visible: true,
        total: totalFiles,
        current: 0,
        folderName: '多个文件'
      });

      // 删除文件
      for (let i = 0; i < fileKeys.length; i++) {
        await cosInstance.deleteObject({
          Bucket: bucketName,
          Region: region,
          Key: fileKeys[i]
        });
        setDeletingProgress(prev => ({
          ...prev,
          current: prev.current + 1
        }));
      }

      // 删除文件夹内容
      for (let i = 0; i < foldersContent.length; i++) {
        await cosInstance.deleteObject({
          Bucket: bucketName,
          Region: region,
          Key: foldersContent[i].Key
        });
        setDeletingProgress(prev => ({
          ...prev,
          current: prev.current + 1
        }));
      }

      message.success('批量删除成功');
      setSelectedFiles([]);
      getFileList();
    } catch (error) {
      message.error('批量删除失败：' + error.message);
    } finally {
      setDeletingProgress(prev => ({ ...prev, visible: false }));
    }
  };

  // 修改批量下载函数
  const handleBatchDownload = async () => {
    const selectedItems = files.filter(file => selectedFiles.includes(file.key));
    const downloadFiles = selectedItems.filter(item => !item.isFolder);
    
    if (downloadFiles.length === 0) {
      message.warning('请选择要下载的文件');
      return;
    }

    // 如果只有一个文件，直接下载
    if (downloadFiles.length === 1) {
      handleDownload(downloadFiles[0]);
      return;
    }

    // 初始化下载进度
    const initialProgress = {};
    downloadFiles.forEach(file => {
      initialProgress[file.name] = {
        progress: 0,
        status: 'pending',
        size: file.size
      };
    });

    setDownloadProgress({
      visible: true,
      files: initialProgress,
      total: downloadFiles.length,
      completed: 0
    });

    // 多个文件下载
    try {
      await Promise.all(downloadFiles.map(async file => {
        try {
          setDownloadProgress(prev => ({
            ...prev,
            files: {
              ...prev.files,
              [file.name]: { ...prev.files[file.name], status: 'downloading' }
            }
          }));

          // 使用 XMLHttpRequest 来获取进度
          const xhr = new XMLHttpRequest();
          xhr.open('GET', file.url, true);
          xhr.responseType = 'blob';

          // 处理下载进度
          xhr.onprogress = (event) => {
            if (event.lengthComputable) {
              const progress = (event.loaded / event.total) * 100;
              setDownloadProgress(prev => ({
                ...prev,
                files: {
                  ...prev.files,
                  [file.name]: { ...prev.files[file.name], progress }
                }
              }));
            }
          };

          // 等待下载完成
          const blob = await new Promise((resolve, reject) => {
            xhr.onload = () => {
              if (xhr.status === 200) {
                resolve(xhr.response);
              } else {
                reject(new Error(`下载失败: ${xhr.status}`));
              }
            };
            xhr.onerror = () => reject(new Error('网络错误'));
            xhr.send();
          });

          // 创建下载链接
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          // 更新完成状态
          setDownloadProgress(prev => ({
            ...prev,
            files: {
              ...prev.files,
              [file.name]: { ...prev.files[file.name], progress: 100, status: 'completed' }
            },
            completed: prev.completed + 1
          }));

        } catch (error) {
          setDownloadProgress(prev => ({
            ...prev,
            files: {
              ...prev.files,
              [file.name]: { ...prev.files[file.name], status: 'error', error: error.message }
            },
            completed: prev.completed + 1
          }));
        }
      }));

      message.success(`已完成 ${downloadFiles.length} 个文件的下载`);
    } catch (error) {
      message.error('批量下载失败：' + error.message);
    }
  };

  // 添加下载进度弹窗组件
  const DownloadProgressModal = () => {
    const totalPercent = Math.round(
      (downloadProgress.completed / downloadProgress.total) * 100
    );

    return (
      <CModal 
        visible={downloadProgress.visible} 
        onClose={() => {
          // 只有在所有文件都完成（成功或失败）时才能关闭
          if (downloadProgress.completed === downloadProgress.total) {
            setDownloadProgress(prev => ({ ...prev, visible: false }));
          }
        }}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>文件下载进度</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span>总体进度</span>
              <span>{downloadProgress.completed}/{downloadProgress.total}</span>
            </div>
            <CProgress value={totalPercent} className="mb-3">
              {totalPercent}%
            </CProgress>
          </div>
          
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {Object.entries(downloadProgress.files).map(([fileName, progress]) => (
              <div key={fileName} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="text-truncate me-2" style={{ fontSize: '10px' }}>
                    {fileName}
                  </div>
                  <div style={{ fontSize: '10px' }}>
                    {progress.size} - {Math.round(progress.progress)}%
                  </div>
                </div>
                <CProgress 
                  value={progress.progress}
                  color={progress.status === 'error' ? 'danger' : 
                         progress.status === 'completed' ? 'success' : 'primary'}
                />
                {progress.status === 'error' && (
                  <div className="text-danger mt-1" style={{ fontSize: '10px' }}>
                    {progress.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton 
            color="secondary" 
            onClick={() => {
              if (downloadProgress.completed === downloadProgress.total) {
                setDownloadProgress(prev => ({ ...prev, visible: false }));
              }
            }}
            disabled={downloadProgress.completed !== downloadProgress.total}
          >
            {downloadProgress.completed !== downloadProgress.total ? '下载中...' : '关闭'}
          </CButton>
        </CModalFooter>
      </CModal>
    );
  };

  return (
    <GlobalStyle>
      <CContainer fluid>
        <CRow>
          <CCol xs={12}>
            <SearchWrapper>
              <CCardBody className="py-2">
                <CRow className="align-items-center">
                  <CCol md={6} lg={4}>
                    <CInputGroup size="sm">
                      <CFormInput
                        placeholder="搜索文件名"
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                      />
                      <CButton
                        color="primary"
                        onClick={handleSearch}
                        disabled={loading}
                      >
                        <CIcon icon={cilMagnifyingGlass} size="sm" />
                        {loading ? '搜索中...' : '搜索'}
                      </CButton>
                    </CInputGroup>
                  </CCol>
                  <CCol>
                    <CButtonGroup size="sm" className="ms-2">
                      <CButton 
                        color="success" 
                        variant="outline"
                        onClick={() => setIsCreateFolderVisible(true)}
                      >
                        <CIcon icon={cilFolder} className="me-1" />
                        新建文件夹
                      </CButton>
                      <Upload
                        customRequest={({ file, onSuccess }) => {
                          handleUpload(file).then(onSuccess);
                        }}
                        multiple={true}
                        showUploadList={false}
                        disabled={uploading}
                      >
                        <CButton color="primary" disabled={uploading}>
                          <CIcon icon={cilCloudUpload} className="me-1" />
                          {uploading ? '上传中...' : `上传文件${currentPath ? '到当前文件夹' : ''}`}
                        </CButton>
                      </Upload>
                      <CButton 
                        color="info"
                        variant="outline"
                        onClick={() => setIsHistoryVisible(true)}
                      >
                        <CIcon icon={cilHistory} className="me-1" />
                        上传历史
                      </CButton>
                    </CButtonGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </SearchWrapper>

            <TableWrapper>
              <CCardBody>
                {currentPath && (
                  <div className="mb-2">
                    <CRow className="align-items-center g-2">
                      <CCol xs="auto">
                        <CButton 
                          color="primary" 
                          variant="outline" 
                          size="sm"
                          onClick={handleBackClick}
                        >
                          返回上级目录
                        </CButton>
                      </CCol>
                      <CCol>
                        <span style={{ fontSize: '10px', color: '#666' }}>
                          当前路径: {currentPath}
                        </span>
                      </CCol>
                    </CRow>
                  </div>
                )}
                {loading ? (
                  <div className="text-center p-3">
                    <CSpinner color="primary" />
                  </div>
                ) : (
                  <CTable hover bordered small>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '40px' }}>
                          <CFormCheck
                            checked={selectedFiles.length === files.length && files.length > 0}
                            indeterminate={selectedFiles.length > 0 && selectedFiles.length < files.length}
                            onChange={handleSelectAll}
                          />
                        </CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '35%' }}>名称</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '10%' }}>大小</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '15%' }}>类型</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '15%' }}>存储类型</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '15%' }}>最后修改时间</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '10%' }}>操作</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {files.length > 0 ? (
                        files.map((item) => (
                          <CTableRow 
                            key={item.key}
                            active={selectedFiles.includes(item.key)}
                          >
                            <CTableDataCell>
                              <CFormCheck
                                checked={selectedFiles.includes(item.key)}
                                onChange={() => handleSelect(item.key)}
                              />
                            </CTableDataCell>
                            {item.isFolder ? (
                              <>
                                <CTableDataCell colSpan="5" style={{ padding: '4px 12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <CIcon 
                                      icon={cilFolder} 
                                      size="sm" 
                                      style={{ 
                                        color: '#ffd700',
                                        marginRight: '4px'
                                      }} 
                                    />
                                    <CButton 
                                      color="link"
                                      className="p-0 text-decoration-none text-start"
                                      onClick={() => handleFolderClick(item.key)}
                                      style={{
                                        fontSize: '10px',
                                        width: 'fit-content',
                                        minWidth: 'unset',
                                        padding: '0',
                                        margin: '0',
                                        display: 'inline-block'
                                      }}
                                    >
                                      {item.name}/
                                    </CButton>
                                  </div>
                                </CTableDataCell>
                                <CTableDataCell style={{ padding: '4px 12px' }}>
                                  <CPopover
                                    content={
                                      <div>
                                        <p>确定要删除这个文件夹吗？文件夹内的所有文件都会被删除。</p>
                                        <CButton 
                                          color="danger" 
                                          size="sm"
                                          onClick={() => handleDelete(item.key, true)}
                                        >
                                          确定删除
                                        </CButton>
                                      </div>
                                    }
                                    placement="left"
                                  >
                                    <CButton color="danger" variant="ghost">
                                      <CIcon icon={cilTrash} size="sm" /> 删除
                                    </CButton>
                                  </CPopover>
                                </CTableDataCell>
                              </>
                            ) : (
                              <>
                                <CTableDataCell style={{ padding: '4px 12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CIcon icon={cilFile} size="sm" />
                                    <a 
                                      href="#" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleFileClick(item);
                                      }}
                                      style={{ color: '#1890ff' }}
                                    >
                                      {item.name}
                                    </a>
                                    <CButton
                                      color="link"
                                      size="sm"
                                      className="p-0"
                                      onClick={() => handleCopy(item.url)}
                                      title="复制链接"
                                    >
                                      <CIcon icon={cilCopy} size="sm" />
                                    </CButton>
                                  </div>
                                </CTableDataCell>
                                <CTableDataCell style={{ padding: '4px 12px' }}>
                                  <CBadge color="info" shape="rounded-pill">
                                    {item.size}
                                  </CBadge>
                                </CTableDataCell>
                                <CTableDataCell style={{ padding: '4px 12px' }}>
                                  <CBadge color="info" shape="rounded-pill">
                                    {item.contentType}
                                  </CBadge>
                                </CTableDataCell>
                                <CTableDataCell style={{ padding: '4px 12px' }}>
                                  <CBadge color="success" shape="rounded-pill">
                                    {item.storageClass}
                                  </CBadge>
                                </CTableDataCell>
                                <CTableDataCell style={{ padding: '4px 12px' }}>
                                  {item.lastModified}
                                </CTableDataCell>
                                <CTableDataCell style={{ padding: '4px 12px' }}>
                                  <CButtonGroup size="sm">
                                    <CButton 
                                      color="info" 
                                      variant="ghost"
                                      onClick={() => handleDownload(item)}
                                    >
                                      <CIcon icon={cilCloudDownload} size="sm" /> 下载
                                    </CButton>
                                    <CPopover
                                      content={
                                        <div>
                                          <p>确定要删除这个文件吗？</p>
                                          <CButton 
                                            color="danger" 
                                            size="sm"
                                            onClick={() => handleDelete(item.key, false)}
                                          >
                                            确定删除
                                          </CButton>
                                        </div>
                                      }
                                      placement="left"
                                    >
                                      <CButton color="danger" variant="ghost">
                                        <CIcon icon={cilTrash} size="sm" /> 删除
                                      </CButton>
                                    </CPopover>
                                  </CButtonGroup>
                                </CTableDataCell>
                              </>
                            )}
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell 
                            colSpan="6" 
                            className="text-center" 
                            style={{ 
                              padding: 0,  // 移除默认内边距
                              backgroundColor: 'var(--cui-table-striped-bg)',
                              position: 'relative',
                              height: '200px'  // 设置固定高度
                            }}
                          >
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.style.backgroundColor = 'var(--cui-table-hover-bg)';
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.style.backgroundColor = 'var(--cui-table-striped-bg)';
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                e.currentTarget.style.backgroundColor = 'var(--cui-table-striped-bg)';
                                const files = Array.from(e.dataTransfer.files);
                                if (files.length > 0) {
                                  handleUpload(files);
                                }
                              }}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.2s ease',
                                padding: '20px'  // 添加内边距
                              }}
                            >
                              <div 
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '16px'  // 增加间距
                                }}
                              >
                                <CIcon 
                                  icon={cilFolder} 
                                  size="xl" 
                                  style={{ 
                                    color: '#ffd700',
                                    width: '48px',  // 增大图标
                                    height: '48px'
                                  }} 
                                />
                                <div className="text-medium-emphasis">
                                  <div style={{ fontSize: '16px' }}>当前文件夹为空</div>
                                  <div style={{ fontSize: '12px', marginTop: '8px' }}>
                                    <CBadge color="var(--cui-table-striped-bg)" className="me-1">拖拽文件到此处上传</CBadge>
                                  </div>
                                </div>
                                {currentPath && (
                                  <div 
                                    style={{
                                      display: 'flex',
                                      gap: '12px'
                                    }}
                                  >
                                    <CButton 
                                      color="primary" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setIsCreateFolderVisible(true)}
                                    >
                                      <CIcon icon={cilFolder} className="me-1" />
                                      新建文件夹
                                    </CButton>
                                    <Upload
                                      customRequest={({ file }) => handleUpload(file)}
                                      multiple={true}
                                      showUploadList={false}
                                      disabled={uploading}
                                      directory={false}
                                    >
                                      <CTooltip
                                        content="支持选择多个文件"
                                        placement="bottom"
                                      >
                                        <CButton 
                                          color="primary" 
                                          size="sm" 
                                          disabled={uploading}
                                        >
                                          <CIcon icon={cilCloudUpload} className="me-1" />
                                          {uploading ? '上传中...' : '上传文件'}
                                        </CButton>
                                      </CTooltip>
                                    </Upload>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                )}
              </CCardBody>
            </TableWrapper>

            {/* 添加文件详情弹窗 */}
            <FileDetailModal />

            {/* 历史记录弹窗 */}
            <HistoryModal />

            {/* 添加新建文件夹弹窗 */}
            <CModal
              visible={isCreateFolderVisible}
              onClose={() => {
                setIsCreateFolderVisible(false);
                setNewFolderName('');
              }}
            >
              <CModalHeader onClose={() => {
                setIsCreateFolderVisible(false);
                setNewFolderName('');
              }}>
                <CModalTitle>新建文件夹</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CFormInput
                  placeholder="请输入文件夹名称"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                />
              </CModalBody>
              <CModalFooter>
                <CButton 
                  color="secondary" 
                  onClick={() => {
                    setIsCreateFolderVisible(false);
                    setNewFolderName('');
                  }}
                >
                  取消
                </CButton>
                <CButton 
                  color="primary"
                  onClick={handleCreateFolder}
                >
                  确定
                </CButton>
              </CModalFooter>
            </CModal>

            {/* 添加删除进度弹窗 */}
            <DeleteProgress />

            {/* 添加上传进度弹窗 */}
            <UploadProgressModal />

            {/* 添加下载进度弹窗 */}
            <DownloadProgressModal />

            {/* 修改批量操作按钮组 */}
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <CButtonGroup size="sm">
                  <CButton 
                    color="info" 
                    variant="outline"
                    onClick={handleBatchDownload}
                  >
                    <CIcon icon={cilCloudDownload} className="me-1" />
                    下载选中项 ({selectedFiles.filter(key => !files.find(f => f.key === key)?.isFolder).length})
                  </CButton>
                  <CButton 
                    color="danger" 
                    variant="outline"
                    onClick={() => {
                      if (window.confirm(`确定要删除选中的 ${selectedFiles.length} 个项目吗？`)) {
                        handleBatchDelete();
                      }
                    }}
                  >
                    <CIcon icon={cilTrash} className="me-1" />
                    删除选中项 ({selectedFiles.length})
                  </CButton>
                </CButtonGroup>
              </div>
            )}
          </CCol>
        </CRow>
      </CContainer>
    </GlobalStyle>
  );
};

export default Cos;
