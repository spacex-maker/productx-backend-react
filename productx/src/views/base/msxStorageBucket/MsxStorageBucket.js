import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import MsxStorageBucketTable from './MsxStorageBucketTable';
import UpdateMsxStorageBucketModel from './UpdateMsxStorageBucketModel';
import MsxStorageBucketCreateFormModel from './MsxStorageBucketCreateFormModel';
import { useTranslation } from 'react-i18next';

const MsxStorageBucket = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    bucketName: '',
    providerId: undefined,
    regionName: '',
    storageType: undefined,
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedBucket, setSelectedBucket] = useState(null);

  const storageTypeOptions = [
    { value: 'STANDARD', label: t('standardStorage') },
    { value: 'LOW_FREQ', label: t('lowFreqStorage') },
    { value: 'ARCHIVE', label: t('archiveStorage') },
  ];

  const statusOptions = [
    { value: true, label: t('enabled') },
    { value: false, label: t('disabled') },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== undefined && value !== '')
      );
      const response = await api.get('/manage/storage-bucket/page', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response?.data) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error(t('fetchDataFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleCreateBucket = async (values) => {
    try {
      await api.post('/manage/storage-bucket/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateBucket = async (values) => {
    try {
      await api.post('/manage/storage-bucket/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (bucket) => {
    setSelectedBucket(bucket);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.bucketName}
                onChange={(e) => handleSearchChange('bucketName', e.target.value)}
                placeholder={t('bucketName')}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.providerId}
                onChange={(e) => handleSearchChange('providerId', e.target.value)}
                placeholder={t('providerId')}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.regionName}
                onChange={(e) => handleSearchChange('regionName', e.target.value)}
                placeholder={t('regionName')}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.storageType}
                onChange={(value) => handleSearchChange('storageType', value)}
                placeholder={t('storageType')}
                allowClear
                style={{ width: 150 }}
                options={storageTypeOptions}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange('status', value)}
                placeholder={t('status')}
                allowClear
                style={{ width: 150 }}
                options={statusOptions}
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  {t('addBucket')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/storage-bucket/delete-batch',
                    selectedRows,
                    fetchData,
                    t,
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
          <MsxStorageBucketTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            t={t}
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

      <MsxStorageBucketCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateBucket}
        form={createForm}
        t={t}
        storageTypeOptions={storageTypeOptions}
        statusOptions={statusOptions}
      />

      <UpdateMsxStorageBucketModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateBucket={handleUpdateBucket}
        selectedBucket={selectedBucket}
        t={t}
        storageTypeOptions={storageTypeOptions}
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default MsxStorageBucket;
