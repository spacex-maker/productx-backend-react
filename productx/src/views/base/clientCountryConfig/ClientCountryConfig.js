import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CButton,
  CListGroup,
  CListGroupItem,
  CSpinner
} from '@coreui/react';
import { Form, Switch, message, Select } from 'antd'; // 添加 Select
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next';

// 添加组件级样式
const styles = {
  countryList: {
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto'
  },
  countryItem: {
    cursor: 'pointer',
    padding: '10px 15px',
    borderBottom: '1px solid var(--cui-border-color)'
  },
  countryContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  flagContainer: {
    width: 40,
    height: 30,
    borderRadius: '2px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--cui-border-color)',
    backgroundColor: 'var(--cui-body-bg)',
    flexShrink: 0
  },
  flagImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  countryName: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  formLabel: {
    color: 'var(--cui-body-color)'
  },
};

// 配置表单组件
const CountryConfigForm = ({ countryConfig, selectedCountry, isLoading, form }) => {
  const { t } = useTranslation();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [timezones, setTimezones] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    if (countryConfig) {
      form.setFieldsValue(countryConfig);
    } else {
      form.resetFields();
    }
  }, [countryConfig, form]);

  useEffect(() => {
    if (selectedCountry?.code) {
      // 根据国家代码获取时区
      try {
        const countryTimezones = moment.tz.zonesForCountry(selectedCountry.code, true);
        if (countryTimezones && countryTimezones.length > 0) {
          setTimezones(countryTimezones.map(tz => ({
            value: tz.name,
            label: `${tz.name} (${moment.tz(tz.name).format('UTC/GMT Z')})`
          })));
        } else {
          setTimezones([]);
        }
      } catch (error) {
        console.warn('获取时区失败:', error);
        setTimezones([]);
      }
    }
  }, [selectedCountry]);

  // 获取系统支持的语言列表
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await api.get('/manage/sys-languages/enabled');
        if (response) {
          setLanguages(response.map(lang => ({
            value: lang.languageCode,
            label: `${lang.languageNameNative} (${lang.languageNameEn})`,
            nameEn: lang.languageNameEn.toLowerCase(),
            nameNative: lang.languageNameNative
          })));
        }
      } catch (error) {
        console.error('获取语言列表失败:', error);
        message.error(t('getFailed'));
      }
    };
    fetchLanguages();
  }, [t]);

  // 获取系统支持的货币列表
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await api.get('/manage/sys-currencies/enabled');
        if (response) {
          setCurrencies(response.map(currency => ({
            value: currency.currencyCode,
            label: `${currency.currencyCode} - ${currency.currencyName} (${currency.symbol})`,
            symbol: currency.symbol,
            name: currency.currencyName,
            descriptionZh: currency.descriptionZh
          })));
        }
      } catch (error) {
        console.error('获取货币列表失败:', error);
        message.error(t('getFailed'));
      }
    };
    fetchCurrencies();
  }, [t]);

  // 根据国家自动选择货币
  useEffect(() => {
    if (selectedCountry?.code && currencies.length > 0 && !form.getFieldValue('currency')) {
      const countryCode = selectedCountry.code.toUpperCase();
      // 特殊国家货币映射
      const specialMappings = {
        'US': 'USD',
        'GB': 'GBP',
        'JP': 'JPY',
        'EU': 'EUR',
        'CN': 'CNY',
        'HK': 'HKD',
        'AU': 'AUD',
        'CA': 'CAD',
        // 可以添加更多映射
      };

      const suggestedCurrency = specialMappings[countryCode];
      if (suggestedCurrency) {
        const matchedCurrency = currencies.find(c => c.value === suggestedCurrency);
        if (matchedCurrency) {
          form.setFieldValue('currency', matchedCurrency.value);
        }
      }
    }
  }, [selectedCountry, currencies, form]);

  // 根据国家代码推荐语言
  useEffect(() => {
    if (selectedCountry?.code && languages.length > 0 && !form.getFieldValue('languageCode')) {
      // 语言匹配规则
      const countryCode = selectedCountry.code.toLowerCase();
      let matchedLanguage;

      // 1. 直接匹配国家代码
      matchedLanguage = languages.find(lang => 
        lang.value.toLowerCase() === countryCode
      );

      // 2. 匹配国家代码的前两位（例如 en-US -> en）
      if (!matchedLanguage) {
        matchedLanguage = languages.find(lang => 
          countryCode.startsWith(lang.value.toLowerCase())
        );
      }

      // 3. 特殊情况处理
      if (!matchedLanguage) {
        const specialMappings = {
          'us': 'en', // 美国 -> 英语
          'gb': 'en', // 英国 -> 英语
          'au': 'en', // 澳大利亚 -> 英语
          'ca': 'en', // 加拿大 -> 英语
          'nz': 'en', // 新西兰 -> 英语
          'in': 'en', // 印度 -> 英语
          'br': 'pt', // 巴西 -> 葡萄牙语
          'pt': 'pt', // 葡萄牙 -> 葡萄牙语
          'at': 'de', // 奥地利 -> 德语
          'ch': 'de', // 瑞士 -> 德语
          'de': 'de', // 德国 -> 德语
          'fr': 'fr', // 法国 -> 法语
          'be': 'fr', // 比利时 -> 法语
          'lu': 'fr', // 卢森堡 -> 法语
          'cn': 'zh', // 中国 -> 中文
          'tw': 'zh', // 台湾 -> 中文
          'hk': 'zh', // 香港 -> 中文
          'sg': 'zh', // 新加坡 -> 中文
          'jp': 'ja', // 日本 -> 日语
          'kr': 'ko', // 韩国 -> 韩语
          'ru': 'ru', // 俄罗斯 -> 俄语
          'es': 'es', // 西班牙 -> 西班牙语
          'mx': 'es', // 墨西哥 -> 西班牙语
          'ar': 'es', // 阿根廷 -> 西班牙语
          'cl': 'es', // 智利 -> 西班牙语
          'co': 'es', // 哥伦比亚 -> 西班牙语
          'pe': 'es', // 秘鲁 -> 西班牙语
          'it': 'it', // 意大利 -> 意大利语
          'gr': 'el', // 希腊 -> 希腊语
          'se': 'sv', // 瑞典 -> 瑞典语
          'no': 'no', // 挪威 -> 挪威语
          'dk': 'da', // 丹麦 -> 丹麦语
          'fi': 'fi', // 芬兰 -> 芬兰语
          'nl': 'nl', // 荷兰 -> 荷兰语
          'tr': 'tr', // 土耳其 -> 土耳其语
          'pl': 'pl', // 波兰 -> 波兰语
          'cz': 'cs', // 捷克 -> 捷克语
          'hu': 'hu', // 匈牙利 -> 匈牙利语
          'th': 'th', // 泰国 -> 泰语
          'vn': 'vi', // 越南 -> 越南语
          'id': 'id', // 印度尼西亚 -> 印尼语
          'my': 'ms', // 马来西亚 -> 马来语
          'sa': 'ar', // 沙特阿拉伯 -> 阿拉伯语
          'eg': 'ar', // 埃及 -> 阿拉伯语
          'ae': 'ar', // 阿联酋 -> 阿拉伯语
          'il': 'he', // 以色列 -> 希伯来语
          'ir': 'fa', // 伊朗 -> 波斯语
          // 可以根据需要继续添加更多国家和语言映射
        };
        
        
        const mappedLanguage = specialMappings[countryCode];
        if (mappedLanguage) {
          matchedLanguage = languages.find(lang => 
            lang.value.toLowerCase() === mappedLanguage
          );
        }
      }

      // 4. 默认使用英语
      if (!matchedLanguage) {
        matchedLanguage = languages.find(lang => 
          lang.value.toLowerCase() === 'en'
        );
      }

      if (matchedLanguage) {
        form.setFieldValue('languageCode', matchedLanguage.value);
      }
    }
  }, [selectedCountry, languages, form]);

  const onFinish = async (values) => {
    setSubmitLoading(true);
    try {
      await api.post('/manage/client-country-config/update', {
        ...values,
        id: countryConfig?.id,
        countryCode: selectedCountry.code
      });
      message.success(t('updateSuccess'));
    } catch (error) {
      console.error('更新配置失败:', error);
      message.error(t('updateFailed'));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <CCard>
      <CCardBody>
        {isLoading ? (
          <div className="text-center">
            <CSpinner color="primary" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <div className="d-flex align-items-center mb-4">
              <div style={styles.flagContainer} className="me-3">
                {selectedCountry.flagImageUrl && (
                  <img 
                    src={selectedCountry.flagImageUrl} 
                    alt={selectedCountry.name}
                    style={styles.flagImage}
                  />
                )}
              </div>
              <h2 style={styles.formLabel} className="mb-0">
                {selectedCountry.name} ({selectedCountry.code}) {t('clientConfig')}
              </h2>
            </div>

            <CRow>
              <CCol md={6}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('languageCode')}</span>}
                  name="languageCode"
                  rules={[{ required: true, message: t('pleaseInput') + t('languageCode') }]}
                >
                  <Select
                    showSearch
                    placeholder={t('pleaseInput') + t('languageCode')}
                    options={languages}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    style={styles.select}
                    dropdownStyle={{
                      backgroundColor: '#ffffff'
                    }}
                  />
                </Form.Item>
              </CCol>
              <CCol md={6}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('clientName')}</span>}
                  name="clientName"
                  rules={[{ required: true, message: t('pleaseInput') + t('clientName') }]}
                >
                  <CFormInput placeholder={t('pleaseInput') + t('clientName')} />
                </Form.Item>
              </CCol>
              <CCol md={6}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('currency')}</span>}
                  name="currency"
                >
                  <Select
                    showSearch
                    placeholder={t('pleaseInput') + t('currency')}
                    options={currencies}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    style={styles.select}
                    dropdownStyle={{
                      backgroundColor: '#ffffff'
                    }}
                  />
                </Form.Item>
              </CCol>
              <CCol md={6}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('timezone')}</span>}
                  name="timezone"
                >
                  <Select
                    showSearch
                    placeholder={t('pleaseInput') + t('timezone')}
                    options={timezones}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    style={styles.select}
                    dropdownStyle={{
                      backgroundColor: '#ffffff'
                    }}
                  />
                </Form.Item>
              </CCol>
              <CCol md={12}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('privacyPolicyUrl')}</span>}
                  name="privacyPolicyUrl"
                >
                  <CFormInput placeholder={t('pleaseInput') + t('privacyPolicyUrl')} />
                </Form.Item>
              </CCol>
              <CCol md={12}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('termsConditionsUrl')}</span>}
                  name="termsConditionsUrl"
                >
                  <CFormInput placeholder={t('pleaseInput') + t('termsConditionsUrl')} />
                </Form.Item>
              </CCol>
              <CCol md={6}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('supportEmail')}</span>}
                  name="supportEmail"
                >
                  <CFormInput placeholder={t('pleaseInput') + t('supportEmail')} />
                </Form.Item>
              </CCol>
              <CCol md={6}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('supportPhone')}</span>}
                  name="supportPhone"
                >
                  <CFormInput placeholder={t('pleaseInput') + t('supportPhone')} />
                </Form.Item>
              </CCol>
              <CCol md={6}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('appVersion')}</span>}
                  name="appVersion"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseInput') + t('appVersion')
                    },
                    {
                      pattern: /^\d+\.\d+\.\d+$/,
                      message: t('versionFormatError')
                    }
                  ]}
                  tooltip={t('versionFormatTip')}
                >
                  <CFormInput 
                    placeholder="1.0.0" 
                    maxLength={10}
                  />
                </Form.Item>
              </CCol>
              <CCol md={6}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('downloadUrl')}</span>}
                  name="downloadUrl"
                >
                  <CFormInput placeholder={t('pleaseInput') + t('downloadUrl')} />
                </Form.Item>
              </CCol>
              <CCol md={12}>
                <Form.Item
                  label={<span style={styles.formLabel}>{t('updateRequired')}</span>}
                  name="updateRequired"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </CCol>
            </CRow>

            <div className="d-flex justify-content-end mt-4">
              <CButton 
                color="primary" 
                type="submit"
                disabled={submitLoading}
              >
                {submitLoading ? (
                  <>
                    <CSpinner size="sm" className="me-2" />
                    {t('saving')}
                  </>
                ) : (
                  t('save')
                )}
              </CButton>
            </div>
          </Form>
        )}
      </CCardBody>
    </CCard>
  );
};

