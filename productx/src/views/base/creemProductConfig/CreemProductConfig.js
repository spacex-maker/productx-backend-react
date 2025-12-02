import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import CreemProductConfigTable from "./CreemProductConfigTable"
import UpdateCreemProductConfigModel from "./UpdateCreemProductConfigModel"
import CreemProductConfigCreateFormModel from "./CreemProductConfigCreateFormModel"
import { useTranslation } from 'react-i18next'

const CreemProductConfig = () => {
  const { t } = useTranslation()

  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    creemProductId: '',
    productName: '',
    coinType: '',
    status: '',
    tag: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedConfig, setSelectedConfig] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      )
      const response = await api.get('/manage/creem-product-config/page', {
        params: { currentPage, pageSize, ...filteredParams },
      })

      if (response) {
        setData(response.data)
        setTotalNum(response.totalNum)
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
      message.error(t('fetchDataFailed'))
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

  const handleCreateConfig = async (values) => {
    try {
      await api.post('/manage/creem-product-config/create', values)
      message.success(t('createSuccess'))
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(t('createFailed'))
    }
  }

  const handleUpdateConfig = async (values) => {
    try {
      await api.post('/manage/creem-product-config/update', values)
      message.success(t('updateSuccess'))
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(t('updateFailed'))
    }
  }

  const handleEditClick = (config) => {
    setSelectedConfig(config)
    setIsUpdateModalVisible(true)
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.post('/manage/creem-product-config/change-status', { id, status })
      message.success(t('statusChangeSuccess'))
      await fetchData()
    } catch (error) {
      message.error(t('statusChangeFailed'))
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
                value={searchParams.productName}
                onChange={handleSearchChange}
                name="productName"
                placeholder={t('productName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.creemProductId}
                onChange={handleSearchChange}
                name="creemProductId"
                placeholder={t('creemProductId')}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.tag}
                onChange={handleSearchChange}
                name="tag"
                placeholder={t('tag')}
                allowClear
                style={{ width: 120 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status || undefined}
                onChange={(value) => handleSelectChange('status', value)}
                placeholder={t('status')}
                allowClear
                style={{ width: 120 }}
              >
                <Select.Option value="ACTIVE">{t('active')}</Select.Option>
                <Select.Option value="INACTIVE">{t('inactive')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin size="small" /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('addCreemProductConfig')}
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => HandleBatchDelete({
                    url: '/manage/creem-product-config/delete',
                    selectedRows,
                    fetchData,
                    t,
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
          <CreemProductConfigTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
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

      <CreemProductConfigCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateConfig}
        form={createForm}
        t={t}
      />

      <UpdateCreemProductConfigModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateConfig={handleUpdateConfig}
        selectedConfig={selectedConfig}
        t={t}
      />
    </div>
  )
}

export default CreemProductConfig
