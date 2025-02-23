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
  CPagination,
  CPaginationItem,
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
  cilInfo,
} from '@coreui/icons';
import COS from 'cos-js-sdk-v5';
import api from 'src/axiosInstance';
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
import styled from 'styled-components';

// 从 components 文件夹导入
import DeleteProgress from './components/DeleteProgress';
import DownloadProgressModal from './components/DownloadProgressModal';
import FileDetailModal from './components/FileDetailModal';
import HistoryModal from './components/HistoryModal';
import UploadProgressModal from './components/UploadProgressModal';
import CreateFolderModal from './components/CreateFolderModal';
import { GlobalStyle, SearchWrapper } from './components/styles';

// 工具函数
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// 在 TableWrapper 中添加分页样式
const TableWrapper = styled.div`
  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid var(--cui-border-color);
    
    .pagination-info {
      color: var(--cui-body-color);
      font-size: 14px;
      
      .text-muted {
        color: var(--cui-text-muted);
      }
    }

    .pagination {
      margin: 0;
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
  const [startTimes, setStartTimes] = useState({});
  const speedCalculationRef = useRef({});
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSpeeds, setDownloadSpeeds] = useState({});
  const prevDownloadData = useRef({});
  const [fileSizes, setFileSizes] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  const updateUploadSpeed = (filename, loaded, total) => {
    const now = Date.now();
    const speedInfo = speedCalculationRef.current[filename] || {
      lastLoaded: 0,
      lastTime: now,
    };

    // 每500ms更新一次速度
    if (now - speedInfo.lastTime >= 500) {
      const timeDiff = (now - speedInfo.lastTime) / 1000; // 转换为秒
      const loadedDiff = loaded - speedInfo.lastLoaded; // 字节差
      const speed = (loadedDiff / (1024 * 1024)) / timeDiff; // MB/s

      setUploadSpeeds(prev => ({
        ...prev,
        [filename]: speed.toFixed(2) + ' MB'
      }));

      // 保存文件总大小
      setFileSizes(prev => ({
        ...prev,
        [filename]: total
      }));

      // 更新参考值
      speedCalculationRef.current[filename] = {
        lastLoaded: loaded,
        lastTime: now,
      };
    } else {
      speedCalculationRef.current[filename] = {
        ...speedInfo,
        lastLoaded: loaded,
      };
    }
  };

  // 初始化 COS 实例
  const initCOS = async () => {
    try {
      const response = await api.get(`/manage/tencent/cos-credential?bucketName=${bucketName}`);
      console.log('COS credentials response:', response);

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
            ExpiredTime: expiredTime || Math.floor(Date.now() / 1000) + 1800,
          });
        },
        Region: region,
      });

      setCosInstance(cos);
      return cos;
    } catch (error) {
      console.error('初始化 COS 失败:', error);
      message.error('初始化 COS 失败：' + error.message);
      return null;
    }
  };

  // 格式化文件大小
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
        MaxKeys: 1000,
      });

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
          Size: parseInt(item.Size), // 保存原始字节数
          lastModified: new Date(item.LastModified).toLocaleString(),
          url: `https://${bucketName}.cos.${region}.myqcloud.com/${item.Key}`,
          contentType: item.ContentType || '未知类型',
          storageClass: item.StorageClass || '标准存储',
          etag: item.ETag,
          owner: item.Owner
        }));

      const allFiles = [...folders, ...files];
      setFiles(allFiles);
      setFilteredFiles(allFiles);

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

  // 处理删除
  const handleDelete = async (key, isFolder) => {
    try {
      const confirmMessage = isFolder 
        ? `确定要删除文件夹 "${key}" 及其所有内容吗？此操作不可恢复。`
        : `确定要删除文件 "${key}" 吗？此操作不可恢复。`;
        
      if (!window.confirm(confirmMessage)) {
        return;
      }

      if (isFolder) {
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

        for (let i = 0; i < result.Contents.length; i++) {
          await cosInstance.deleteObject({
            Bucket: bucketName,
            Region: region,
            Key: result.Contents[i].Key,
          });

          setDeletingProgress((prev) => ({
            ...prev,
            current: i + 1,
          }));
        }

        message.success('文件夹删除成功');
      } else {
        await cosInstance.deleteObject({
          Bucket: bucketName,
          Region: region,
          Key: key,
        });
        message.success('文件删除成功');
      }

      getFileList();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败：' + error.message);
    } finally {
      setDeletingProgress({
        visible: false,
        total: 0,
        current: 0,
        folderName: '',
      });
    }
  };

  // 处理文件上传
  const handleUpload = async (files) => {
    if (!cosInstance) {
      message.error('COS 实例未初始化');
      return;
    }

    setUploading(true);
    setUploadModalVisible(true);

    const uploadFile = async (file) => {
      try {
        const key = currentPath + file.name;
        
        setStartTimes(prev => ({
          ...prev,
          [file.name]: Date.now()
        }));

        await cosInstance.uploadFile({
          Bucket: bucketName,
          Region: region,
          Key: key,
          Body: file,
          onProgress: (progressData) => {
            const percent = Math.round(progressData.percent * 100);
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: percent
            }));
            updateUploadSpeed(file.name, progressData.loaded, progressData.total);
          },
        });

        setUploadHistory((prev) => [
          {
            fileName: file.name,
            fileSize: file.size,
            uploadTime: new Date().toLocaleString(),
            status: 'success',
          },
          ...prev,
        ]);

      } catch (error) {
        console.error('上传失败:', error);
        setUploadHistory((prev) => [
          {
            fileName: file.name,
            fileSize: file.size,
            uploadTime: new Date().toLocaleString(),
            status: 'error',
            error: error.message,
          },
          ...prev,
        ]);
        throw error;
      }
    };

    try {
      const fileList = Array.isArray(files) ? files : [files];
      
      // 初始化进度
      const initialProgress = fileList.reduce((acc, file) => {
        acc[file.name] = 0;
        return acc;
      }, {});
      setUploadProgress(initialProgress);

      // 并发上传，但限制最大并发数为3
      const batchSize = 3;
      for (let i = 0; i < fileList.length; i += batchSize) {
        const batch = fileList.slice(i, i + batchSize);
        await Promise.all(batch.map(uploadFile));
      }

      message.success(`成功上传 ${fileList.length} 个文件`);
      getFileList();
    } catch (error) {
      message.error('部分文件上传失败，请查看详情');
    } finally {
      setUploading(false);
    }
  };

  // 处理创建文件夹
  const handleCreateFolder = async () => {
    if (!cosInstance) {
      message.error('COS 实例未初始化');
      return;
    }

    try {
      const folderKey = currentPath + newFolderName + '/';
      
      await cosInstance.putObject({
        Bucket: bucketName,
        Region: region,
        Key: folderKey,
        Body: '',
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

  // 处理搜索
  const handleSearch = (value) => {
    setSearchKey(value);
    const filtered = files.filter((file) =>
      file.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFiles(filtered);
    setPagination((prev) => ({
      ...prev,
      current: 1,
      total: filtered.length,
    }));
  };

  // 处理文件选择
  const handleSelect = (key) => {
    setSelectedFiles((prev) => {
      if (prev.includes(key)) {
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // 处理全选
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFiles(files.map((file) => file.key));
    } else {
      setSelectedFiles([]);
    }
  };

  // 处理批量下载
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
      const batchSize = 3;
      for (let i = 0; i < selectedFileList.length; i += batchSize) {
        const batch = selectedFileList.slice(i, i + batchSize);
        await Promise.all(batch.map((file) => handleDownload(file)));
      }

      message.success(`成功下载 ${selectedFileList.length} 个文件`);
    } catch (error) {
      console.error('批量下载失败:', error);
      message.error('部分文件下载失败，请查看详情');
    } finally {
      setDownloading(false);
    }
  };

  // 处理批量删除
  const handleBatchDelete = async () => {
    try {
      const totalItems = selectedFiles.length;
      setDeletingProgress({
        visible: true,
        total: totalItems,
        current: 0,
        folderName: '选中项',
      });

      for (let i = 0; i < selectedFiles.length; i++) {
        const key = selectedFiles[i];
        const isFolder = files.find((f) => f.key === key)?.isFolder;

        if (isFolder) {
          const result = await cosInstance.getBucket({
            Bucket: bucketName,
            Region: region,
            Prefix: key,
            MaxKeys: 1000,
          });

          for (const item of result.Contents) {
            await cosInstance.deleteObject({
              Bucket: bucketName,
              Region: region,
              Key: item.Key,
            });
          }
        } else {
          await cosInstance.deleteObject({
            Bucket: bucketName,
            Region: region,
            Key: key,
          });
        }

        setDeletingProgress((prev) => ({
          ...prev,
          current: i + 1,
        }));
      }

      message.success(`成功删除 ${totalItems} 个项目`);
      setSelectedFiles([]);
      getFileList();
    } catch (error) {
      console.error('批量删除失败:', error);
      message.error('批量删除失败：' + error.message);
    } finally {
      setDeletingProgress({
        visible: false,
        total: 0,
        current: 0,
        folderName: '',
      });
    }
  };

  // 判断是否为图片URL
  const isImageUrl = (key) => {
    if (!key) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some((ext) => key.toLowerCase().endsWith(ext));
  };

  const getFileIcon = (filename, isFolder, contentType) => {
    if (isFolder) {
      return <FolderOutlined style={{ color: '#faa937' }} />;
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    
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
      case undefined:
        return <FileUnknownOutlined style={{ color: '#8c8c8c' }} />;
      default:
        return <FileOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getFileExtension = (filename) => {
    if (!filename) return '未知';
    const parts = filename.split('.');
    if (parts.length <= 1) return '未知';
    return parts[parts.length - 1].toUpperCase();
  };

  // 处理文件详情
  const handleShowDetail = (file) => {
    // 从 XML 数据中获取原始字节数
    const originalSize = parseInt(file.Size || file.size);
    const fileDetail = {
      ...file,
      size: originalSize,  // 使用原始字节数
      name: file.name || file.key,
      lastModified: file.lastModified,
      storageClass: file.storageClass,
      etag: file.etag,
      owner: file.owner,
      status: file.status,
      url: file.url,
      key: file.key
    };
    setSelectedFile(fileDetail);
    setIsFileDetailVisible(true);
  };

  // 初始化
  useEffect(() => {
    initCOS().then((cos) => {
      if (cos) {
        getFileList(cos);
      }
    });
  }, []);

  // 修改表格数据渲染逻辑
  const startIndex = (pagination.current - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const currentPageData = filteredFiles.slice(startIndex, endIndex);

  return (
    <GlobalStyle>
      <CContainer fluid>
        <CRow>
          <CCol xs={12}>
            <SearchWrapper>
              <CCardBody>
                <CRow className="align-items-center">
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
                            checked={selectedFiles.length === files.length}
                            onChange={handleSelectAll}
                          />
                        </CTableHeaderCell>
                        <CTableHeaderCell>文件名</CTableHeaderCell>
                        <CTableHeaderCell>大小</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '80px' }}>类型</CTableHeaderCell>
                        <CTableHeaderCell>存储类型</CTableHeaderCell>
                        <CTableHeaderCell>修改时间</CTableHeaderCell>
                        <CTableHeaderCell style={{ width: '150px' }}>操作</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {currentPageData.length > 0 ? (
                        currentPageData.map((item) => (
                          <CTableRow key={item.key}>
                            <CTableDataCell>
                              <CFormCheck
                                checked={selectedFiles.includes(item.key)}
                                onChange={() => handleSelect(item.key)}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <div className="d-flex align-items-center">
                                {isImageUrl(item.key) ? (
                                  <Image
                                    src={item.url}
                                    width={32}
                                    height={32}
                                    preview={true}
                                    style={{
                                      objectFit: 'cover',
                                      marginRight: '8px',
                                      borderRadius: '4px'
                                    }}
                                  />
                                ) : (
                                  <CIcon icon={cilFile} className="me-2" />
                                )}
                                <span
                                  className="text-primary"
                                  style={{ 
                                    cursor: item.isFolder ? 'pointer' : 'default',
                                    maxWidth: '300px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onClick={() => item.isFolder && handleFolderClick(item.key)}
                                >
                                  {item.name}
                                </span>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>{item.size}</CTableDataCell>
                            <CTableDataCell>
                              <div className="d-flex align-items-center">
                                {getFileIcon(item.name, item.isFolder, item.contentType)}
                                <span className="ms-2">
                                  {item.isFolder ? '文件夹' : getFileExtension(item.name)}
                                </span>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>{item.storageClass}</CTableDataCell>
                            <CTableDataCell>{item.lastModified}</CTableDataCell>
                            <CTableDataCell>
                              <div className="d-flex gap-2">
                                <CButton
                                  color="primary"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShowDetail(item)}
                                >
                                  <CIcon icon={cilInfo} className="me-1" />
                                  详情
                                </CButton>
                                <CButton
                                  color="primary"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(item)}
                                >
                                  <CIcon icon={cilCloudDownload} className="me-1" />
                                  下载
                                </CButton>
                                <CButton
                                  color="danger"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(item.key, item.isFolder)}
                                >
                                  <CIcon icon={cilTrash} className="me-1" />
                                  删除
                                </CButton>
                              </div>
                            </CTableDataCell>
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

            {/* 文件详情弹窗 */}
            <FileDetailModal
              visible={isFileDetailVisible}
              file={selectedFile}
              onClose={() => {
                setIsFileDetailVisible(false);
                setSelectedFile(null);
              }}
              onDownload={handleDownload}
            />

            <HistoryModal 
              visible={isHistoryVisible}
              history={uploadHistory}
              onClose={() => setIsHistoryVisible(false)}
            />

            <CreateFolderModal
              visible={isCreateFolderVisible}
              folderName={newFolderName}
              onNameChange={setNewFolderName}
              onClose={() => {
                setIsCreateFolderVisible(false);
                setNewFolderName('');
              }}
              onSubmit={handleCreateFolder}
            />

            <DeleteProgress
              progress={deletingProgress}
            />

            <UploadProgressModal
              visible={uploadModalVisible}
              uploading={uploading}
              progress={uploadProgress}
              speeds={uploadSpeeds}
              startTimes={startTimes}
              fileSizes={fileSizes}
              onClose={() => {
                if (!uploading) {
                  setUploadModalVisible(false);
                  setUploadProgress({});
                  setUploadSpeeds({});
                  setStartTimes({});
                  setFileSizes({});
                  speedCalculationRef.current = {};
                }
              }}
            />

            <DownloadProgressModal
              visible={downloadModalVisible}
              downloading={downloading}
              progress={downloadProgress}
              speeds={downloadSpeeds}
              onClose={() => {
                if (!downloading) {
                  setDownloadModalVisible(false);
                  setDownloadProgress({});
                  setDownloadSpeeds({});
                }
              }}
            />

            {/* 批量操作按钮 */}
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
                      const message = `确定要删除选中的 ${selectedFiles.length} 个项目吗？此操作不可恢复。`;
                      if (window.confirm(message)) {
                        handleBatchDelete();
                      }
                    }}
                  >
                    <CIcon icon={cilTrash} className="me-1" />
                    删除选中项
                  </CButton>
                </CButtonGroup>
              </div>
            )}

            {/* 修改分页组件部分 */}
            {filteredFiles.length > 0 && (
              <div className="pagination-wrapper">
                <CPagination>
                  <CPaginationItem
                    onClick={() => setPagination(prev => ({ ...prev, current: 1 }))}
                    disabled={pagination.current === 1}
                  >
                    首页
                  </CPaginationItem>
                  <CPaginationItem
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                    disabled={pagination.current === 1}
                  >
                    上一页
                  </CPaginationItem>
                  {Array.from({ length: Math.ceil(filteredFiles.length / pagination.pageSize) }).map((_, index) => (
                    <CPaginationItem
                      key={index + 1}
                      active={pagination.current === index + 1}
                      onClick={() => setPagination(prev => ({ ...prev, current: index + 1 }))}
                    >
                      {index + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                    disabled={pagination.current === Math.ceil(filteredFiles.length / pagination.pageSize)}
                  >
                    下一页
                  </CPaginationItem>
                  <CPaginationItem
                    onClick={() => setPagination(prev => ({ 
                      ...prev, 
                      current: Math.ceil(filteredFiles.length / pagination.pageSize) 
                    }))}
                    disabled={pagination.current === Math.ceil(filteredFiles.length / pagination.pageSize)}
                  >
                    末页
                  </CPaginationItem>
                  <span className="ms-3 text-muted" style={{ fontSize: '14px' }}>
                    共 {filteredFiles.length} 项
                  </span>
                </CPagination>
              </div>
            )}
          </CCol>
        </CRow>
      </CContainer>
    </GlobalStyle>
  );
};

export default Cos;