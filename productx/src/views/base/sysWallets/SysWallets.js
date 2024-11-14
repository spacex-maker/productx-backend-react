import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import WalletTable from "src/views/base/sysWallets/WalletTable"
import UpdateWalletModal from "src/views/base/sysWallets/UpdateWalletsModel"
import WalletCreateFormModal from "src/views/base/sysWallets/WalletsCreateFormModel"

const updateWalletStatus = async (id, newStatus) => {
  await api.post('/manage/sys-wallets/change-status', { id, status: newStatus })
}

const createWallet = async (walletData) => {
  await api.post('/manage/sys-wallets/create', walletData)
}

const updateWallet = async (updateData) => {
  await api.put(`/manage/sys-wallets/update`, updateData)
}

const WalletList = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    address: '',
    type: '',
    label: '',
    countryCode: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedWallet, setSelectedWallet] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      )
      const response = await api.get('/manage/sys-wallets/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
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

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }
  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked
    await api.post('/manage/sys-wallets/change-status', { id, status: newStatus })
    await fetchData() // Re-fetch data after status update
  }
  const handleCreateWallet = async (values) => {
    await createWallet(values)
    setIsCreateModalVisible(false)
    createForm.resetFields()
    await fetchData()
  }

  const handleUpdateWallet = async (values) => {
    await updateWallet(values)
    setIsUpdateModalVisible(false)
    updateForm.resetFields()
    await fetchData()
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
                size="small"
                value={searchParams.address}
                onChange={handleSearchChange}
                name="address"
                placeholder="钱包地址"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                className="search-box"
                name="type"
                value={searchParams.type}
                onChange={(value) => handleSearchChange({ target: { name: 'type', value } })}
                allowClear
                placeholder="钱包类型"
              >
                <Select.Option value="1">类型 1</Select.Option>
                <Select.Option value="2">类型 2</Select.Option>
              </Select>
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.label}
                onChange={handleSearchChange}
                name="label"
                placeholder="钱包标签/别名"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.countryCode}
                onChange={handleSearchChange}
                name="countryCode"
                placeholder="国家码"
                allowClear
              />
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
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                新增钱包
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/sys-wallets/delete-batch',
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
          <WalletTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleUpdateWallet}
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
      <WalletCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateWallet}
        form={createForm}
      />
      <UpdateWalletModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateWallet={handleUpdateWallet}
        selectedWallet={selectedWallet} // Pass the selected wallet info
      />
    </div>
  )
}

export default WalletList
