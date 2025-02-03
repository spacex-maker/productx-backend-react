import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import QtsSupportedExchangesTable from "./QtsSupportedExchangesTable"
import UpdateQtsSupportedExchangesModal from "./UpdateQtsSupportedExchangesModel"
import QtsSupportedExchangesCreateFormModal from "./QtsSupportedExchangesCreateFormModel"

const { Option } = Select

const QtsSupportedExchanges = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    exchangeName: '',
    status: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedExchange, setSelectedExchange] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      )
      const response = await api.get('/manage/qts-supported-exchanges/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      })

      if (response) {
        setData(response.data)
        setTotalNum(response.totalNum)
      }
    } catch (error) {
      console.error('获取数据失败', error)
      message.error('获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (value, name) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleStatusChange = async (id, event) => {
    try {
      await api.post('/manage/qts-supported-exchanges/change-status', {
        id,
        status: event.target.checked
      })
      message.success('状态更新成功')
      await fetchData()
    } catch (error) {
      message.error('状态更新失败')
    }
  }

  const handleEditClick = (exchange) => {
    setSelectedExchange(exchange)
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
                value={searchParams.exchangeName}
                onChange={(e) => handleSearchChange(e.target.value, 'exchangeName')}
                placeholder="交易所名称"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange(value, 'status')}
                placeholder="状态"
                allowClear
                style={{ width: 150 }}
              >
                <Option value={true}>启用</Option>
                <Option value={false}>禁用</Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : '查询'}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  新增交易所
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/qts-supported-exchanges/delete-batch',
                    selectedRows,
                    fetchData,
                  })}
                  disabled={selectedRows.length === 0}
                >
                  批量删除
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <QtsSupportedExchangesTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleStatusChange={handleStatusChange}
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

      <QtsSupportedExchangesCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={async (values) => {
          try {
            await api.post('/manage/qts-supported-exchanges/create', values)
            message.success('创建成功')
            setIsCreateModalVisible(false)
            createForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error('创建失败')
          }
        }}
        form={createForm}
      />

      <UpdateQtsSupportedExchangesModal
        isVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false)
          updateForm.resetFields()
        }}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateExchange={async (values) => {
          try {
            await api.post('/manage/qts-supported-exchanges/update', values)
            message.success('更新成功')
            setIsUpdateModalVisible(false)
            updateForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error('更新失败')
          }
        }}
        selectedExchange={selectedExchange}
      />
    </div>
  )
}

export default QtsSupportedExchanges
