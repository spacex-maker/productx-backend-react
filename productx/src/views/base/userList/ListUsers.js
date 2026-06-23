import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import {Modal, Button, Form, Input, DatePicker, message, Spin, Row, Col, Select, Space} from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import UserTable from "src/views/base/userList/UserTable";
import UpdateUserModal from "src/views/base/userList/UpdateUserModal";
import UserDetailModal from "src/views/base/userList/UserDetailModal";
import UserCreateFormModal from "src/views/base/userList/UserCreateFormModal";
import BatchSendEmailModal from "src/views/base/userList/BatchSendEmailModal";
import UserKycReviewModal from "src/views/base/userList/UserKycReviewModal";
import UserDisableModal from "src/views/base/userList/UserDisableModal";
import { useTranslation } from 'react-i18next'; // 引入 useTranslation
const { Option } = Select;

const updateUserStatus = async (id, newStatus, disableReason) => {
  await api.post('/manage/user/change-status', {
    id,
    status: newStatus,
    disableReason: newStatus ? undefined : disableReason,
  })
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
    status: undefined,
    kycStatus: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null) // 用于存储选中的用户
  const [isBatchSendEmailModalVisible, setIsBatchSendEmailModalVisible] = useState(false)
  const [isKycReviewModalVisible, setIsKycReviewModalVisible] = useState(false)
  const [kycReviewUser, setKycReviewUser] = useState(null)
  const [isDisableModalVisible, setIsDisableModalVisible] = useState(false)
  const [disableTargetUser, setDisableTargetUser] = useState(null)
  const [disableSubmitting, setDisableSubmitting] = useState(false)
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

      if (response) {
        // 拦截器返回 BasePageResult：{ data: [], totalNum }
        const list = response.data ?? []
        const total = response.totalNum ?? 0
        setData(Array.isArray(list) ? list : [])
        setTotalNum(Number(total) || 0)
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (user, event) => {
    const newStatus = event.target.checked
    if (!newStatus) {
      setDisableTargetUser(user)
      setIsDisableModalVisible(true)
      return
    }
    try {
      await updateUserStatus(user.id, true)
      message.success('用户已启用')
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || '启用失败')
    }
  }

  const handleDisableSubmit = async (disableReason) => {
    if (!disableTargetUser) return
    setDisableSubmitting(true)
    try {
      await updateUserStatus(disableTargetUser.id, false, disableReason)
      message.success('用户已禁用')
      setIsDisableModalVisible(false)
      setDisableTargetUser(null)
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || '禁用失败')
    } finally {
      setDisableSubmitting(false)
    }
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

  const handleKycReviewClick = (user) => {
    setKycReviewUser(user)
    setIsKycReviewModalVisible(true)
  }

  const handleKycReviewSuccess = () => {
    setIsKycReviewModalVisible(false)
    setKycReviewUser(null)
    fetchData()
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.id}
                onChange={handleSearchChange}
                name="id"
                placeholder={t('userId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.username}
                onChange={handleSearchChange}
                name="username"
                placeholder={t('username')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.nickname}
                onChange={handleSearchChange}
                name="nickname"
                placeholder={t('nickname')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.email}
                onChange={handleSearchChange}
                name="email"
                placeholder={t('email')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.address}
                onChange={handleSearchChange}
                name="address"
                placeholder={t('address')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange({ target: { name: 'status', value }})}
                placeholder={t('status')}
                allowClear
                style={{ width: 150 }}
              >
                <Option value="true">{t('enabled')}</Option>
                <Option value="false">{t('disabled')}</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.kycStatus}
                onChange={(value) => handleSearchChange({ target: { name: 'kycStatus', value }})}
                placeholder="实名状态"
                allowClear
                style={{ width: 150 }}
              >
                <Option value={0}>未认证</Option>
                <Option value={1}>审核中</Option>
                <Option value={2}>已通过</Option>
                <Option value={3}>审核失败</Option>
                <Option value={4}>需重新认证</Option>
                <Option value={5}>解绑审核中</Option>
                <Option value={6}>解绑未通过</Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('createUser')}
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    HandleBatchDelete({
                      url: '/manage/user/delete-batch',
                      selectedRows,
                      fetchData,
                    })
                  }
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsBatchSendEmailModalVisible(true)}
                >
                  {t('batchSendEmail')}
                </Button>
              </Space>
            </Col>
          </Row>
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
            handleKycReviewClick={handleKycReviewClick}
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
      <BatchSendEmailModal
        isVisible={isBatchSendEmailModalVisible}
        onCancel={() => setIsBatchSendEmailModalVisible(false)}
        onSuccess={fetchData}
        selectedUsers={data.filter((u) => selectedRows.includes(u.id))}
      />
      <UserKycReviewModal
        visible={isKycReviewModalVisible}
        user={kycReviewUser}
        onCancel={() => {
          setIsKycReviewModalVisible(false)
          setKycReviewUser(null)
        }}
        onSuccess={handleKycReviewSuccess}
      />
      <UserDisableModal
        open={isDisableModalVisible}
        user={disableTargetUser}
        loading={disableSubmitting}
        onCancel={() => {
          setIsDisableModalVisible(false)
          setDisableTargetUser(null)
        }}
        onSubmit={handleDisableSubmit}
      />
    </div>
  )
}

export default UserList
