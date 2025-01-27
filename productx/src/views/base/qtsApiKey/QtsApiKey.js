import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import QtsApiKeyTable from "./QtsApiKeyTable"
import UpdateQtsApiKeyModal from "./UpdateQtsApiKeyModel"
import QtsApiKeyCreateFormModal from "./QtsApiKeyCreateFormModel"

const QtsApiKey = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    exchangeName: '',
    apiKeyName: '',
    status: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedApiKey, setSelectedApiKey] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      )
      const response = await api.get('/manage/qts-api-key/list', {
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

  const handleEditClick = (apiKey) => {
    setSelectedApiKey(apiKey)
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
              <Input
                value={searchParams.apiKeyName}
                onChange={(e) => handleSearchChange(e.target.value, 'apiKeyName')}
                placeholder="API密钥标识"
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
                  新增API密钥
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/qts-api-key/delete-batch',
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
          <QtsApiKeyTable
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

      <QtsApiKeyCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={async (values) => {
          try {
            await api.post('/manage/qts-api-key/create', values)
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

      <UpdateQtsApiKeyModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateApiKey={async (values) => {
          try {
            await api.post('/manage/qts-api-key/update', values)
            message.success('更新成功')
            setIsUpdateModalVisible(false)
            updateForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error('更新失败')
          }
        }}
        selectedApiKey={selectedApiKey}
      />
    </div>
  )
}

export default QtsApiKey
