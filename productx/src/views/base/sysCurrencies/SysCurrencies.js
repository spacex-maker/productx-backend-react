import React, {useState, useEffect} from 'react'
import api from 'src/axiosInstance'
import {Modal, Button, Form, Input, message, Spin, Select, Col, Row} from 'antd'
import {UseSelectableRows} from 'src/components/common/UseSelectableRows'
import {HandleBatchDelete} from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import CurrencyTable from "src/views/base/sysCurrencies/CurrencyTable"
import UpdateCurrencyModal from "src/views/base/sysCurrencies/UpdateCurrencyModal"
import CurrencyCreateFormModal from "src/views/base/sysCurrencies/CurrencyCreateFormModal"

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
                size="small"
                value={searchParams.currencyName}
                onChange={handleSearchChange}
                name="currencyName"
                placeholder="英文名称"
                allowClear // 添加这个属性
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.descriptionZh}
                onChange={handleSearchChange}
                name="descriptionZh"
                placeholder="搜索中文名称"
                allowClear // 添加这个属性
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.currencyCode}
                onChange={handleSearchChange}
                name="currencyCode"
                placeholder="搜索货币代码"
                allowClear // 添加这个属性
              />
            </Col>
            <Col>
              <Select
                size="small"
                className="search-box"
                name="status"
                onChange={(value) => handleSearchChange({target: {name: 'status', value}})}
                allowClear
                placeholder="是否启用"
              >
                <Select.Option value="true">启用</Select.Option>
                <Select.Option value="false">禁用</Select.Option>
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
                {isLoading ? <Spin/> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary" onClick={() => setIsCreateModalVisible(true)}>
                新增货币
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/currency/delete-batch',
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
          <CurrencyTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
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
