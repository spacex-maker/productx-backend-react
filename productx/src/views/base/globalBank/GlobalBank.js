import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import BankTable from 'src/views/base/globalBank/GlobalBankTable';
import UpdateBankModal from 'src/views/base/globalBank/UpdateGlobalBankModal';
import BankCreateFormModal from 'src/views/base/globalBank/GlobalBankCreateFormModal';
import BankDetailModal from 'src/views/base/globalBank/GlobalBankDetailModal';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const updateBankStatus = async (id, newStatus) => {
  await api.post('/manage/global-bank/change-status', { id, status: newStatus ? 1 : 0 });
};

const createBank = async (bankData) => {
  await api.post('/manage/global-bank/create', bankData);
};

const updateBank = async (updateData) => {
  await api.put('/manage/global-bank/update', updateData);
};

const BankList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    bankName: '',
    swiftCode: '',
    countryCode: undefined,
    city: '',
    status: undefined,
  });

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedBank, setSelectedBank] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBankDetail, setSelectedBankDetail] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(null);

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

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

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
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      const response = await api.get('/manage/global-bank/list', {
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

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked;
    setLoadingStatus(id);
    try {
      const response = await api.post('/manage/global-bank/change-status', {
        id,
        status: newStatus
      });
      
      if (response) {
        message.success(t('statusUpdateSuccess'));
        await fetchData();
      } else {
        message.error(response?.message || t('statusUpdateFailed'));
        await fetchData();
      }
    } catch (error) {
      message.error(t('statusUpdateFailed'));
      console.error('Failed to update status:', error);
      await fetchData();
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleCreateBank = async (values) => {
    await createBank(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateBank = async (values) => {
    await updateBank(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleEditClick = (bank) => {
    updateForm.setFieldsValue({ ...bank });
    setIsUpdateModalVisible(true);
  };

  const handleViewClick = (bank) => {
    setSelectedBankDetail(bank);
    setIsDetailModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  // 在表格中显示国家名称
  const getCountryName = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.name : countryCode;
  };

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <Row gutter={16}>
            <Col>
              <Input
                placeholder={t('enterBankName')}
                value={searchParams.bankName}
                onChange={handleSearchChange}
                name="bankName"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                placeholder={t('enterSwiftCode')}
                value={searchParams.swiftCode}
                onChange={handleSearchChange}
                name="swiftCode"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                placeholder={t('selectCountry')}
                value={searchParams.countryCode}
                onChange={(value) => handleSearchChange({ target: { name: 'countryCode', value } })}
                allowClear
                loading={loadingCountries}
                style={{ width: 150 }}
              >
                {countries.map(country => countryOption(country))}
              </Select>
            </Col>
            <Col>
              <Input
                placeholder={t('enterCity')}
                value={searchParams.city}
                onChange={handleSearchChange}
                name="city"
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData}>
                  {t('search')}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  {t('createBank')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/global-bank/delete-batch',
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
          <BankTable
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
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <BankCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateBank}
        form={createForm}
      />
      <UpdateBankModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateBank={handleUpdateBank}
        selectedBank={selectedBank}
        countries={countries}
      />
      <BankDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        bankData={selectedBankDetail}
        countries={countries}
      />
    </div>
  );
};

export default BankList;
