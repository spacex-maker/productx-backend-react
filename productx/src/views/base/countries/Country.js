import React, {useState, useEffect} from 'react';
import api from 'src/axiosInstance';
import {Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space} from 'antd';
import {UseSelectableRows} from 'src/components/common/UseSelectableRows';
import {HandleBatchDelete} from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import CountryTable from 'src/views/base/countries/CountryTable'; // 你需要创建这个表格组件
import UpdateCountryModal from 'src/views/base/countries/UpdateCountryModal'; // 你需要创建这个更新模态框
import CountryCreateFormModal from 'src/views/base/countries/CountryCreateFormModal'; // 你需要创建这个创建模态框
import WorldMap from './WorldMap';
import { useTranslation } from 'react-i18next';
const updateCountryStatus = async (id, newStatus) => {
  await api.post('/manage/countries/change-status', {id, status: newStatus});
};

const createCountry = async (countryData) => {
  await api.post('/manage/countries/create', countryData);
};

const updateCountry = async (updateData) => {
  await api.put(`/manage/countries/update`, updateData);
};

const CountryList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    name: '',
    code: '',
    continent: '',
    status: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchData();
    fetchAllData()
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
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      );
      const response = await api.get('/manage/countries/list', {
        params: {currentPage, pageSize: pageSize, ...filteredParams},
      });

      if (response && response.data) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('数据加载失败，请重试！');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      );
      const response = await api.get('/manage/countries/list-all');

      if (response) {
        setAllData(response);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error('数据加载失败，请重试！');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSearchChange = (event) => {
    const {name, value} = event.target;
    setSearchParams((prevParams) => ({...prevParams, [name]: value}));
  };

  const handleCreateCountry = async (values) => {
    await createCountry(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchAllData()
    await fetchData();
  };
  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked
    await updateCountryStatus(id, newStatus)
    await fetchAllData()
    await fetchData() // Re-fetch data after status update
  }
  const handleUpdateCountry = async (values) => {
    await updateCountry(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchAllData()
    await fetchData();
  };

  const handleEditClick = (country) => {
    updateForm.setFieldsValue({
      id: country.id,
      name: country.name,
      code: country.code,
      continent: country.continent,
      status: country.status,
    });
    setSelectedCountry(country);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div className="country-list-wrapper">
      <div className="search-wrapper">
        <div className="search-container">
          <Row gutter={[8, 8]} align="middle">
            <Col flex="0 0 160px">
              <Input
                size="small"
                value={searchParams.name}
                onChange={handleSearchChange}
                name="name"
                placeholder={t('countryName')}
                allowClear
              />
            </Col>
            <Col flex="0 0 160px">
              <Input
                size="small"
                value={searchParams.code}
                onChange={handleSearchChange}
                name="code"
                placeholder={t('countryCode')}
                allowClear
              />
            </Col>
            <Col flex="0 0 160px">
              <Select
                size="small"
                name="continent"
                onChange={(value) => handleSearchChange({target: {name: 'continent', value}})}
                allowClear
                placeholder={t('selectContinent')}
                style={{ width: '100%' }}
              >
                <Select.Option value="非洲">{t('africa')}</Select.Option>
                <Select.Option value="亚洲">{t('asia')}</Select.Option>
                <Select.Option value="欧洲">{t('europe')}</Select.Option>
                <Select.Option value="北美洲">{t('northAmerica')}</Select.Option>
                <Select.Option value="南美洲">{t('southAmerica')}</Select.Option>
                <Select.Option value="大洋洲">{t('oceania')}</Select.Option>
                <Select.Option value="南极洲">{t('antarctica')}</Select.Option>
              </Select>
            </Col>
            <Col flex="0 0 160px">
              <Select
                size="small"
                name="status"
                onChange={(value) => handleSearchChange({target: {name: 'status', value}})}
                allowClear
                placeholder={t('businessStatus')}
                style={{ width: '100%' }}
              >
                <Select.Option value="1">{t('yes')}</Select.Option>
                <Select.Option value="0">{t('no')}</Select.Option>
              </Select>
            </Col>
            <Col flex="none">
              <Space size={8}>
                <Button
                  size="small"
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin size="small"/> : t('search')}
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('createCountry')}
                </Button>
                <Button
                  size="small"
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/country/delete-batch',
                    selectedRows,
                    fetchData,
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
          <CountryTable
            allData={allData}
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
          />
        </Spin>

        <Pagination
          size="small"
          totalPages={totalPages}
          current={currentPage}
          onPageChange={setCurrent}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <WorldMap countries={allData} />
      </div>
      <CountryCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateCountry}
        form={createForm}
      />
      <UpdateCountryModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateCountry={handleUpdateCountry}
        selectedCountry={selectedCountry}
      />

      <style jsx global>{`
        .country-list-wrapper {
          padding: 16px;
          background: var(--cui-body-bg);
        }

        .search-wrapper {
          padding: 12px;
          background: var(--cui-card-bg);
          border: 1px solid var(--cui-border-color);
          border-radius: 4px;
          margin-bottom: 16px;
        }


      `}</style>
    </div>
  );
};

export default CountryList;
