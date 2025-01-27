import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import QtsStrategyTable from "./QtsStrategyTable"
import UpdateQtsStrategyModal from "./UpdateQtsStrategyModel"
import QtsStrategyCreateFormModal from "./QtsStrategyCreateFormModel"

const QtsStrategy = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    strategyName: '',
    strategyType: '',
    symbol: '',
    status: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedStrategy, setSelectedStrategy] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      )
      const response = await api.get('/manage/qts-strategy/list', {
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

  const handleEditClick = (strategy) => {
    setSelectedStrategy(strategy)
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
                value={searchParams.strategyName}
                onChange={(e) => handleSearchChange(e.target.value, 'strategyName')}
                placeholder="策略名称"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.strategyType}
                onChange={(e) => handleSearchChange(e.target.value, 'strategyType')}
                placeholder="策略类型"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.symbol}
                onChange={(e) => handleSearchChange(e.target.value, 'symbol')}
                placeholder="交易对"
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
                  新增策略
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/qts-strategy/delete-batch',
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
          <QtsStrategyTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
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

      <QtsStrategyCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={async (values) => {
          try {
            await api.post('/manage/qts-strategy/create', values)
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

      <UpdateQtsStrategyModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateStrategy={async (values) => {
          try {
            await api.post('/manage/qts-strategy/update', values)
            message.success('更新成功')
            setIsUpdateModalVisible(false)
            updateForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error('更新失败')
          }
        }}
        selectedStrategy={selectedStrategy}
      />
    </div>
  )
}

export default QtsStrategy
