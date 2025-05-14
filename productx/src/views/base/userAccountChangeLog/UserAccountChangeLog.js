import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space, DatePicker } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import Pagination from 'src/components/common/Pagination';
import UserAccountChangeLogTable from './UserAccountChangeLogTable';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const UserAccountChangeLog = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    username: '',
    coinType: '',
    changeType: '',
    orderId: '',
    startTime: '',
    endTime: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== ''),
      );
      const response = await api.get('/manage/user-account-change-log/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum || 0);
      }
    } catch (error) {
      console.error('获取数据失败', error);
      message.error('获取数据失败');
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
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleTimeChange = (dates) => {
    if (dates) {
      setSearchParams((prev) => ({
        ...prev,
        startTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      }));
    } else {
      setSearchParams((prev) => ({
        ...prev,
        startTime: '',
        endTime: '',
      }));
    }
    setCurrent(1);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows();

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrent(1);
  };

  const coinTypeOptions = [
    { value: 'USDT_ERC20', label: 'USDT_ERC20' },
    { value: 'CNY', label: 'CNY' },
  ];

  const changeTypeOptions = [
    { value: 'AI_MODEL_FEE', label: t('aiModelFee') },
    { value: 'FROZEN', label: t('frozen') },
    { value: 'UNFROZEN', label: t('unfrozen') },
    { value: 'DEPOSIT', label: t('deposit') },
    { value: 'WITHDRAW', label: t('withdraw') },
  ];

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
              <Select
                value={searchParams.coinType}
                onChange={(value) => handleSelectChange(value, 'coinType')}
                placeholder={t('coinType')}
                style={{ width: 150 }}
                allowClear
                options={coinTypeOptions}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.changeType}
                onChange={(value) => handleSelectChange(value, 'changeType')}
                placeholder={t('changeType')}
                style={{ width: 150 }}
                allowClear
                options={changeTypeOptions}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.orderId}
                onChange={handleSearchChange}
                name="orderId"
                placeholder={t('orderId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col span={6}>
              <RangePicker
                showTime
                onChange={handleTimeChange}
                style={{ width: '100%' }}
                placeholder={[t('startTime'), t('endTime')]}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={fetchData} disabled={isLoading}>
                {isLoading ? <Spin /> : t('search')}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <UserAccountChangeLogTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
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

export default UserAccountChangeLog;
