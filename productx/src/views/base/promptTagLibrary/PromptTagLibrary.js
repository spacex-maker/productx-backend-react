import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from 'src/components/common/Pagination'
import PromptTagLibraryTable from './PromptTagLibraryTable'
import UpdatePromptTagLibraryModel from './UpdatePromptTagLibraryModel'
import PromptTagLibraryCreateFormModel from './PromptTagLibraryCreateFormModel'
import { useTranslation } from 'react-i18next'

const { Option } = Select

const STATUS_OPTIONS = [
  { value: 0, label: '禁用' },
  { value: 1, label: '启用' },
]
const GROUP_TYPE_OPTIONS = [
  { value: 1, label: '核心题材 (Subject)' },
  { value: 2, label: '艺术风格 (Style)' },
  { value: 3, label: '构图与视角 (View)' },
  { value: 4, label: '光影与氛围 (Lighting)' },
  { value: 5, label: '质量与修饰 (Quality)' },
]

const PromptTagLibrary = () => {
  const { t } = useTranslation()
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    tagCode: '',
    groupType: undefined,
    status: undefined,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedItem, setSelectedItem] = useState(null)

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection,
  } = UseSelectableRows()

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
      const response = await api.get('/manage/prompt-tag-library/list', {
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
    try {
      await api.post('/manage/prompt-tag-library/create', values)
      message.success(t('创建成功'))
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('创建失败'))
    }
  }

  const handleUpdate = async (values) => {
    try {
      await api.post('/manage/prompt-tag-library/update', values)
      message.success(t('更新成功'))
      setIsUpdateModalVisible(false)
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
      await api.delete('/manage/prompt-tag-library/delete', { data: { id } })
      message.success(t('删除成功'))
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('删除失败'))
    }
  }

  const totalPages = Math.ceil(totalNum / pageSize) || 1

  return (
    <div>
      <div className="mb-3">
        <Row gutter={[16, 16]}>
          <Col>
            <Input
              value={searchParams.tagCode}
              onChange={handleSearchChange}
              name="tagCode"
              placeholder={t('标签编码/关键词')}
              allowClear
              style={{ width: 160 }}
            />
          </Col>
          <Col>
            <Select
              value={searchParams.groupType}
              onChange={(value) => handleSelectChange('groupType', value)}
              placeholder={t('分组类型')}
              allowClear
              style={{ width: 180 }}
            >
              {GROUP_TYPE_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              value={searchParams.status}
              onChange={(value) => handleSelectChange('status', value)}
              placeholder={t('状态')}
              allowClear
              style={{ width: 100 }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={fetchData} disabled={isLoading}>
                {isLoading ? <Spin size="small" /> : t('search')}
              </Button>
              <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                {t('新建标签')}
              </Button>
              <Button
                danger
                disabled={!selectedRows?.length}
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/prompt-tag-library/delete-batch',
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
      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <PromptTagLibraryTable
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
      <PromptTagLibraryCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreate}
        form={createForm}
        t={t}
      />
      <UpdatePromptTagLibraryModel
        isVisible={isUpdateModalVisible}
        onCancel={() => { setIsUpdateModalVisible(false); setSelectedItem(null) }}
        onFinish={handleUpdate}
        form={updateForm}
        selectedItem={selectedItem}
        t={t}
      />
    </div>
  )
}

export default PromptTagLibrary
