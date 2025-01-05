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
import { useTranslation } from 'react-i18next'; // 引入 useTranslation
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
  const { t } = useTranslation(); // 使用 t() 方法进行翻译
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    id: '',
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
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === 0 || value === '0') return true;
          return value !== '' && value !== null;
        }),
      )

      if (filteredParams.id) {
        filteredParams.id = Number(filteredParams.id);
      }

      const response = await api.get('/manage/user/list', {
        params: { currentPage:current, pageSize: pageSize, ...filteredParams },
      })

      if (response && response.data) {
        setData(response.data) // 更新为新的数据结构
        setTotalNum(response.totalNum) // 读取总数
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
    setSelectedUser(user)
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
                  value={searchParams.id}
                  onChange={handleSearchChange}
                  name="id"
                  placeholder={t('userId')}
                  allowClear
                />
              </Col>
              <Col>
                <Input
                  size="small"
                  value={searchParams.username}
                  onChange={handleSearchChange}
                  name="username"
                  placeholder={t('username')}
                  allowClear
                />
              </Col>
              <Col>
                <Input
                  size="small"
                  value={searchParams.nickname}
                  onChange={handleSearchChange}
                  name="nickname"
                  placeholder={t('nickname')}
                  allowClear
                />
              </Col>
              <Col>
                <Input
                  size="small"
                  value={searchParams.email}
                  onChange={handleSearchChange}
                  name="email"
                  placeholder={t('email')}
                  allowClear
                />
              </Col>
              <Col>
                <Input
                  size="small"
                  value={searchParams.address}
                  onChange={handleSearchChange}
                  name="address"
                  placeholder={t('address')}
                  allowClear
                  style={{
                    maxWidth: '150px',
                    minWidth: '100px'
                  }}
                />
              </Col>
              <Col>
                <Select
                  size="small"
                  className="search-box"
                  name="status"
                  onChange={(value) => handleSearchChange({target: {name: 'status', value}})}
                  allowClear
                  placeholder={t('status')}
                >
                  <Option value="true">{t('enabled')}</Option>
                  <Option value="false">{t('disabled')}</Option>
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
                  {isLoading ? <Spin/> : t('search')}
                </Button>
              </Col>
              <Col>
                <Button
                  size="small"
                  type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  {t('createUser')}
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
                  {t('batchDelete')}
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
        selectedUser={selectedUser}
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
