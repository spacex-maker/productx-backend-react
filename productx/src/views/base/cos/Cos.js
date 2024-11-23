import React, { useState, useEffect } from 'react';
import { Table, Button, Upload, message, Spin, Space, Popconfirm, Input } from 'antd';
import { UploadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import COS from 'cos-js-sdk-v5';
import api from 'src/axiosInstance';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const TableContainer = styled.div`
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Cos = () => {
  const [cosInstance, setCosInstance] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';

  // 初始化 COS 实例
  const initCOS = async () => {
    try {
      const response = await api.get(`/manage/tencent/cos-credential?bucketName=${bucketName}`);
      const { secretId, secretKey, sessionToken, host } = response;
      
      const cos = new COS({
        SecretId: secretId,
        SecretKey: secretKey,
        SecurityToken: sessionToken,
        Region: region
      });
      
      setCosInstance(cos);
      return cos;
    } catch (error) {
      message.error('初始化 COS 失败：' + error.message);
    }
  };

  // 获取文件列表
  const getFileList = async (cos) => {
    setLoading(true);
    try {
      const instance = cos || cosInstance;
      const result = await instance.getBucket({
        Bucket: bucketName,
        Region: region,
        Prefix: searchKey
      });
      
      const fileList = result.Contents.map(item => ({
        key: item.Key,
        size: (item.Size / 1024).toFixed(2) + ' KB',
        lastModified: new Date(item.LastModified).toLocaleString(),
        url: `https://${bucketName}.cos.${region}.myqcloud.com/${item.Key}`
      }));
      
      setFiles(fileList);
    } catch (error) {
      message.error('获取文件列表失败：' + error.message);
    } finally {
      setLoading(false);
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

  // 上传文件
  const handleUpload = async (file) => {
    try {
      await cosInstance.putObject({
        Bucket: bucketName,
        Region: region,
        Key: file.name,
        Body: file
      });
      message.success('上传成功');
      getFileList();
      return false; // 阻止 Upload 组件默认上传行为
    } catch (error) {
      message.error('上传失败：' + error.message);
      return false;
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '文件名',
      dataIndex: 'key',
      key: 'key',
      render: (text, record) => (
        <a href={record.url} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      )
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: '最后修改时间',
      dataIndex: 'lastModified',
      key: 'lastModified',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="确定要删除这个文件吗？"
            onConfirm={() => handleDelete(record.key)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  useEffect(() => {
    const initialize = async () => {
      const cos = await initCOS();
      if (cos) {
        getFileList(cos);
      }
    };
    initialize();
    
    // 定期刷新临时密钥
    const refreshInterval = setInterval(initCOS, 1800000); // 30分钟刷新一次
    
    return () => clearInterval(refreshInterval);
  }, []);

  // 搜索文件
  const handleSearch = () => {
    getFileList();
  };

  return (
    <Container>
      <StyledHeader>
        <h2>对象存储管理</h2>
        <Upload
          customRequest={({ file }) => handleUpload(file)}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />} type="primary">
            上传文件
          </Button>
        </Upload>
      </StyledHeader>

      <SearchContainer>
        <Input
          placeholder="搜索文件名"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        >
          搜索
        </Button>
      </SearchContainer>

      <TableContainer>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={files}
            rowKey="key"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个文件`
            }}
          />
        </Spin>
      </TableContainer>
    </Container>
  );
};

export default Cos;
