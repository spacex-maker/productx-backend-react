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
  const [currentPage, setCurrent] = useState(1);
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
  }, [currentPage, pageSize, searchParams]);

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
          currentPage, 
          pageSize, 
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
      await api.put('/manage/website-list/update-status', {
        id,
        status: checked ? 1 : 0
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

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
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

  return (
    <div>
      <div className="search-form mb-3">
        <Form>
          <Row gutter={16}>
            <Col>
              <Input
                placeholder={t('pleaseEnterSiteName')}
                value={searchParams.name}
                onChange={(e) => handleSearchChange({ target: { name: 'name', value: e.target.value }})}
                allowClear
                style={{ width: 180 }}
              />
            </Col>
            <Col>
              <Input
                placeholder={t('pleaseEnterSiteUrl')}
                value={searchParams.url}
                onChange={(e) => handleSearchChange({ target: { name: 'url', value: e.target.value }})}
                allowClear
                style={{ width: 180 }}
              />
            </Col>
            <Col>
              <Select
                allowClear
                placeholder={t('pleaseSelectClassification')}
                value={searchParams.category}
                onChange={(value) => handleSearchChange({ target: { name: 'category', value }})}
                style={{ width: 180 }}
              >
                <Option value="购物">{t('shopping')}</Option>
                <Option value="娱乐">{t('entertainment')}</Option>
                <Option value="教育">{t('education')}</Option>
                <Option value="新闻">{t('news')}</Option>
                <Option value="社交">{t('social')}</Option>
              </Select>
            </Col>
            <Col>
              <Select
                allowClear
                showSearch
                placeholder={t('country')}
                value={searchParams.countryCode}
                onChange={(value) => handleSearchChange({ target: { name: 'countryCode', value }})}
                filterOption={(input, option) => {
                  const country = countries.find(c => c.code === option.value);
                  return (
                    country?.name.toLowerCase().includes(input.toLowerCase()) ||
                    country?.code.toLowerCase().includes(input.toLowerCase())
                  );
                }}
                style={{ width: 180 }}
              >
                {countries.map(country => (
                  <Option key={country.code} value={country.code}>
                    <Space>
                      <img 
                        src={country.flagImageUrl} 
                        alt={country.name}
                        style={{ 
                          width: 20,
                          height: 15,
                          borderRadius: 0
                        }}
                      />
                      <span>{country.name}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
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
            </Col>
          </Row>
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
        total={totalNum}
        current={currentPage}
        pageSize={pageSize}
        onChange={setCurrent}
        onShowSizeChange={(current, size) => {
          setCurrent(1);
          setPageSize(size);
        }}
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
