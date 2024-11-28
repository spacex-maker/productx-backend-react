import React, { useState, useEffect } from 'react'
import { Form, Input, Select, DatePicker, Space, Row, Col, Button, Spin, message } from 'antd'
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

const { RangePicker } = DatePicker
const { Option } = Select

const SysIssueTracker = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [updateForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [currentIssue, setCurrentIssue] = useState(null)
  const [issueTypes, setIssueTypes] = useState([])
  const [issueStatus, setIssueStatus] = useState([])
  const [issuePriorities, setIssuePriorities] = useState([])
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)

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
      // 过滤掉空值
      const params = {
        current,
        pageSize,
        ...Object.fromEntries(
          Object.entries(values || {}).filter(([_, value]) => 
            value !== undefined && 
            value !== null && 
            value !== ''
          )
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
      current: 1
    })
  }

  const handleReset = () => {
    form.resetFields()
    setCurrent(1)
    fetchIssues({ current: 1 })
  }

  // 处理页码变化
  const handlePageChange = (newPage) => {
    setCurrent(newPage)
    fetchIssues({
      ...form.getFieldsValue(),
      current: newPage
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

  return (
    <div className="issue-tracker-wrapper">
      <div className="search-wrapper">
        <div className="search-container">
          <Form form={form} layout="inline">
            <Row gutter={[8, 8]} align="middle">
              <Col flex="0 0 160px">
                <Form.Item name="title">
                  <Input
                    size="small"
                    placeholder="问题标题"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col flex="0 0 160px">
                <Form.Item name="type">
                  <Select
                    size="small"
                    placeholder="问题类型"
                    style={{ width: '100%' }}
                    allowClear
                  >
                    {issueTypes.map(type => (
                      <Select.Option key={type.value} value={type.value}>
                        {type.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col flex="0 0 160px">
                <Form.Item name="status">
                  <Select
                    size="small"
                    placeholder="状态"
                    style={{ width: '100%' }}
                    allowClear
                  >
                    {issueStatus.map(status => (
                      <Select.Option key={status.value} value={status.value}>
                        {status.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col flex="0 0 160px">
                <Form.Item name="priority">
                  <Select
                    size="small"
                    placeholder="优先级"
                    style={{ width: '100%' }}
                    allowClear
                  >
                    {issuePriorities.map(priority => (
                      <Select.Option key={priority.value} value={priority.value}>
                        {priority.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col flex="0 0 160px">
                <Form.Item name="assignee">
                  <Input
                    size="small"
                    placeholder="处理人"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col flex="0 0 160px">
                <Form.Item name="reporter">
                  <Input
                    size="small"
                    placeholder="报告人"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col flex="0 0 200px">
                <Form.Item name="dateRange">
                  <RangePicker
                    size="small"
                    style={{ width: '100%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </Form.Item>
              </Col>
              <Col flex="none">
                <Space size={8}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? <Spin size="small"/> : '搜索'}
                  </Button>
                  <Button
                    size="small"
                    onClick={handleReset}
                  >
                    重置
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setIsModalVisible(true)}
                  >
                    新建问题
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => HandleBatchDelete({
                      url: '/manage/sys-issue-tracker/batch-delete',
                      selectedRows,
                      fetchData: () => fetchIssues(form.getFieldsValue()),
                    })}
                    disabled={selectedRows.length === 0}
                  >
                    批量删除
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
          size="small"
          totalPages={Math.ceil(totalNum / pageSize)}
          current={current}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize)
            setCurrent(1)
            fetchIssues({
              ...form.getFieldsValue(),
              current: 1,
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
        onOk={() => updateForm.submit()}
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
