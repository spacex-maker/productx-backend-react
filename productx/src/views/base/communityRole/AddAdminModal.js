import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Select,
  DatePicker,
  message,
  Steps,
  Button,
  Space,
  Table,
  Input,
  Row,
  Col,
  Avatar,
  Tag,
} from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import api from 'src/axiosInstance'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

const { Option } = Select
const { Step } = Steps

const AddAdminModal = ({ visible, onCancel, onSuccess, roles }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // 用户列表相关状态
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [userSearchParams, setUserSearchParams] = useState({
    id: '',
    username: '',
    nickname: '',
    email: '',
  })

  useEffect(() => {
    if (visible && currentStep === 0) {
      fetchUsers()
    }
  }, [visible, currentStep, currentPage, pageSize, userSearchParams])

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(userSearchParams).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined,
        ),
      )

      if (filteredParams.id) {
        filteredParams.id = Number(filteredParams.id)
      }

      const response = await api.get('/manage/user/list', {
        params: { currentPage, pageSize, ...filteredParams },
      })

      if (response && response.data) {
        setUsers(response.data)
        setTotalUsers(response.totalNum)
      }
    } catch (error) {
      console.error('获取用户列表失败', error)
      message.error('获取用户列表失败')
    } finally {
      setUsersLoading(false)
    }
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setCurrentStep(1)
    form.setFieldsValue({
      userId: user.id,
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const submitData = {
        userId: selectedUser.id,
        roleId: values.roleId,
        expiredTime: values.expiredTime ? values.expiredTime.format('YYYY-MM-DD HH:mm:ss') : null,
      }

      await api.post('/manage/community-user-role/create', submitData)
      message.success('添加管理员成功')
      handleClose()
      onSuccess()
    } catch (error) {
      console.error('添加管理员失败', error)
      message.error(error?.response?.data?.message || '添加管理员失败')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.resetFields()
    setSelectedUser(null)
    setCurrentStep(0)
    setCurrentPage(1)
    setUserSearchParams({
      id: '',
      username: '',
      nickname: '',
      email: '',
    })
    onCancel()
  }

  const handleUserSearchChange = (event) => {
    const { name, value } = event.target
    setUserSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const userColumns = [
    {
      title: t('用户ID'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: t('用户信息'),
      key: 'userInfo',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />}>
            {record.username?.[0]?.toUpperCase()}
          </Avatar>
          <div>
            <div>{record.username}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>
              {record.nickname || record.email}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: t('状态'),
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>{status ? '正常' : '禁用'}</Tag>
      ),
    },
    {
      title: t('操作'),
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button type="primary" size="small" onClick={() => handleUserSelect(record)}>
          选择
        </Button>
      ),
    },
  ]

  return (
    <Modal
      title="添加管理员"
      open={visible}
      onCancel={handleClose}
      width={800}
      footer={null}
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="选择用户" />
        <Step title="分配角色" />
      </Steps>

      {currentStep === 0 && (
        <div>
          {/* 用户搜索 */}
          <div className="mb-3">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Input
                  value={userSearchParams.id}
                  onChange={handleUserSearchChange}
                  name="id"
                  placeholder={t('用户ID')}
                  allowClear
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col span={6}>
                <Input
                  value={userSearchParams.username}
                  onChange={handleUserSearchChange}
                  name="username"
                  placeholder={t('用户名')}
                  allowClear
                />
              </Col>
              <Col span={6}>
                <Input
                  value={userSearchParams.nickname}
                  onChange={handleUserSearchChange}
                  name="nickname"
                  placeholder={t('昵称')}
                  allowClear
                />
              </Col>
              <Col span={6}>
                <Input
                  value={userSearchParams.email}
                  onChange={handleUserSearchChange}
                  name="email"
                  placeholder={t('邮箱')}
                  allowClear
                />
              </Col>
            </Row>
          </div>

          {/* 用户列表 */}
          <Table
            columns={userColumns}
            dataSource={users}
            loading={usersLoading}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalUsers,
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 个用户`,
              onChange: (page, size) => {
                setCurrentPage(page)
                setPageSize(size)
              },
            }}
            size="small"
          />
        </div>
      )}

      {currentStep === 1 && selectedUser && (
        <div>
          {/* 显示选中的用户 */}
          <div style={{ 
            marginBottom: 24, 
            padding: 16, 
            background: 'var(--cui-info-bg-subtle)', 
            border: '1px solid var(--cui-info-border-subtle)',
            borderRadius: 8 
          }}>
            <Space>
              <Avatar src={selectedUser.avatar} size={48} icon={<UserOutlined />}>
                {selectedUser.username?.[0]?.toUpperCase()}
              </Avatar>
              <div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--cui-primary)' }}>{selectedUser.username}</div>
                <div style={{ fontSize: 12, color: 'var(--cui-secondary-color)' }}>
                  ID: {selectedUser.id} | {selectedUser.email}
                </div>
              </div>
            </Space>
          </div>

          {/* 角色分配表单 */}
          <Form form={form} layout="vertical">
            <Form.Item name="userId" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="roleId"
              label="选择角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择要分配的角色">
                {roles.map((role) => (
                  <Option key={role.id} value={role.id}>
                    <Space>
                      {role.roleName}
                      {role.isOfficial && <Tag color="gold">官方</Tag>}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="expiredTime" label="过期时间">
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="留空表示永久有效"
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < moment().startOf('day')}
              />
            </Form.Item>
          </Form>

          {/* 操作按钮 */}
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCurrentStep(0)}>上一步</Button>
              <Button type="primary" loading={loading} onClick={handleSubmit}>
                确定授权
              </Button>
            </Space>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default AddAdminModal

