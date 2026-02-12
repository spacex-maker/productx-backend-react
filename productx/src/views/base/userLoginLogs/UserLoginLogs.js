import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Input, message, Spin, Col, Row, Select, Space, DatePicker, Tabs } from 'antd';
import Pagination from 'src/components/common/Pagination';
import UserLoginLogsTable from './UserLoginLogsTable';
import UserLoginLogDashboard from './UserLoginLogDashboard';
import { useTranslation } from 'react-i18next';
import { UnorderedListOutlined, BarChartOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const UserLoginLogs = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    username: '',
    loginIp: '',
    status: '',
    startTime: null,
    endTime: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      );
      const response = await api.get('/manage/user-login-log/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        const list = response.data ?? [];
        const total = response.totalNum ?? 0;
        setData(Array.isArray(list) ? list : []);
        setTotalNum(Number(total) || 0);
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
                value={searchParams.userId}
                onChange={handleSearchChange}
                name="userId"
                placeholder={t('userId')}
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
                value={searchParams.status}
                onChange={(value) => handleSelectChange(value, 'status')}
                placeholder={t('loginStatus')}
                style={{ width: 150 }}
                allowClear
              >
                <Select.Option value={true}>{t('success')}</Select.Option>
                <Select.Option value={false}>{t('failed')}</Select.Option>
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

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'list',
            label: (
              <span>
                <UnorderedListOutlined />
                {t('loginLogStats.tabList') || '列表'}
              </span>
            ),
            children: (
              <>
                <div className="table-responsive">
                  <Spin spinning={isLoading}>
                    <UserLoginLogsTable data={data} />
                  </Spin>
                </div>
                <Pagination
                  totalPages={totalPages}
                  current={currentPage}
                  onPageChange={setCurrent}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                />
              </>
            ),
          },
          {
            key: 'dashboard',
            label: (
              <span>
                <BarChartOutlined />
                {t('loginLogStats.tabDashboard') || '看板'}
              </span>
            ),
            children: (
              <UserLoginLogDashboard
                timeRange={{
                  startTime: searchParams.startTime || undefined,
                  endTime: searchParams.endTime || undefined,
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default UserLoginLogs;
