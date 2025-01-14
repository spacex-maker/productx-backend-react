import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import CourierTable from 'src/views/base/express/ExpressTable';
import UpdateCourierModal from 'src/views/base/express/UpdateExpressCompanyModal';
import CourierCreateFormModal from 'src/views/base/express/ExpressCompanyCreateFormModal';
import ExpressCompanyDetailModal from './ExpressCompanyDetailModal';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const updateCourierStatus = async (id, newStatus) => {
  await api.post('/manage/express/change-status', { id, status: newStatus});
};

const createCourier = async (courierData) => {
  await api.post('/manage/express/create', courierData);
};

const updateCourier = async (updateData) => {
  await api.put('/manage/express/update', updateData);
};

const ExpressList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    name: '',
    trackingNumberFormat: '',
    website: '',
    contactNumber: '',
    status: '',
    countryCode: undefined
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [countries, setCountries] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
        }
      } catch (error) {
        console.error('获取国家列表失败:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleDetailClick = (courier) => {
    setSelectedCourier(courier);
    setIsDetailModalVisible(true);
  };

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      );
      const response = await api.get('/manage/express/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response && response.data) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked;
    await updateCourierStatus(id, newStatus);
    await fetchData();
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateCourier = async (values) => {
    await createCourier(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateCourier = async (values) => {
    await updateCourier(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleEditClick = (courier) => {
    setSelectedCourier(courier);
    updateForm.setFieldsValue({
      id: courier.id,
      countryCode: courier.countryCode,
      name: courier.name,
      trackingNumberFormat: courier.trackingNumberFormat,
      website: courier.website,
      contactNumber: courier.contactNumber,
      status: courier.status
    });
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                size="small"
                value={searchParams.name}
                onChange={handleSearchChange}
                name="name"
                placeholder={t('companyName')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.trackingNumberFormat}
                onChange={handleSearchChange}
                name="trackingNumberFormat"
                placeholder={t('trackingFormat')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.website}
                onChange={handleSearchChange}
                name="website"
                placeholder={t('website')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.contactNumber}
                onChange={handleSearchChange}
                name="contactNumber"
                placeholder={t('contactNumber')}
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                className="search-box"
                name="status"
                onChange={(value) => handleSearchChange({ target: { name: 'status', value } })}
                allowClear
                placeholder={t('status')}
              >
                <Select.Option value="1">{t('enable')}</Select.Option>
                <Select.Option value="0">{t('disable')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                size="small"
                className="search-box"
                name="countryCode"
                onChange={(value) => handleSearchChange({ target: { name: 'countryCode', value } })}
                allowClear
                placeholder={t('country')}
                showSearch
                optionFilterProp="children"
                style={{ minWidth: 150 }}
              >
                {countries.map(country => (
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
                    </Space>
                  </Select.Option>
                ))}
              </Select>
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
                {t('addExpressCompany')}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/sys-couriers/delete-batch',
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
          <CourierTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
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
      <CourierCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateCourier}
        form={createForm}
      />
      <UpdateCourierModal
        isVisible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          updateForm.resetFields();
        }}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateCourier={handleUpdateCourier}
        selectedCourier={selectedCourier}
      />
      <ExpressCompanyDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        courier={selectedCourier}
        countries={countries}
      />
    </div>
  );
};

export default ExpressList;
