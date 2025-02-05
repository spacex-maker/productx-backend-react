import React, { useState, useEffect } from 'react'
import api from 'src/axiosInstance'
import { Button, Input, message, Spin, Col, Row, Space, Select, DatePicker } from 'antd'
import Pagination from "src/components/common/Pagination"
import QtsSystemLogTable from "./QtsSystemLogTable"

const { RangePicker } = DatePicker;

const QtsSystemLog = () => {
  const [data, setData] = useState([])
  const [totalNum, setTotalNum] = useState(0)
  const [currentPage, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    logType: '',
    logLevel: '',
    message: '',
    startTime: undefined,
    endTime: undefined,
  })

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize, searchParams])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      )
      const response = await api.get('/manage/qts-system-log/list', {
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

  const handleTimeRangeChange = (dates) => {
    if (dates) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        startTime: dates[0]?.valueOf(),
        endTime: dates[1]?.valueOf(),
      }))
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        startTime: undefined,
        endTime: undefined,
      }))
    }
  }

  const totalPages = Math.ceil(totalNum / pageSize)

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.logType}
                onChange={(e) => handleSearchChange(e.target.value, 'logType')}
                placeholder="日志类型"
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.logLevel}
                onChange={(value) => handleSearchChange(value, 'logLevel')}
                placeholder="日志级别"
                allowClear
                style={{ width: 150 }}
              >
                <Select.Option value="INFO">INFO</Select.Option>
                <Select.Option value="WARN">WARN</Select.Option>
                <Select.Option value="ERROR">ERROR</Select.Option>
              </Select>
            </Col>
            <Col>
              <Input
                value={searchParams.message}
                onChange={(e) => handleSearchChange(e.target.value, 'message')}
                placeholder="日志内容"
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <RangePicker
                onChange={handleTimeRangeChange}
                showTime
                style={{ width: 380 }}
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
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <QtsSystemLogTable data={data} />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}

export default QtsSystemLog
