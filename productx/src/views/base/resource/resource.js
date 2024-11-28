import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import 'src/scss/_custom.scss';
import { Modal, Button, Form, Input, message, Spin, Progress } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import FileUpload from 'src/components/common/TencentCosFileUpload';
import Pagination from 'src/components/common/Pagination';
import { HandleBatch } from 'src/components/common/HandleBatch';

// 上传资源
const uploadResource = async (values) => {
  try {
    const formData = new FormData();

    // 处理其他字段
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    await api.post('/manage/resource/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    message.success('Upload successful!');
  } catch (error) {
    console.error('Failed to upload resource', error);
    message.error('Upload failed!');
  }
};

const ResourceList = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    uploadUser: '',
    resourceName: '',
    title: '',
    description: '',
    isPublic: '',
  });

  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 添加加载状态
  const [form] = Form.useForm();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);

  useEffect(() => {
    fetchData();
  }, [current, pageSize]);

  const fetchData = async () => {
    setIsLoading(true); // 开始加载
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      );
      const response = await api.get('/manage/resource/list', {
        params: { current, size: pageSize, ...filteredParams },
      });

      setData(response.data);
      setTotalNum(response.totalNum);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false); // 完成加载
    }
  };
  const handleUploadStatusChange = (uploading) => {
    console.log('上传状态改变:' + uploading);
    setIsUploading(uploading);
  };

  const handleUploadProgress = (percentCompleted, speed) => {
    setUploadPercent(percentCompleted);
    setUploadSpeed(speed);
  };
  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleUploadModalCancel = () => setIsUploadModalVisible(false);

  const handleImageModalCancel = () => {
    setIsImageModalVisible(false);
    setFullscreenImage(null);
  };
  const handleUploadSuccess = (newFileUrls, newFileNames) => {
    // 获取当前表单中的 fileUrls，如果没有则返回空数组
    const currentFileUrls = form.getFieldValue('fileUrls') || [];

    // 将当前的 fileUrls 与新上传的 newFileUrls 合并
    const updatedFileUrls = [...currentFileUrls, ...newFileUrls];

    // 更新表单字段的值
    form.setFieldsValue({ fileUrls: updatedFileUrls });

    // 更新文件名状态，将新文件名追加到已有文件名数组中
    setUploadedFileNames((prevFileNames) => [...prevFileNames, ...newFileNames]);

    fetchData();
  };
  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    // 这里可以添加错误提示
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };
  const [selectedItem, setSelectedItem] = useState(null); // 选中的记录
  const [isModalVisible, setIsModalVisible] = useState(false); // 弹窗可见性
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };
  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection, // 获取重置选择状态的方法
  } = UseSelectableRows();
  const handleSearch = () => {
    fetchData();
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          {Object.keys(searchParams).map((key) => (
            <div key={key} className="position-relative">
              <input
                type="text"
                className="form-control search-box"
                name={key}
                placeholder={`搜索${key}`}
                value={searchParams[key]}
                onChange={handleSearchChange}
              />
            </div>
          ))}
          <Button
            type="primary"
            onClick={handleSearch}
            className="search-button"
            disabled={isLoading} // 禁用按钮
          >
            {isLoading ? <Spin /> : '查询'}
          </Button>
          <Button
            type="primary"
            onClick={() => setIsUploadModalVisible(true)}
            className="upload-button"
          >
            上传资源
          </Button>
          <Button
            type="primary"
            onClick={() =>
              HandleBatchDelete({
                url: '/manage/resource/delete-batch',
                selectedRows,
                fetchData,
              })
            }
            disabled={selectedRows.length === 0}
          >
            批量删除
          </Button>
          <Button
            type="primary"
            onClick={() =>
              HandleBatch({
                url: '/manage/resource/disable-batch',
                selectedRows,
                fetchData,
              })
            }
            disabled={selectedRows.length === 0}
          >
            批量失效
          </Button>
          <Button
            type="primary"
            onClick={() =>
              HandleBatch({
                url: '/manage/resource/enable-batch',
                selectedRows,
                fetchData,
              })
            }
            disabled={selectedRows.length === 0}
          >
            批量生效
          </Button>
        </div>
      </div>

      <Modal
        title="上传资源"
        visible={isUploadModalVisible}
        onCancel={handleUploadModalCancel}
        footer={null}
        zIndex={1000}
      >
        <Form form={form} layout="vertical" onFinish={uploadResource}>
          <Form.Item name="uploadUser" label="上传用户">
            <Input placeholder="请输入上传用户" />
          </Form.Item>
          <Form.Item name="resourceName" label="资源名称">
            <Input placeholder="请输入资源名称" />
          </Form.Item>
          <Form.Item name="title" label="文件标题">
            <Input placeholder="请输入文件标题" />
          </Form.Item>
          <Form.Item name="description" label="文件介绍">
            <Input placeholder="请输入文件介绍" />
          </Form.Item>
          <Form.Item name="isPublic" label="是否公开">
            <Input placeholder="请输入是否公开" />
          </Form.Item>
          <Form.Item
            name="fileUrls"
            label="选择文件"
            rules={[{ required: true, message: '请选择文件' }]}
          >
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
              onUploadStatusChange={handleUploadStatusChange}
              onUploadProgress={handleUploadProgress}
            />
          </Form.Item>
        </Form>
        {/* 显示上传的文件名 */}
        {uploadedFileNames.length > 0 && (
          <Form.Item label="已上传文件">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {uploadedFileNames.map((fileName, index) => (
                <div key={index}>{fileName}</div>
              ))}
            </div>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isUploading}>
            {isUploading ? '上传中' : '上传'}
          </Button>
          {isUploading && (
            <div style={{ marginTop: '20px' }}>
              <Progress percent={uploadPercent} />
              <p>Speed: {uploadSpeed} KB/s</p>
            </div>
          )}
        </Form.Item>
      </Modal>

      <Modal
        visible={isImageModalVisible}
        footer={null}
        onCancel={handleImageModalCancel}
        width="80%"
        style={{ top: 20 }}
        zIndex={2000}
      >
        {fullscreenImage && (
          <img src={fullscreenImage} alt="fullscreen" style={{ width: '100%' }} />
        )}
      </Modal>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <div className="table-wrapper">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="select_all"
                        checked={selectAll}
                        onChange={(event) => handleSelectAll(event, data)}
                      />
                      <label className="custom-control-label" htmlFor="select_all"></label>
                    </div>
                  </th>
                  {[
                    '状态',
                    '上传用户',
                    '资源名称',
                    '文件标题',
                    '文件介绍',
                    '文件大小',
                    '是否公开',
                    '资源链接',
                    '过期时间',
                    '浏览量',
                    '下载量',
                    '点赞数',
                    '不喜欢数',
                  ].map((field) => (
                    <th key={field}>{field}</th>
                  ))}
                  <th className="fixed-column">操作</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="record-font">
                    <td>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id={`td_checkbox_${item.id}`}
                          checked={selectedRows.includes(item.id)}
                          onChange={() => handleSelectRow(item.id)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor={`td_checkbox_${item.id}`}
                        ></label>
                      </div>
                    </td>
                    <td
                      className="text-truncate"
                      style={{
                        color:
                          item.status === 'COMMON'
                            ? 'green'
                            : item.status === 'INVALID'
                              ? 'orange'
                              : item.status === 'DELETE'
                                ? 'red'
                                : 'black',
                      }}
                    >
                      {item.status === 'COMMON'
                        ? '正常'
                        : item.status === 'INVALID'
                          ? '失效'
                          : item.status === 'DELETE'
                            ? '删除'
                            : '未知'}
                    </td>
                    <td className="text-truncate">{item.uploadUser}</td>
                    <td className="text-truncate">{item.resourceName}</td>
                    <td className="text-truncate">{item.title}</td>
                    <td className="text-truncate">{item.description}</td>
                    <td className="text-truncate">{(item.fileSize / 1024).toFixed(2)}MB</td>
                    <td
                      className="text-truncate"
                      style={{
                        color: item.isPublic ? 'green' : 'red',
                      }}
                    >
                      {item.isPublic ? '全站公开' : '上传者可见'}
                    </td>
                    <td className="text-truncate">{item.fileUrl}</td>
                    <td className="text-truncate">{item.expirationDate}</td>
                    <td className="text-truncate">{item.viewCount}</td>
                    <td className="text-truncate">{item.downloadCount}</td>
                    <td className="text-truncate">{item.likeCount}</td>
                    <td className="text-truncate">{item.dislikeCount}</td>
                    <td className="text-truncate fixed-column">
                      <Button onClick={() => handleViewDetails(item)} type="link">
                        查看详情
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Spin>
      </div>

      <Pagination
        totalPages={Math.ceil(totalNum / pageSize)}
        current={current}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <Modal
        title="资源详细信息"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        zIndex={1000}
      >
        {selectedItem && (
          <div>
            <p>
              <strong>资源名称:</strong> {selectedItem.resourceName}
            </p>
            <p>
              <strong>上传用户:</strong> {selectedItem.uploadUser}
            </p>
            <p>
              <strong>标题:</strong> {selectedItem.title}
            </p>
            <p>
              <strong>描述:</strong> {selectedItem.description}
            </p>
            <p>
              <strong>url:</strong> {selectedItem.fileUrl}
            </p>
            <p>
              <strong>文件大小:</strong> {(selectedItem.fileSize / 1024).toFixed(2)}MB
            </p>
            <p>
              <strong>状态:</strong>
              <span
                style={{
                  color:
                    selectedItem.status === 'COMMON'
                      ? 'green'
                      : selectedItem.status === 'INVALID'
                        ? 'orange'
                        : selectedItem.status === 'DELETE'
                          ? 'red'
                          : 'black',
                }}
              >
                {selectedItem.status === 'COMMON'
                  ? '正常'
                  : selectedItem.status === 'INVALID'
                    ? '失效'
                    : selectedItem.status === 'DELETE'
                      ? '删除'
                      : '未知'}
              </span>
            </p>
            <p>
              <strong>过期时间:</strong> {selectedItem.expirationDate}
            </p>
            <p>
              <strong>下载量:</strong> {selectedItem.downloadCount}
            </p>
            <p>
              <strong>是否公开:</strong> {selectedItem.isPublic ? '是' : '否'}
            </p>
            <p>
              <strong>上传时间:</strong> {selectedItem.createTime}
            </p>
            {selectedItem.fileUrls &&
              selectedItem.fileUrls.map((url, index) => (
                <div key={index}>
                  {url.endsWith('.mp4') ? (
                    <div>
                      <video width="320" height="240" controls>
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <p>视频封面:</p>
                      <img
                        src={selectedItem.coverImageUrl}
                        alt="Cover"
                        style={{ width: '320px' }}
                      />
                    </div>
                  ) : (
                    <div>
                      <img src={url} alt="Resource" style={{ width: '320px' }} />
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResourceList;
