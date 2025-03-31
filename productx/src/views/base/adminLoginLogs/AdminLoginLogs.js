import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space, DatePicker } from 'antd';
import Pagination from 'src/components/common/Pagination';
import AdminLoginLogsTable from './AdminLoginLogsTable';
import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;

const AdminLoginLogs = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    adminId: '',
    username: '',
    loginIp: '',
    loginStatus: '',
    startTime: null,
    endTime: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      );
      const response = await api.get('/manage/admin-login-logs/page', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('获取数据失败', error);
      message.error(t('getFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleSelectChange = (value, field) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setSearchParams(prev => ({
        ...prev,
        startTime: dates[0]?.format('YYYY-MM-DD HH:mm:ss'),
        endTime: dates[1]?.format('YYYY-MM-DD HH:mm:ss')
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        startTime: null,
        endTime: null
      }));
    }
    setCurrent(1);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrent(1);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.adminId}
                onChange={handleSearchChange}
                name="adminId"
                placeholder={t('adminId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.username}
                onChange={handleSearchChange}
                name="username"
                placeholder={t('username')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.loginIp}
                onChange={handleSearchChange}
                name="loginIp"
                placeholder={t('loginIp')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.loginStatus}
                onChange={(value) => handleSelectChange(value, 'loginStatus')}
                placeholder={t('loginStatus')}
                style={{ width: 150 }}
                allowClear
              >
                <Select.Option value="success">{t('success')}</Select.Option>
                <Select.Option value="failed">{t('failed')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <RangePicker
                showTime
                onChange={handleDateRangeChange}
                style={{ width: 300 }}
              />
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : t('search')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <AdminLoginLogsTable
            data={data}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default AdminLoginLogs;
