import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import MsxCloudProvidersTable from "./MsxCloudProvidersTable";
import UpdateMsxCloudProvidersModel from "./UpdateMsxCloudProvidersModel";
import MsxCloudProvidersCreateFormModel from "./MsxCloudProvidersCreateFormModel";
import { useTranslation } from 'react-i18next';
import MsxCloudProviderRegionsModal from './MsxCloudProviderRegionsModal';

const MsxCloudProviders = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    providerName: '',
    countryCode: undefined,
    serviceType: '',
    status: 'ACTIVE',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [isRegionsModalVisible, setIsRegionsModalVisible] = useState(false);
  const [selectedProviderForRegions, setSelectedProviderForRegions] = useState(null);

  const statusOptions = [
    { value: 'ACTIVE', label: t('active') },
    { value: 'INACTIVE', label: t('inactive') },
    { value: 'DISCONTINUED', label: t('discontinued') },
  ];

  const serviceTypeOptions = [
    { value: 'IaaS', label: 'IaaS' },
    { value: 'PaaS', label: 'PaaS' },
    { value: 'SaaS', label: 'SaaS' },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        message.error(t('fetchCountriesFailed'));
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, [t]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      const response = await api.get('/manage/msx-cloud-providers/page', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response?.data) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('fetchDataFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateProvider = async (values) => {
    try {
      await api.post('/manage/msx-cloud-providers/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateProvider = async (values) => {
    try {
      await api.post('/manage/msx-cloud-providers/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (provider) => {
    setSelectedProvider(provider);
    setIsUpdateModalVisible(true);
  };

  const handleRegionsClick = (provider) => {
    setSelectedProviderForRegions(provider);
    setIsRegionsModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  const countryOption = (country) => (
    <Select.Option key={country.id} value={country.code}>
      <Space>
        <img 
          src={country.flagImageUrl} 
          alt={country.name}
          style={{ 
            width: 20, 
            height: 15, 
            objectFit: 'cover',
            borderRadius: 2,
            border: '1px solid #f0f0f0'
          }}
        />
        <span>{country.name}</span>
        <span style={{ color: '#999' }}>({country.code})</span>
      </Space>
    </Select.Option>
  );

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.providerName}
                onChange={(e) => handleSearchChange('providerName', e.target.value)}
                placeholder={t('providerName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.countryCode}
                onChange={(value) => handleSearchChange('countryCode', value)}
                placeholder={t('selectCountry')}
                allowClear
                loading={loadingCountries}
                style={{ minWidth: 150 }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const country = countries.find((c) => c.code === option.value);
                  return (
                    country?.name.toLowerCase().includes(input.toLowerCase()) ||
                    country?.code.toLowerCase().includes(input.toLowerCase())
                  );
                }}
                dropdownMatchSelectWidth={false}
                popupMatchSelectWidth={false}
                listHeight={256}
                dropdownStyle={{ 
                  minWidth: 250,
                  maxWidth: 300
                }}
              >
                {countries.map((country) => countryOption(country))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.serviceType}
                onChange={(value) => handleSearchChange('serviceType', value)}
                placeholder={t('serviceType')}
                allowClear
                style={{ width: 150 }}
                options={serviceTypeOptions}
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
                  {t('addProvider')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/msx-cloud-providers/delete-batch',
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
          <MsxCloudProvidersTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleRegionsClick={handleRegionsClick}
            countries={countries}
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

      <MsxCloudProvidersCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateProvider}
        form={createForm}
        t={t}
        statusOptions={statusOptions}
        serviceTypeOptions={serviceTypeOptions}
      />

      <UpdateMsxCloudProvidersModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateProvider={handleUpdateProvider}
        selectedProvider={selectedProvider}
        t={t}
        statusOptions={statusOptions}
        serviceTypeOptions={serviceTypeOptions}
      />

      <MsxCloudProviderRegionsModal
        isVisible={isRegionsModalVisible}
        onCancel={() => setIsRegionsModalVisible(false)}
        providerId={selectedProviderForRegions?.id}
        providerName={selectedProviderForRegions?.providerName}
        t={t}
        countries={countries}
      />
    </div>
  );
};

export default MsxCloudProviders;
