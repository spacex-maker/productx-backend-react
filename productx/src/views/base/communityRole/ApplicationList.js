import React, { useState, useEffect } from 'react'
import { Button, Input, message, Spin, Col, Row, Select, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import api from 'src/axiosInstance'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import Pagination from 'src/components/common/Pagination'
import ApplicationListTable from './ApplicationListTable'
import ReviewModal from './ReviewModal'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const ApplicationList = ({ onPendingCountChange }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    userId: '',
    username: '',
    roleId: '',
    status: '',
  })
  const [roles, setRoles] = useState([])
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows()

  useEffect(() => {
    fetchData()
    fetchRoles()
    fetchPendingCount()
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

  const fetchPendingCount = async () => {
    try {
      const response = await api.get('/manage/community-role-application/pending-count')
      if (response !== undefined) {
        onPendingCountChange?.(response)
      }
    } catch (error) {
      console.error('获取待审核数量失败', error)
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const params = {
        currentPage,
        pageSize,
        ...searchParams,
      }

      // 移除空值参数
      Object.keys(params).forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })

      const response = await api.post('/manage/community-role-application/list', params)

      if (response) {
        setData(response.data || [])
        setTotalNum(response.totalNum || 0)
        setTotalPages(Math.ceil((response.totalNum || 0) / pageSize))
      }
    } catch (error) {
      message.error(t('获取数据失败'))
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrent(1)
    fetchData()
  }

  const handleReset = () => {
    setSearchParams({
      userId: '',
      username: '',
      roleId: '',
      status: '',
    })
    setCurrent(1)
  }

  const handleReviewClick = (application) => {
    setSelectedApplication(application)
    setReviewModalVisible(true)
  }

  const handleReviewSubmit = async (values) => {
    try {
      await api.post('/manage/community-role-application/review', {
        id: selectedApplication.id,
        ...values,
      })
      message.success(t('审核成功'))
      setReviewModalVisible(false)
      setSelectedApplication(null)
      fetchData()
      fetchPendingCount() // 刷新待审核数量
    } catch (error) {
      message.error(error?.response?.data?.message || t('审核失败'))
    }
  }

  const statusOptions = [
    { value: '', label: t('全部状态') },
    { value: 0, label: t('待审核') },
    { value: 1, label: t('审核通过') },
    { value: 2, label: t('审核拒绝') },
    { value: 3, label: t('已撤回') },
  ]

  return (
    <div className="application-list-container">
      {/* 搜索区域 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder={t('用户ID')}
            value={searchParams.userId}
            onChange={(e) => setSearchParams({ ...searchParams, userId: e.target.value })}
            onPressEnter={handleSearch}
          />
        </Col>
        <Col span={6}>
          <Input
            placeholder={t('用户名/昵称')}
            value={searchParams.username}
            onChange={(e) => setSearchParams({ ...searchParams, username: e.target.value })}
            onPressEnter={handleSearch}
          />
        </Col>
        <Col span={6}>
          <Select
            placeholder={t('选择角色')}
            value={searchParams.roleId || undefined}
            onChange={(value) => setSearchParams({ ...searchParams, roleId: value })}
            style={{ width: '100%' }}
            allowClear
          >
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.roleName} ({role.roleCode})
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            placeholder={t('申请状态')}
            value={searchParams.status}
            onChange={(value) => setSearchParams({ ...searchParams, status: value })}
            style={{ width: '100%' }}
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* 操作按钮 */}
      <Row style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              {t('搜索')}
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              {t('重置')}
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 表格 */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <ApplicationListTable
            data={data}
            selectedRows={selectedRows}
            selectAll={selectAll}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            onReviewClick={handleReviewClick}
          />

          <Pagination
            totalPages={totalPages}
            current={currentPage}
            onPageChange={setCurrent}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrent(1)
            }}
          />
        </>
      )}

      {/* 审核模态框 */}
      <ReviewModal
        visible={reviewModalVisible}
        application={selectedApplication}
        onCancel={() => {
          setReviewModalVisible(false)
          setSelectedApplication(null)
        }}
        onSubmit={handleReviewSubmit}
      />
    </div>
  )
}

export default ApplicationList

