import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import MsxUserStorageTable from './MsxUserStorageTable';
import UpdateMsxUserStorageModel from './UpdateMsxUserStorageModel';
import MsxUserStorageCreateFormModel from './MsxUserStorageCreateFormModel';
import { useTranslation } from 'react-i18next';

const MsxUserStorage = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    nodeName: '',
    status: undefined,
    nodeType: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedStorage, setSelectedStorage] = useState(null);

  const nodeTypeOptions = [
    { value: 'STANDARD', label: t('standardStorage') },
    { value: 'LOW_FREQ', label: t('lowFreqStorage') },
    { value: 'ARCHIVE', label: t('archiveStorage') },
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: t('activeStatus') },
    { value: 'INACTIVE', label: t('inactiveStatus') },
    { value: 'DISABLED', label: t('disabledStatus') },
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
      const response = await api.get('/manage/msx-user-storage/page', {
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

  const handleCreateStorage = async (values) => {
    try {
      await api.post('/manage/msx-user-storage/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateStorage = async (values) => {
    try {
      // 将存储限制从GB转换为字节
      const submitValues = {
        ...values,
        storageLimit: values.storageLimit ? Math.round(values.storageLimit * 1024 * 1024 * 1024) : 0,
      };
      await api.post('/manage/msx-user-storage/update', submitValues);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (storage) => {
    setSelectedStorage(storage);
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
                value={searchParams.userId}
                onChange={(e) => handleSearchChange('userId', e.target.value)}
                placeholder={t('userId')}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.nodeName}
                onChange={(e) => handleSearchChange('nodeName', e.target.value)}
                placeholder={t('nodeName')}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.nodeType}
                onChange={(value) => handleSearchChange('nodeType', value)}
                placeholder={t('nodeType')}
                allowClear
                style={{ width: 150 }}
                options={nodeTypeOptions}
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
                  {t('addStorage')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/msx-user-storage/delete-batch',
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
          <MsxUserStorageTable
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

      <MsxUserStorageCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateStorage}
        form={createForm}
        t={t}
        nodeTypeOptions={nodeTypeOptions}
        statusOptions={statusOptions}
      />

      <UpdateMsxUserStorageModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateStorage={handleUpdateStorage}
        selectedStorage={selectedStorage}
        t={t}
        nodeTypeOptions={nodeTypeOptions}
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default MsxUserStorage;
