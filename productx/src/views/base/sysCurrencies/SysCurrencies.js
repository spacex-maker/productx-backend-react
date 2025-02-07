import React, {useState, useEffect} from 'react'
import api from 'src/axiosInstance'
import {Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space} from 'antd'
import {UseSelectableRows} from 'src/components/common/UseSelectableRows'
import {HandleBatchDelete} from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import CurrencyTable from "src/views/base/sysCurrencies/CurrencyTable"
import UpdateCurrencyModal from "src/views/base/sysCurrencies/UpdateCurrencyModal"
import CurrencyCreateFormModal from "src/views/base/sysCurrencies/CurrencyCreateFormModal"
import { useTranslation } from 'react-i18next'

const { Option } = Select;

const updateCurrencyStatus = async (id, newStatus) => {
  await api.post('/manage/sys-currencies/change-status', {id, status: newStatus})
}

const createCurrency = async (currencyData) => {
  await api.post('/manage/sys-currencies/create', currencyData)
}

const updateCurrency = async (updateData) => {
  await api.put(`/manage/sys-currencies/update`, updateData)
}

const CurrencyList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    currencyCode: '',
    currencyName: '',
    descriptionZh: '',
    status: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const handleDetailClick = (currency) => {
    setSelectedCurrency(currency)
    setIsDetailModalVisible(true)
  }

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      )
      const response = await api.get('/manage/sys-currencies/list', {
        params: {currentPage, size: pageSize, ...filteredParams},
      })

      if (response && response.data) {
        setData(response.data) // Updated to match the new data structure
        setTotalNum(response.totalNum) // Read total number of items
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked
    await updateCurrencyStatus(id, newStatus)
    await fetchData() // Re-fetch data after status update
  }

  const handleSearchChange = (event) => {
    const {name, value} = event.target
    setSearchParams((prevParams) => ({...prevParams, [name]: value}))
    setCurrent(1) // 重置页码到第一页
  }

  const handleCreateCurrency = async (values) => {
    await createCurrency(values)
    setIsCreateModalVisible(false)
    createForm.resetFields()
    await fetchData()
  }

  const handleUpdateCurrency = async (values) => {
    await updateCurrency(values)
    setIsUpdateModalVisible(false)
    updateForm.resetFields()
    await fetchData()
  }

  const handleEditClick = (currency) => {
    updateForm.setFieldsValue({
      id: currency.id,
      currencyCode: currency.currencyCode,
      currencyName: currency.currencyName,
      symbol: currency.symbol,
      description: currency.description,
      status: currency.status,
    })
    setIsUpdateModalVisible(true)
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.currencyName}
                onChange={handleSearchChange}
                name="currencyName"
                placeholder={t('searchCurrencyNameEn')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.descriptionZh}
                onChange={handleSearchChange}
                name="descriptionZh"
                placeholder={t('searchCurrencyNameZh')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.currencyCode}
                onChange={handleSearchChange}
                name="currencyCode"
                placeholder={t('searchCurrencyCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                name="status"
                onChange={(value) => handleSearchChange({target: {name: 'status', value}})}
                allowClear
                placeholder={t('selectStatus')}
                style={{ width: 150 }}
              >
                <Select.Option value="true">{t('enabled')}</Select.Option>
                <Select.Option value="false">{t('disabled')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin/> : t('search')}
                </Button>
                <Button
                  type="primary" 
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('addCurrency')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/currency/delete-batch',
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
          <CurrencyTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
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
      <CurrencyCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateCurrency}
        form={createForm}
      />
      <UpdateCurrencyModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateCurrency={handleUpdateCurrency}
        selectedCurrency={selectedCurrency} // Pass the selected currency info
      />
    </div>
  )
}

export default CurrencyList
