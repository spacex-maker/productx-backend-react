import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, DatePicker } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import ActivityConfigTable from './ActivityConfigTable';
import ActivityConfigCreateModal from './ActivityConfigCreateModal';
import ActivityConfigUpdateModal from './ActivityConfigUpdateModal';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ActivityConfig = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    title: '',
    displayName: '',
    activityType: undefined,
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedConfig, setSelectedConfig] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined),
      );
      const response = await api.get('/manage/activity-config/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || []);
        setTotalNum(response.totalNum || 0);
      } else {
        message.info('暂无数据');
      }
    } catch (error) {
      console.error('Failed to fetch activity configs', error);
      message.error('获取活动配置失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreate = async (values) => {
    try {
      // 日期格式转换已在Modal中处理
      await api.post('/manage/activity-config/create', values);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('Failed to create activity config', error);
      message.error('创建失败');
    }
  };

  const handleUpdate = async (values) => {
    try {
      // 日期格式转换已在Modal中处理
      await api.put('/manage/activity-config/update', values);
      message.success('更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('Failed to update activity config', error);
      message.error('更新失败');
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/manage/activity-config/${id}`);
      message.success('删除成功');
      await fetchData();
    } catch (error) {
      console.error('Failed to delete activity config', error);
      message.error('删除失败');
    }
  };

  const handleEditClick = (config) => {
    updateForm.setFieldsValue({
      id: config.id,
      title: config.title,
      activityType: config.activityType,
      status: config.status,
      priority: config.priority,
      startTime: config.startTime ? dayjs(config.startTime) : null,
      endTime: config.endTime ? dayjs(config.endTime) : null,
    });
    // 将完整的config传递给Modal，由Modal内部解析JSON
    setSelectedConfig(config);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.title}
                onChange={handleSearchChange}
                name="title"
                placeholder="活动名称"
                allowClear
              />
            </Col>
            <Col>
              <Input
                value={searchParams.displayName}
                onChange={handleSearchChange}
                name="displayName"
                placeholder="展示名称"
                allowClear
              />
            </Col>
            <Col>
              <Select
                value={searchParams.activityType}
                onChange={(value) => handleSelectChange('activityType', value)}
                allowClear
                placeholder="活动类型"
                style={{ width: 150 }}
              >
                <Select.Option value="invite_friend">邀请好友</Select.Option>
                <Select.Option value="recharge">充值</Select.Option>
                <Select.Option value="sign_in">签到</Select.Option>
                <Select.Option value="content_creation">创作激励</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSelectChange('status', value)}
                allowClear
                placeholder="状态"
                style={{ width: 150 }}
              >
                <Select.Option value={0}>草稿</Select.Option>
                <Select.Option value={1}>上线中</Select.Option>
                <Select.Option value={2}>已下线</Select.Option>
                <Select.Option value={3}>暂停</Select.Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary" onClick={fetchData} disabled={isLoading}>
                <SearchOutlined /> {isLoading ? <Spin /> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                <PlusOutlined /> 新增活动
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                danger
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/activity-config/delete-batch',
                    selectedRows,
                    fetchData,
                  })
                }
                disabled={selectedRows.length === 0}
              >
                <DeleteOutlined /> 批量删除
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <ActivityConfigTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </Spin>
      </div>
      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <ActivityConfigCreateModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreate}
        form={createForm}
      />
      <ActivityConfigUpdateModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdate={handleUpdate}
        selectedConfig={selectedConfig}
      />
    </div>
  );
};

export default ActivityConfig;

