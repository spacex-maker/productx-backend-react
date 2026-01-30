import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from 'src/components/common/Pagination'
import PromptMarketListingTable from './PromptMarketListingTable'
import UpdatePromptMarketListingModel from './UpdatePromptMarketListingModel'
import PromptMarketListingCreateFormModel from './PromptMarketListingCreateFormModel'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const LISTING_TYPE_OPTIONS = [
  { value: 'IMAGE', label: 'IMAGE' },
  { value: 'VIDEO', label: 'VIDEO' },
  { value: 'AUDIO', label: 'AUDIO' },
  { value: 'TEXT', label: 'TEXT' },
]

const STATUS_OPTIONS = [
  { value: 1, label: '上架' },
  { value: 2, label: '下架' },
  { value: 3, label: '违规冻结' },
]

const AUDIT_STATUS_OPTIONS = [
  { value: 0, label: '待审' },
  { value: 1, label: '通过' },
  { value: 2, label: '驳回' },
]

const PromptMarketListing = () => {
  const { t } = useTranslation()

  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    userId: undefined,
    listingType: undefined,
    categoryId: undefined,
    title: '',
    modelType: '',
    status: undefined,
    auditStatus: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedItem, setSelectedItem] = useState(null)

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
      const response = await api.get('/manage/prompt-market-listing/list', {
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

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (values) => {
    const payload = { ...values, isPromptHidden: values.isPromptHidden ? 1 : 0 }
    try {
      await api.post('/manage/prompt-market-listing/create', payload)
      message.success(t('创建成功'))
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('创建失败'))
    }
  }

  const handleUpdate = async (values) => {
    const payload = { ...values, isPromptHidden: values.isPromptHidden ? 1 : 0 }
    try {
      await api.post('/manage/prompt-market-listing/update', payload)
      message.success(t('更新成功'))
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      setSelectedItem(null)
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('更新失败'))
    }
  }

  const handleEditClick = (item) => {
    setSelectedItem(item)
    setIsUpdateModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('/manage/prompt-market-listing/delete', {
        data: { id },
      })
      message.success(t('删除成功'))
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('删除失败'))
    }
  }

  const totalPages = Math.ceil(totalNum / pageSize) || 1

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection,
  } = UseSelectableRows()

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.title}
                onChange={handleSearchChange}
                name="title"
                placeholder={t('标题关键词')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.listingType}
                onChange={(value) => handleSelectChange('listingType', value)}
                placeholder={t('商品类型')}
                allowClear
                style={{ width: 120 }}
              >
                {LISTING_TYPE_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Input
                value={searchParams.categoryId}
                onChange={handleSearchChange}
                name="categoryId"
                placeholder={t('分类ID')}
                allowClear
                style={{ width: 100 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.modelType}
                onChange={handleSearchChange}
                name="modelType"
                placeholder={t('模型大类')}
                allowClear
                style={{ width: 120 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSelectChange('status', value)}
                placeholder={t('状态')}
                allowClear
                style={{ width: 120 }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.auditStatus}
                onChange={(value) => handleSelectChange('auditStatus', value)}
                placeholder={t('审核状态')}
                allowClear
                style={{ width: 120 }}
              >
                {AUDIT_STATUS_OPTIONS.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin size="small" /> : t('search')}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  {t('创建商品')}
                </Button>
                <Button
                  danger
                  disabled={!selectedRows?.length}
                  onClick={() =>
                    HandleBatchDelete({
                      url: '/manage/prompt-market-listing/delete-batch',
                      selectedRows,
                      fetchData,
                      resetSelection,
                    })
                  }
                >
                  {t('批量删除')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <PromptMarketListingTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
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

      <PromptMarketListingCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreate}
        form={createForm}
        t={t}
      />

      <UpdatePromptMarketListingModel
        isVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false)
          setSelectedItem(null)
        }}
        onFinish={handleUpdate}
        form={updateForm}
        selectedItem={selectedItem}
        t={t}
      />
    </div>
  )
}

export default PromptMarketListing
