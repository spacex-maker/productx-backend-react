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
    <div className="user-list-wrapper">
      <div className="search-wrapper">
        <div className="search-container">
          <Row gutter={[10, 10]}>
            <Col>
              <Input
                size="small"
                value={searchParams.username}
                onChange={handleSearchChange}
                name="username"
                placeholder={t('username')}
                allowClear // 添加这个属性
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.nickname}
                onChange={handleSearchChange}
                name="nickname"
                placeholder={t('nickname')}
                allowClear // 添加这个属性
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.email}
                onChange={handleSearchChange}
                name="email"
                placeholder={t('email')}
                allowClear // 添加这个属性
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.address}
                onChange={handleSearchChange}
                name="address"
                placeholder={t('address')}
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
      <style jsx global>{`
        .user-list-wrapper {
          padding: 16px;
          background: var(--cui-body-bg);
        }

        .search-wrapper {
          padding: 12px;
          background: var(--cui-card-bg);
          border: 1px solid var(--cui-border-color);
          border-radius: 4px;
          margin-bottom: 16px;
        }

        /* 输入框主题样式 */
        .ant-input-outlined,
        :where(.css-dev-only-do-not-override-1x0dypw).ant-input-outlined,
        :where(.css-*).ant-input-outlined {
          background-color: var(--cui-input-bg) !important;
          border-width: 1px !important;
          border-style: solid !important;
          border-color: var(--cui-border-color) !important;
          color: var(--cui-body-color) !important;
          transition: all 0.3s !important;
          font-size: 10px !important;
          height: 24px !important;
        }

        /* 输入框悬浮状态 */
        .ant-input-outlined:hover,
        :where(.css-dev-only-do-not-override-1x0dypw).ant-input-outlined:hover,
        :where(.css-*).ant-input-outlined:hover {
          border-color: var(--cui-primary) !important;
          background-color: var(--cui-input-bg) !important;
        }

        /* 输入框聚焦状态 */
        .ant-input-outlined:focus,
        :where(.css-dev-only-do-not-override-1x0dypw).ant-input-outlined:focus,
        :where(.css-*).ant-input-outlined:focus,
        .ant-input-outlined.ant-input-focused,
        :where(.css-dev-only-do-not-override-1x0dypw).ant-input-outlined.ant-input-focused,
        :where(.css-*).ant-input-outlined.ant-input-focused {
          border-color: var(--cui-primary) !important;
          box-shadow: 0 0 0 2px rgba(var(--cui-primary-rgb), 0.2) !important;
          background-color: var(--cui-input-bg) !important;
        }

        /* Select 组件样式 */
        .ant-select-selector,
        :where(.css-dev-only-do-not-override-1x0dypw).ant-select .ant-select-selector,
        :where(.css-*).ant-select .ant-select-selector {
          background-color: var(--cui-input-bg) !important;
          border-color: var(--cui-border-color) !important;
          color: var(--cui-body-color) !important;
          height: 24px !important;
          font-size: 10px !important;
        }

        /* Select 悬浮状态 */
        .ant-select:hover .ant-select-selector,
        :where(.css-dev-only-do-not-override-1x0dypw).ant-select:hover .ant-select-selector,
        :where(.css-*).ant-select:hover .ant-select-selector {
          border-color: var(--cui-primary) !important;
        }

        /* Select 聚焦状态 */
        .ant-select-focused .ant-select-selector,
        :where(.css-dev-only-do-not-override-1x0dypw).ant-select-focused .ant-select-selector,
        :where(.css-*).ant-select-focused .ant-select-selector {
          border-color: var(--cui-primary) !important;
          box-shadow: 0 0 0 2px rgba(var(--cui-primary-rgb), 0.2) !important;
        }

        /* 暗色主题适配 */
        [data-theme="dark"] .ant-input-outlined,
        [data-theme="dark"] .ant-select-selector {
          background-color: var(--cui-dark-input-bg, #1f1f1f) !important;
          border-color: var(--cui-dark-border-color, #444) !important;
          color: var(--cui-dark-body-color, #fff) !important;
        }

        /* 占位符文本颜色 */
        .ant-input::placeholder,
        .ant-select-selection-placeholder {
          color: var(--cui-text-muted) !important;
          font-size: 10px !important;
        }

        /* 清除图标颜色 */
        .ant-input-clear-icon,
        .ant-select-clear {
          color: var(--cui-text-muted) !important;
          font-size: 10px !important;
        }

        /* 按钮样式 */
        .ant-btn {
          font-size: 10px !important;
          height: 24px !important;
          padding: 0 12px !important;
        }

        .ant-btn-primary {
          background: var(--cui-primary) !important;
          border-color: var(--cui-primary) !important;
        }

        .ant-btn-primary:hover {
          background: var(--cui-primary-hover) !important;
          border-color: var(--cui-primary-hover) !important;
        }

        /* 禁用状态 */
        .ant-input-outlined[disabled],
        .ant-select-disabled .ant-select-selector {
          background-color: var(--cui-input-disabled-bg) !important;
          border-color: var(--cui-input-disabled-border) !important;
          color: var(--cui-input-disabled-color) !important;
        }

        /* 下拉菜单样式 */
        .ant-select-dropdown {
          background-color: var(--cui-card-bg) !important;
          border: 1px solid var(--cui-border-color) !important;
          font-size: 10px !important;
        }

        .ant-select-item {
          color: var(--cui-body-color) !important;
          font-size: 10px !important;
        }

        .ant-select-item-option-selected {
          background-color: var(--cui-primary) !important;
          color: #fff !important;
        }

        .ant-select-item-option-active {
          background-color: rgba(var(--cui-primary-rgb), 0.1) !important;
        }
      `}</style>
    </div>
  )
}

export default UserList
