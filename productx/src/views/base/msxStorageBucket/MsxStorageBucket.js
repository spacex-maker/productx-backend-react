import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import MsxStorageBucketTable from './MsxStorageBucketTable';
import UpdateMsxStorageBucketModel from './UpdateMsxStorageBucketModel';
import MsxStorageBucketCreateFormModel from './MsxStorageBucketCreateFormModel';
import MsxStorageBucketDetailModal from './MsxStorageBucketDetailModal';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

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
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBucketId, setSelectedBucketId] = useState(null);

  const storageTypeOptions = [
    { value: 'STANDARD', label: t('standardStorage') },
    { value: 'LOW_FREQ', label: t('lowFreqStorage') },
    { value: 'ARCHIVE', label: t('archiveStorage') },
  ];

  const statusOptions = [
    { value: true, label: t('enabled') },
    { value: false, label: t('disabled') },
  ];

  // 获取服务商列表
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoadingProviders(true);
        const response = await api.get('/manage/msx-cloud-providers/list-enable');
        if (response) {
          setProviders(response);
        }
      } catch (error) {
        console.error('Failed to fetch providers:', error);
        message.error(t('fetchProvidersFailed'));
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProviders();
  }, [t]);

  // 渲染服务商选项
  const providerOption = (provider) => (
    <Option key={provider.id} value={provider.id}>
      <Space>
        {provider.iconImg && (
          <img 
            src={provider.iconImg} 
            alt={provider.providerName}
            style={{ 
              width: 20, 
              height: 20, 
              objectFit: 'contain',
              verticalAlign: 'middle'
            }}
          />
        )}
        <span>{provider.providerName}</span>
      </Space>
    </Option>
  );

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

  const handleDetailClick = (bucket) => {
    setSelectedBucketId(bucket.id);
    setIsDetailModalVisible(true);
  };

  const handleDeleteClick = async (bucketId) => {
    try {
      await api.delete(`/manage/storage-bucket/${bucketId}`);
      message.success(t('deleteSuccess'));
      await fetchData();
    } catch (error) {
      console.error('Failed to delete bucket:', error);
      message.error(t('deleteFailed'));
    }
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
              <Select
                placeholder={t('selectProvider')}
                value={searchParams.providerId}
                onChange={(value) => handleSearchChange('providerId', value)}
                allowClear
                loading={loadingProviders}
                style={{ minWidth: 200 }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const provider = providers.find((p) => p.id === option.value);
                  return provider?.providerName.toLowerCase().includes(input.toLowerCase());
                }}
                dropdownMatchSelectWidth={false}
                popupMatchSelectWidth={false}
                listHeight={256}
                dropdownStyle={{ 
                  minWidth: 250,
                  maxWidth: 300
                }}
              >
                {providers.map((provider) => providerOption(provider))}
              </Select>
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
                    resetSelection,
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
          <MsxStorageBucketTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
            handleDeleteClick={handleDeleteClick}
            providers={providers}
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
        providers={providers}
      />

      <UpdateMsxStorageBucketModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateBucket={handleUpdateBucket}
        selectedBucket={selectedBucket}
        t={t}
      />

      <MsxStorageBucketDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedBucketId(null);
        }}
        bucketId={selectedBucketId}
      />
    </div>
  );
};

export default MsxStorageBucket;
