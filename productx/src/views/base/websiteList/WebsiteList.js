import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import WebsiteListTable from './WebsiteListTable';
import UpdateWebsiteListModal from './UpdateWebsiteListModal';
import WebsiteListCreateFormModal from './WebsiteListCreateFormModal';
import WebsiteListDetailModal from './WebsiteListDetailModal';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { Option } = Select;

const WebsiteList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    name: '',
    url: '',
    category: undefined,
    subCategory: undefined,
    countryCode: undefined,
    tags: '',
    status: undefined,
    isVerified: undefined,
    isFeatured: undefined,
    isPopular: undefined,
    isNew: undefined,
    language: undefined,
    hasMobileSupport: undefined,
    hasDarkMode: undefined,
    hasSsl: undefined,
    businessModel: undefined,
    companyName: '',
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedWebsiteDetail, setSelectedWebsiteDetail] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState({});

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  useEffect(() => {
    fetchData();
  }, [current, pageSize, searchParams]);

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
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      const response = await api.get('/manage/website-list/list', {
        params: { 
          currentPage: current,
          pageSize: pageSize,
          ...filteredParams 
        },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      message.error(error.message || t('fetchDataFailed'));
      setData([]);
      setTotalNum(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, checked) => {
    setLoadingStatus(prev => ({ ...prev, [id]: true }));
    try {
      await api.post('/manage/website-list/change-status', {
        id,
        status: checked
      });
      
      await fetchData();
      message.success(t('updateSuccess'));
    } catch (error) {
      console.error('Failed to update status:', error);
      message.error(error.message || t('updateFailed'));
    } finally {
      setLoadingStatus(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSearchChange = ({ target: { name, value } }) => {
    setSearchParams(prev => ({ 
      ...prev, 
      [name]: value,
      currentPage: 1  // 修正参数名为 currentPage
    }));
  };

  const handleCreateWebsite = async (values) => {
    try {
      await api.post('/manage/website-list/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.message || t('createFailed'));
    }
  };

  const handleUpdateWebsite = async (values) => {
    try {
      await api.put('/manage/website-list/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(error.message || t('updateFailed'));
    }
  };

  const handleEditClick = (record) => {
    setSelectedWebsite(record);
    setIsUpdateModalVisible(true);
  };

  const handleViewClick = (record) => {
    setSelectedWebsiteDetail(record);
    setIsDetailModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  // 特征多选框的处理
  const handleCharacteristicsChange = (values) => {
    setSearchParams(prev => ({
      ...prev,
      isNew: values.includes('isNew'),
      isFeatured: values.includes('isFeatured'),
      isPopular: values.includes('isPopular'),
      isVerified: values.includes('isVerified'),
      currentPage: 1
    }));
  };

  // 功能多选框的处理
  const handleFeaturesChange = (values) => {
    setSearchParams(prev => ({
      ...prev,
      hasMobileSupport: values.includes('hasMobileSupport') || undefined,
      hasDarkMode: values.includes('hasDarkMode') || undefined,
      hasSsl: values.includes('hasSsl') || undefined,
      currentPage: 1
    }));
  };

  return (
    <div>
      <div className="search-form mb-3">
        <Form>
          <Space wrap>
            <Input
              placeholder={t('pleaseEnterSiteName')}
              value={searchParams.name}
              onChange={(e) => handleSearchChange({ target: { name: 'name', value: e.target.value }})}
              allowClear
              style={{ minWidth: 200 }}
            />
            <Input
              placeholder={t('pleaseEnterSiteUrl')}
              value={searchParams.url}
              onChange={(e) => handleSearchChange({ target: { name: 'url', value: e.target.value }})}
              allowClear
              style={{ minWidth: 200 }}
            />
            <Select
              allowClear
              placeholder={t('pleaseSelectClassification')}
              value={searchParams.category}
              onChange={(value) => handleSearchChange({ target: { name: 'category', value }})}
              style={{ minWidth: 200 }}
            >
              <Option value="购物">{t('shopping')}</Option>
              <Option value="美食">{t('food')}</Option>
              <Option value="交通">{t('transportation')}</Option>
              <Option value="旅游">{t('travel')}</Option>
              <Option value="娱乐">{t('entertainment')}</Option>
              <Option value="教育">{t('education')}</Option>
              <Option value="新闻">{t('news')}</Option>
              <Option value="社交">{t('social')}</Option>
            </Select>
            <Select
              allowClear
              placeholder={t('status')}
              value={searchParams.status}
              onChange={(value) => handleSearchChange({ target: { name: 'status', value }})}
              style={{ minWidth: 200 }}
            >
              <Option value={true}>{t('enabled')}</Option>
              <Option value={false}>{t('disabled')}</Option>
            </Select>
            <Select
              mode="multiple"
              allowClear
              placeholder={t('characteristics')}
              value={[
                searchParams.isNew && 'isNew',
                searchParams.isFeatured && 'isFeatured',
                searchParams.isPopular && 'isPopular',
                searchParams.isVerified && 'isVerified',
              ].filter(Boolean)}
              onChange={handleCharacteristicsChange}
              style={{ minWidth: 200 }}
            >
              <Option value="isNew">{t('newOnline')}</Option>
              <Option value="isFeatured">{t('recommended')}</Option>
              <Option value="isPopular">{t('popular')}</Option>
              <Option value="isVerified">{t('verified')}</Option>
            </Select>
            <Select
              mode="multiple"
              allowClear
              placeholder={t('features')}
              value={[
                searchParams.hasMobileSupport && 'hasMobileSupport',
                searchParams.hasDarkMode && 'hasDarkMode',
                searchParams.hasSsl && 'hasSsl',
              ].filter(Boolean)}
              onChange={handleFeaturesChange}
              style={{ minWidth: 200 }}
            >
              <Option value="hasMobileSupport">{t('mobileSupport')}</Option>
              <Option value="hasDarkMode">{t('darkMode')}</Option>
              <Option value="hasSsl">{t('ssl')}</Option>
            </Select>
            <Input
              placeholder={t('pleaseEnterCompanyName')}
              value={searchParams.companyName}
              onChange={(e) => handleSearchChange({ target: { name: 'companyName', value: e.target.value }})}
              allowClear
              style={{ minWidth: 200 }}
            />
            <Space>
              <Button type="primary" onClick={fetchData}>
                {t('search')}
              </Button>
              <Button onClick={() => setIsCreateModalVisible(true)}>
                {t('create')}
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/website-list/delete-batch',
                    selectedRows,
                    fetchData,
                  })
                }
                disabled={selectedRows.length === 0}
              >
                {t('batchDelete')}
              </Button>
            </Space>
          </Space>
        </Form>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <WebsiteListTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleViewClick={handleViewClick}
            countries={countries}
            loadingStatus={loadingStatus}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={current}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <WebsiteListCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateWebsite}
        form={createForm}
        countries={countries}
      />

      <UpdateWebsiteListModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onFinish={handleUpdateWebsite}
        form={updateForm}
        selectedWebsite={selectedWebsite}
        countries={countries}
      />

      <WebsiteListDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        websiteData={selectedWebsiteDetail}
        countries={countries}
      />
    </div>
  );
};

export default WebsiteList;
