import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import ManagerTable from "src/views/base/manager/ManagerTable"; // 请确保你有相应的管理员表格组件
import UpdateManagerModal from "src/views/base/manager/UpdateManagerModal"; // 更新管理员模态框
import ManagerCreateFormModal from "src/views/base/manager/ManagerCreateFormModal"; // 新建管理员模态框
import ManagerDetailModal from './ManagerDetailModal';

const updateManagerStatus = async (id, newStatus) => {
  await api.post('/manage/manager/change-status', { id, status: newStatus });
}

const createManager = async (managerData) => {
  await api.post('/manage/manager/create', managerData);
}

const updateManager = async (updateData) => {
  await api.post(`/manage/manager/update`, updateData);
}

const ManagerList = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    username: '',
    email: '',
    phone: '',
    roleId: undefined,
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedManager, setSelectedManager] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedManagerId, setSelectedManagerId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection
  } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      );
      const response = await api.get('/manage/manager/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response.data) {
        setData(response.data); // 更新数据结构
        setTotalNum(response.totalNum); // 获取总记录数
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateManager = async (values) => {
    await createManager(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateManager = async (values) => {
    try {
      await api.post('/manage/manager/update', values);
      message.success('修改成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      fetchData(); // 刷新列表
    } catch (error) {
      console.error('Failed to update manager:', error);
      message.error('修改失败');
    }
  };
  const handleStatusChange = async (id, event) => {
    await updateManagerStatus(id, event)
    await fetchData() // 状态更新后重新获取数据
  }

  const handleDeleteClick = async (id) => {
    try {
      await api.post('/manage/manager/remove', { id });
      message.success('删除成功');
      await fetchData();
    } catch (error) {
      console.error('Failed to delete manager:', error);
      message.error('删除失败');
    }
  };
  const handleEditClick = (record) => {
    setSelectedManager(record);
    setIsUpdateModalVisible(true);
  };

  const handleDetailClick = (record) => {
    setSelectedManagerId(record.id);
    setIsDetailModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <Row gutter={16}>
          <Col>
            <Input
              value={searchParams.username}
              onChange={handleSearchChange}
              name="username"
              placeholder="用户名"
              allowClear
            />
          </Col>
          <Col>
            <Input
              value={searchParams.email}
              onChange={handleSearchChange}
              name="email"
              placeholder="邮箱"
              allowClear
            />
          </Col>
          <Col>
            <Input
              value={searchParams.phone}
              onChange={handleSearchChange}
              name="phone"
              placeholder="手机号"
              allowClear
            />
          </Col>
          <Col>
            <Select
              name="status"
              onChange={(value) => handleSearchChange({ target: { name: 'status', value: value === 1}})}
              allowClear
              placeholder="选择状态"
            >
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>禁用</Select.Option>
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={fetchData}
              disabled={isLoading}
            >
              {isLoading ? <Spin /> : '查询'}
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => setIsCreateModalVisible(true)}>
              新增管理员
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => HandleBatchDelete({
                url: '/manage/manager/delete-batch',
                selectedRows,
                resetSelection,
                fetchData,
              })}
              disabled={selectedRows.length === 0}
            >
              批量删除
            </Button>
          </Col>
        </Row>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <ManagerTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleDetailClick={handleDetailClick}
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
      <ManagerCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateManager}
        form={createForm}
      />
      <UpdateManagerModal
        isVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          setSelectedManager(null);
          updateForm.resetFields();
        }}
        form={updateForm}
        handleUpdateManager={handleUpdateManager}
        selectedManager={selectedManager}
      />
      <ManagerDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedManagerId(null);
        }}
        managerId={selectedManagerId}
      />
    </div>
  );
};

export default ManagerList;
