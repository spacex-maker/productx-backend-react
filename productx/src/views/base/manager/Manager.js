import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import ManagerTable from "src/views/base/manager/ManagerTable"; // 请确保你有相应的管理员表格组件
import UpdateManagerModal from "src/views/base/manager/UpdateManagerModal"; // 更新管理员模态框
import ManagerCreateFormModal from "src/views/base/manager/ManagerCreateFormModal"; // 新建管理员模态框

const updateManagerStatus = async (id, newStatus) => {
  await api.post('/manage/manager/change-status', { id, status: newStatus });
}

const createManager = async (managerData) => {
  await api.post('/manage/manager/create', managerData);
}

const updateManager = async (updateData) => {
  await api.put(`/manage/manager/update`, updateData);
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

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
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
    await updateManager(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };
  const handleStatusChange = async (id, event) => {
    await updateManagerStatus(id, event)
    await fetchData() // 状态更新后重新获取数据
  }

  const handleDeleteClick = async (id) => {
    await api.post(`/manage/manager/remove`, { id });
    await fetchData() // 状态更新后重新获取数据
  }
  const handleEditClick = (manager) => {
    updateForm.setFieldsValue({
      id: manager.id,
      username: manager.username,
      email: manager.email,
      phone: manager.phone,
      roleId: manager.roleId,
      status: manager.status,
    });
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
                size="small"
                value={searchParams.username}
                onChange={handleSearchChange}
                name="username"
                placeholder="用户名"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.email}
                onChange={handleSearchChange}
                name="email"
                placeholder="邮箱"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.phone}
                onChange={handleSearchChange}
                name="phone"
                placeholder="手机号"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
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
                size="small"
                type="primary"
                onClick={fetchData}
                disabled={isLoading}
              >
                {isLoading ? <Spin /> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}>
                新增管理员
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/manager/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
              >
                批量删除
              </Button>
            </Col>
          </Row>
        </div>
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
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateManager={handleUpdateManager}
        selectedManager={selectedManager} // 传递所选管理员信息
      />
    </div>
  );
};

export default ManagerList;
