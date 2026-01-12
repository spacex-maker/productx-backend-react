import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row, Space, Select, Switch } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import AiImageScenariosTable from "./AiImageScenariosTable"
import UpdateAiImageScenariosModel from "./UpdateAiImageScenariosModel"
import AiImageScenariosCreateFormModel from "./AiImageScenariosCreateFormModel"
import { useTranslation } from 'react-i18next'

const { Option } = Select

const AiImageScenarios = () => {
  const { t } = useTranslation()

  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    sceneKey: '',
    sceneName: '',
    categoryId: undefined,
    isActive: undefined,
    isVip: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchData()
    fetchCategories()
  }, [currentPage, pageSize, searchParams])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/manage/ai-image-scenario-categories/enabled-tree')
      if (response && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories', error)
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      )
      const response = await api.get('/manage/ai-image-scenarios/list', {
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
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleCreateScenario = async (values) => {
    try {
      await api.post('/manage/ai-image-scenarios/create', values)
      message.success(t('创建成功'))
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('创建失败'))
    }
  }

  const handleUpdateScenario = async (values) => {
    try {
      await api.post('/manage/ai-image-scenarios/update', values)
      message.success(t('更新成功'))
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('更新失败'))
    }
  }

  const handleStatusChange = async (id, checked) => {
    try {
      await api.post('/manage/ai-image-scenarios/change-status', {
        id: id,
        status: checked ? 1 : 0
      })
      message.success(t('状态修改成功'))
      await fetchData()
    } catch (error) {
      message.error(error?.response?.data?.message || t('状态修改失败'))
    }
  }

  const handleEditClick = (scenario) => {
    setSelectedScenario(scenario)
    setIsUpdateModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete('/manage/ai-image-scenarios/delete', {
        data: { id }
      })
      message.success(t('删除成功'))
      await fetchData()
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
                value={searchParams.sceneKey}
                onChange={handleSearchChange}
                name="sceneKey"
                placeholder={t('场景标识')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.sceneName}
                onChange={handleSearchChange}
                name="sceneName"
                placeholder={t('场景名称')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.categoryId}
                onChange={(value) => handleSelectChange('categoryId', value)}
                placeholder={t('场景分类')}
                allowClear
                style={{ width: 150 }}
              >
                {categories.map(cat => (
                  <Option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </Option>
                ))}
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
                value={searchParams.isVip}
                onChange={(value) => handleSelectChange('isVip', value)}
                placeholder={t('VIP专属')}
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
                  {t('创建场景')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <AiImageScenariosTable
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

      <AiImageScenariosCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateScenario}
        form={createForm}
        categories={categories}
        t={t}
      />

      <UpdateAiImageScenariosModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateScenario={handleUpdateScenario}
        selectedScenario={selectedScenario}
        categories={categories}
        t={t}
      />
    </div>
  )
}

export default AiImageScenarios
