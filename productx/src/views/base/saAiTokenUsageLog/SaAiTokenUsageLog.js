import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space, DatePicker } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import Pagination from 'src/components/common/Pagination';
import SaAiTokenUsageLogTable from './SaAiTokenUsageLogTable';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SaAiTokenUsageLog = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    agentId: '',
    modelName: '',
    success: '',
    currency: '',
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
      const response = await api.get('/manage/sa-ai-token-usage-log/list', {
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

  const successOptions = [
    { value: true, label: t('success') },
    { value: false, label: t('failed') },
  ];

  const currencyOptions = [
    { value: 'CNY', label: 'CNY' },
    { value: 'USD', label: 'USD' },
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
                value={searchParams.agentId}
                onChange={handleSearchChange}
                name="agentId"
                placeholder={t('agentId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.modelName}
                onChange={handleSearchChange}
                name="modelName"
                placeholder={t('modelName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.success}
                onChange={(value) => handleSelectChange(value, 'success')}
                placeholder={t('selectStatus')}
                style={{ width: 150 }}
                allowClear
                options={successOptions}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.currency}
                onChange={(value) => handleSelectChange(value, 'currency')}
                placeholder={t('currency')}
                style={{ width: 150 }}
                allowClear
                options={currencyOptions}
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
          <SaAiTokenUsageLogTable
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

export default SaAiTokenUsageLog;
