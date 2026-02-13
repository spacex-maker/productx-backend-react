import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Spin, Select, Col, Row, InputNumber } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import UserInviteStatsTable from './UserInviteStatsTable';
import UserInviteStatsCreateModal from './UserInviteStatsCreateModal';
import UserInviteStatsUpdateModal from './UserInviteStatsUpdateModal';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const UserInviteStats = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    uid: '',
    currentLevel: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedStats, setSelectedStats] = useState(null);

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
      const response = await api.get('/manage/user-invite-stats/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || []);
        setTotalNum(response.totalNum || 0);
      } else {
        message.info('暂无数据');
      }
    } catch (error) {
      console.error('Failed to fetch user invite stats', error);
      message.error('获取用户邀请统计失败');
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
      await api.post('/manage/user-invite-stats/create', values);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('Failed to create user invite stats', error);
      message.error('创建失败');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await api.put('/manage/user-invite-stats/update', values);
      message.success('更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('Failed to update user invite stats', error);
      message.error('更新失败');
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/manage/user-invite-stats/${id}`);
      message.success('删除成功');
      await fetchData();
    } catch (error) {
      console.error('Failed to delete user invite stats', error);
      message.error('删除失败');
    }
  };

  const handleEditClick = (stats) => {
    updateForm.setFieldsValue({
      id: stats.id,
      uid: stats.uid,
      totalInvitedCount: stats.totalInvitedCount,
      validInvitedCount: stats.validInvitedCount,
      totalRewardPoints: stats.totalRewardPoints,
      currentLevel: stats.currentLevel,
    });
    setSelectedStats(stats);
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
                value={searchParams.uid}
                onChange={handleSearchChange}
                name="uid"
                placeholder="用户UID"
                allowClear
                type="number"
              />
            </Col>
            <Col>
              <Select
                value={searchParams.currentLevel}
                onChange={(value) => handleSelectChange('currentLevel', value)}
                allowClear
                placeholder="邀请等级"
                style={{ width: 150 }}
              >
                <Select.Option value={1}>青铜</Select.Option>
                <Select.Option value={2}>白银</Select.Option>
                <Select.Option value={3}>黄金</Select.Option>
                <Select.Option value={4}>铂金</Select.Option>
                <Select.Option value={5}>钻石</Select.Option>
                <Select.Option value={6}>王者</Select.Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary" onClick={fetchData} disabled={isLoading}>
                <SearchOutlined /> {isLoading ? <Spin /> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                <PlusOutlined /> 新增统计
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                danger
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/user-invite-stats/delete-batch',
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
          <UserInviteStatsTable
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
      <UserInviteStatsCreateModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreate}
        form={createForm}
      />
      <UserInviteStatsUpdateModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdate={handleUpdate}
        selectedStats={selectedStats}
      />
    </div>
  );
};

export default UserInviteStats;

