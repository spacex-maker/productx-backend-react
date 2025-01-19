import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space, DatePicker } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import WebsiteApplicationTable from './WebsiteApplicationTable';
import UpdateWebsiteApplicationModal from './UpdateWebsiteApplicationModal';
import WebsiteApplicationCreateFormModal from './WebsiteApplicationCreateFormModal';
import WebsiteApplicationDetailModal from './WebsiteApplicationDetailModal';
import WebsiteApplicationReviewModal from './WebsiteApplicationReviewModal';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const WebsiteApplication = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    websiteName: '',
    url: '',
    contactEmail: '',
    contactPhone: '',
    status: undefined,
    countryCode: undefined,
    createTimeStart: undefined,
    createTimeEnd: undefined,
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedApplicationDetail, setSelectedApplicationDetail] = useState(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();
  const [selectedApplicationForReview, setSelectedApplicationForReview] = useState(null);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

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

      const response = await api.get('/manage/website-applications/list', {
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

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setSearchParams(prev => ({
        ...prev,
        createTimeStart: dates[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        createTimeEnd: dates[1].endOf('day').format('YYYY-MM-DD HH:mm:ss')
      }));
    } else {
      setSearchParams(prev => ({
        ...prev,
        createTimeStart: undefined,
        createTimeEnd: undefined
      }));
    }
    setCurrent(1);
  };

  const handleEditClick = (application) => {
    setSelectedApplication(application);
    updateForm.setFieldsValue({ ...application });
    setIsUpdateModalVisible(true);
  };

  const handleViewClick = (application) => {
    setSelectedApplicationDetail(application);
    setIsDetailModalVisible(true);
  };

  const handleReviewClick = (application) => {
    setSelectedApplicationForReview(application);
    setIsReviewModalVisible(true);
    reviewForm.setFieldsValue({
      id: application.id
    });
  };

  const totalPages = Math.ceil(totalNum / pageSize);

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

  const handleCreateApplication = async (values) => {
    try {
      await api.post('/manage/website-applications/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      fetchData();
    } catch (error) {
      console.error('Failed to create application:', error);
      message.error(error.message || t('createFailed'));
    }
  };

  const handleUpdateApplication = async (values) => {
    try {
      await api.put(`/manage/website-applications/update/${values.id}`, values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      fetchData();
    } catch (error) {
      console.error('Failed to update application:', error);
      message.error(error.message || t('updateFailed'));
    }
  };

  const handleReviewApplication = async (values) => {
    try {
      await api.post('/manage/website-applications/review', values);
      message.success(t('reviewSuccess'));
      setIsReviewModalVisible(false);
      reviewForm.resetFields();
      fetchData();
    } catch (error) {
      console.error('Failed to review application:', error);
      message.error(error.message || t('reviewFailed'));
    }
  };

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                size="small"
                value={searchParams.websiteName}
                onChange={handleSearchChange}
                name="websiteName"
                placeholder={t('websiteName')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.url}
                onChange={handleSearchChange}
                name="url"
                placeholder={t('websiteUrl')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.contactEmail}
                onChange={handleSearchChange}
                name="contactEmail"
                placeholder={t('contactEmail')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.contactPhone}
                onChange={handleSearchChange}
                name="contactPhone"
                placeholder={t('contactPhone')}
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                value={searchParams.status}
                onChange={(value) => handleSearchChange({ target: { name: 'status', value }})}
                placeholder={t('applicationStatus')}
                allowClear
                style={{ minWidth: 120 }}
              >
                <Option value="pending">{t('pending')}</Option>
                <Option value="approved">{t('approved')}</Option>
                <Option value="rejected">{t('rejected')}</Option>
              </Select>
            </Col>
            <Col>
              <Select
                size="small"
                value={searchParams.countryCode}
                onChange={(value) => handleSearchChange({ target: { name: 'countryCode', value }})}
                placeholder={t('country')}
                allowClear
                showSearch
                loading={loadingCountries}
                style={{ minWidth: 150 }}
                filterOption={(input, option) => {
                  const country = countries.find(c => c.code === option.value);
                  return (
                    country?.name.toLowerCase().includes(input.toLowerCase()) ||
                    country?.code.toLowerCase().includes(input.toLowerCase())
                  );
                }}
              >
                {countries.map(country => countryOption(country))}
              </Select>
            </Col>
            <Col>
              <RangePicker
                size="small"
                onChange={handleDateRangeChange}
                style={{ minWidth: 230 }}
              />
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                className="search-button"
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
                {t('createApplication')}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/website-applications/delete-batch',
                    selectedRows,
                    fetchData,
                  })
                }
                disabled={selectedRows.length === 0}
              >
                {t('batchDelete')}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <WebsiteApplicationTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleViewClick={handleViewClick}
            handleReviewClick={handleReviewClick}
            countries={countries}
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

      <WebsiteApplicationCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateApplication}
        form={createForm}
        countries={countries}
      />

      <UpdateWebsiteApplicationModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onFinish={handleUpdateApplication}
        form={updateForm}
        selectedApplication={selectedApplication}
        countries={countries}
      />

      <WebsiteApplicationDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        applicationData={selectedApplicationDetail}
        countries={countries}
      />

      <WebsiteApplicationReviewModal
        isVisible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        onFinish={handleReviewApplication}
        form={reviewForm}
        applicationData={selectedApplicationForReview}
      />
    </div>
  );
};

export default WebsiteApplication;
