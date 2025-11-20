import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import MsxCloudProviderRegionsTable from './MsxCloudProviderRegionsTable';
import UpdateMsxCloudProviderRegionsModel from './UpdateMsxCloudProviderRegionsModel';
import MsxCloudProviderRegionsCreateFormModel from './MsxCloudProviderRegionsCreateFormModel';
import { useTranslation } from 'react-i18next';
import MsxCloudProviderRegionsDetailModal from './MsxCloudProviderRegionsDetailModal';

const { Option } = Select;

const MsxCloudProviderRegions = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    providerId: undefined,
    countryCode: undefined,
    regionCode: '',
    status: undefined,
  });

  const [countries, setCountries] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailRegion, setDetailRegion] = useState(null);

  const statusOptions = [
    { value: 'ACTIVE', label: t('active') },
    { value: 'INACTIVE', label: t('inactive') }
  ];

  // 获取国家列表
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

  // 渲染国家选项
  const countryOption = (country) => (
    <Option key={country.id} value={country.code}>
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
    </Option>
  );

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
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );
      const response = await api.get('/manage/cloud-provider-regions/page', {
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
    setCurrent(1);
  };

  const handleCreateRegion = async (values) => {
    try {
      await api.post('/manage/cloud-provider-regions/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateRegion = async (values) => {
    try {
      await api.post('/manage/cloud-provider-regions/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (region) => {
    setSelectedRegion(region);
    setIsUpdateModalVisible(true);
  };

  const handleViewClick = (region) => {
    setDetailRegion(region);
    setIsDetailModalVisible(true);
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
      <div className="card">
        <div className="card-body">
          <Row gutter={16}>
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
              <Select
                placeholder={t('selectCountry')}
                value={searchParams.countryCode}
                onChange={(value) => handleSearchChange('countryCode', value)}
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
              <Input
                value={searchParams.regionCode}
                onChange={(e) => handleSearchChange('regionCode', e.target.value)}
                placeholder={t('regionCode')}
                allowClear
                style={{ width: 150 }}
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
                  {t('addRegion')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/cloud-provider-regions/delete-batch',
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
          <MsxCloudProviderRegionsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleViewClick={handleViewClick}
            countries={countries}
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

      <MsxCloudProviderRegionsCreateFormModel
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateRegion}
        form={createForm}
        t={t}
        statusOptions={statusOptions}
        countries={countries}
        providers={providers}
      />

      <UpdateMsxCloudProviderRegionsModel
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateRegion={handleUpdateRegion}
        selectedRegion={selectedRegion}
        t={t}
        statusOptions={statusOptions}
        countries={countries}
        providers={providers}
      />

      <MsxCloudProviderRegionsDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setDetailRegion(null);
        }}
        region={detailRegion}
        countries={countries}
        providers={providers}
        t={t}
      />
    </div>
  );
};

export default MsxCloudProviderRegions;
