import React, { useState, useEffect } from 'react'
import { Button, Input, message, Spin, Col, Row, Select, Modal, Form, DatePicker, Tag, Space } from 'antd'
import { UserAddOutlined, SearchOutlined } from '@ant-design/icons'
import api from 'src/axiosInstance'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import Pagination from 'src/components/common/Pagination'
import AddAdminModal from './AddAdminModal'
import AdminListTable from './AdminListTable'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const { Option } = Select

const AdminList = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    userId: '',
    roleId: '',
    includeExpired: false,
  })
  const [roles, setRoles] = useState([])
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [editForm] = Form.useForm()

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows()

  useEffect(() => {
    fetchData()
    fetchRoles()
  }, [currentPage, pageSize, searchParams])

  const fetchRoles = async () => {
    try {
      const response = await api.get('/manage/community-role/list', {
        params: { currentPage: 1, pageSize: 100 },
      })
      if (response && response.data) {
        setRoles(response.data)
      }
    } catch (error) {
      console.error('获取角色列表失败', error)
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== ''),
      )

      const response = await api.get('/manage/community-user-role/users-with-roles', {
        params: { currentPage, pageSize, ...filteredParams },
      })

      if (response) {
        setData(response.data || [])
        setTotalNum(response.totalNum || 0)
      }
    } catch (error) {
      console.error('获取管理员列表失败', error)
      message.error('获取管理员列表失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveAdmin = async (userId, roleId) => {
    try {
      await api.delete(`/manage/community-user-role/user/${userId}/role/${roleId}`)
      message.success('移除管理员成功')
      fetchData()
    } catch (error) {
      console.error('移除管理员失败', error)
      message.error(error?.response?.data?.message || '移除管理员失败')
    }
  }

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin)
    editForm.setFieldsValue({
      roleId: admin.roleId,
      expiredTime: admin.expiredTime ? dayjs(admin.expiredTime) : null,
    })
    setEditModalVisible(true)
  }

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields()
      await api.post('/manage/community-user-role/update', {
        id: selectedAdmin.id,
        roleId: values.roleId,
        expiredTime: values.expiredTime ? values.expiredTime.format('YYYY-MM-DD HH:mm:ss') : null,
      })
      message.success('更新成功')
      setEditModalVisible(false)
      editForm.resetFields()
      setSelectedAdmin(null)
      fetchData()
    } catch (error) {
      console.error('更新失败', error)
      message.error(error?.response?.data?.message || '更新失败')
    }
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
    setCurrent(1)
  }

  const handleSelectChange = (value, field) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }))
    setCurrent(1)
  }

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize)
    setCurrent(1)
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  return (
    <div>
      {/* 搜索栏 */}
      <div className="mb-3">
        <Row gutter={[16, 16]}>
          <Col>
            <Input
              value={searchParams.userId}
              onChange={handleSearchChange}
              name="userId"
              placeholder={t('用户ID')}
              allowClear
              style={{ width: 150 }}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col>
            <Select
              value={searchParams.roleId}
              onChange={(value) => handleSelectChange(value, 'roleId')}
              placeholder={t('选择角色')}
              allowClear
              style={{ width: 200 }}
            >
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  {role.roleName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={searchParams.includeExpired}
              onChange={(value) => handleSelectChange(value, 'includeExpired')}
              style={{ width: 150 }}
            >
              <Option value={false}>仅有效角色</Option>
              <Option value={true}>包含已过期</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={fetchData} disabled={isLoading}>
              {isLoading ? <Spin /> : t('search')}
            </Button>
          </Col>
        </Row>
      </div>

      {/* 操作按钮 */}
      <div className="mb-3">
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setAddModalVisible(true)}
        >
          新增管理员
        </Button>
      </div>

      {/* 表格 */}
      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <AdminListTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleRemoveAdmin={handleRemoveAdmin}
            handleEditClick={handleEditClick}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* 添加管理员模态框 */}
      <AddAdminModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSuccess={() => {
          setAddModalVisible(false)
          fetchData()
        }}
        roles={roles}
      />

      {/* 编辑管理员模态框 */}
      <Modal
        title="编辑管理员"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false)
          editForm.resetFields()
          setSelectedAdmin(null)
        }}
        onOk={handleEditSubmit}
        okText="确定"
        cancelText="取消"
      >
        {selectedAdmin && (
          <div style={{ 
            marginBottom: 16, 
            padding: 12, 
            background: 'var(--cui-info-bg-subtle)', 
            border: '1px solid var(--cui-info-border-subtle)',
            borderRadius: 4 
          }}>
            <p style={{ marginBottom: 8 }}>
              <strong>用户：</strong>
              {selectedAdmin.username}
              {selectedAdmin.nickname && ` (${selectedAdmin.nickname})`}
            </p>
            <p style={{ marginBottom: 0 }}>
              <strong>当前角色：</strong>
              {selectedAdmin.roleName} ({selectedAdmin.roleCode})
            </p>
          </div>
        )}
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {roles.map((role) => (
                <Option key={role.id} value={role.id}>
                  <Space>
                    {role.roleName}
                    <span style={{ color: '#999', fontSize: '12px' }}>({role.roleCode})</span>
                    {role.isOfficial && <Tag color="gold">官方</Tag>}
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="expiredTime"
            label="过期时间"
            help="留空表示永久有效"
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
              placeholder="选择过期时间"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminList

