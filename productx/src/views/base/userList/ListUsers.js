import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import {Modal, Button, Form, Input, DatePicker, message, Spin, Row, Col, Select} from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import UserTable from "src/views/base/userList/UserTable";
import UpdateUserModal from "src/views/base/userList/UpdateUserModal";
import UserDetailModal from "src/views/base/userList/UserDetailModal";
import UserCreateFormModal from "src/views/base/userList/UserCreateFormModal";

const updateUserStatus = async (id, newStatus) => {
  await api.post('/manage/user/change-status', { id, status: newStatus})
}

const createUser = async (userData) => {
  await api.post('/manage/user/create', userData)
}

const updateUser = async (updateData) => {
  await api.put(`/manage/user/update`, updateData)
}

const UserList = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    username: '',
    nickname: '',
    email: '',
    address: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null) // 用于存储选中的用户
  useEffect(() => {
    fetchData()
  }, [current, pageSize, searchParams])
  const handleDetailClick = (user) => {
    setSelectedUser(user)
    setIsDetailModalVisible(true)
  }
  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      )
      const response = await api.get('/manage/user/list', {
        params: { current, size: pageSize, ...filteredParams },
      })

      if (response && response.data) {
        setData(response.data) // 更新为新的数据结构
        setTotalNum(response.data.totalNum) // 读取总数
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked
    await updateUserStatus(id, newStatus)
    await fetchData() // 状态更新后重新获取数据
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleCreateUser = async (values) => {
    await createUser(values)
    setIsCreateModalVisible(false)
    createForm.resetFields()
    await fetchData()
  }

  const handleUpdateUser = async (values) => {
    await updateUser(values)
    setIsUpdateModalVisible(false)
    updateForm.resetFields()
    await fetchData()
  }

  const handleEditClick = (user) => {
    updateForm.setFieldsValue({
      id: user.id,
      nickname: user.nickname,
      email: user.email,
    })
    setIsUpdateModalVisible(true)
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <div className="search-container">
            <Row gutter={[10, 10]}>
              <Col>
                <Input
                  size="small"
                  value={searchParams.username}
                  onChange={handleSearchChange}
                  name="username"
                  placeholder="用户名"
                  allowClear // 添加这个属性
                />
              </Col>
              <Col>
                <Input
                  size="small"
                  value={searchParams.nickname}
                  onChange={handleSearchChange}
                  name="nickname"
                  placeholder="昵称"
                  allowClear // 添加这个属性
                />
              </Col>
              <Col>
                <Input
                  size="small"
                  value={searchParams.email}
                  onChange={handleSearchChange}
                  name="email"
                  placeholder="邮箱"
                  allowClear // 添加这个属性
                />
              </Col>
              <Col>
                <Input
                  size="small"
                  value={searchParams.address}
                  onChange={handleSearchChange}
                  name="address"
                  placeholder="地址"
                  allowClear // 添加这个属性
                />
              </Col>
              <Col>
                <Select
                  size="small"
                  className="search-box"
                  name="status"
                  onChange={(value) => handleSearchChange({target: {name: 'status', value}})}
                  allowClear // 添加这个属性以允许清空选择
                  placeholder="是否启用"
                >
                  <Option value="true">启用</Option>
                  <Option value="false">禁用</Option>
                </Select>
              </Col>
              <Col>
                <Button
                  size="small"
                  type="primary"
                  onClick={fetchData}
                  className="search-button"
                  disabled={isLoading}
                >
                  {isLoading ? <Spin/> : '查询'}
                </Button>
              </Col>
              <Col>
                <Button
                  size="small"
                  type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  创建用户
                </Button>
              </Col>
              <Col>
              <Button
                size="small"
                type="primary" onClick={() => setIsCreateModalVisible(true)}>
                修改用户
              </Button>
            </Col>
              <Col>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/user/delete-batch',
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
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <UserTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
          />
        </Spin>
      </div>
      <Pagination
        totalPages={totalPages}
        current={current}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <UserCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateUser}
        form={createForm}
      />
      <UpdateUserModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateUser={handleUpdateUser}
        selectedUser={selectedUser} // 传递当前选中的用户信息
      />
      <UserDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        selectedUser={selectedUser}
      />
    </div>
  )
}

export default UserList
