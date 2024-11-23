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
  CFormInput
} from '@coreui/react';
import {Upload, message, Popconfirm, Button, Space, Progress, Modal, List, Tag} from 'antd';
import CIcon from '@coreui/icons-react';
import {
  cilCloudUpload,
  cilTrash,
  cilMagnifyingGlass,
  cilFile,
  cilFolder,
  cilCloudDownload
} from '@coreui/icons';
import COS from 'cos-js-sdk-v5';
import api from 'src/axiosInstance';
import styled from 'styled-components';
import { CopyOutlined, CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons';

const StyledCard = styled(CCard)`
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const SearchWrapper = styled(CCard)`
  margin-bottom: 20px;
`;

const TableWrapper = styled(CCard)`
  .ant-table-wrapper {
    background: white;
    border-radius: 4px;
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
  const [uploading, setUploading] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isFileDetailVisible, setIsFileDetailVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
        Delimiter: '/',
        MaxKeys: 1000
      });

      console.log('getBucket result:', result);

      if (!result) {
        throw new Error('获取文件列表失败：返回数据格式错误');
      }

      // 处理文件夹
      const folders = (result.CommonPrefixes || []).map(prefix => ({
        key: prefix.Prefix,
        isFolder: true,
        name: prefix.Prefix.slice(path.length).replace('/', '')
      }));

      // 处理文件
      const files = (result.Contents || []).map(item => ({
        key: item.Key,
        isFolder: false,
        name: item.Key.slice(path.length),
        size: (item.Size / 1024).toFixed(2) + ' KB',
        lastModified: new Date(item.LastModified).toLocaleString(),
        url: `https://${bucketName}.cos.${region}.myqcloud.com/${item.Key}`,
        contentType: item.ContentType || '未知类型',
        etag: item.ETag?.replace(/"/g, ''),
        storageClass: item.StorageClass || '标准存储',
        owner: item.Owner?.ID || '未知'
      })).filter(file => file.name !== '');

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

  // 删除文件
  const handleDelete = async (key) => {
    try {
      await cosInstance.deleteObject({
        Bucket: bucketName,
        Region: region,
        Key: key
      });
      message.success('删除成功');
      getFileList();
    } catch (error) {
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
  const handleUpload = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: {
          percent: 0,
          status: 'uploading'
        }
      }));

      const fileKey = currentPath 
        ? `${currentPath}${file.name}`
        : file.name;

      await cosInstance.putObject({
        Bucket: bucketName,
        Region: region,
        Key: fileKey,
        Body: file,
        onProgress: (progressData) => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: {
              percent: Math.floor(progressData.percent * 100),
              status: 'uploading'
            }
          }));
        }
      });

      // 上传成功
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: {
          percent: 100,
          status: 'success'
        }
      }));

      // 添加到上传历史
      addUploadHistory(file, 'success', currentPath);
      message.success('上传成功');

      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });
      }, 3000);

      getFileList(null, currentPath);
    } catch (error) {
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: {
          percent: 0,
          status: 'error'
        }
      }));
      // 添加到上传历史
      addUploadHistory(file, 'error', currentPath);
      console.error('上传失败:', error);
      message.error('上传失败：' + error.message);
    } finally {
      setUploading(false);
    }
    return false;
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

  // 添加文件详情弹窗组件
  const FileDetailModal = () => {
    if (!selectedFile) return null;

    const details = [
      {
        label: '文件名',
        value: selectedFile.name
      },
      {
        label: '文件大小',
        value: selectedFile.size
      },
      {
        label: '存储类型',
        value: selectedFile.storageClass
      },
      {
        label: '文件类型',
        value: selectedFile.contentType
      },
      {
        label: '最后修改时间',
        value: selectedFile.lastModified
      },
      {
        label: '访问链接',
        value: selectedFile.url,
        isUrl: true
      },
      {
        label: 'ETag',
        value: selectedFile.etag
      }
    ];

    return (
      <Modal
        title="文件详情"
        open={isFileDetailVisible}
        onCancel={() => setIsFileDetailVisible(false)}
        footer={[
          <Button key="download" type="primary" onClick={() => handleDownload(selectedFile)}>
            <CIcon icon={cilCloudDownload} size="sm" /> 下载文件
          </Button>,
          <Button key="copy" onClick={() => handleCopy(selectedFile.url)}>
            <CopyOutlined /> 复制链接
          </Button>,
          <Button key="close" onClick={() => setIsFileDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        <List
          dataSource={details}
          renderItem={item => (
            <List.Item style={{ padding: '12px 0' }}>
              <div style={{ width: '100%' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ 
                  wordBreak: 'break-all',
                  color: '#666'
                }}>
                  {item.isUrl ? (
                    <a href={item.value} target="_blank" rel="noopener noreferrer">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Modal>
    );
  };

  // 上传历史记录弹窗
  const HistoryModal = () => (
    <Modal
      title="上传历史记录"
      open={isHistoryVisible}
      onCancel={() => setIsHistoryVisible(false)}
      footer={null}
      width={700}
    >
      <List
        dataSource={uploadHistory}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px' }}>{item.fileName}</span>
                  <Tag color={item.status === 'success' ? 'success' : 'error'}>
                    {item.status === 'success' ? (
                      <><CheckCircleOutlined /> 成功</>
                    ) : (
                      <><CloseCircleOutlined /> 失败</>
                    )}
                  </Tag>
                </div>
              }
              description={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>大小: {item.fileSize}</span>
                  <span>上传时间: {item.uploadTime}</span>
                  <span>上传位置: {item.path}</span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );

  return (
    <CContainer fluid>
      <CRow>
        <CCol xs={12}>
          <StyledCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">对象存储管理</h5>
                {currentPath && (
                  <small className="text-muted">
                    当前位置: {currentPath}
                  </small>
                )}
              </div>
              <div>
                <Space>
                  <Upload
                    customRequest={({ file }) => handleUpload(file)}
                    showUploadList={false}
                    disabled={uploading}
                  >
                    <CButton color="primary" disabled={uploading}>
                      <CIcon icon={cilCloudUpload} className="me-2" />
                      {uploading ? '上传中...' : `上传文件${currentPath ? '到当前文件夹' : ''}`}
                    </CButton>
                  </Upload>
                  <Button 
                    icon={<HistoryOutlined />}
                    onClick={() => setIsHistoryVisible(true)}
                  >
                    上传历史
                  </Button>
                </Space>
                {/* 上传进度显示 */}
                <div style={{ marginTop: '10px', maxWidth: '300px' }}>
                  {Object.entries(uploadProgress).map(([fileName, progress]) => (
                    <div key={fileName} style={{ marginBottom: '8px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}>
                        <span style={{ 
                          maxWidth: '200px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'
                        }}>
                          {fileName}
                        </span>
                        <span>{progress.percent}%</span>
                      </div>
                      <Progress 
                        percent={progress.percent} 
                        status={progress.status}
                        size="small"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CCardHeader>
          </StyledCard>

          <SearchWrapper>
            <CCardBody>
              <CRow>
                <CCol md={6} lg={4}>
                  <CInputGroup>
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
                      <CIcon icon={cilMagnifyingGlass} />
                      {loading ? '搜索中...' : '搜索'}
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CRow>
            </CCardBody>
          </SearchWrapper>

          <TableWrapper>
            <CCardBody>
              {currentPath && (
                <div className="mb-3">
                  <CButton 
                    color="primary" 
                    variant="outline" 
                    onClick={handleBackClick}
                  >
                    返回上级目录
                  </CButton>
                  <span className="ms-3">当前路径: {currentPath}</span>
                </div>
              )}
              {loading ? (
                <div className="text-center p-3">
                  <CSpinner color="primary" />
                </div>
              ) : (
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: '35%' }}>名称</th>
                      <th style={{ width: '10%' }}>大小</th>
                      <th style={{ width: '15%' }}>类型</th>
                      <th style={{ width: '15%' }}>存储类型</th>
                      <th style={{ width: '15%' }}>最后修改时间</th>
                      <th className="fixed-column" style={{ width: '10%' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((item) => (
                      <tr key={item.key} className="record-font">
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                            <CIcon 
                              icon={item.isFolder ? cilFolder : cilFile} 
                              size="sm" 
                              style={{ marginRight: '8px' }} 
                            />
                            <div style={{ 
                              flex: 1, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              position: 'relative'
                            }}>
                              {item.isFolder ? (
                                <a href="#" onClick={(e) => {
                                  e.preventDefault();
                                  handleFolderClick(item.key);
                                }}>
                                  {item.name}
                                </a>
                              ) : (
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
                              )}
                            </div>
                            {!item.isFolder && (
                              <Button
                                icon={<CopyOutlined />}
                                size="small"
                                onClick={() => handleCopy(item.url)}
                                style={{ marginLeft: '8px' }}
                                title="复制链接"
                              />
                            )}
                          </div>
                        </td>
                        <td className="text-truncate">
                          {item.isFolder ? '-' : item.size}
                        </td>
                        <td className="text-truncate">
                          {item.isFolder ? (
                            <Tag color="purple">文件夹</Tag>
                          ) : (
                            <Tag color="blue">{item.contentType}</Tag>
                          )}
                        </td>
                        <td className="text-truncate">
                          {item.isFolder ? '-' : (
                            <Tag color="green">{item.storageClass}</Tag>
                          )}
                        </td>
                        <td className="text-truncate">
                          {item.isFolder ? '-' : item.lastModified}
                        </td>
                        <td className="fixed-column">
                          {item.isFolder ? (
                            <Button type="link" onClick={() => handleFolderClick(item.key)}>
                              打开
                            </Button>
                          ) : (
                            <Space>
                              <Button type="link" onClick={() => handleDownload(item)}>
                                <CIcon icon={cilCloudDownload} size="sm" /> 下载
                              </Button>
                              <Popconfirm
                                title="确定要删除这个文件吗？"
                                onConfirm={() => handleDelete(item.key)}
                                okText="确定"
                                cancelText="取消"
                              >
                                <Button type="link" danger>
                                  <CIcon icon={cilTrash} size="sm" /> 删除
                                </Button>
                              </Popconfirm>
                            </Space>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CCardBody>
          </TableWrapper>

          {/* 添加文件详情弹窗 */}
          <FileDetailModal />

          {/* 历史记录弹窗 */}
          <HistoryModal />
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Cos;