// 主页面组件
const ClientCountryConfig = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryConfig, setCountryConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/manage/countries/list-all-enable');
      if (response) {
        setCountries(response);
        // 默认选择第一个国家
        if (response.length > 0) {
          setSelectedCountry(response[0]);
          fetchCountryConfig(response[0].code);
        }
      }
    } catch (error) {
      console.error('获取国家列表失败:', error);
      message.error(t('getFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCountryConfig = async (countryCode) => {
    setConfigLoading(true);
    try {
      const response = await api.get(`/manage/client-country-config/country/${countryCode}`);
      setCountryConfig(response || null); // 如果响应为空，设置为 null
    } catch (error) {
      console.error('获取国家配置失败:', error);
      message.error(t('getFailed'));
      setCountryConfig(null); // 出错时设置为 null
    } finally {
      setConfigLoading(false);
    }
  };

  const handleCountrySelect = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    if (country && country.code !== selectedCountry?.code) {
      setSelectedCountry(country);
      fetchCountryConfig(countryCode);
    }
  };

  return (
    <CRow>
      <CCol md={3}>
        <CCard className="mb-4">
          <CCardBody>
            {isLoading ? (
              <div className="text-center">
                <CSpinner color="primary" />
              </div>
            ) : (
              <CListGroup style={styles.countryList}>
                {countries.map(country => (
                  <CListGroupItem
                    key={country.code}
                    onClick={() => handleCountrySelect(country.code)}
                    active={selectedCountry?.code === country.code}
                    style={styles.countryItem}
                  >
                    <div style={styles.countryContent}>
                      <div style={styles.flagContainer}>
                        {country.flagImageUrl ? (
                          <img 
                            src={country.flagImageUrl} 
                            alt={country.name}
                            style={styles.flagImage}
                          />
                        ) : (
                          <span>{country.code}</span>
                        )}
                      </div>
                      <span style={styles.countryName}>
                        {country.name} ({country.code})
                      </span>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={9}>
        {selectedCountry && (
          <CountryConfigForm 
            countryConfig={countryConfig}
            selectedCountry={selectedCountry}
            isLoading={configLoading}
            form={form}
          />
        )}
      </CCol>
    </CRow>
  );
};

export default ClientCountryConfig;
