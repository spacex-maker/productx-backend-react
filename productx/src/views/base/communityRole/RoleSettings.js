import React, { useState, useEffect } from 'react'
import { Button, Input, message, Spin, Row, Col, Modal, Form, Switch, Checkbox, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import api from 'src/axiosInstance'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import Pagination from 'src/components/common/Pagination'
import RoleSettingsTable from './RoleSettingsTable'
import { useTranslation } from 'react-i18next'

const { TextArea } = Input
const { Option } = Select

const RoleSettings = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    roleName: '',
    roleCode: '',
  })

  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [updateModalVisible, setUpdateModalVisible] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [createForm] = Form.useForm()
  const [updateForm] = Form.useForm()
  
  const [permissions, setPermissions] = useState([])
  const [roleTypes, setRoleTypes] = useState([])

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows()

  // 只在组件挂载时获取权限列表和角色类型（这些数据不会变化）
  useEffect(() => {
    fetchPermissions()
    fetchRoleTypes()
  }, [])

  // 在分页或搜索参数变化时获取角色列表
  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== ''),
      )

      const response = await api.get('/manage/community-role/list', {
        params: { currentPage, pageSize, ...filteredParams },
      })

      if (response) {
        setData(response.data || [])
        setTotalNum(response.totalNum || 0)
      }
    } catch (error) {
      console.error('获取角色列表失败', error)
      message.error('获取角色列表失败')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/manage/community-role/permissions')
      if (response) {
        setPermissions(response)
      }
    } catch (error) {
      console.error('获取权限列表失败', error)
      message.error('获取权限列表失败')
    }
  }

  const fetchRoleTypes = async () => {
    try {
      const response = await api.get('/manage/community-role/role-types')
      if (response) {
        setRoleTypes(response)
      }
    } catch (error) {
      console.error('获取角色类型失败', error)
    }
  }

  const handleCreate = async (values) => {
    try {
      // 将权限数组转换为JSON字符串
      const submitData = {
        ...values,
        permissions: values.permissions ? JSON.stringify(values.permissions) : null,
      }
      await api.post('/manage/community-role/create', submitData)
      message.success('创建角色成功')
      setCreateModalVisible(false)
      createForm.resetFields()
      fetchData()
    } catch (error) {
      console.error('创建角色失败', error)
      message.error(error?.response?.data?.message || '创建角色失败')
    }
  }

  const handleUpdate = async (values) => {
    try {
      // 将权限数组转换为JSON字符串
      const submitData = {
        ...values,
        id: selectedRole.id,
        permissions: values.permissions ? JSON.stringify(values.permissions) : null,
      }
      await api.post('/manage/community-role/update', submitData)
      message.success('更新角色成功')
      setUpdateModalVisible(false)
      updateForm.resetFields()
      setSelectedRole(null)
      fetchData()
    } catch (error) {
      console.error('更新角色失败', error)
      message.error(error?.response?.data?.message || '更新角色失败')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('/manage/community-role/delete', {
        data: { id },
      })
      message.success('删除角色成功')
      fetchData()
    } catch (error) {
      console.error('删除角色失败', error)
      message.error(error?.response?.data?.message || '删除角色失败')
    }
  }

  const handleEditClick = (record) => {
    setSelectedRole(record)
    // 将JSON字符串转换为数组
    let permissionsArray = []
    if (record.permissions) {
      try {
        permissionsArray = JSON.parse(record.permissions)
      } catch (e) {
        console.error('解析权限失败', e)
      }
    }
    updateForm.setFieldsValue({
      roleName: record.roleName,
      roleCode: record.roleCode,
      permissions: permissionsArray,
      isOfficial: record.isOfficial,
      description: record.description,
    })
    setUpdateModalVisible(true)
  }

  // 按分类分组权限
  const groupPermissionsByCategory = () => {
    const grouped = {}
    permissions.forEach((perm) => {
      if (!grouped[perm.category]) {
        grouped[perm.category] = []
      }
      grouped[perm.category].push(perm)
    })
    return grouped
  }

  const permissionGroups = groupPermissionsByCategory()

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
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
              value={searchParams.roleName}
              onChange={handleSearchChange}
              name="roleName"
              placeholder={t('角色名称')}
              allowClear
              style={{ width: 200 }}
            />
          </Col>
          <Col>
            <Input
              value={searchParams.roleCode}
              onChange={handleSearchChange}
              name="roleCode"
              placeholder={t('角色标识')}
              allowClear
              style={{ width: 200 }}
            />
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
          新增角色
        </Button>
      </div>

      {/* 表格 */}
      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <RoleSettingsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
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

      {/* 创建角色模态框 */}
      <Modal
        title="新增角色"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          createForm.resetFields()
        }}
        onOk={() => createForm.submit()}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="例如：社区巡查员" />
          </Form.Item>

          <Form.Item
            name="roleCode"
            label="角色标识"
            rules={[{ required: true, message: '请输入角色标识' }]}
          >
            <Input placeholder="例如：community_inspector" />
          </Form.Item>

          <Form.Item name="permissions" label="权限配置">
            {permissions.length === 0 ? (
              <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>
                加载权限列表中...
              </div>
            ) : (
              <Checkbox.Group style={{ width: '100%' }}>
                <Row gutter={[16, 8]}>
                  {Object.entries(permissionGroups).map(([category, perms]) => (
                    <Col span={24} key={category}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{category}:</div>
                      {perms.map((perm) => (
                        <Checkbox key={perm.code} value={perm.code} style={{ marginLeft: 16 }}>
                          {perm.name}
                        </Checkbox>
                      ))}
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>

          <Form.Item name="isOfficial" label="是否官方人员" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="description" label="角色描述">
            <TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 更新角色模态框 */}
      <Modal
        title="编辑角色"
        open={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false)
          updateForm.resetFields()
          setSelectedRole(null)
        }}
        onOk={() => updateForm.submit()}
      >
        <Form form={updateForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="例如：社区巡查员" />
          </Form.Item>

          <Form.Item name="roleCode" label="角色标识">
            <Input placeholder="例如：community_inspector" />
          </Form.Item>

          <Form.Item name="permissions" label="权限配置">
            {permissions.length === 0 ? (
              <div style={{ color: '#999', padding: '20px', textAlign: 'center' }}>
                加载权限列表中...
              </div>
            ) : (
              <Checkbox.Group style={{ width: '100%' }}>
                <Row gutter={[16, 8]}>
                  {Object.entries(permissionGroups).map(([category, perms]) => (
                    <Col span={24} key={category}>
                      <div style={{ marginBottom: 8, fontWeight: 'bold' }}>{category}:</div>
                      {perms.map((perm) => (
                        <Checkbox key={perm.code} value={perm.code} style={{ marginLeft: 16 }}>
                          {perm.name}
                        </Checkbox>
                      ))}
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>

          <Form.Item name="isOfficial" label="是否官方人员" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="description" label="角色描述">
            <TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RoleSettings

