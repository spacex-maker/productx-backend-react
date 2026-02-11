import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Input, message, Spin, Col, Row, Select, Space, DatePicker } from 'antd';
import Pagination from 'src/components/common/Pagination';
import ApiAccessLogTable from './ApiAccessLogTable';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ApiAccessLog = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    traceId: '',
    requestId: '',
    appCode: '',
    apiPath: '',
    method: undefined,
    userId: '',
    clientIp: '',
    statusCode: undefined,
    startTime: null,
    endTime: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const methodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'PATCH', label: 'PATCH' },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === 0 || value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      if (filteredParams.userId) {
        filteredParams.userId = Number(filteredParams.userId);
      }
      if (filteredParams.statusCode !== undefined) {
        filteredParams.statusCode = Number(filteredParams.statusCode);
      }
      if (filteredParams.startTime) {
        filteredParams.startTime = dayjs(filteredParams.startTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        delete filteredParams.startTime;
      }
      if (filteredParams.endTime) {
        filteredParams.endTime = dayjs(filteredParams.endTime).format('YYYY-MM-DD HH:mm:ss');
      } else {
        delete filteredParams.endTime;
      }

      const response = await api.get('/manage/api-access-log/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        // 拦截器已返回 data，即 BasePageResult { data: [], totalNum }
        const list = response.data ?? [];
        const total = response.totalNum ?? 0;
        setData(Array.isArray(list) ? list : []);
        setTotalNum(Number(total) || 0);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('fetchDataFailed') || '获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrent(1);
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setSearchParams((prev) => ({
        ...prev,
        startTime: dates[0],
        endTime: dates[1],
      }));
    } else {
      setSearchParams((prev) => ({ ...prev, startTime: null, endTime: null }));
    }
    setCurrent(1);
  };

  const totalPages = Math.ceil(totalNum / pageSize) || 1;

  return (
    <div>
      <div className="card" style={{ marginTop: 0, marginBottom: 0 }}>
        <div className="card-body">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.traceId}
                onChange={(e) => handleSearchChange('traceId', e.target.value)}
                placeholder="链路追踪ID"
                allowClear
                style={{ width: 140 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.requestId}
                onChange={(e) => handleSearchChange('requestId', e.target.value)}
                placeholder="请求ID"
                allowClear
                style={{ width: 160 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.appCode}
                onChange={(e) => handleSearchChange('appCode', e.target.value)}
                placeholder="子系统标识"
                allowClear
                style={{ width: 120 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.apiPath}
                onChange={(e) => handleSearchChange('apiPath', e.target.value)}
                placeholder="接口路径"
                allowClear
                style={{ width: 180 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.method}
                onChange={(value) => handleSearchChange('method', value)}
                placeholder="请求方法"
                allowClear
                style={{ width: 100 }}
              >
                {methodOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Input
                value={searchParams.userId}
                onChange={(e) => handleSearchChange('userId', e.target.value)}
                placeholder="用户ID"
                allowClear
                style={{ width: 100 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.clientIp}
                onChange={(e) => handleSearchChange('clientIp', e.target.value)}
                placeholder="访问IP"
                allowClear
                style={{ width: 130 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.statusCode}
                onChange={(value) => handleSearchChange('statusCode', value)}
                placeholder="状态码"
                allowClear
                style={{ width: 100 }}
              >
                <Option value={200}>200</Option>
                <Option value={400}>400</Option>
                <Option value={401}>401</Option>
                <Option value={403}>403</Option>
                <Option value={404}>404</Option>
                <Option value={500}>500</Option>
              </Select>
            </Col>
            <Col>
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={handleDateRangeChange}
                value={
                  searchParams.startTime && searchParams.endTime
                    ? [dayjs(searchParams.startTime), dayjs(searchParams.endTime)]
                    : null
                }
                placeholder={['开始时间', '结束时间']}
                style={{ width: 360 }}
                allowClear
              />
            </Col>
            <Col>
              <Button type="primary" onClick={fetchData} disabled={isLoading}>
                {isLoading ? <Spin size="small" /> : null}
                <span style={{ marginLeft: isLoading ? 8 : 0 }}>{t('search') || '查询'}</span>
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <ApiAccessLogTable data={data} onRefresh={fetchData} />
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
  );
};

export default ApiAccessLog;
