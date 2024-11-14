import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import CryptoCurrencyTable from "src/views/base/sysCryptoCurrencies/CryptoCurrencyTable"
import UpdateCryptoCurrencyModal from "src/views/base/sysCryptoCurrencies/UpdateCryptoCurrencyModal"
import CryptoCurrencyCreateFormModal from "src/views/base/sysCryptoCurrencies/CryptoCurrencyCreateFormModal"

const updateCryptoCurrencyStatus = async (id, newStatus) => {
  await api.post('/manage/sys-crypto-currencies/change-status', { id, status: newStatus })
}

const createCryptoCurrency = async (currencyData) => {
  await api.post('/manage/sys-crypto-currencies/create', currencyData)
}

const updateCryptoCurrency = async (updateData) => {
  await api.put(`/manage/sys-crypto-currencies/update`, updateData)
}

const CryptoCurrencyList = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    name: '',
    symbol: '',
    chineseName: '',
    type: '',
    status: '',
    regulatedRegion: '',
    blockchainType: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedCurrency, setSelectedCurrency] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

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
      const response = await api.get('/manage/sys-crypto-currencies/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      })

      if (response) {
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
    await updateCryptoCurrencyStatus(id, newStatus)
    await fetchData() // Re-fetch data after status update
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleCreateCurrency = async (values) => {
    await createCryptoCurrency(values)
    setIsCreateModalVisible(false)
    createForm.resetFields()
    await fetchData()
  }

  const handleUpdateCurrency = async (values) => {
    await updateCryptoCurrency(values)
    setIsUpdateModalVisible(false)
    updateForm.resetFields()
    await fetchData()
  }

  const handleEditClick = (currency) => {
    updateForm.setFieldsValue({
      id: currency.id,
      name: currency.name,
      symbol: currency.symbol,
      chineseName: currency.chineseName,
      type: currency.type,
      status: currency.status,
      regulatedRegion: currency.regulatedRegion,
      blockchainType: currency.blockchainType,
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
                size="small"
                value={searchParams.name}
                onChange={handleSearchChange}
                name="name"
                placeholder="加密货币名称"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.symbol}
                onChange={handleSearchChange}
                name="symbol"
                placeholder="加密货币符号"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.chineseName}
                onChange={handleSearchChange}
                name="chineseName"
                placeholder="加密货币中文名称"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                className="search-box"
                name="status"
                onChange={(value) => handleSearchChange({ target: { name: 'status', value } })}
                allowClear
                placeholder="状态"
              >
                <Option value="1">启用</Option>
                <Option value="0">禁用</Option>
              </Select>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                className="search-button"
                disabled={isLoading}
              >
                {isLoading ? <Spin /> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary" onClick={() => setIsCreateModalVisible(true)}>
                新增加密货币
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/crypto-currency/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
              >
                批量删除
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <CryptoCurrencyTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
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
      <CryptoCurrencyCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateCurrency}
        form={createForm}
      />
      <UpdateCryptoCurrencyModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateCurrency={handleUpdateCurrency}
        selectedCurrency={selectedCurrency}
      />
    </div>
  )
}

export default CryptoCurrencyList
