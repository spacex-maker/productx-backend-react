import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import Pagination from 'src/components/common/Pagination'
import SaAiGenTaskTable from './SaAiGenTaskTable'
import SaAiGenTaskDetailModal from './SaAiGenTaskDetailModal'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const TASK_TYPE_OPTIONS = [
  { value: 't2i', label: 't2i' },
  { value: 'i2i', label: 'i2i' },
  { value: 't2v', label: 't2v' },
  { value: 'i2v', label: 'i2v' },
  { value: 'upscale', label: 'upscale' },
  { value: 'restore', label: 'restore' },
]
const STATUS_OPTIONS = [
  { value: 0, label: '排队' },
  { value: 1, label: '进行中' },
  { value: 2, label: '成功' },
  { value: 3, label: '失败' },
  { value: 4, label: '超时' },
]

const SaAiGenTask = () => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    userId: undefined,
    taskType: undefined,
    status: undefined,
    modelCode: '',
    modelName: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [detailId, setDetailId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined
        )
      )
      const response = await api.get('/manage/sa-ai-gen-task/list', {
        params: { currentPage, pageSize, ...filteredParams },
      })
      if (response) {
        setData(response.data || [])
        setTotalNum(response.totalNum || 0)
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
      message.error(error?.response?.data?.message || t('获取数据失败'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleViewDetail = (id) => {
    setDetailId(id)
    setDetailVisible(true)
  }

  const totalPages = Math.ceil(totalNum / pageSize) || 1

  return (
    <div>
      <div className="mb-3">
        <Row gutter={[16, 16]}>
          <Col>
            <Input
              value={searchParams.userId}
              onChange={handleSearchChange}
              name="userId"
              placeholder={t('用户ID')}
              allowClear
              style={{ width: 120 }}
            />
          </Col>
          <Col>
            <Select
              value={searchParams.taskType}
              onChange={(v) => handleSelectChange('taskType', v)}
              placeholder={t('任务类型')}
              allowClear
              style={{ width: 100 }}
            >
              {TASK_TYPE_OPTIONS.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={searchParams.status}
              onChange={(v) => handleSelectChange('status', v)}
              placeholder={t('状态')}
              allowClear
              style={{ width: 90 }}
            >
              {STATUS_OPTIONS.map((o) => (
                <Option key={o.value} value={o.value}>{o.label}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Input
              value={searchParams.modelCode}
              onChange={handleSearchChange}
              name="modelCode"
              placeholder={t('模型代码')}
              allowClear
              style={{ width: 140 }}
            />
          </Col>
          <Col>
            <Input
              value={searchParams.modelName}
              onChange={handleSearchChange}
              name="modelName"
              placeholder={t('模型名称')}
              allowClear
              style={{ width: 140 }}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={fetchData} disabled={isLoading}>
              {isLoading ? <Spin size="small" /> : t('search')}
            </Button>
          </Col>
        </Row>
      </div>
      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <SaAiGenTaskTable data={data} onViewDetail={handleViewDetail} t={t} />
        </Spin>
      </div>
      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <SaAiGenTaskDetailModal
        visible={detailVisible}
        taskId={detailId}
        onClose={() => { setDetailVisible(false); setDetailId(null) }}
        t={t}
      />
    </div>
  )
}

export default SaAiGenTask
