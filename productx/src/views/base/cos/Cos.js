import React, { useState, useEffect, useRef } from 'react';
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
} from '@coreui/react';
import { Upload, message, Progress, Image } from 'antd';
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
} from '@coreui/icons';
import COS from 'cos-js-sdk-v5';
import api from 'src/axiosInstance';
import styled from 'styled-components';
import {
  CopyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

const StyledCard = styled(CCard)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const SearchWrapper = styled(CCard)`
  margin-bottom: 20px;

  .card-body {
    padding: 12px;
  }

  .input-group {
    width: 100%;
  }

  .btn-group {
    .btn {
      padding: 4px 12px;
      display: flex;
      align-items: center;

      svg {
        margin-right: 4px;
      }
    }
  }

  @media (max-width: 768px) {
    .btn-group {
      width: 100%;

      .btn {
        flex: 1;
        justify-content: center;
      }
    }
  }
`;

const TableWrapper = styled(CCard)`
  .ant-table-wrapper {
    background: white;
    border-radius: 4px;
  }
`;

// 修改全局样式组件
const GlobalStyle = styled.div`
  // 表格样式优化
  .table {
    margin-bottom: 0;

    th,
    td {
      padding: 8px 12px;
      vertical-align: middle;
    }
  }

  // 按钮样式优化
  .btn {
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

  // Space 组件间距优化
  .ant-space {
    gap: 4px !important;
  }

  // 卡片内边距优化
  .card-body {
    padding: 12px;
  }

  // 图片预览遮罩样式
  .custom-mask {
    font-size: 12px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.5);
  }

  // 预览modal样式优化
  .ant-image-preview-root {
    .ant-image-preview-wrap {
      .ant-image-preview-img {
        max-width: 90vw;
        max-height: 90vh;
      }
    }
  }
`;

// 添加样式组件，使用主题色变量
const DetailModalWrapper = styled.div`
  font-size: 12px;

  .modal-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--cui-body-color);
  }

  .section-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--cui-body-color);
    margin-bottom: 12px;
  }

  .detail-card {
    background: var(--cui-card-bg);
    border: 1px solid var(--cui-border-color);
    border-radius: var(--cui-border-radius);
    padding: 16px;
    margin-bottom: 16px;
  }

  .info-table {
    width: 100%;
    border-radius: var(--cui-border-radius);
    overflow: hidden;

    td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--cui-border-color);

      &:first-child {
        width: 100px;
        color: var(--cui-body-color);
        background: var(--cui-tertiary-bg);
      }

      &:last-child {
        background: var(--cui-card-bg);
      }
    }

    tr:last-child td {
      border-bottom: none;
    }
  }

  .badge {
    font-size: 11px;
    padding: 4px 8px;
    font-weight: normal;
    background: var(--cui-primary);

    &.badge-info {
      background: var(--cui-info);
    }

    &.badge-success {
      background: var(--cui-success);
    }
  }

  .copy-button {
    font-size: 11px;
    padding: 4px 8px;
    color: var(--cui-primary);
    background: var(--cui-btn-ghost-bg);
    border-color: var(--cui-primary);

    &:hover {
      color: var(--cui-white);
      background: var(--cui-primary);
    }

    .icon {
      font-size: 11px;
      margin-right: 4px;
    }
  }

  .link-section {
    background: var(--cui-card-bg);
    border: 1px solid var(--cui-border-color);
    border-radius: var(--cui-border-radius);
    padding: 12px;

    .link-text {
      font-size: 11px;
      color: var(--cui-body-color);
      word-break: break-all;
    }

    .hint-text {
      font-size: 11px;
      color: var(--cui-text-muted);
      margin-top: 8px;
    }
  }

  .modal-footer {
    background: var(--cui-tertiary-bg);
    border-top: 1px solid var(--cui-border-color);

    .btn {
      font-size: 12px;
      padding: 4px 12px;

      &.btn-primary {
        background: var(--cui-primary);
        border-color: var(--cui-primary);

        &:hover {
          background: var(--cui-primary-hover);
          border-color: var(--cui-primary-hover);
        }
      }

      &.btn-secondary {
        background: var(--cui-secondary);
        border-color: var(--cui-secondary);

        &:hover {
          background: var(--cui-secondary-hover);
          border-color: var(--cui-secondary-hover);
        }
      }
    }
  }

  // 暗色主题适配
  [data-theme='dark'] & {
    .detail-card {
      background: var(--cui-dark);
    }

    .info-table {
      td:first-child {
        background: var(--cui-dark);
      }

      td:last-child {
        background: var(--cui-dark-bg);
      }
    }

    .link-section {
      background: var(--cui-dark);
    }
  }
`;

// 修改下载进度弹窗样式
const ProgressModalWrapper = styled.div`
  font-size: 12px;

  .modal-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--cui-body-color);
  }

  .progress-card {
    background: var(--cui-card-bg);
    border: 1px solid var(--cui-border-color);
    border-radius: var(--cui-border-radius);
    padding: 12px;
    margin-bottom: 12px;
  }

  .progress-bar {
    background-color: var(--cui-primary);
    height: 8px;
    border-radius: var(--cui-border-radius);

    &.success {
      background-color: var(--cui-success);
    }

    &.error {
      background-color: var(--cui-danger);
    }
  }

  .text-speed {
    color: var(--cui-primary);
  }

  .text-muted {
    color: var(--cui-text-muted) !important;
  }

  .text-error {
    color: var(--cui-danger);
  }

  .modal-footer {
    background: var(--cui-tertiary-bg);
    border-top: 1px solid var(--cui-border-color);
  }

  // 暗色主题适配
  [data-theme='dark'] & {
    .progress-card {
      background: var(--cui-dark);
    }
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
  const [uploadProgress, setUploadProgress] = useState({});
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
    folderName: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [uploadSpeeds, setUploadSpeeds] = useState({});
  const prevUploadData = useRef({}); // 用于存储上一次的上传数据
  const speedUpdateInterval = useRef(null);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSpeeds, setDownloadSpeeds] = useState({});
  const prevDownloadData = useRef({});

  // 初始化 COS 实例
  const initCOS = async () => {
    try {
      const response = await api.get(`/manage/tencent/cos-credential?bucketName=${bucketName}`);
      console.log('COS credentials response:', response); // 调试用

      const { secretId, secretKey, sessionToken, expiredTime } = response;

      if (!secretId || !secretKey || !sessionToken) {
        throw new Error('获取临时密钥失败：密钥信息不完整');
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
      console.error('初始化 COS 失败:', error); // 调试用
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
      let instance = cos || cosInstance;
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
        Delimiter: '/',
        MaxKeys: 1000, // 获取所有文件用于计算总数
      });

      // 处理文件夹和文件
      const folders = (result.CommonPrefixes || []).map((prefix) => ({
        key: prefix.Prefix,
        isFolder: true,
        name: prefix.Prefix.slice(path.length).replace('/', ''),
      }));

      const files = (result.Contents || [])
        .filter((item) => !item.Key.endsWith('/'))
        .map((item) => ({
          key: item.Key,
          isFolder: false,
          name: item.Key.slice(path.length),
          size: formatSize(item.Size),
          lastModified: new Date(item.LastModified).toLocaleString(),
          url: `https://${bucketName}.cos.${region}.myqcloud.com/${item.Key}`,
          contentType: item.ContentType || '未知类型',
          storageClass: item.StorageClass || '标准存储',
        }));

      const allFiles = [...folders, ...files];
      setFiles(allFiles);
      setFilteredFiles(allFiles);

      // 更新分页信息
      setPagination((prev) => ({
        ...prev,
        total: allFiles.length,
      }));
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

  // 处理回上级目录
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
          MaxKeys: 1000,
        });

        const totalFiles = result.Contents.length;
        setDeletingProgress({
          visible: true,
          total: totalFiles,
          current: 0,
          folderName: key.split('/').slice(-2)[0],
        });

        // 删除文件夹下的所有文件
        for (let i = 0; i < result.Contents.length; i++) {
          const item = result.Contents[i];
          await cosInstance.deleteObject({
            Bucket: bucketName,
            Region: region,
            Key: item.Key,
          });

          setDeletingProgress((prev) => ({
            ...prev,
            current: i + 1,
          }));
        }

        message.success('文件夹删除成功');
        setDeletingProgress((prev) => ({ ...prev, visible: false }));
      } else {
        // 删除单个文件
        await cosInstance.deleteObject({
          Bucket: bucketName,
          Region: region,
          Key: key,
        });
        message.success('文件删除成功');
      }
      getFileList();
    } catch (error) {
      setDeletingProgress((prev) => ({ ...prev, visible: false }));
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
      path: path || '根目录',
    };
    setUploadHistory((prev) => [historyItem, ...prev].slice(0, 100)); // 只保留最近100条记录
  };

  // 修改上传文件函数
  const handleUpload = async (files) => {
    const fileList = Array.isArray(files) ? files : [files];
    if (fileList.length === 0) return;

    setUploading(true);
    setUploadModalVisible(true);
    setUploadSpeeds({}); // 重置速度数据
    prevUploadData.current = {}; // 重置上一次的数据

    // 初始化上传进度
    const initialProgress = fileList.reduce((acc, file) => {
      acc[file.name] = {
        percent: 0,
        status: 'active',
        size: formatSize(file.size),
        totalSize: file.size,
        loaded: 0,
        name: file.name,
        error: null,
        startTime: Date.now(),
      };
      return acc;
    }, {});

    setUploadProgress(initialProgress);

    try {
      await Promise.all(
        fileList.map(async (file) => {
          const key = currentPath + file.name;

          try {
            await cosInstance.uploadFile({
              Bucket: bucketName,
              Region: region,
              Key: key,
              Body: file,
              onProgress: (progressData) => {
                const now = Date.now();
                const loaded = progressData.loaded;
                const fileName = file.name;

                // 更新进度
                setUploadProgress((prev) => ({
                  ...prev,
                  [fileName]: {
                    ...prev[fileName],
                    percent: Math.round(progressData.percent * 100),
                    status: 'active',
                    loaded: loaded,
                  },
                }));

                // 计算速度
                const prevData = prevUploadData.current[fileName];
                if (prevData) {
                  const timeDiff = (now - prevData.time) / 1000; // 转换为秒
                  const bytesDiff = loaded - prevData.loaded;
                  const speedBps = bytesDiff / timeDiff;

                  let speedText;
                  if (speedBps >= 1024 * 1024) {
                    speedText = `${(speedBps / (1024 * 1024)).toFixed(2)} MB/s`;
                  } else if (speedBps >= 1024) {
                    speedText = `${(speedBps / 1024).toFixed(2)} KB/s`;
                  } else {
                    speedText = `${Math.round(speedBps)} B/s`;
                  }

                  // 计算剩余时间
                  const remainingBytes = file.size - loaded;
                  const remainingTime = remainingBytes / speedBps;
                  let remainingText;
                  if (remainingTime >= 3600) {
                    remainingText = `${Math.round(remainingTime / 3600)}小时`;
                  } else if (remainingTime >= 60) {
                    remainingText = `${Math.round(remainingTime / 60)}分钟`;
                  } else {
                    remainingText = `${Math.round(remainingTime)}秒`;
                  }

                  setUploadSpeeds((prev) => ({
                    ...prev,
                    [fileName]: {
                      speed: speedText,
                      remaining: remainingText,
                    },
                  }));
                }

                // 更新上一次的数据
                prevUploadData.current[fileName] = {
                  loaded,
                  time: now,
                };
              },
            });

            // 更新上传成功状态
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: {
                ...prev[file.name],
                percent: 100,
                status: 'success',
              },
            }));

            // 清除该文件的速度显示
            setUploadSpeeds((prev) => {
              const newSpeeds = { ...prev };
              delete newSpeeds[file.name];
              return newSpeeds;
            });
          } catch (error) {
            console.error(`文件 ${file.name} 上传失败:`, error);
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: {
                ...prev[file.name],
                status: 'error',
                error: error.message,
              },
            }));
          }
        }),
      );

      await getFileList();
      message.success(`成功上传 ${fileList.length} 个文件`);
    } catch (error) {
      console.error('批量上传失败:', error);
      message.error('部分文件上传失败，请查看详情');
    } finally {
      setUploading(false);
      prevUploadData.current = {};
      setUploadSpeeds({});
    }
  };

  // 复制到剪贴板的功能
  const handleCopy = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        message.success('链接已复制到剪切板');
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
  const handleSearch = (value) => {
    setSearchKey(value);

    if (!value.trim()) {
      setFilteredFiles(files);
      return;
    }

    const searchText = value.toLowerCase();
    const filtered = files.filter((file) => file.name.toLowerCase().includes(searchText));

    setFilteredFiles(filtered);
  };

  // 添加文件详情弹窗理函数
  const handleFileClick = (file) => {
    setSelectedFile(file);
    setIsFileDetailVisible(true);
  };

  // 修改文件详情弹窗组件
  const FileDetailModal = () => {
    if (!selectedFile) return null;

    const isFolder = selectedFile.isFolder;
    const fileSize = selectedFile.size;
    const lastModified = new Date(selectedFile.lastModified).toLocaleString();
    const fileType = selectedFile.contentType || '未知类型';
    const storageClass = selectedFile.storageClass || '标准存储';

    return (
      <CModal
        visible={isFileDetailVisible}
        onClose={() => {
          setIsFileDetailVisible(false);
          setSelectedFile(null);
        }}
        size="lg"
      >
        <DetailModalWrapper>
          <CModalHeader>
            <CModalTitle>
              <div className="d-flex align-items-center">
                <CIcon
                  icon={isFolder ? cilFolder : cilFile}
                  className="me-2 text-primary"
                  size="lg"
                />
                文件详情
              </div>
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            {/* 文件名称区域 */}
            <div className="detail-card">
              <div className="section-title">文件名称</div>
              <div className="d-flex align-items-center">
                <div className="text-break flex-grow-1">{selectedFile.name}</div>
                <CButton
                  color="ghost-primary"
                  size="sm"
                  className="copy-button ms-2"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedFile.name);
                    message.success('文件名已复制到剪贴板');
                  }}
                >
                  <CIcon icon={cilCopy} className="icon" />
                  复制
                </CButton>
              </div>
            </div>

            {/* 基本信息区域 */}
            <div className="detail-card">
              <div className="section-title">基本信息</div>
              <table className="info-table">
                <tbody>
                  <tr>
                    <td>文件类型</td>
                    <td>
                      <CBadge color={isFolder ? 'info' : 'primary'}>
                        {isFolder ? '文件夹' : fileType}
                      </CBadge>
                    </td>
                  </tr>
                  {!isFolder && (
                    <>
                      <tr>
                        <td>文件大小</td>
                        <td>{fileSize}</td>
                      </tr>
                      <tr>
                        <td>存储类型</td>
                        <td>
                          <CBadge color="success">{storageClass}</CBadge>
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td>修改时间</td>
                    <td>{lastModified}</td>
                  </tr>
                  <tr>
                    <td>文件路径</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="text-break flex-grow-1">{selectedFile.key}</div>
                        <CButton
                          color="ghost-primary"
                          size="sm"
                          className="copy-button ms-2"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedFile.key);
                            message.success('路径已复制到剪贴板');
                          }}
                        >
                          <CIcon icon={cilCopy} className="icon" />
                          复制
                        </CButton>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 文件链接区域 */}
            {!isFolder && (
              <div className="detail-card">
                <div className="section-title">文件链接</div>
                <div className="link-section">
                  <div className="d-flex align-items-center">
                    <div className="link-text flex-grow-1">{selectedFile.url}</div>
                    <CButton
                      color="primary"
                      size="sm"
                      className="copy-button ms-2"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedFile.url);
                        message.success('链接已复制到剪贴板');
                      }}
                    >
                      <CIcon icon={cilCopy} className="icon" />
                      复制链接
                    </CButton>
                  </div>
                  <div className="hint-text">提示：文件链接长期有效，可直接访问或下载！</div>
                </div>
              </div>
            )}
          </CModalBody>
          <CModalFooter>
            {!isFolder && (
              <CButton
                color="primary"
                size="sm"
                onClick={() => window.open(selectedFile.url, '_blank')}
              >
                <CIcon icon={cilCloudDownload} className="me-2" />
                下载文件
              </CButton>
            )}
            <CButton
              color="secondary"
              size="sm"
              onClick={() => {
                setIsFileDetailVisible(false);
                setSelectedFile(null);
              }}
            >
              关闭
            </CButton>
          </CModalFooter>
        </DetailModalWrapper>
      </CModal>
    );
  };

  // 上传历史记录弹窗
  const HistoryModal = () => (
    <CModal visible={isHistoryVisible} onClose={() => setIsHistoryVisible(false)} size="lg">
      <CModalHeader onClose={() => setIsHistoryVisible(false)}>
        <CModalTitle>上传历史</CModalTitle>
      </CModalHeader>
      <CModalBody>{/* 历史记录内容 */}</CModalBody>
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
        Body: '', // 创建空文件夹
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
      <CModal visible={deletingProgress.visible} backdrop="static" keyboard={false}>
        <CModalHeader>
          <CModalTitle>正在删除文件夹</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mb-3">正在删除文件夹 "{deletingProgress.folderName}"</div>
          <div className="mb-2 text-center">
            {deletingProgress.current} / {deletingProgress.total}
          </div>
          <CProgress value={percent} className="mb-3">
            {percent}%
          </CProgress>
          <div className="text-muted small">请勿关闭窗口，删除过程中请耐心等待...</div>
        </CModalBody>
      </CModal>
    );
  };

  // 修改上传进度弹窗组件
  const UploadProgressModal = () => (
    <CModal
      visible={uploadModalVisible}
      onClose={() => {
        if (!uploading) {
          setUploadModalVisible(false);
          setUploadProgress({});
          setUploadSpeeds({});
        }
      }}
      size="lg"
    >
      <CModalHeader>
        <CModalTitle>文件上传进度</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="text-truncate me-2" style={{ fontSize: '10px' }}>
                  {fileName}
                </div>
                <div style={{ fontSize: '10px' }}>
                  {progress.size}
                  {uploadSpeeds[fileName] && progress.status === 'active' && (
                    <>
                      <span className="mx-1">-</span>
                      {uploadSpeeds[fileName].speed}
                      <span className="mx-1">-</span>
                      剩余 {uploadSpeeds[fileName].remaining}
                    </>
                  )}
                  <span className="ms-1">- {progress.percent}%</span>
                </div>
              </div>
              <CProgress
                value={progress.percent}
                color={
                  progress.status === 'error'
                    ? 'danger'
                    : progress.status === 'success'
                      ? 'success'
                      : 'primary'
                }
              />
              {progress.error && (
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
            if (!uploading) {
              setUploadModalVisible(false);
              setUploadProgress({});
              setUploadSpeeds({});
            }
          }}
          disabled={uploading}
        >
          {uploading ? '上传中...' : '关闭'}
        </CButton>
      </CModalFooter>
    </CModal>
  );

  // 添加选择处理函数
  const handleSelect = (key) => {
    setSelectedFiles((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // 添加全选处理函数
  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((file) => file.key));
    }
  };

  // 添加批量删除处理函数
  const handleBatchDelete = async () => {
    try {
      const folderKeys = selectedFiles.filter((key) => files.find((f) => f.key === key)?.isFolder);
      const fileKeys = selectedFiles.filter((key) => !files.find((f) => f.key === key)?.isFolder);

      // 设置删除进度初始状态
      let totalFiles = fileKeys.length;
      let foldersContent = [];

      // 获取文件夹内的文件
      for (const folderKey of folderKeys) {
        const result = await cosInstance.getBucket({
          Bucket: bucketName,
          Region: region,
          Prefix: folderKey,
          MaxKeys: 1000,
        });
        foldersContent = [...foldersContent, ...result.Contents];
        totalFiles += result.Contents.length;
      }

      setDeletingProgress({
        visible: true,
        total: totalFiles,
        current: 0,
        folderName: '多个文件',
      });

      // 删除文件
      for (let i = 0; i < fileKeys.length; i++) {
        await cosInstance.deleteObject({
          Bucket: bucketName,
          Region: region,
          Key: fileKeys[i],
        });
        setDeletingProgress((prev) => ({
          ...prev,
          current: prev.current + 1,
        }));
      }

      // 删除文件夹内容
      for (let i = 0; i < foldersContent.length; i++) {
        await cosInstance.deleteObject({
          Bucket: bucketName,
          Region: region,
          Key: foldersContent[i].Key,
        });
        setDeletingProgress((prev) => ({
          ...prev,
          current: prev.current + 1,
        }));
      }

      message.success('批量删除成功');
      setSelectedFiles([]);
      getFileList();
    } catch (error) {
      message.error('批量删除失败：' + error.message);
    } finally {
      setDeletingProgress((prev) => ({ ...prev, visible: false }));
    }
  };

  // 处理分页变化
  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
    }));
  };

  // 修改单个文件下载函数
  const downloadFile = async (file) => {
    try {
      const startTime = Date.now();
      prevDownloadData.current[file.name] = {
        loaded: 0,
        time: startTime,
      };

      setDownloadProgress((prev) => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: 'active',
          percent: 0,
          startTime,
        },
      }));

      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentLength = +response.headers.get('Content-Length');
      const reader = response.body.getReader();
      const chunks = [];
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        // 计算下载速度
        const now = Date.now();
        const prevData = prevDownloadData.current[file.name];
        if (prevData) {
          const timeDiff = (now - prevData.time) / 1000; // 转换为秒
          const bytesDiff = receivedLength - prevData.loaded;
          const speedBps = bytesDiff / timeDiff;

          let speedText;
          if (speedBps >= 1024 * 1024) {
            speedText = `${(speedBps / (1024 * 1024)).toFixed(2)} MB/s`;
          } else if (speedBps >= 1024) {
            speedText = `${(speedBps / 1024).toFixed(2)} KB/s`;
          } else {
            speedText = `${Math.round(speedBps)} B/s`;
          }

          // 计算剩余时间
          const remainingBytes = contentLength - receivedLength;
          const remainingTime = remainingBytes / speedBps;
          let remainingText;
          if (remainingTime >= 3600) {
            remainingText = `${Math.round(remainingTime / 3600)}小时`;
          } else if (remainingTime >= 60) {
            remainingText = `${Math.round(remainingTime / 60)}分钟`;
          } else {
            remainingText = `${Math.round(remainingTime)}秒`;
          }

          setDownloadSpeeds((prev) => ({
            ...prev,
            [file.name]: {
              speed: speedText,
              remaining: remainingText,
            },
          }));
        }

        // 更新进度
        const percent = Math.round((receivedLength / contentLength) * 100);
        setDownloadProgress((prev) => ({
          ...prev,
          [file.name]: {
            ...prev[file.name],
            percent,
            status: 'active',
          },
        }));

        // 更新上一次的数据
        prevDownloadData.current[file.name] = {
          loaded: receivedLength,
          time: now,
        };
      }

      // 更新下载成功状态
      setDownloadProgress((prev) => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          percent: 100,
          status: 'success',
        },
      }));
    } catch (error) {
      console.error(`文件 ${file.name} 下载失败:`, error);
      setDownloadProgress((prev) => ({
        ...prev,
        [file.name]: {
          ...prev[file.name],
          status: 'error',
          error: error.message,
        },
      }));
      // 清理速度数据
      setDownloadSpeeds((prev) => {
        const newSpeeds = { ...prev };
        delete newSpeeds[file.name];
        return newSpeeds;
      });
      throw error;
    }
  };

  // 修改批量下载处理函数
  const handleBatchDownload = async () => {
    const selectedFileList = selectedFiles
      .map((key) => files.find((f) => f.key === key))
      .filter((file) => file && !file.isFolder);

    if (selectedFileList.length === 0) {
      message.warning('请选择要下载的文件');
      return;
    }

    setDownloading(true);
    setDownloadModalVisible(true);

    // 初始化下载进度
    const initialProgress = selectedFileList.reduce((acc, file) => {
      acc[file.name] = {
        percent: 0,
        status: 'pending',
        size: file.size,
        name: file.name,
        error: null,
      };
      return acc;
    }, {});

    setDownloadProgress(initialProgress);

    try {
      // 并发载，但限制最大并发数为3
      const batchSize = 3;
      for (let i = 0; i < selectedFileList.length; i += batchSize) {
        const batch = selectedFileList.slice(i, i + batchSize);
        await Promise.all(batch.map((file) => downloadFile(file)));
      }

      message.success(`成功下载 ${selectedFileList.length} 个文件`);
    } catch (error) {
      console.error('批量下载失败:', error);
      message.error('部分文件下载失败，请查看详情');
    } finally {
      setDownloading(false);
    }
  };

  // 修改下载进度弹窗组件
  const DownloadProgressModal = () => (
    <CModal
      visible={downloadModalVisible}
      onClose={() => {
        if (!downloading) {
          setDownloadModalVisible(false);
          setDownloadProgress({});
          setDownloadSpeeds({});
        }
      }}
      size="lg"
    >
      <ProgressModalWrapper>
        <CModalHeader>
          <CModalTitle>
            <div className="d-flex align-items-center">
              <CIcon icon={cilCloudDownload} className="me-2" />
              文件下载进度
            </div>
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Object.entries(downloadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center" style={{ maxWidth: '70%' }}>
                    <CIcon
                      icon={cilFile}
                      className={`me-2 ${
                        progress.status === 'success'
                          ? 'text-success'
                          : progress.status === 'error'
                            ? 'text-danger'
                            : 'text-primary'
                      }`}
                    />
                    <div className="text-truncate" title={fileName}>
                      {fileName}
                    </div>
                  </div>
                  <div className="text-end" style={{ minWidth: '120px' }}>
                    <div className="small">{progress.size}</div>
                    {downloadSpeeds[fileName] && progress.status === 'active' && (
                      <div className="small text-primary">{downloadSpeeds[fileName].speed}</div>
                    )}
                  </div>
                </div>

                <CProgress
                  className="mb-1"
                  height={8}
                  value={progress.percent}
                  color={
                    progress.status === 'error'
                      ? 'danger'
                      : progress.status === 'success'
                        ? 'success'
                        : 'primary'
                  }
                />

                <div className="d-flex justify-content-between align-items-center">
                  <div className="small text-muted">
                    {progress.percent}%
                    {downloadSpeeds[fileName] && progress.status === 'active' && (
                      <span className="ms-2">剩余 {downloadSpeeds[fileName].remaining}</span>
                    )}
                  </div>
                  {progress.error && <div className="small text-danger">{progress.error}</div>}
                </div>
              </div>
            ))}
          </div>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            已完成 {Object.values(downloadProgress).filter((p) => p.status === 'success').length} /{' '}
            {Object.keys(downloadProgress).length} 个文件
          </div>
          <CButton
            color={downloading ? 'secondary' : 'primary'}
            onClick={() => {
              if (!downloading) {
                setDownloadModalVisible(false);
                setDownloadProgress({});
                setDownloadSpeeds({});
              }
            }}
            disabled={downloading}
          >
            {downloading ? (
              <div className="d-flex align-items-center">
                <CSpinner size="sm" className="me-2" />
                下载中...
              </div>
            ) : (
              '关闭'
            )}
          </CButton>
        </CModalFooter>
      </ProgressModalWrapper>
    </CModal>
  );

  // 修改判断是否为图片URL的辅助函数
  const isImageUrl = (key) => {
    if (!key) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some((ext) => key.toLowerCase().endsWith(ext));
  };

  return (
    <GlobalStyle>
      <CContainer fluid>
        <CRow>
          <CCol xs={12}>
            <SearchWrapper>
              <CCardBody>
                <CRow className="align-items-center">
                  {/* 搜索框 */}
                  <CCol xs={12} md={6}>
                    <CInputGroup>
                      <CFormInput
                        placeholder="搜索文件..."
                        value={searchKey}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="border-end-0"
                      />
                      <CButton color="primary" variant="outline" onClick={() => getFileList()}>
                        <CIcon icon={cilMagnifyingGlass} />
                      </CButton>
                    </CInputGroup>
                  </CCol>

                  {/* 右侧按钮组 */}
                  <CCol xs={12} md={6} className="d-flex justify-content-end mt-2 mt-md-0">
                    <CButtonGroup>
                      <Upload
                        customRequest={({ file, onSuccess }) => {
                          handleUpload(file).then(onSuccess);
                        }}
                        showUploadList={false}
                        disabled={uploading}
                        multiple={true}
                        directory={false}
                        accept="*"
                        beforeUpload={(file, fileList) => {
                          if (fileList.indexOf(file) === 0) {
                            handleUpload(fileList);
                          }
                          return false;
                        }}
                      >
                        <CButton color="primary" disabled={uploading} title="支持批量上传">
                          <CIcon icon={cilCloudUpload} className="me-1" />
                          上传
                        </CButton>
                      </Upload>
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => setIsCreateFolderVisible(true)}
                        title="新建文件夹"
                      >
                        <CIcon icon={cilFolder} className="me-1" />
                        新建文件夹
                      </CButton>
                      <CButton
                        color="primary"
                        variant="outline"
                        onClick={() => setIsHistoryVisible(true)}
                        title="上传历史"
                      >
                        <CIcon icon={cilHistory} className="me-1" />
                        历史记录
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
                  <CTable hover responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style={{ width: '40px' }}>
                          <CFormCheck
                            checked={selectedFiles.length === files.length && files.length > 0}
                            indeterminate={
                              selectedFiles.length > 0 && selectedFiles.length < files.length
                            }
                            onChange={handleSelectAll}
                          />
                        </CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '10%' }}>预览</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '35%' }}>名称</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '10%' }}>大小</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '15%' }}>类型</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '15%' }}>存储类</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '15%' }}>最后修改时间</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '10%' }}>操作</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredFiles.length > 0 ? (
                        filteredFiles
                          .slice(
                            (pagination.current - 1) * pagination.pageSize,
                            pagination.current * pagination.pageSize,
                          )
                          .map((item) => (
                            <CTableRow key={item.key} active={selectedFiles.includes(item.key)}>
                              <CTableDataCell>
                                <CFormCheck
                                  checked={selectedFiles.includes(item.key)}
                                  onChange={() => handleSelect(item.key)}
                                />
                              </CTableDataCell>
                              <CTableDataCell>
                                {!item.isFolder && isImageUrl(item.key) && (
                                  <Image
                                    src={`https://${bucketName}.cos.${region}.myqcloud.com/${item.key}`}
                                    alt={item.name}
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      objectFit: 'cover',
                                      cursor: 'pointer',
                                    }}
                                    preview={{
                                      mask: '预览',
                                      maskClassName: 'custom-mask',
                                    }}
                                  />
                                )}
                              </CTableDataCell>
                              {item.isFolder ? (
                                <CTableDataCell colSpan="6" style={{ padding: '4px 12px' }}>
                                  <CRow className="align-items-center g-0">
                                    <CCol style={{ display: 'flex', alignItems: 'center' }}>
                                      <CIcon
                                        icon={cilFolder}
                                        size="sm"
                                        style={{
                                          color: '#ffd700',
                                          marginRight: '4px',
                                        }}
                                      />
                                      <CButton
                                        color="link"
                                        className="p-0 text-decoration-none text-start"
                                        onClick={() => handleFolderClick(item.key)}
                                      >
                                        {item.name}/
                                      </CButton>
                                    </CCol>
                                    <CCol xs="auto">
                                      <CButtonGroup size="sm">
                                        <CButton
                                          color="primary"
                                          variant="ghost"
                                          onClick={() => handleFolderClick(item.key)}
                                        >
                                          打开
                                        </CButton>
                                        <CPopover
                                          content={
                                            <div>
                                              <p>
                                                确定要删除这个文件夹吗？文件夹所有文件都会被删除。
                                              </p>
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
                                      </CButtonGroup>
                                    </CCol>
                                  </CRow>
                                </CTableDataCell>
                              ) : (
                                <>
                                  <CTableDataCell style={{ padding: '4px 12px' }}>
                                    <div
                                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      <CIcon icon={cilFile} size="sm" />
                                      <a
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleFileClick(item);
                                        }}
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
                                  <CTableDataCell>
                                    <CBadge color="info" shape="rounded-pill">
                                      {item.size}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge color="info" shape="rounded-pill">
                                      {item.contentType}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CBadge color="success" shape="rounded-pill">
                                      {item.storageClass}
                                    </CBadge>
                                  </CTableDataCell>
                                  <CTableDataCell>{item.lastModified}</CTableDataCell>
                                  <CTableDataCell>
                                    <CButtonGroup style={{ width: '150px' }} size="sm">
                                      {!item.isFolder && ( // 只为文件显下载按钮
                                        <CButton
                                          color="primary"
                                          variant="ghost"
                                          onClick={() => handleDownload(item)}
                                          title="下载文件"
                                        >
                                          <CIcon icon={cilCloudDownload} size="sm" />
                                          <span className="ms-1">下载</span>
                                        </CButton>
                                      )}
                                      <CButton
                                        color="danger"
                                        variant="ghost"
                                        onClick={() => handleDelete(item.key, item.isFolder)}
                                        title={item.isFolder ? '删除文件夹' : '删除文件'}
                                      >
                                        <CIcon icon={cilTrash} size="sm" />
                                        <span className="ms-1">删除</span>
                                      </CButton>
                                    </CButtonGroup>
                                  </CTableDataCell>
                                </>
                              )}
                            </CTableRow>
                          ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan="7" className="text-center py-5">
                            <div className="d-flex flex-column align-items-center text-muted">
                              <CIcon icon={cilFolder} size="3xl" className="mb-3 text-muted" />
                              {loading ? (
                                <>
                                  <CSpinner size="sm" className="mb-2" />
                                  <div>加载中...</div>
                                </>
                              ) : searchKey ? (
                                <>
                                  <h5 className="mb-2">未找到匹配的文件</h5>
                                  <div className="small">
                                    没有找到包含 "{searchKey}" 的文件或文件夹
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h5 className="mb-2">当前文件夹为空</h5>
                                  <div className="small">
                                    {currentPath ? (
                                      <>
                                        您可以
                                        <Upload
                                          customRequest={({ file, onSuccess }) => {
                                            handleUpload(file).then(onSuccess);
                                          }}
                                          showUploadList={false}
                                          disabled={uploading}
                                          multiple={true}
                                          directory={false}
                                          accept="*"
                                          beforeUpload={(file, fileList) => {
                                            if (fileList.indexOf(file) === 0) {
                                              handleUpload(fileList);
                                            }
                                            return false;
                                          }}
                                        >
                                          <CButton
                                            color="link"
                                            className="p-0 mx-1"
                                            disabled={uploading}
                                          >
                                            上传文件
                                          </CButton>
                                        </Upload>
                                        或
                                        <CButton
                                          color="link"
                                          className="p-0 mx-1"
                                          onClick={() => setIsCreateFolderVisible(true)}
                                        >
                                          新建文件夹
                                        </CButton>
                                      </>
                                    ) : (
                                      '当前目录下没有任何文件或文件夹'
                                    )}
                                  </div>
                                </>
                              )}
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
              <CModalHeader
                onClose={() => {
                  setIsCreateFolderVisible(false);
                  setNewFolderName('');
                }}
              >
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
                <CButton color="primary" onClick={handleCreateFolder}>
                  确定
                </CButton>
              </CModalFooter>
            </CModal>

            {/* 添加删除进度弹窗 */}
            <DeleteProgress />

            {/* 加上传进度弹窗 */}
            <UploadProgressModal />

            {/* 修改批量操作按钮部分 */}
            {selectedFiles.length > 0 && (
              <div className="mt-2">
                <CButtonGroup size="sm">
                  {selectedFiles.some((key) => {
                    const file = files.find((f) => f.key === key);
                    return file && !file.isFolder;
                  }) && (
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={handleBatchDownload}
                      disabled={downloading}
                    >
                      <CIcon icon={cilCloudDownload} className="me-1" />
                      下载选中项 (
                      {
                        selectedFiles.filter((key) => {
                          const file = files.find((f) => f.key === key);
                          return file && !file.isFolder;
                        }).length
                      }
                      ){downloading && <CSpinner size="sm" className="ms-2" />}
                    </CButton>
                  )}
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

            {/* 添加分页组件 */}
            {filteredFiles.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="small text-muted">共 {filteredFiles.length} 项</div>
                <CButtonGroup size="sm">
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                  >
                    上��页
                  </CButton>
                  <CButton color="primary" variant="outline" disabled>
                    {pagination.current} / {Math.ceil(filteredFiles.length / pagination.pageSize)}
                  </CButton>
                  <CButton
                    color="primary"
                    variant="outline"
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={
                      pagination.current >= Math.ceil(filteredFiles.length / pagination.pageSize)
                    }
                  >
                    下一页
                  </CButton>
                </CButtonGroup>
              </div>
            )}

            {/* 添加下载进度弹窗 */}
            <DownloadProgressModal />
          </CCol>
        </CRow>
      </CContainer>
    </GlobalStyle>
  );
};

export default Cos;
