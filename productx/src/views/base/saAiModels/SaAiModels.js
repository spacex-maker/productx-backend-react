import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaAiModelsTable from './SaAiModelsTable';
import { useTranslation } from 'react-i18next';

const SaAiModels = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    modelName: '',
    modelCode: '',
    status: '',
    companyId: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      const response = await api.get('/manage/sa-ai-models/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response?.data?.data) {
        setData(response.data.data.data);
        setTotalNum(response.data.data.totalNum);
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

  const handleStatusChange = async (ids, status) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    
    if (ids.length === 0) {
      message.warning(t('pleaseSelect'));
      return;
    }

    try {
      await api.post('/manage/sa-ai-models/change-status', {
        ids: ids,
        status: status,
      });
      message.success(t('updateSuccess'));
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEnableStatusChange = async (id, event) => {
    await handleStatusChange(id, event.target.checked);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

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
                value={searchParams.modelName}
                onChange={handleSearchChange}
                name="modelName"
                placeholder={t('modelName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.modelCode}
                onChange={handleSearchChange}
                name="modelCode"
                placeholder={t('modelCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.companyId}
                onChange={handleSearchChange}
                name="companyId"
                placeholder={t('companyId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSelectChange(value, 'status')}
                placeholder={t('selectStatus')}
                style={{ width: 150 }}
                allowClear
              >
                <Select.Option value={true}>{t('active')}</Select.Option>
                <Select.Option value={false}>{t('inactive')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, true)}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchEnable')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, false)}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDisable')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sa-ai-models/delete-batch',
                    selectedRows,
                    fetchData,
                  })}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <SaAiModelsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={() => {}}
            handleEnableStatusChange={handleEnableStatusChange}
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

export default SaAiModels;
