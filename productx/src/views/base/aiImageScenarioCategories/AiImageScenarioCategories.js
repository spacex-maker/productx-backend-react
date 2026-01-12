import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row, Space, Select, TreeSelect } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import Pagination from "src/components/common/Pagination"
import AiImageScenarioCategoriesTable from "./AiImageScenarioCategoriesTable"
import UpdateAiImageScenarioCategoriesModel from "./UpdateAiImageScenarioCategoriesModel"
import AiImageScenarioCategoriesCreateFormModel from "./AiImageScenarioCategoriesCreateFormModel"
import { useTranslation } from 'react-i18next'

const { Option } = Select

const AiImageScenarioCategories = () => {
  const { t } = useTranslation()

  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    categoryKey: '',
    categoryName: '',
    parentId: '',
    level: '',
    isActive: '',
    isHot: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryTree, setCategoryTree] = useState([])

  useEffect(() => {
    fetchData()
    fetchCategoryTree()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      )
      const response = await api.get('/manage/ai-image-scenario-categories/list', {
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

  const fetchCategoryTree = async () => {
    try {
      const response = await api.get('/manage/ai-image-scenario-categories/root')
      if (response && response.data) {
        setCategoryTree(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch category tree', error)
    }
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleCreateCategory = async (values) => {
    try {
      await api.post('/manage/ai-image-scenario-categories/create', values)
      message.success(t('创建成功'))
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
      await fetchCategoryTree()
    } catch (error) {
      message.error(error?.response?.data?.message || t('创建失败'))
    }
  }

  const handleUpdateCategory = async (values) => {
    try {
      await api.post('/manage/ai-image-scenario-categories/update', values)
      message.success(t('更新成功'))
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      await fetchData()
      await fetchCategoryTree()
    } catch (error) {
      message.error(error?.response?.data?.message || t('更新失败'))
    }
  }

  const handleStatusChange = async (id, checked) => {
    try {
      await api.post('/manage/ai-image-scenario-categories/change-status', {
        id: id,
        status: checked ? 1 : 0
      })
      message.success(t('状态修改成功'))
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('状态修改失败'))
    }
  }

  const handleEditClick = (category) => {
    setSelectedCategory(category)
    setIsUpdateModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('/manage/ai-image-scenario-categories/delete', {
        data: { id }
      })
      message.success(t('删除成功'))
      await fetchData()
      await fetchCategoryTree()
    } catch (error) {
      message.error(error?.response?.data?.message || t('删除失败'))
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
                value={searchParams.categoryKey}
                onChange={handleSearchChange}
                name="categoryKey"
                placeholder={t('分类标识')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.categoryName}
                onChange={handleSearchChange}
                name="categoryName"
                placeholder={t('分类名称')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.level}
                onChange={(value) => handleSelectChange('level', value)}
                placeholder={t('层级')}
                allowClear
                style={{ width: 120 }}
              >
                <Option value={1}>{t('一级分类')}</Option>
                <Option value={2}>{t('二级分类')}</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.isActive}
                onChange={(value) => handleSelectChange('isActive', value)}
                placeholder={t('启用状态')}
                allowClear
                style={{ width: 120 }}
              >
                <Option value={true}>{t('启用')}</Option>
                <Option value={false}>{t('禁用')}</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.isHot}
                onChange={(value) => handleSelectChange('isHot', value)}
                placeholder={t('热门分类')}
                allowClear
                style={{ width: 120 }}
              >
                <Option value={true}>{t('是')}</Option>
                <Option value={false}>{t('否')}</Option>
              </Select>
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
                  {t('创建分类')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <AiImageScenarioCategoriesTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
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

      <AiImageScenarioCategoriesCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateCategory}
        form={createForm}
        categoryTree={categoryTree}
        t={t}
      />

      <UpdateAiImageScenarioCategoriesModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateCategory={handleUpdateCategory}
        selectedCategory={selectedCategory}
        categoryTree={categoryTree}
        t={t}
      />
    </div>
  )
}

export default AiImageScenarioCategories
