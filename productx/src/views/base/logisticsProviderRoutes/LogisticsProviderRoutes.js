import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select, InputNumber } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import LogisticsProviderRoutesTable from "./LogisticsProviderRoutesTable"
import UpdateLogisticsProviderRoutesModel from "./UpdateLogisticsProviderRoutesModel"
import LogisticsProviderRoutesCreateFormModel from "./LogisticsProviderRoutesCreateFormModel"
import LogisticsProviderRoutesDetailModel from './LogisticsProviderRoutesDetailModel'


const { Option } = Select;

const LogisticsProviderRoutes = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    providerId: undefined,
    routeId: undefined,
    transportType: undefined,
    serviceQuality: undefined,
    minEstimatedCost: undefined,
    maxEstimatedCost: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null)

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      )
      const response = await api.get('/manage/logistics-provider-routes/list', {
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

  const handleEditClick = (route) => {
    setSelectedRoute(route)
    setIsUpdateModalVisible(true)
  }

  const handleViewDetails = (route) => {
    setSelectedRouteDetails(route)
    setIsDetailModalVisible(true)
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
              <InputNumber
                placeholder="物流提供商ID"
                value={searchParams.providerId}
                onChange={(value) => handleSearchChange(value, 'providerId')}
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <InputNumber
                placeholder="物流路线ID"
                value={searchParams.routeId}
                onChange={(value) => handleSearchChange(value, 'routeId')}
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.transportType}
                onChange={(value) => handleSearchChange(value, 'transportType')}
                placeholder="运输方式"
                allowClear
                style={{ width: 150 }}
              >
                <Option value="air">空运</Option>
                <Option value="sea">海运</Option>
                <Option value="land">陆运</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.serviceQuality}
                onChange={(value) => handleSearchChange(value, 'serviceQuality')}
                placeholder="服务质量"
                allowClear
                style={{ width: 150 }}
              >
                <Option value="经济">经济</Option>
                <Option value="标准">标准</Option>
                <Option value="优先">优先</Option>
              </Select>
            </Col>
            <Col>
              <InputNumber
                placeholder="最小估算费用"
                value={searchParams.minEstimatedCost}
                onChange={(value) => handleSearchChange(value, 'minEstimatedCost')}
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <InputNumber
                placeholder="最大估算费用"
                value={searchParams.maxEstimatedCost}
                onChange={(value) => handleSearchChange(value, 'maxEstimatedCost')}
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : '查询'}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  新增路线
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/logistics-provider-routes/delete-batch',
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
          <LogisticsProviderRoutesTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleViewDetails={handleViewDetails}
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

      <LogisticsProviderRoutesCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        onFinish={async (values) => {
          try {
            await api.post('/manage/logistics-provider-routes/create', values);
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

      <UpdateLogisticsProviderRoutesModel
        isVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          updateForm.resetFields();
        }}
        handleUpdateRoute={async (values) => {
          try {
            await api.post('/manage/logistics-provider-routes/update', values);
            message.success('更新成功');
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
            fetchData();
          } catch (error) {
            message.error('更新失败');
          }
        }}
        form={updateForm}
        selectedRoute={selectedRoute}
      />

      <LogisticsProviderRoutesDetailModel
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        record={selectedRouteDetails}
      />
    </div>
  )
}

export default LogisticsProviderRoutes
