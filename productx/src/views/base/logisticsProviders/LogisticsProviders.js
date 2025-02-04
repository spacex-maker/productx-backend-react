import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select, InputNumber } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import LogisticsProvidersTable from "./LogisticsProvidersTable"
import UpdateLogisticsProvidersModal from "./UpdateLogisticsProvidersModel"
import LogisticsProvidersCreateFormModal from "./LogisticsProvidersCreateFormModel"
import LogisticsProvidersDetailModel from './LogisticsProvidersDetailModel'
import LogisticsProviderRoutesManageModel from './LogisticsProviderRoutesManageModel'

const LogisticsProviders = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    providerName: '',
    headquarters: '',
    isActive: undefined,
    minRating: undefined,
    maxRating: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedProviderDetails, setSelectedProviderDetails] = useState(null)
  const [isRoutesManageVisible, setIsRoutesManageVisible] = useState(false)
  const [selectedProviderForRoutes, setSelectedProviderForRoutes] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      )
      const response = await api.get('/manage/logistics-providers/list', {
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

  const handleEditClick = (provider) => {
    setSelectedProvider(provider)
    setIsUpdateModalVisible(true)
  }

  const handleViewDetails = (provider) => {
    setSelectedProviderDetails(provider)
    setIsDetailModalVisible(true)
  }

  const handleManageRoutes = (provider) => {
    setSelectedProviderForRoutes(provider)
    setIsRoutesManageVisible(true)
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
                placeholder="物流提供商名称"
                value={searchParams.providerName}
                onChange={(e) => handleSearchChange(e.target.value, 'providerName')}
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Input
                placeholder="总部所在地"
                value={searchParams.headquarters}
                onChange={(e) => handleSearchChange(e.target.value, 'headquarters')}
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.isActive}
                onChange={(value) => handleSearchChange(value, 'isActive')}
                placeholder="运营状态"
                allowClear
                style={{ width: 150 }}
              >
                <Option value={true}>运营中</Option>
                <Option value={false}>未运营</Option>
              </Select>
            </Col>
            <Col>
              <InputNumber
                placeholder="最小评分"
                value={searchParams.minRating}
                onChange={(value) => handleSearchChange(value, 'minRating')}
                min={0}
                max={5}
                step={0.1}
                style={{ width: 120 }}
              />
            </Col>
            <Col>
              <InputNumber
                placeholder="最大评分"
                value={searchParams.maxRating}
                onChange={(value) => handleSearchChange(value, 'maxRating')}
                min={0}
                max={5}
                step={0.1}
                style={{ width: 120 }}
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : '查询'}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  新增提供商
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/logistics-providers/delete-batch',
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
          <LogisticsProvidersTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleViewDetails={handleViewDetails}
            handleManageRoutes={handleManageRoutes}
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

      <LogisticsProvidersCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        onFinish={async (values) => {
          try {
            await api.post('/manage/logistics-providers/create', values);
            message.success('创建成功');
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchData();
          } catch (error) {
            message.error('创建失败');
          }
        }}
        form={createForm}
      />

      <UpdateLogisticsProvidersModal
        isVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          updateForm.resetFields();
        }}
        handleUpdateProvider={async (values) => {
          try {
            await api.post('/manage/logistics-providers/update', values);
            message.success('更新成功');
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
            fetchData();
          } catch (error) {
            message.error('更新失败');
          }
        }}
        form={updateForm}
        selectedProvider={selectedProvider}
      />
      
      <LogisticsProvidersDetailModel
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        record={selectedProviderDetails}
      />
      
      <LogisticsProviderRoutesManageModel
        isVisible={isRoutesManageVisible}
        onCancel={() => {
          setIsRoutesManageVisible(false);
          setSelectedProviderForRoutes(null);
        }}
        provider={selectedProviderForRoutes}
      />
    </div>
  )
}

export default LogisticsProviders
