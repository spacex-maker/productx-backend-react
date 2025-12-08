import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select, DatePicker } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import UserFeedbackTable from "./UserFeedbackTable"
import UserFeedbackUpdateModal from "./UserFeedbackUpdateModal"
import UserFeedbackCreateFormModal from "./UserFeedbackCreateFormModal"
import UserFeedbackDetail from "./UserFeedbackDetail"
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

const { Option } = Select
const { RangePicker } = DatePicker

const UserFeedback = () => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    userId: '',
    feedbackType: '',
    priority: '',
    status: '',
    title: '',
    createTimeStart: null,
    createTimeEnd: null,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === null || value === undefined) return false
          if (Array.isArray(value) && value.length === 0) return false
          return value !== ''
        })
      )

      // 处理日期范围
      if (filteredParams.createTimeStart && filteredParams.createTimeEnd) {
        filteredParams.createTimeStart = dayjs(filteredParams.createTimeStart).format('YYYY-MM-DD HH:mm:ss')
        filteredParams.createTimeEnd = dayjs(filteredParams.createTimeEnd).format('YYYY-MM-DD HH:mm:ss')
      } else {
        delete filteredParams.createTimeStart
        delete filteredParams.createTimeEnd
      }

      const response = await api.post('/manage/user-feedback/list', {
        currentPage,
        pageSize,
        ...filteredParams,
      })

      // axiosInstance 拦截器已经提取了 data 字段，response 就是 BasePageResult: { data: [...], totalNum: ... }
      if (response) {
        setData(response.data || [])
        // @ts-ignore - axiosInstance 拦截器已处理响应，返回的是数据对象而非 AxiosResponse
        setTotalNum(response.totalNum || 0)
      }
    } catch (error) {
      console.error('获取数据失败', error)
      message.error(t('fetchDataFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (value, name) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        createTimeStart: dates[0],
        createTimeEnd: dates[1],
      }))
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        createTimeStart: null,
        createTimeEnd: null,
      }))
    }
  }

  const handleEditClick = (feedback) => {
    setSelectedFeedback(feedback)
    setIsUpdateModalVisible(true)
  }

  const handleViewDetail = async (feedback) => {
    try {
      // axiosInstance 拦截器已经提取了 data 字段，response 就是 UserFeedbackResponse 对象
      const response = await api.get('/manage/user-feedback/detail', {
        params: { id: feedback.id }
      })
      
      if (response) {
        setSelectedFeedback(response)
        setIsDetailModalVisible(true)
      } else {
        message.error(t('fetchDetailFailedEmpty'))
      }
    } catch (error) {
      console.error('获取详情失败:', error)
      message.error(t('fetchDetailFailed') + ': ' + (error.response?.data?.message || error.message))
    }
  }

  const handleReply = async (id, adminReply) => {
    try {
      await api.post('/manage/user-feedback/reply', null, {
        params: { id, adminReply }
      })
      message.success(t('replySuccess'))
      await fetchData()
    } catch (error) {
      message.error(t('replyFailed'))
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.post('/manage/user-feedback/update-status', null, {
        params: { id, status }
      })
      message.success(t('statusUpdateSuccess'))
      await fetchData()
    } catch (error) {
      message.error(t('statusUpdateFailed'))
    }
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows()

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.userId}
                onChange={(e) => handleSearchChange(e.target.value, 'userId')}
                placeholder={t('userId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.feedbackType}
                onChange={(value) => handleSearchChange(value, 'feedbackType')}
                placeholder={t('feedbackType')}
                allowClear
                style={{ width: 150 }}
              >
                <Option value="suggestion">{t('suggestion')}</Option>
                <Option value="bug">{t('bug')}</Option>
                <Option value="question">{t('question')}</Option>
                <Option value="other">{t('other')}</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.priority}
                onChange={(value) => handleSearchChange(value, 'priority')}
                placeholder={t('priority')}
                allowClear
                style={{ width: 150 }}
              >
                <Option value="LOW">{t('low')}</Option>
                <Option value="MEDIUM">{t('medium')}</Option>
                <Option value="HIGH">{t('high')}</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange(value, 'status')}
                placeholder={t('processingStatus')}
                allowClear
                style={{ width: 150 }}
              >
                <Option value="PENDING">{t('pending')}</Option>
                <Option value="PROCESSING">{t('processing')}</Option>
                <Option value="RESOLVED">{t('resolved')}</Option>
                <Option value="CLOSED">{t('closed')}</Option>
              </Select>
            </Col>
            <Col>
              <Input
                value={searchParams.title}
                onChange={(e) => handleSearchChange(e.target.value, 'title')}
                placeholder={t('feedbackTitle')}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={handleDateRangeChange}
                placeholder={[t('startTime'), t('endTime')]}
              />
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
                  {t('createFeedback')}
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => HandleBatchDelete({
                    url: '/manage/user-feedback/delete-batch',
                    selectedRows,
                    fetchData,
                    resetSelection: () => handleSelectAll(false, [])
                  })}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <UserFeedbackTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleViewDetail={handleViewDetail}
            handleReply={handleReply}
            handleStatusChange={handleStatusChange}
            t={t}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <UserFeedbackCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={async (values) => {
          try {
            await api.post('/manage/user-feedback/create', values)
            message.success(t('createSuccess'))
            setIsCreateModalVisible(false)
            createForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error(t('createFailed'))
          }
        }}
        form={createForm}
      />

      <UserFeedbackUpdateModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateFeedback={async (values) => {
          try {
            await api.put('/manage/user-feedback/update', values)
            message.success(t('updateSuccess'))
            setIsUpdateModalVisible(false)
            updateForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error(t('updateFailed'))
          }
        }}
        selectedFeedback={selectedFeedback}
      />

      <Modal
        title={t('feedbackDetail')}
        open={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false)
          setSelectedFeedback(null)
        }}
        afterClose={() => {
          setSelectedFeedback(null)
        }}
        footer={null}
        width={1200}
        destroyOnClose={true}
      >
        {isDetailModalVisible && selectedFeedback && (
          <UserFeedbackDetail 
            feedback={selectedFeedback} 
            onReply={handleReply}
            onStatusChange={handleStatusChange}
            t={t} 
          />
        )}
      </Modal>
    </div>
  )
}

export default UserFeedback

