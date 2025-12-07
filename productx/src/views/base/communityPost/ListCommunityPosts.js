import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import CommunityPostTable from './CommunityPostTable';
import UpdateCommunityPostModal from './UpdateCommunityPostModal';
import CommunityPostCreateModal from './CommunityPostCreateModal';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ListCommunityPosts = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    title: '',
    mediaType: undefined,
    status: undefined,
    isFeatured: undefined,
    channelId: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedPost, setSelectedPost] = useState(null);

  const statusOptions = [
    { value: 0, label: '审核中' },
    { value: 1, label: '公开' },
    { value: 2, label: '私有' },
    { value: 9, label: '违规下架' },
  ];

  const mediaTypeOptions = [
    { value: 'IMAGE', label: '图片' },
    { value: 'VIDEO', label: '视频' },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === 0 || value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      if (filteredParams.userId) {
        filteredParams.userId = Number(filteredParams.userId);
      }
      if (filteredParams.channelId) {
        filteredParams.channelId = Number(filteredParams.channelId);
      }

      const response = await api.get('/manage/community-post/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || response);
        setTotalNum(response['totalNum'] || 0);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('fetchDataFailed') || '获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleCreatePost = async (values) => {
    try {
      await api.post('/manage/community-post/create', values);
      message.success(t('createSuccess') || '创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed') || '创建失败');
    }
  };

  const handleUpdatePost = async (values) => {
    try {
      await api.post('/manage/community-post/update', values);
      message.success(t('updateSuccess') || '更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed') || '更新失败');
    }
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection,
  } = UseSelectableRows();

  return (
    <div>
      <div className="card" style={{ marginTop: 0, marginBottom: 0 }}>
        <div className="card-body">
          <Row gutter={16}>
            <Col>
              <Input
                value={searchParams.userId}
                onChange={(e) => handleSearchChange('userId', e.target.value)}
                placeholder="用户ID"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.title}
                onChange={(e) => handleSearchChange('title', e.target.value)}
                placeholder="标题"
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.mediaType}
                onChange={(value) => handleSearchChange('mediaType', value)}
                placeholder="媒体类型"
                allowClear
                style={{ width: 150 }}
              >
                {mediaTypeOptions.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange('status', value)}
                placeholder="状态"
                allowClear
                style={{ width: 150 }}
              >
                {statusOptions.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.isFeatured}
                onChange={(value) => handleSearchChange('isFeatured', value)}
                placeholder="是否精选"
                allowClear
                style={{ width: 150 }}
              >
                <Option value={true}>是</Option>
                <Option value={false}>否</Option>
              </Select>
            </Col>
            <Col>
              <Input
                value={searchParams.channelId}
                onChange={(e) => handleSearchChange('channelId', e.target.value)}
                placeholder="频道ID"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  {t('add') || '添加'}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/community-post/delete-batch',
                    selectedRows,
                    fetchData,
                    resetSelection,
                  })}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete') || '批量删除'}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <CommunityPostTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            t={t}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <CommunityPostCreateModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreatePost}
        form={createForm}
        t={t}
        statusOptions={statusOptions}
        mediaTypeOptions={mediaTypeOptions}
      />

      <UpdateCommunityPostModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdatePost={handleUpdatePost}
        selectedPost={selectedPost}
        t={t}
        statusOptions={statusOptions}
        mediaTypeOptions={mediaTypeOptions}
      />
    </div>
  );
};

export default ListCommunityPosts;

