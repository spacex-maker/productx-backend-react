import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Card, Row, Col, Avatar, message, Spin, Space } from 'antd';
import {
  UserOutlined,
  GlobalOutlined,
  PhoneOutlined,
  CompassOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  NumberOutlined,
  TeamOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import api from 'src/axiosInstance';
import debounce from 'lodash/debounce';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const UpdateRegionAgentsModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  initialValues
}) => {
  const { t } = useTranslation();
  const [managers, setManagers] = useState([]);
  const [managerLoading, setManagerLoading] = useState(false);
  const [countries, setCountries] = useState([]);
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
      console.error(t('searchAgentFailed'), error);
      message.error(t('searchAgentFailed'));
    } finally {
      setManagerLoading(false);
    }
  };

  // 处理代理人选择
  const handleManagerSelect = (value, option) => {
    form.setFieldsValue({
      agentName: option.label
    });
    setCurrentPage(1); // 重置页码
  };

  // 防抖处理代理人搜索
  const debouncedManagerSearch = debounce(fetchManagers, 500);

  // 获取国家列表
  const fetchCountries = async () => {
    try {
      const response = await api.get('/manage/countries/list-all-enable');
      if (response) {
        setCountries(response);
      }
    } catch (error) {
      console.error(t('getCountryListFailed'), error);
      message.error(t('getCountryListFailed'));
    }
  };

  // 搜索城市
  const handleCitySearch = async (search) => {
    const countryCode = form.getFieldValue('countryCode');
    if (!countryCode) {
      return;
    }

    setCitySearchLoading(true);
    try {
      const response = await api.get('/manage/global-addresses/list-all', {
        params: {
          code: countryCode,
          search: search || undefined
        }
      });

      if (response) {
        setCities(response);
      }
    } catch (error) {
      console.error(t('searchCityFailed'), error);
      message.error(t('searchCityFailed'));
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
      regionName: undefined
    });
    setCities([]);
    setCurrentPage(1); // 重置页码
  };

  // 处理城市选择
  const handleCitySelect = (cityName, option) => {
    const selectedCity = option.data;

    if (selectedCity) {
      const countryCode = form.getFieldValue('countryCode');
      form.setFieldsValue({
        regionId: selectedCity.id,
        regionCode: selectedCity.code,
        regionName: selectedCity.name
      });
    }
    setCurrentPage(1); // 重置页码
  };

  // 组件加载时获取国家列表
  useEffect(() => {
    if (isVisible) {
      fetchCountries();
    }
  }, [isVisible]);

  // 在弹窗显示时设置初始值
  useEffect(() => {
    if (isVisible && initialValues) {
      const formValues = {
        ...initialValues,
        startDate: initialValues.startDate ? dayjs(initialValues.startDate) : null,
        endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
        contractStartDate: initialValues.contractStartDate ? dayjs(initialValues.contractStartDate) : null,
        contractEndDate: initialValues.contractEndDate ? dayjs(initialValues.contractEndDate) : null
      };

      form.setFieldsValue(formValues);
      setSelectedCountry(initialValues.countryCode);

      // 如果有城市数据，预设城市列表
      if (initialValues.city) {
        setCities([{
          id: initialValues.regionId,
          code: initialValues.regionCode,
          name: initialValues.city,
          enName: initialValues.regionEnglishName,
          type: initialValues.regionType,
          population: initialValues.regionPopulation,
          longitude: initialValues.regionLongitude,
          latitude: initialValues.regionLatitude
        }]);

        // 立即加载该城市的其他选项
        handleCitySearch(initialValues.city);
      }

      // 如果有国家代码，预加载该国家的城市数据
      if (initialValues.countryCode) {
        // 可以预加载一些默认的城市数据
        handleCitySearch('');
      }
    }
  }, [isVisible, initialValues, form]);

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
      console.error(t('getAgentTypesFailed'), error);
      message.error(t('getAgentTypesFailed'));
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
    form.setFieldsValue({
      isExclusive: code === 'REGIONAL_EXCLUSIVE' ? 1 : 0
    });
  };

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          {t('updateRegionAgent')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"

      >
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Card    title={t('basicInfo')}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={t('agentId')}
                  name="agentId"
                  rules={[{ required: true, message: t('pleaseInputAgentId') }]}
                >
                  <Select
                    showSearch
                    placeholder={t('searchAgent')}
                    loading={managerLoading}
                    filterOption={false}
                    onSearch={debouncedManagerSearch}
                    onChange={handleManagerSelect}
                    optionLabelProp="label"
                    disabled
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
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={t('agentName')}
                  name="agentName"
                  rules={[{ required: true, message: t('pleaseInputAgentName') }]}
                >
                  <Input placeholder={t('pleaseInputAgentName')} disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={t('agentType')}
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
                    disabled
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
          </Card>

          <Card    title={t('regionInfo')}>
            <Row gutter={16}>
              <Col span={selectedCountry === 'CN' ? 8 : 12}>
                <Form.Item
                  name="countryCode"
                  label={<span><GlobalOutlined /> {t('country')}</span>}
                  rules={[{ required: true, message: t('pleaseSelectCountry') }]}
                >
                  <Select
                    showSearch

                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    optionLabelProp="label"
                    dropdownMatchSelectWidth={false}
                    dropdownStyle={{ width: '400px' }}
                    onChange={(value) => {
                      form.setFieldValue('city', undefined);
                      form.setFieldValue('province', undefined);
                      setCities([]);
                      setSelectedCountry(value);
                    }}
                    disabled
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
                    <Input disabled />
                  </Form.Item>
                </Col>
              )}
              <Col span={selectedCountry === 'CN' ? 8 : 12}>
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
                    notFoundContent={citySearchLoading ? <Spin    /> : null}
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
                  <Select placeholder={t('pleaseSelectAgentLevel')} disabled>
                    <Select.Option value={1}>{t('primaryAgent')}</Select.Option>
                    <Select.Option value={2}>{t('secondaryAgent')}</Select.Option>
                    <Select.Option value={3}>{t('tertiaryAgent')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="isExclusive"
                  label={t('isExclusive')}
                  rules={[{ required: true, message: t('pleaseSelectIsExclusive') }]}
                >
                  <Select placeholder={t('pleaseSelectIsExclusive')} disabled>
                    <Select.Option value={1}>{t('yes')}</Select.Option>
                    <Select.Option value={0}>{t('no')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card    title={t('contractInfo')}>
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
          </Card>

          <Card    title={t('authorizationTime')}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="代理授权开始时间"
                  name="startDate"
                  rules={[{ required: true, message: '请选择授权开始时间' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="授权开始时间"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="代理授权结束时间"
                  name="endDate"
                  rules={[{ required: true, message: '请选择授权结束时间' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime
                    placeholder="授权结束时间"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card    title={t('businessInfo')}>
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
                  label={t('settlementCurrency')}
                  name="currency"
                >
                  <Select placeholder={t('pleaseSelectSettlementCurrency')}>
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
              <Input.TextArea rows={4} placeholder="请输入备注信息" />
            </Form.Item>
          </Card>
        </Space>
      </Form>
    </Modal>
  );
};

export default UpdateRegionAgentsModal;
