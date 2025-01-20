import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import SysConfigTable from "./SysConfigTable"
import UpdateSysConfigModal from "./UpdateSysConfigModel"
import SysConfigCreateFormModal from "./SysConfigCreateFormModel"

const SysConfig = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    configKey: '',
    description: '',
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
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      )
      const response = await api.get('/manage/sys-config/page', {
        params: { currentPage, size: pageSize, ...filteredParams },
      })

      if (response) {
        setData(response.data)
        setTotalNum(response.totalNum)
      }
    } catch (error) {
      console.error('Failed to fetch data', error)
      message.error('获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchChange = (event) => {
    const { name, value } = event.target
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  const handleCreateConfig = async (values) => {
    try {
      await api.post('/manage/sys-config/create', values)
      message.success('创建成功')
      setIsCreateModalVisible(false)
      createForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error('创建失败')
    }
  }

  const handleUpdateConfig = async (values) => {
    try {
      await api.post('/manage/sys-config/update', values)
      message.success('更新成功')
      setIsUpdateModalVisible(false)
      updateForm.resetFields()
      await fetchData()
    } catch (error) {
      message.error('更新失败')
    }
  }

  const handleEditClick = (config) => {
    setSelectedConfig(config)
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
                value={searchParams.configKey}
                onChange={handleSearchChange}
                name="configKey"
                placeholder="配置键"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.description}
                onChange={handleSearchChange}
                name="description"
                placeholder="描述"
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
                  {isLoading ? <Spin /> : '查询'}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  新增配置
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sys-config/delete-batch',
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
          <SysConfigTable
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

      <SysConfigCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateConfig}
        form={createForm}
      />

      <UpdateSysConfigModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateConfig={handleUpdateConfig}
        selectedConfig={selectedConfig}
      />
    </div>
  )
}

export default SysConfig
