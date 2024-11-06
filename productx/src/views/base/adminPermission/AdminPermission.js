import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import PermissionTable from "src/views/base/adminPermission/PermissionTable"; // 请确保你有相应的权限表格组件
import PermissionCreateFormModal from "src/views/base/adminPermission/AddPermissionModal"; // 新建权限模态框
import UpdatePermissionModal from "src/views/base/adminPermission/UpdatePermissionModal"; // 更新权限模态框

const createPermission = async (permissionData) => {
  await api.post('/manage/admin-permissions/create', permissionData);
};

const updatePermission = async (updateData) => {
  await api.put('/manage/admin-permissions/update', updateData);
};

const AdminPermission = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    description: '',
    status: undefined,
    type: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedPermission, setSelectedPermission] = useState(null);

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
      const response = await api.get('/manage/admin-permissions/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response && response.data) {
        setData(response.data); // 更新数据结构
        setTotalNum(response.totalNum); // 获取总记录数
      } else {
        message.info("暂无数据(No Data)");
      }
    } catch (error) {
      console.error('Failed to fetch permissions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreatePermission = async (values) => {
    await createPermission(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdatePermission = async (values) => {
    await updatePermission(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleStatusChange = async (id, event) => {
    await api.post('/manage/admin-permissions/change-status', { id, status: event });
    await fetchData(); // 状态更新后重新获取数据
  };

  const handleDeleteClick = async (id) => {
    await api.post('/manage/admin-permissions/remove', { id });
    await fetchData(); // 删除后重新获取数据
  };

  const handleEditClick = (permission) => {
    updateForm.setFieldsValue({
      id: permission.id,
      permissionName: permission.permissionName,
      permissionNameEn: permission.permissionNameEn,
      status: permission.status,
      description: permission.description,
      type: permission.type,
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
                value={searchParams.description}
                onChange={handleSearchChange}
                name="description"
                placeholder="权限描述"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                name="status"
                onChange={(value) => handleSearchChange({ target: { name: 'status', value: value } })}
                allowClear
                placeholder="选择状态"
              >
                <Select.Option value="true">启用</Select.Option>
                <Select.Option value="false">禁用</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                size="small"
                name="type"
                onChange={(value) => handleSearchChange({ target: { name: 'type', value: value } })}
                allowClear
                placeholder="权限类型"
              >
                <Select.Option value={1}>菜单</Select.Option>
                <Select.Option value={2}>接口</Select.Option>
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
                onClick={() => setIsCreateModalVisible(true)}
              >
                新增权限
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/admin-permissions/delete-batch',
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
          <PermissionTable
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
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <PermissionCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreatePermission}
        form={createForm}
      />
      <UpdatePermissionModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdatePermission={handleUpdatePermission}
        selectedPermission={selectedPermission} // 传递所选权限信息
      />
    </div>
  );
};

export default AdminPermission;
