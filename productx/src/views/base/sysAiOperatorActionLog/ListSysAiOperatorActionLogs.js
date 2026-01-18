import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select, DatePicker } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SysAiOperatorActionLogTable from './SysAiOperatorActionLogTable';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ListSysAiOperatorActionLogs = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    operatorId: '',
    userId: '',
    actionType: undefined,
    actionResult: undefined,
    startTime: null,
    endTime: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const actionTypeOptions = [
    { value: 'GENERATE_IMAGE', label: t('generateImage') || '生成图片' },
    { value: 'POST_PUBLISH', label: t('postPublish') || '发布帖子' },
    { value: 'POST_LIKE', label: t('postLike') || '点赞帖子' },
    { value: 'POST_COMMENT', label: t('postComment') || '评论帖子' },
  ];

  const actionResultOptions = [
    { value: 'SUCCESS', label: t('success') || '成功' },
    { value: 'FAILED', label: t('failed') || '失败' },
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

      if (filteredParams.operatorId) {
        filteredParams.operatorId = Number(filteredParams.operatorId);
      }
      if (filteredParams.userId) {
        filteredParams.userId = Number(filteredParams.userId);
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

      const response = await api.get('/manage/sys-ai-operator-action-log/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || response);
        setTotalNum(response['totalNum'] || 0);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('fetchDataFailed') || '获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setSearchParams((prevParams) => ({
        ...prevParams,
        startTime: dates[0],
        endTime: dates[1],
      }));
    } else {
      setSearchParams((prevParams) => ({
        ...prevParams,
        startTime: null,
        endTime: null,
      }));
    }
    setCurrent(1);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection,
  } = UseSelectableRows();

  return (
    <div>
      <div className="card" style={{ marginTop: 0, marginBottom: 0 }}>
        <div className="card-body">
          <Row gutter={16}>
            <Col>
              <Input
                value={searchParams.operatorId}
                onChange={(e) => handleSearchChange('operatorId', e.target.value)}
                placeholder={t('operatorId') || '机器人ID'}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.userId}
                onChange={(e) => handleSearchChange('userId', e.target.value)}
                placeholder={t('userId') || '用户ID'}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.actionType}
                onChange={(value) => handleSearchChange('actionType', value)}
                placeholder={t('actionType') || '行为类型'}
                allowClear
                style={{ width: 150 }}
              >
                {actionTypeOptions.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.actionResult}
                onChange={(value) => handleSearchChange('actionResult', value)}
                placeholder={t('actionResult') || '行为结果'}
                allowClear
                style={{ width: 150 }}
              >
                {actionResultOptions.map((result) => (
                  <Option key={result.value} value={result.value}>
                    {result.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={handleDateRangeChange}
                value={searchParams.startTime && searchParams.endTime 
                  ? [dayjs(searchParams.startTime), dayjs(searchParams.endTime)]
                  : null}
                placeholder={[t('startTime') || '开始时间', t('endTime') || '结束时间']}
                style={{ width: 350 }}
                allowClear
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sys-ai-operator-action-log/delete',
                    selectedRows,
                    fetchData,
                    resetSelection,
                    method: 'delete',
                  })}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete') || '批量删除'}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <SysAiOperatorActionLogTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            t={t}
            actionTypeOptions={actionTypeOptions}
            actionResultOptions={actionResultOptions}
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
    </div>
  );
};

export default ListSysAiOperatorActionLogs;
