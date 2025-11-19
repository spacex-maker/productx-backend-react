import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import MsxCloudCredentialsTable from './MsxCloudCredentialsTable';
import UpdateMsxCloudCredentialsModel from './UpdateMsxCloudCredentialsModel';
import MsxCloudCredentialsCreateFormModel from './MsxCloudCredentialsCreateFormModel';
import { useTranslation } from 'react-i18next';

const MsxCloudCredentials = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    name: '',
    type: undefined,
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  const typeOptions = [
    { value: 'COS', label: 'COS' },
    { value: 'OSS', label: 'OSS' },
    { value: 'S3', label: 'S3' },
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
        message.error(t('fetchProvidersFailed') || '获取服务商列表失败');
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProviders();
  }, [t]);

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
      const response = await api.get('/manage/cloud-credentials/page', {
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

  const handleCreateCredential = async (values) => {
    try {
      await api.post('/manage/cloud-credentials/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateCredential = async (values) => {
    try {
      await api.post('/manage/cloud-credentials/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (credential) => {
    setSelectedCredential(credential);
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
                value={searchParams.name}
                onChange={(e) => handleSearchChange('name', e.target.value)}
                placeholder={t('name')}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.type}
                onChange={(value) => handleSearchChange('type', value)}
                placeholder={t('type')}
                allowClear
                style={{ width: 150 }}
                options={typeOptions}
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
                  {t('addCredential')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/cloud-credentials/delete-batch',
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
          <MsxCloudCredentialsTable
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

      <MsxCloudCredentialsCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateCredential}
        form={createForm}
        t={t}
        typeOptions={typeOptions}
        statusOptions={statusOptions}
        providers={providers}
      />

      <UpdateMsxCloudCredentialsModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateCredential={handleUpdateCredential}
        selectedCredential={selectedCredential}
        t={t}
        typeOptions={typeOptions}
        statusOptions={statusOptions}
        providers={providers}
      />
    </div>
  );
};

export default MsxCloudCredentials;
