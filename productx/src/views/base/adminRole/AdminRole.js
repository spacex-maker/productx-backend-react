import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import RoleTable from "src/views/base/adminRole/AdminRoleTable"; // 请确保你有相应的角色表格组件
import RoleCreateFormModal from "src/views/base/adminRole/AdminRoleCreateFormModal"; // 新建角色模态框
import UpdateRoleModal from "src/views/base/adminRole/UpdateAdminRoleModal"; // 更新角色模态框

const createRole = async (roleData) => {
  await api.post('/manage/admin-roles/create', roleData);
};

const updateRole = async (updateData) => {
  await api.put('/manage/admin-roles/update', updateData);
};

const AdminRole = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    roleName: '',
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState(null);

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
      const response = await api.get('/manage/admin-roles/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response && response.data) {
        setData(response.data); // 更新数据结构
        setTotalNum(response.totalNum); // 获取总记录数
      }else{
        message.info("暂无数据(No Data)")
      }
    } catch (error) {
      console.error('Failed to fetch roles', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateRole = async (values) => {
    await createRole(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateRole = async (values) => {
    await updateRole(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleStatusChange = async (id, event) => {
    await api.post('/manage/admin-roles/change-status', { id, status: event });
    await fetchData(); // 状态更新后重新获取数据
  };

  const handleDeleteClick = async (id) => {
    await api.post('/manage/admin-roles/remove', { id });
    await fetchData(); // 删除后重新获取数据
  };

  const handleEditClick = (role) => {
    updateForm.setFieldsValue({
      id: role.id,
      roleName: role.roleName,
      roleNameEn: role.roleNameEn,
      status: role.status,
      description: role.description,
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
                value={searchParams.roleName}
                onChange={handleSearchChange}
                name="roleName"
                placeholder="角色名称"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.roleNameEn}
                onChange={handleSearchChange}
                name="roleNameEn"
                placeholder="角色英文名"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                name="status"
                onChange={(value) => handleSearchChange({ target: { name: 'status', value: value} })}
                allowClear
                placeholder="选择状态"
              >
                <Select.Option value="true">启用</Select.Option>
                <Select.Option value="false">禁用</Select.Option>
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
                新增角色
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/admin-roles/delete-batch',
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
          <RoleTable
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
      <RoleCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateRole}
        form={createForm}
      />
      <UpdateRoleModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateRole={handleUpdateRole}
        selectedRole={selectedRole} // 传递所选角色信息
      />
    </div>
  );
};

export default AdminRole;
