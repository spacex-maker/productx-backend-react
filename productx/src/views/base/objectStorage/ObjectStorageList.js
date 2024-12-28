import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Select, Col, Row, DatePicker } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import ObjectStorageTable from './ObjectStorageTable';
import ObjectStorageCreateModal from './ObjectStorageCreateModal';
import { useTranslation } from 'react-i18next';
import UpdateObjectStorageModal from './UpdateObjectStorageModal';
import ObjectStorageDetailModal from './ObjectStorageDetailModal';

const { RangePicker } = DatePicker;

const ObjectStorageList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    storageProvider: '',
    storageType: '',
    isActive: undefined,
    isDefault: undefined,
    status: '',
    bucketName: '',
    region: '',
    timeRange: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = { ...searchParams };
      if (params.timeRange?.length === 2) {
        params.startTime = params.timeRange[0].format('YYYY-MM-DD HH:mm:ss');
        params.endTime = params.timeRange[1].format('YYYY-MM-DD HH:mm:ss');
      }
      delete params.timeRange;

      const response = await api.get('/manage/object-storage-config/page', {
        params: { currentPage, pageSize, ...params },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateStorage = async (values) => {
    try {
      await api.post('/manage/object-storage-config/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateStorage = async (values) => {
    try {
      await api.post('/manage/object-storage-config/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (storage) => {
    setSelectedStorage(storage);
    setIsUpdateModalVisible(true);
  };

  const handleDetailClick = (storage) => {
    setSelectedStorage(storage);
    setIsDetailModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[10, 10]}>
            <Col>
              <Input
                size="small"
                value={searchParams.storageProvider}
                onChange={e => handleSearchChange('storageProvider', e.target.value)}
                placeholder={t('storageProvider')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.storageType}
                onChange={e => handleSearchChange('storageType', e.target.value)}
                placeholder={t('storageType')}
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                value={searchParams.isActive}
                onChange={value => handleSearchChange('isActive', value)}
                placeholder={t('isActive')}
                allowClear
              >
                <Select.Option value={true}>{t('yes')}</Select.Option>
                <Select.Option value={false}>{t('no')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                size="small"
                value={searchParams.isDefault}
                onChange={value => handleSearchChange('isDefault', value)}
                placeholder={t('isDefault')}
                allowClear
              >
                <Select.Option value={true}>{t('yes')}</Select.Option>
                <Select.Option value={false}>{t('no')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.bucketName}
                onChange={e => handleSearchChange('bucketName', e.target.value)}
                placeholder={t('bucketName')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.region}
                onChange={e => handleSearchChange('region', e.target.value)}
                placeholder={t('region')}
                allowClear
              />
            </Col>
            <Col>
              <RangePicker
                size="small"
                value={searchParams.timeRange}
                onChange={value => handleSearchChange('timeRange', value)}
                showTime
              />
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                disabled={isLoading}
              >
                {isLoading ? <Spin /> : t('search')}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                {t('createStorage')}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <ObjectStorageTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
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

      <ObjectStorageCreateModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateStorage}
        form={createForm}
      />

      <UpdateObjectStorageModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateStorage={handleUpdateStorage}
        selectedStorage={selectedStorage}
      />

      <ObjectStorageDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        selectedStorage={selectedStorage}
      />
    </div>
  );
};

export default ObjectStorageList;
