import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Card, Row, Col, Avatar, message, Spin, Tooltip } from 'antd';
import { UserOutlined, GlobalOutlined, PhoneOutlined, CompassOutlined, ClockCircleOutlined, EnvironmentOutlined, NumberOutlined, TeamOutlined, AppstoreOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 8px;
  }

  .ant-form-item-label {
    padding: 0 0 4px;
    
    > label {
      font-size: 12px;
      height: 16px;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .ant-input,
  .ant-select-selector,
  .ant-picker {
    font-size: 12px !important;
    padding: 4px 8px !important;
    height: 28px !important;
  }

  .ant-select-selection-item {
    line-height: 20px !important;
  }

  .ant-picker {
    width: 100%;
  }
`;

const StyledCard = styled(Card)`
  .ant-card-head {
    min-height: 36px;
    padding: 0 12px;
    
    .ant-card-head-title {
      padding: 8px 0;
      font-size: 13px;
    }
  }
  
  .ant-card-body {
    padding: 12px;
  }

  & + & {
    margin-top: 8px;
  }
`;

const StyledSelect = styled(Select)`
  .country-option {
    display: flex;
    flex-direction: column;
    
    .main-row {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      
      .flag {
        margin-right: 8px;
        font-size: 16px;
      }
      
      .name {
        flex: 1;
        font-weight: 500;
      }
      
      .code {
        color: #666;
        margin-left: 8px;
      }
    }
    
    .sub-row {
      display: flex;
      font-size: 11px;
      color: #666;
      
      > span {
        display: flex;
        align-items: center;
        margin-right: 12px;
        
        .anticon {
          margin-right: 4px;
          font-size: 11px;
        }
      }
    }
  }

  .city-option {
    display: flex;
    flex-direction: column;
    
    .main-row {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      
      .name {
        flex: 1;
        font-weight: 500;
      }
      
      .code {
        color: #666;
        margin-left: 8px;
      }
    }
    
    .sub-row {
      display: flex;
      flex-wrap: wrap;
      font-size: 11px;
      color: #666;
      
      > span {
        display: flex;
        align-items: center;
        margin-right: 12px;
        
        .anticon {
          margin-right: 4px;
          font-size: 11px;
        }
      }
    }
  }
`;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 12px;
  }
  
  .ant-modal-header {
    padding: 12px;
    margin-bottom: 8px;
  }
  
  .ant-modal-title {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .ant-modal-body {
    padding: 12px;
  }
  
  .ant-modal-footer {
    padding: 8px 12px;
    margin-top: 8px;
  }
`;

const RegionAgentsCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();
  const [managers, setManagers] = useState([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [agentTypes, setAgentTypes] = useState([]);
  const [agentTypesLoading, setAgentTypesLoading] = useState(false);

  // 搜索代理人
  const fetchManagers = async (search = '') => {
    setManagerLoading(true);
    try {
      const response = await api.get('/manage/manager/list', {
        params: { 
          username: search,
          pageSize: 20
        }
      });
      if (response?.data) {
        setManagers(response.data);
      }
    } catch (error) {
      console.error('搜索代理人失败:', error);
      message.error('搜索代理人失败');
    } finally {
      setManagerLoading(false);
    }
  };

  // 处理代理人选择
  const handleManagerSelect = (value, option) => {
    form.setFieldsValue({
      agentName: option.label
    });
  };

  // 防抖处理代理人搜索
  const debouncedManagerSearch = debounce(fetchManagers, 500);

  // 获取国家列表
  const fetchCountries = async () => {
    setCountriesLoading(true);
    try {
      const response = await api.get('/manage/countries/list-all-enable');
      if (response) {
        setCountries(response);
      }
    } catch (error) {
      console.error(t('getCountryListFailed'), error);
      message.error(t('getCountryListFailed'));
    } finally {
      setCountriesLoading(false);
    }
  };

  // 搜索城市
  const handleCitySearch = async (search) => {
    const countryCode = form.getFieldValue('countryCode');
    if (!countryCode) {
      return;
    }

    if (!search) {
      setCities([]);
      return;
    }

    setCitySearchLoading(true);
    try {
      const response = await api.get('/manage/global-addresses/list-all', {
        params: {
          code: countryCode,
          search
        }
      });

      if (response) {
        setCities(response);
      }
    } catch (error) {
      console.error('搜索城市失败:', error);
      message.error('搜索城市失败');
    } finally {
      setCitySearchLoading(false);
    }
  };

  // 处理国家选择
  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    form.setFieldsValue({
      city: undefined,
      regionId: undefined,
      regionCode: undefined,
      regionName: undefined,
      countryCode: value
    });
    setCities([]);
  };

  // 处理城市选择
  const handleCitySelect = (cityName, option) => {
    const selectedCity = option.data;
    
    if (selectedCity) {
      const countryCode = form.getFieldValue('countryCode');
      form.setFieldsValue({
        regionId: selectedCity.id,
        regionCode: selectedCity.code,
        regionName: selectedCity.name,
        countryCode: countryCode
      });
    }
  };

  // 组件加载时获取国家列表
  useEffect(() => {
    fetchCountries();
  }, []);

  // 防抖处理城市搜索
  const debouncedCitySearch = debounce(handleCitySearch, 500);

  // 获取代理类型列表
  const fetchAgentTypes = async () => {
    setAgentTypesLoading(true);
    try {
      const response = await api.get('/manage/region-agents/list-type');
      if (response) {
        setAgentTypes(response);
      }
    } catch (error) {
      console.error('获取代理类型失败:', error);
      message.error('获取代理类型失败');
    } finally {
      setAgentTypesLoading(false);
    }
  };

  // 在组件挂载时获取代理类型
  useEffect(() => {
    if (isVisible) {
      fetchAgentTypes();
    }
  }, [isVisible]);

  // 处理代理类型选择
  const handleAgentTypeSelect = (code) => {
    // 如果是区域独家代理，设置为独家代理
    form.setFieldsValue({
      isExclusive: code === 'REGIONAL_EXCLUSIVE' ? 1 : 0
    });
  };

  const renderCountryOption = (country) => ({
    value: country.code,
    label: (
      <div className="country-option">
        <div className="main-row">
          <span className="flag">
            {country.emoji || <GlobalOutlined />}
          </span>
          <span className="name">{country.name}</span>
          <span className="code">{country.code}</span>
        </div>
        <div className="sub-row">
          <span>
            <GlobalOutlined />
            {country.englishName || 'N/A'}
          </span>
          <span>
            <PhoneOutlined />
            +{country.phoneCode}
          </span>
          <span>
            <CompassOutlined />
            {country.continent || 'N/A'}
          </span>
          <span>
            <ClockCircleOutlined />
            {country.timezone || 'N/A'}
          </span>
        </div>
      </div>
    ),
    data: country
  });

  const renderCityOption = (city) => ({
    value: city.id,
    label: (
      <div className="city-option">
        <div className="main-row">
          <span className="name">{city.name}</span>
          <span className="code">{city.code}</span>
        </div>
        <div className="sub-row">
          <span>
            <GlobalOutlined />
            {city.englishName || 'N/A'}
          </span>
          <span>
            <EnvironmentOutlined />
            {city.type || '城市'}
          </span>
          <span>
            <NumberOutlined />
            {city.postcode || 'N/A'}
          </span>
          <span>
            <CompassOutlined />
            {city.longitude?.toFixed(2) || 'N/A'}, {city.latitude?.toFixed(2) || 'N/A'}
          </span>
          {city.population && (
            <span>
              <TeamOutlined />
              {(city.population / 10000).toFixed(0)}万
            </span>
          )}
        </div>
      </div>
    ),
    data: city
  });

  return (
    <StyledModal
      title={t('createAgent')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', padding: '12px' }}
    >
      <StyledForm
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="countryCode"
          hidden
        >
          <Input />
        </Form.Item>

        <StyledCard title={t('basicInfo')}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={<span><UserOutlined /> {t('agentId')}</span>}
                name="agentId"
                rules={[{ required: true, message: t('pleaseInputAgentId') }]}
              >
                <StyledSelect
                  showSearch
                  placeholder={t('searchAgent')}
                  loading={managerLoading}
                  filterOption={false}
                  onSearch={debouncedManagerSearch}
                  onChange={handleManagerSelect}
                  optionLabelProp="label"
                >
                  {managers.map(manager => (
                    <Select.Option
                      key={manager.id}
                      value={manager.id}
                      label={manager.username}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          size={16}
                          src={manager.avatar}
                          icon={<UserOutlined />}
                          className="user-avatar"
                        />
                        <span style={{ marginLeft: 8 }}>{manager.username}</span>
                      </div>
                    </Select.Option>
                  ))}
                </StyledSelect>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span><UserOutlined /> {t('agentName')}</span>}
                name="agentName"
                rules={[{ required: true, message: t('pleaseInputAgentName') }]}
              >
                <Input placeholder={t('pleaseInputAgentName')} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span><AppstoreOutlined /> {t('agentType')}</span>}
                name="agentType"
                rules={[{ required: true, message: t('pleaseSelectAgentType') }]}
              >
                <Select
                  placeholder={t('pleaseSelectAgentType')}
                  loading={agentTypesLoading}
                  optionLabelProp="label"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ minWidth: '300px' }}
                  onChange={handleAgentTypeSelect}
                >
                  {agentTypes.map(type => (
                    <Select.Option
                      key={type.code}
                      value={type.code}
                      label={type.name}
                    >
                      <div style={{ padding: '4px 0' }}>
                        <div style={{ fontWeight: 500 }}>
                          {type.name}
                          <span style={{ 
                            fontSize: '12px', 
                            color: '#666', 
                            fontWeight: 'normal',
                            marginLeft: '8px' 
                          }}>
                            ({type.code})
                          </span>
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#666', 
                          marginTop: '4px',
                          whiteSpace: 'normal',
                          lineHeight: '1.4'
                        }}>
                          {type.description}
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="countryCode"
                label={<span><GlobalOutlined /> {t('country')}</span>}
                rules={[{ required: true, message: t('pleaseSelectCountry') }]}
              >
                <Select
                  showSearch
                  loading={countriesLoading}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  optionLabelProp="label"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: '400px' }}
                  onChange={handleCountryChange}
                >
                  {countries.map(country => (
                    <Select.Option
                      key={country.code}
                      value={country.code}
                      label={`${country.name} (${country.code})`}
                    >
                      <div style={{ fontSize: '10px', padding: '2px 0', display: 'flex', alignItems: 'center' }}>
                        <img
                          src={country.flagImageUrl}
                          alt={`${country.name} ${t('flag')}`}
                          style={{ width: '20px', height: '15px', marginRight: '8px' }}
                        />
                        <div>
                          {country.name} ({country.code})
                        </div>
                        <div style={{ color: '#666', marginTop: '2px' }}>
                          {t('capital')}: {country.capital} | {t('officialLanguages')}: {country.officialLanguages} | {t('currency')}: {country.currency} | {t('continent')}: {country.continent}
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {selectedCountry === 'CN' && (
              <Col span={8}>
                <Form.Item
                  label={<span><EnvironmentOutlined /> {t('province')}</span>}
                  name="province"
                  rules={[{ required: true, message: t('pleaseInputProvince') }]}
                >
                  <Input placeholder={t('pleaseInputProvince')} />
                </Form.Item>
              </Col>
            )}
            <Col span={selectedCountry === 'CN' ? 8 : 16}>
              <Form.Item
                label={<span><EnvironmentOutlined /> {t('city')}</span>}
                name="city"
                rules={[{ required: true, message: t('pleaseSelectCity') }]}
              >
                <Select
                  showSearch
                  disabled={!form.getFieldValue('countryCode')}
                  loading={citySearchLoading}
                  onSearch={handleCitySearch}
                  filterOption={false}
                  notFoundContent={citySearchLoading ? <Spin size="small" /> : null}
                  optionLabelProp="label"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: '300px' }}
                  onChange={handleCitySelect}
                >
                  {cities.map(city => (
                    <Select.Option
                      key={city.code}
                      value={city.name}
                      label={`${city.name} (${city.enName})`}
                      data={city}
                    >
                      <div style={{ fontSize: '10px', padding: '2px 0' }}>
                        <div>{city.name}</div>
                        <div style={{ color: '#666', marginTop: '2px' }}>
                          {city.enName} | {t('cityType')}: {city.type} | {t('population')}: {(city.population/10000).toFixed(0)}{t('tenThousand')}
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="regionId"
                label={t('regionId')}
                rules={[{ required: true, message: t('pleaseSelectCityToGetRegionId') }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="regionCode"
                label={t('regionCode')}
                rules={[{ required: true, message: t('pleaseSelectCityToGetRegionCode') }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="regionName"
                label={t('regionName')}
                rules={[{ required: true, message: t('pleaseSelectCityToGetRegionName') }]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="agentLevel"
                label={t('agentLevel')}
                rules={[{ required: true, message: t('pleaseSelectAgentLevel') }]}
              >
                <Select placeholder={t('pleaseSelectAgentLevel')}>
                  <Select.Option value={1}>{t('agentLevelOne')}</Select.Option>
                  <Select.Option value={2}>{t('agentLevelTwo')}</Select.Option>
                  <Select.Option value={3}>{t('agentLevelThree')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isExclusive"
                label={t('isExclusive')}
                rules={[{ required: true, message: t('pleaseSelectIsExclusive') }]}
              >
                <Select 
                  placeholder={t('pleaseSelectIsExclusive')}
                  disabled
                >
                  <Select.Option value={1}>{t('yes')}</Select.Option>
                  <Select.Option value={0}>{t('no')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </StyledCard>

        {/* 合同信息 */}
        <StyledCard title={t('contractInfo')}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('contractNumber')}
                name="contractNumber"
                rules={[{ required: true, message: t('pleaseInputContractNumber') }]}
              >
                <Input placeholder={t('pleaseInputContractNumber')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('contactInfo')}
                name="contactInfo"
              >
                <Input.TextArea 
                  rows={2}
                  placeholder={t('pleaseInputContactInfo')} 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('contractStartDate')}
                name="contractStartDate"
                rules={[{ required: true, message: t('pleaseSelectContractStartDate') }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder={t('pleaseSelectContractStartDate')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('contractEndDate')}
                name="contractEndDate"
                rules={[{ required: true, message: t('pleaseSelectContractEndDate') }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder={t('pleaseSelectContractEndDate')}
                />
              </Form.Item>
            </Col>
          </Row>
        </StyledCard>

        {/* 授权时间 */}
        <StyledCard title={t('authorizationPeriod')}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={t('agentAuthorizationStartDate')}
                name="startDate"
                rules={[{ required: true, message: t('pleaseSelectAuthorizationStartDate') }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder={t('pleaseSelectAuthorizationStartDate')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('agentAuthorizationEndDate')}
                name="endDate"
                rules={[{ required: true, message: t('pleaseSelectAuthorizationEndDate') }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  placeholder={t('pleaseSelectAuthorizationEndDate')}
                />
              </Form.Item>
            </Col>
          </Row>
        </StyledCard>

        {/* 业务信息 */}
        <StyledCard title={t('businessInfo')}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={t('salesQuota')}
                name="salesQuota"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\¥\s?|(,*)/g, '')}
                  placeholder={t('pleaseInputSalesQuota')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('commissionRate')}
                name="commissionRate"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  formatter={value => `${value}%`}
                  parser={value => value.replace('%', '')}
                  placeholder={t('pleaseInputCommissionRate')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('currency')}
                name="currency"
              >
                <Select placeholder={t('pleaseSelectCurrency')}>
                  <Select.Option value="CNY">{t('CNY')}</Select.Option>
                  <Select.Option value="USD">{t('USD')}</Select.Option>
                  <Select.Option value="EUR">{t('EUR')}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={t('remarks')}
            name="remarks"
          >
            <Input.TextArea rows={4} placeholder={t('pleaseInputRemarks')} />
          </Form.Item>
        </StyledCard>
      </StyledForm>

      <style jsx global>{`
        .ant-select-dropdown {
          font-size: 12px !important;
        }
        .ant-select-item {
          min-height: 28px !important;
          line-height: 28px !important;
          padding: 4px 8px !important;
        }
        .ant-form-item-explain {
          font-size: 12px;
          min-height: 16px;
          padding-top: 2px;
        }
        .ant-modal-footer button {
          font-size: 12px;
          height: 28px;
          padding: 0 12px;
        }
        .ant-select-dropdown .ant-select-item-option-content {
          display: flex !important;
          align-items: center !important;
        }
        .user-avatar {
          margin-right: 4px;
          flex-shrink: 0;
        }
        .ant-select-item {
          padding: 8px 12px !important;
        }
        .ant-select-item-option-content {
          white-space: normal !important;
        }
        .ant-select-selection-item {
          padding: 0 4px !important;
        }
        .ant-select-selection-item .country-option,
        .ant-select-selection-item .city-option {
          padding: 0 !important;
        }
        .ant-select-selection-item .sub-row {
          display: none;
        }
        .ant-select-item-option-content {
          white-space: normal !important;
        }
        .ant-select-dropdown .ant-select-item {
          padding: 8px 12px !important;
        }
        .ant-select-dropdown .ant-select-item-option-content > div {
          padding: 4px 0;
        }
      `}</style>
    </StyledModal>
  );
};

export default RegionAgentsCreateFormModal;
