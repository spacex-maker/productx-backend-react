import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import UserProductHotSearchTable from "./UserProductHotSearchTable"
import UpdateUserProductHotSearchModel from "./UpdateUserProductHotSearchModel"
import UserProductHotSearchCreateFormModel from "./UserProductHotSearchCreateFormModel"
import { useTranslation } from 'react-i18next'

const UserProductHotSearch = () => {
  const { t } = useTranslation()

  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    countryCode: '',
    language: '',
    categoryId: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedRecord, setSelectedRecord] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      )
      const response = await api.get('/manage/user-product-hot-search/page', {
        params: { currentPage, pageSize: pageSize, ...filteredParams },
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
    setCurrent(1)
  }

  const handleSelectChange = (value, field) => {
    setSearchParams(prev => ({ ...prev, [field]: value }))
    setCurrent(1)
  }

  const handleCreate = async (values) => {
    try {
      await api.post('/manage/user-product-hot-search/create', values)
      message.success(t('createSuccess'))
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(t('createFailed'))
    }
  }

  const handleUpdate = async (values) => {
    try {
      await api.post('/manage/user-product-hot-search/update', values)
      message.success(t('updateSuccess'))
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error(t('updateFailed'))
    }
  }

  const handleEditClick = (record) => {
    setSelectedRecord(record)
    setIsUpdateModalVisible(true)
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
                value={searchParams.searchTerm}
                onChange={handleSearchChange}
                name="searchTerm"
                placeholder={t('searchTerm')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.countryCode}
                onChange={handleSearchChange}
                name="countryCode"
                placeholder={t('countryCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.language}
                onChange={handleSearchChange}
                name="language"
                placeholder={t('language')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.categoryId}
                onChange={handleSearchChange}
                name="categoryId"
                placeholder={t('categoryId')}
                allowClear
                style={{ width: 150 }}
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
                  {t('add')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/user-product-hot-search/delete-batch',
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
          <UserProductHotSearchTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
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

      <UserProductHotSearchCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreate}
        form={createForm}
        t={t}
      />

      <UpdateUserProductHotSearchModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdate={handleUpdate}
        selectedRecord={selectedRecord}
        t={t}
      />
    </div>
  )
}

export default UserProductHotSearch
