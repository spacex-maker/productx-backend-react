import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import InviteRecordTable from './InviteRecordTable';
import InviteRecordCreateModal from './InviteRecordCreateModal';
import InviteRecordUpdateModal from './InviteRecordUpdateModal';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const InviteRecord = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    inviterUid: '',
    inviteeUid: '',
    inviteCode: '',
    channel: undefined,
    status: undefined,
    rewardIssued: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedRecord, setSelectedRecord] = useState(null);

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
      const response = await api.get('/manage/invite-record/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || []);
        setTotalNum(response.totalNum || 0);
      } else {
        message.info('暂无数据');
      }
    } catch (error) {
      console.error('Failed to fetch invite records', error);
      message.error('获取邀请记录失败');
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
      await api.post('/manage/invite-record/create', values);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('Failed to create invite record', error);
      message.error('创建失败');
    }
  };

  const handleUpdate = async (values) => {
    try {
      await api.put('/manage/invite-record/update', values);
      message.success('更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('Failed to update invite record', error);
      message.error('更新失败');
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.delete(`/manage/invite-record/${id}`);
      message.success('删除成功');
      await fetchData();
    } catch (error) {
      console.error('Failed to delete invite record', error);
      message.error('删除失败');
    }
  };

  const handleEditClick = (record) => {
    updateForm.setFieldsValue({
      id: record.id,
      inviterUid: record.inviterUid,
      inviteeUid: record.inviteeUid,
      inviteCode: record.inviteCode,
      channel: record.channel,
      status: record.status,
      rewardIssued: record.rewardIssued,
      clientIp: record.clientIp,
      deviceFingerprint: record.deviceFingerprint,
    });
    setSelectedRecord(record);
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
                value={searchParams.inviterUid}
                onChange={handleSearchChange}
                name="inviterUid"
                placeholder="邀请人UID"
                allowClear
              />
            </Col>
            <Col>
              <Input
                value={searchParams.inviteeUid}
                onChange={handleSearchChange}
                name="inviteeUid"
                placeholder="被邀请人UID"
                allowClear
              />
            </Col>
            <Col>
              <Input
                value={searchParams.inviteCode}
                onChange={handleSearchChange}
                name="inviteCode"
                placeholder="邀请码"
                allowClear
              />
            </Col>
            <Col>
              <Select
                value={searchParams.channel}
                onChange={(value) => handleSelectChange('channel', value)}
                allowClear
                placeholder="来源渠道"
                style={{ width: 150 }}
              >
                <Select.Option value="link">链接</Select.Option>
                <Select.Option value="poster">海报</Select.Option>
                <Select.Option value="share_api">分享API</Select.Option>
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
                <Select.Option value={0}>已点击/待注册</Select.Option>
                <Select.Option value={1}>已注册</Select.Option>
                <Select.Option value={2}>已达标</Select.Option>
                <Select.Option value={9}>风控冻结</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.rewardIssued}
                onChange={(value) => handleSelectChange('rewardIssued', value)}
                allowClear
                placeholder="奖励状态"
                style={{ width: 150 }}
              >
                <Select.Option value={0}>未发放</Select.Option>
                <Select.Option value={1}>已发放</Select.Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary" onClick={fetchData} disabled={isLoading}>
                <SearchOutlined /> {isLoading ? <Spin /> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                <PlusOutlined /> 新增记录
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                danger
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/invite-record/delete-batch',
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
          <InviteRecordTable
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
      <InviteRecordCreateModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreate}
        form={createForm}
      />
      <InviteRecordUpdateModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdate={handleUpdate}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default InviteRecord;

