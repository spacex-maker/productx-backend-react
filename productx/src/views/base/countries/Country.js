import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import CountryTable from 'src/views/base/countries/CountryTable'; // 你需要创建这个表格组件
import UpdateCountryModal from 'src/views/base/countries/UpdateCountryModal'; // 你需要创建这个更新模态框
import CountryCreateFormModal from 'src/views/base/countries/CountryCreateFormModal'; // 你需要创建这个创建模态框
import WorldMap from './WorldMap';
import { useTranslation } from 'react-i18next';
const updateCountryStatus = async (id, newStatus) => {
  await api.post('/manage/countries/change-status', { id, status: newStatus });
};

const createCountry = async (countryData) => {
  await api.post('/manage/countries/create', countryData);
};

const updateCountry = async (values) => {
  try {
    const response = await api.put('/manage/countries/update', {
      ...values,
      // 转换日期格式
      independenceDay: values.independenceDay ? values.independenceDay.format('YYYY-MM-DD') : null,
      // 确保数值类型正确
      population: values.population ? Number(values.population) : null,
      gdp: values.gdp ? Number(values.gdp) : null,
      area: values.area ? Number(values.area) : null,
      populationDensity: values.populationDensity ? Number(values.populationDensity) : null,
      hdi: values.hdi ? Number(values.hdi) : null,
      averageAnnualTemperature: values.averageAnnualTemperature
        ? Number(values.averageAnnualTemperature)
        : null,
      nationalSecurityIndex: values.nationalSecurityIndex
        ? Number(values.nationalSecurityIndex)
        : null,
      capitalPopulation: values.capitalPopulation ? Number(values.capitalPopulation) : null,
      povertyRate: values.povertyRate ? Number(values.povertyRate) : null,
      unemploymentRate: values.unemploymentRate ? Number(values.unemploymentRate) : null,
      politicalStability: values.politicalStability ? Number(values.politicalStability) : null,
      educationLevel: values.educationLevel ? Number(values.educationLevel) : null,
      healthcareLevel: values.healthcareLevel ? Number(values.healthcareLevel) : null,
      internetPenetrationRate: values.internetPenetrationRate
        ? Number(values.internetPenetrationRate)
        : null,
      foreignExchangeReserves: values.foreignExchangeReserves
        ? Number(values.foreignExchangeReserves)
        : null,
      energyConsumption: values.energyConsumption ? Number(values.energyConsumption) : null,
      airQualityIndex: values.airQualityIndex ? Number(values.airQualityIndex) : null,
      greenEconomyIndex: values.greenEconomyIndex ? Number(values.greenEconomyIndex) : null,
      militaryStrengthIndex: values.militaryStrengthIndex
        ? Number(values.militaryStrengthIndex)
        : null,
      linguisticDiversity: values.linguisticDiversity ? Number(values.linguisticDiversity) : null,
      birthRate: values.birthRate ? Number(values.birthRate) : null,
      deathRate: values.deathRate ? Number(values.deathRate) : null,
      worldHeritageSites: values.worldHeritageSites ? Number(values.worldHeritageSites) : null,
    });
    message.success('更新成功');
  } catch (error) {
    message.error('更新失败：' + error.message);
  }
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
    fetchAllData();
  }, [currentPage, pageSize, searchParams]);

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      );
      const response = await api.get('/manage/countries/list', {
        params: { currentPage, pageSize: pageSize, ...filteredParams },
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
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateCountry = async (values) => {
    await createCountry(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchAllData();
    await fetchData();
  };
  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked;
    await updateCountryStatus(id, newStatus);
    await fetchAllData();
    await fetchData(); // Re-fetch data after status update
  };
  const handleUpdateCountry = async (values) => {
    await updateCountry(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchAllData();
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
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.name}
                onChange={handleSearchChange}
                name="name"
                placeholder={t('countryName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.code}
                onChange={handleSearchChange}
                name="code"
                placeholder={t('countryCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                name="continent"
                onChange={(value) => handleSearchChange({ target: { name: 'continent', value } })}
                allowClear
                placeholder={t('selectContinent')}
                style={{ width: 150 }}
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
            <Col>
              <Select
                name="status"
                onChange={(value) => handleSearchChange({ target: { name: 'status', value } })}
                allowClear
                placeholder={t('businessStatus')}
                style={{ width: 150 }}
              >
                <Select.Option value="1">{t('yes')}</Select.Option>
                <Select.Option value="0">{t('no')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('createCountry')}
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    HandleBatchDelete({
                      url: '/manage/country/delete-batch',
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
