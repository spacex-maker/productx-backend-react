import React, { useState, useEffect } from 'react'
import { Form, Input, Select, DatePicker, Space, Row, Col, Button, Spin, message, Modal, Checkbox, Switch, Avatar } from 'antd'
import { useNavigate } from 'react-router-dom'
import api from 'src/axiosInstance'
import IssueTable from './IssueTable'
import CreateIssueModal from './CreateIssueModal'
import UpdateIssueModal from './UpdateIssueModal'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from 'src/components/common/Pagination'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import IssueDetailModal from './IssueDetailModal'
import { ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker
const { Option } = Select
const { confirm } = Modal

const SysIssueTracker = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [updateForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [currentIssue, setCurrentIssue] = useState(null)
  const [issueTypes, setIssueTypes] = useState([])
  const [issueStatus, setIssueStatus] = useState([])
  const [issuePriorities, setIssuePriorities] = useState([])
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [managers, setManagers] = useState([])

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows()

  // 获取枚举数据
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const [typesRes, statusRes, prioritiesRes] = await Promise.all([
          api.get('/manage/sys-issue-tracker/issue-types'),
          api.get('/manage/sys-issue-tracker/issue-status'),
          api.get('/manage/sys-issue-tracker/issue-priorities'),
        ])
        setIssueTypes(typesRes)
        setIssueStatus(statusRes)
        setIssuePriorities(prioritiesRes)
      } catch (error) {
        console.error('Failed to fetch enums:', error)
      }
    }
    fetchEnums()
  }, [])

  // 在组件加载时进行初始搜索
  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async (values = {}) => {
    setLoading(true)
    try {
      // 过滤掉空值并去除字符串首尾空格
      const params = {
        currentPage,
        pageSize,
        ...Object.fromEntries(
          Object.entries(values || {}).filter(([_, value]) =>
            value !== undefined &&
            value !== null &&
            value !== ''
          ).map(([key, value]) => [
            key,
            typeof value === 'string' ? value.trim() : value
          ])
        )
      }

      // 处理日期范围
      if (values?.dateRange?.length === 2) {
        params.createTimeStart = values.dateRange[0].format('YYYY-MM-DD HH:mm:ss')
        params.createTimeEnd = values.dateRange[1].format('YYYY-MM-DD HH:mm:ss')
      }
      delete params.dateRange

      const response = await api.get('/manage/sys-issue-tracker/list', { params })
      setData(response.data)
      setTotalNum(response.totalNum)
    } catch (error) {
      console.error('Failed to fetch issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setCurrent(1)
    const values = await form.validateFields()
    fetchIssues({
      ...values,
      currentPage: 1
    })
  }

  const handleReset = () => {
    form.resetFields()
    setCurrent(1)
    fetchIssues({ currentPage: 1 })
  }

  // 处理页码变化
  const handlePageChange = (newPage) => {
    setCurrent(newPage)
    fetchIssues({
      ...form.getFieldsValue(),
      currentPage: newPage
    })
  }

  // 处理编辑点击
  const handleEditClick = (issue) => {
    setCurrentIssue(issue)
    setIsUpdateModalVisible(true)
    updateForm.setFieldsValue({
      ...issue,
      dateRange: issue.createTime ? [dayjs(issue.createTime), null] : null,
    })
  }

  // 处理详情点击
  const handleDetailClick = (issue) => {
    setCurrentIssue(issue)
    setIsDetailModalVisible(true)
  }

  // 批量删除处理函数
  const handleBatchDelete = () => {
    confirm({
      title: t('confirmDelete'),
      icon: <ExclamationCircleOutlined />,
      content: t('confirmDelete'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await api.post('/manage/sys-issue-tracker/batch-delete', {
            ids: selectedRows
          })
          message.success(t('deleteSuccess'))
          // 重置选中状态
          handleSelectRow([])
          // 刷新列表
          fetchIssues(form.getFieldsValue())
        } catch (error) {
          console.error('Failed to delete issues:', error)
          message.error(t('deleteFailed'))
        }
      }
    })
  }

  const handleUpdateSuccess = () => {
    setIsUpdateModalVisible(false)  // 关闭模态框
    fetchIssues()                 // 重新获取数据
  }

  const fetchManagers = async (search = '') => {
    try {
      const response = await api.get('/manage/manager/list', {
        params: { username: search }
      })
      if (response.data) {
        setManagers(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch managers:', error)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  return (
    <div className="issue-tracker-wrapper">
      <div className="mb-3">
        <div className="search-container">
          <Form form={form}>
            <Row gutter={[16, 16]}>
              <Col>
                <Form.Item name="title">
                  <Input
                    placeholder={t('issueTitle')}
                    allowClear
                    style={{ width: 150 }}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="type">
                  <Select
                    placeholder={t('issueType')}
                    style={{ width: 150 }}
                    allowClear
                  >
                    {issueTypes.map(type => (
                      <Option key={type.value} value={type.value}>{t(type.label)}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="priority">
                  <Select
                    placeholder={t('priority')}
                    style={{ width: 150 }}
                    allowClear
                  >
                    {issuePriorities.map(priority => (
                      <Option key={priority.value} value={priority.value}>{t(priority.label)}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="status">
                  <Select
                    placeholder={t('status')}
                    style={{ width: 150 }}
                    allowClear
                  >
                    <Option value="Open">{t('statusOptions.open')}</Option>
                    <Option value="In Progress">{t('inProgress')}</Option>
                    <Option value="Resolved">{t('resolved')}</Option>
                    <Option value="Closed">{t('closed')}</Option>
                    <Option value="Reopened">{t('reopened')}</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="dateRange">
                  <RangePicker
                    placeholder={[t('startDate'), t('endDate')]}
                    style={{ width: 280 }}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="assignee">
                  <Select
                    showSearch
                    allowClear
                    placeholder={t('enterAssignee')}
                    style={{ width: 200 }}
                    filterOption={false}
                    onSearch={fetchManagers}
                    onChange={() => {
                      setTimeout(() => {
                        handleSearch();
                      }, 0);
                    }}
                  >
                    {managers.map(manager => (
                      <Option key={manager.id} value={manager.username}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Avatar 
                            size={32} 
                            src={manager.avatar} 
                            icon={<UserOutlined />} 
                            style={{
                              boxShadow: '0 0 8px rgba(135, 208, 104, 0.8)',
                              border: '2px solid #87d068'
                            }}
                          />
                          <span>{manager.username}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="reporter">
                  <Select
                    showSearch
                    allowClear
                    placeholder={t('enterReporter')}
                    style={{ width: 200 }}
                    filterOption={false}
                    onSearch={fetchManagers}
                    onChange={() => {
                      setTimeout(() => {
                        handleSearch();
                      }, 0);
                    }}
                  >
                    {managers.map(manager => (
                      <Option key={manager.id} value={manager.username}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={manager.avatar} icon={<UserOutlined />} style={{ marginRight: 4 }} />
                          <span>{manager.username}</span>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col>
                <Form.Item name="assignedToMe" valuePropName="checked">
                  <Switch
                    checkedChildren={t('onlyShowAssignedToMe')}
                    unCheckedChildren={t('onlyShowAssignedToMe')}
                  />
                </Form.Item>
              </Col>
              <Col>
                <Space>
                  <Button type="primary" onClick={handleSearch}>
                    {t('search')}
                  </Button>
                  <Button onClick={handleReset}>
                    {t('reset')}
                  </Button>
                  <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    {t('create')}
                  </Button>
                  <Button
                    type="primary"
                    danger
                    disabled={selectedRows.length === 0}
                    onClick={handleBatchDelete}
                  >
                    {t('batchDelete')}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={loading}>
          <IssueTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
          />
        </Spin>

        <Pagination
          totalPages={Math.ceil(totalNum / pageSize)}
          current={currentPage}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrent(1)
            fetchIssues({
              ...form.getFieldsValue(),
              currentPage: 1,
              pageSize: newSize
            })
          }}
        />
      </div>

      <CreateIssueModal
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSuccess={() => {
          setIsModalVisible(false)
          fetchIssues(form.getFieldsValue())
        }}
        issueTypes={issueTypes}
        issuePriorities={issuePriorities}
      />

      <UpdateIssueModal
        visible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false)
          setCurrentIssue(null)
          updateForm.resetFields()
        }}
        onOk={handleUpdateSuccess}
        form={updateForm}
        issue={currentIssue}
        issueTypes={issueTypes}
        issuePriorities={issuePriorities}
      />

      <IssueDetailModal
        visible={isDetailModalVisible}
        issue={currentIssue}
        onCancel={() => {
          setIsDetailModalVisible(false)
          setCurrentIssue(null)
        }}
      />

      <style jsx global>{`
        .issue-tracker-wrapper {
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

        .table-responsive {
          background: var(--cui-card-bg);
          border: 1px solid var(--cui-border-color);
          border-radius: 4px;
          padding: 16px;
        }
      `}</style>
    </div>
  )
}

export default SysIssueTracker
