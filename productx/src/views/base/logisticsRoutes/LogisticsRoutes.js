import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Modal, Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd'
import { UseSelectableRows } from 'src/components/common/UseSelectableRows'
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete'
import Pagination from "src/components/common/Pagination"
import LogisticsRoutesTable from "./LogisticsRoutesTable"
import UpdateLogisticsRoutesModal from "./UpdateLogisticsRoutesModel"
import LogisticsRoutesCreateFormModal from "./LogisticsRoutesCreateFormModel"
import LogisticsRoutesDetailModal from './LogisticsRoutesDetailModal'

const { Option } = Select;

const LogisticsRoutes = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchParams, setSearchParams] = useState({
    originCountry: '',
    destinationCountry: '',
    transportType: '',
    status: undefined,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [createForm] = Form.useForm()
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
  const [updateForm] = Form.useForm()
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null)
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchData()
    fetchCountries()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      )
      const response = await api.get('/manage/logistics-routes/list', {
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

  const fetchCountries = async () => {
    try {
      const response = await api.get('/manage/countries/list-all-enable');
      if (response) {
        setCountries(response);
      }
    } catch (error) {
      console.error('获取国家列表失败:', error);
    }
  };

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
              <Select
                value={searchParams.originCountry}
                onChange={(value) => handleSearchChange(value, 'originCountry')}
                placeholder="起始国家"
                allowClear
                showSearch
                optionFilterProp="children"
                style={{ width: 200 }}
              >
                {countries.map(country => (
                  <Option key={country.id} value={country.code}>
                    <Space>
                      <img
                        src={country.flagImageUrl}
                        alt={country.name}
                        style={{
                          width: 20,
                          height: 15,
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '1px solid #f0f0f0'
                        }}
                      />
                      <span>{country.name}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.destinationCountry}
                onChange={(value) => handleSearchChange(value, 'destinationCountry')}
                placeholder="目的国家"
                allowClear
                showSearch
                optionFilterProp="children"
                style={{ width: 200 }}
              >
                {countries.map(country => (
                  <Option key={country.id} value={country.code}>
                    <Space>
                      <img
                        src={country.flagImageUrl}
                        alt={country.name}
                        style={{
                          width: 20,
                          height: 15,
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '1px solid #f0f0f0'
                        }}
                      />
                      <span>{country.name}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
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
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : '查询'}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  新增路线
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/logistics-routes/delete-batch',
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
          <LogisticsRoutesTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleViewDetails={handleViewDetails}
            countries={countries}
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

      <LogisticsRoutesCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={async (values) => {
          try {
            await api.post('/manage/logistics-routes/create', values)
            message.success('创建成功')
            setIsCreateModalVisible(false)
            createForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error('创建失败')
          }
        }}
        form={createForm}
        countries={countries}
      />

      <UpdateLogisticsRoutesModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateRoute={async (values) => {
          try {
            await api.post('/manage/logistics-routes/update', values)
            message.success('更新成功')
            setIsUpdateModalVisible(false)
            updateForm.resetFields()
            await fetchData()
          } catch (error) {
            message.error('更新失败')
          }
        }}
        selectedRoute={selectedRoute}
        countries={countries}
      />

      <LogisticsRoutesDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        record={selectedRouteDetails}
        countries={countries}
      />
    </div>
  )
}

export default LogisticsRoutes
