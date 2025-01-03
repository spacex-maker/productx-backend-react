import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Modal, Form, Input, Upload, message, DatePicker, Select, Row, Col, TimePicker, Spin, Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, GlobalOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import COS from 'cos-js-sdk-v5';
import { 
  MobileOutlined,
  LaptopOutlined,
  ToolOutlined,
  TableOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  CarOutlined,
  QuestionOutlined,
  ShopOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker: TimeRangePicker } = TimePicker;

const GOOGLE_MAPS_API_KEY = 'AIzaSyCedr_Evbf2ga-gThS0v3xbd8gIyd1roAg';
const GOOGLE_MAPS_SIGNING_SECRET = '92ry4EvnHZK9cnZfUb8Ps-stb8s=';

const getSignedUrl = async (url) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(url);
    const key = encoder.encode(GOOGLE_MAPS_SIGNING_SECRET);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      data
    );

    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
    
    return `${url}&signature=${encodeURIComponent(base64Signature)}`;
  } catch (error) {
    console.error('URL signing error:', error);
    return url;
  }
};

const UpdateRepairServiceMerchantsModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateMerchant,
  selectedMerchant
}) => {
  const { t, i18n } = useTranslation();
  const [logoUrl, setLogoUrl] = useState('');
  const [licenseUrl, setLicenseUrl] = useState('');
  const [cosInstance, setCosInstance] = useState(null);
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [mapType, setMapType] = useState(null);

  // 初始化数据
  useEffect(() => {
    if (selectedMerchant) {
      form.setFieldsValue({
        ...selectedMerchant,
        licenseExpiry: selectedMerchant.licenseExpiry ? dayjs(selectedMerchant.licenseExpiry) : null,
        paymentMethods: Array.isArray(selectedMerchant.paymentMethods) 
          ? selectedMerchant.paymentMethods 
          : (selectedMerchant.paymentMethods?.split(',').filter(Boolean) || []),
        serviceAreas: selectedMerchant.serviceAreas?.split(',').filter(Boolean) || [t('wholeCity')]
      });
      setLogoUrl(selectedMerchant.merchantLogo);
      setLicenseUrl(selectedMerchant.businessLicense);
      setSelectedCountry(selectedMerchant.countryCode);
      setMapType(selectedMerchant.countryCode === 'CN' ? 'amap' : 'google');
      setLocation({
        lat: selectedMerchant.latitude ? parseFloat(selectedMerchant.latitude) : null,
        lng: selectedMerchant.longitude ? parseFloat(selectedMerchant.longitude) : null
      });
    }
  }, [selectedMerchant, form, t]);

  // 初始化 COS 实例
  const initCOS = async () => {
    try {
      const response = await api.get(`/manage/tencent/cos-credential?bucketName=${bucketName}`);
      const { secretId, secretKey, sessionToken, expiredTime } = response;

      if (!secretId || !secretKey || !sessionToken) {
        throw new Error('获取临时密钥��败：密钥信息不完整');
      }

      const cos = new COS({
        getAuthorization: function (options, callback) {
          callback({
            TmpSecretId: secretId,
            TmpSecretKey: secretKey,
            SecurityToken: sessionToken,
            ExpiredTime: expiredTime || Math.floor(Date.now() / 1000) + 1800,
          });
        },
        Region: region,
      });

      setCosInstance(cos);
      return cos;
    } catch (error) {
      console.error('初始化 COS 失败:', error);
      message.error('初始化 COS 失败：' + error.message);
      return null;
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
      return false;
    }
    return true;
  };

  const customRequest = useCallback(async ({ file, onSuccess, onError, onProgress, fileType }) => {
    try {
      let instance = cosInstance;
      if (!instance) {
        instance = await initCOS();
        if (!instance) {
          throw new Error('COS 实例未初始化');
        }
      }

      const folder = fileType === 'license' ? 'licenses' : 'logos';
      const key = `${folder}/${Date.now()}-${file.name}`;
      
      await instance.uploadFile({
        Bucket: bucketName,
        Region: region,
        Key: key,
        Body: file,
        onProgress: (progressData) => {
          onProgress({ percent: Math.round(progressData.percent * 100) });
        }
      });

      const url = `https://${bucketName}.cos.${region}.myqcloud.com/${key}`;
      
      if (fileType === 'license') {
        setLicenseUrl(url);
        form.setFieldsValue({ businessLicense: url });
      } else {
        setLogoUrl(url);
        form.setFieldsValue({ merchantLogo: url });
      }
      
      onSuccess();
    } catch (error) {
      console.error('上传失败:', error);
      message.error('上传失败：' + error.message);
      onError(error);
    }
  }, [cosInstance, bucketName, region, form]);

  const uploadButton = (
    <div style={{ fontSize: '10px' }}>
      <PlusOutlined />
    </div>
  );

  // 服务类型选项
  const serviceTypeOptions = useMemo(() => [
    { value: 'mobileRepair', label: t('mobileRepair'), icon: <MobileOutlined /> },
    { value: 'computerRepair', label: t('computerRepair'), icon: <LaptopOutlined /> },
    { value: 'applianceRepair', label: t('applianceRepair'), icon: <ToolOutlined /> },
    { value: 'furnitureRepair', label: t('furnitureRepair'), icon: <TableOutlined /> },
    { value: 'plumbing', label: t('plumbing'), icon: <ExperimentOutlined /> },
    { value: 'electricalRepair', label: t('electricalRepair'), icon: <ThunderboltOutlined /> },
    { value: 'carRepair', label: t('carRepair'), icon: <CarOutlined /> },
    { value: 'other', label: t('other'), icon: <QuestionOutlined /> }
  ], [t]);

  const parseTimeRange = (timeString) => {
    if (!timeString || timeString === '24时营业') return null;
    const [start, end] = timeString.split('-');
    return [dayjs(start, 'HH:mm'), dayjs(end, 'HH:mm')];
  };

  // 获取国家列表
  const fetchCountries = async () => {
    try {
      const response = await api.get('/manage/countries/list-all-enable');
      if (response) {
        setCountries(response);
      }
    } catch (error) {
      console.error('获取国家列表失败:', error);
      message.error(t('fetchCountriesFailed'));
    }
  };

  // 城市搜索
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
      message.error(t('searchCityFailed'));
    } finally {
      setCitySearchLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // 获取当前位置
  const getCurrentLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code) {
        form.setFieldValue('countryCode', data.country_code);
        setSelectedCountry(data.country_code);
        setMapType(data.country_code === 'CN' ? 'amap' : 'google');
        
        if (data.city) {
          form.setFieldValue('city', data.city);
        }
        
        if (data.region) {
          form.setFieldValue('province', data.region);
        }
        
        setLocation({
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        });
      }
    } catch (error) {
      console.error('获取当前位置失败:', error);
      message.error(t('getCurrentLocationFailed'));
    }
  };

  useEffect(() => {
    if (!selectedMerchant) {
      getCurrentLocation();
    }
  }, [selectedMerchant]);

  // 地图选择器组件
  const MapPicker = ({ visible, onCancel, onSelect, mapType }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!visible || mapInstanceRef.current) return;
      setLoading(true);

      const initMap = async () => {
        try {
          if (mapType === 'google') {
            if (!window.google?.maps) {
              await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=${i18n.language}`;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
              });
            }

            const mapContainer = mapContainerRef.current;
            if (!mapContainer) return;

            const address = form.getFieldValue('address');
            const city = form.getFieldValue('city');
            const province = form.getFieldValue('province');
            const country = countries.find(c => c.code === form.getFieldValue('countryCode'))?.name;
            
            const fullAddress = [address, city, province, country].filter(Boolean).join(', ');

            const defaultCenter = { 
              lat: location?.lat || 22.396428, 
              lng: location?.lng || 114.109497 
            };

            const map = new window.google.maps.Map(mapContainer, {
              center: defaultCenter,
              zoom: 13,
              mapTypeControl: false,
              zoomControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              language: i18n.language
            });

            mapInstanceRef.current = map;

            const marker = new window.google.maps.Marker({
              map,
              position: defaultCenter,
              draggable: true,
              animation: window.google.maps.Animation.DROP
            });

            markerRef.current = marker;

            marker.addListener('dragend', () => {
              const position = marker.getPosition();
              const lat = position.lat();
              const lng = position.lng();
              
              onSelect({
                lat,
                lng,
                address: ''
              });
            });

            map.addListener('click', (e) => {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              marker.setPosition(e.latLng);
              
              onSelect({
                lat,
                lng,
                address: ''
              });
            });

            if (fullAddress) {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ address: fullAddress }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  const location = results[0].geometry.location;
                  
                  map.setCenter(location);
                  map.setZoom(17);
                  marker.setPosition(location);

                  onSelect({
                    lat: location.lat(),
                    lng: location.lng(),
                    address: results[0].formatted_address
                  });
                }
              });
            }
          }
        } catch (error) {
          console.error('Map initialization error:', error);
          message.error(t('mapInitError'));
        } finally {
          setLoading(false);
        }
      };

      initMap();
    }, [visible]);

    return (
      <Modal
        title={t('selectLocation')}
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel} size="small">
            {t('cancel')}
          </Button>,
          <Button 
            key="confirm" 
            type="primary" 
            onClick={onCancel}
            size="small"
          >
            {t('confirm')}
          </Button>
        ]}
        width={800}
        destroyOnClose={true}
      >
        <Spin spinning={loading} tip={t('loadingMap')}>
          <div 
            ref={mapContainerRef}
            style={{ height: '500px', width: '100%' }}
          />
        </Spin>
      </Modal>
    );
  };

  const handleCountryChange = (value) => {
    form.setFieldValue('city', undefined);
    form.setFieldValue('province', undefined);
    setCities([]);
    setSelectedCountry(value);
    setMapType(value === 'CN' ? 'amap' : 'google');
  };

  useEffect(() => {
    if (mapType === 'google' && !window.google?.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        console.log('Google Maps API loaded successfully');
      };
      
      script.onerror = (error) => {
        console.error('Google Maps API loading failed:', error);
        message.error(t('mapLoadError'));
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
        delete window.initMap;
      };
    }
  }, [mapType]);

  const handleOpenMap = useCallback(() => {
    if (!form.getFieldValue('countryCode')) {
      message.warning(t('pleaseSelectCountryFirst'));
      return;
    }
    if (!form.getFieldValue('address')) {
      message.warning(t('pleaseEnterAddressFirst'));
      return;
    }
    setMapVisible(true);
  }, [form, t]);

  const handleMapCancel = useCallback(() => {
    setMapVisible(false);
  }, []);

  const handleMapSelect = useCallback((loc) => {
    form.setFieldsValue({
      latitude: loc.lat.toFixed(6),
      longitude: loc.lng.toFixed(6)
    });
  }, [form]);

  // 处理表单提交
  const handleFinish = (values) => {
    const formData = {
      ...values,
      id: selectedMerchant.id,
      merchantLogo: logoUrl,
      serviceTypes: values.serviceTypes,
      paymentMethods: values.paymentMethods || [],
      serviceAreas: values.serviceAreas?.join(','),
      licenseExpiry: values.licenseExpiry?.format('YYYY-MM-DD')
    };
    handleUpdateMerchant(formData);
  };

  return (
    <Modal
      title={t('updateMerchant')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={480}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <div className="form-section">
          <div className="section-title">{t('basicInfo')}</div>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <Form.Item
                label={<span><ShopOutlined /> {t('merchantName')}</span>}
                name="merchantName"
                rules={[{ required: true }]}
              >
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('logo')}
                name="merchantLogo"
                rules={[{ required: true }]}
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.file?.response?.url || logoUrl;
                }}
              >
                <Upload
                  name="file"
                  listType="picture-card"
                  className="avatar-uploader-small"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={(options) => customRequest({ ...options, fileType: 'logo' })}
                >
                  {logoUrl ? (
                    <img src={logoUrl} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('contactInfo')}</div>
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                label={<span><UserOutlined /> {t('contactPerson')}</span>}
                name="contactPerson"
                rules={[{ required: true }]}
              >
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span><PhoneOutlined /> {t('contactPhone')}</span>}
                name="contactPhone"
                rules={[{ required: true }]}
              >
                <Input size="small" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<span><MailOutlined /> {t('contactEmail')}</span>}
                name="contactEmail"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('addressInfo')}</div>
          <Row gutter={[16, 0]}>
            <Col span={selectedCountry === 'CN' ? 8 : 12}>
              <Form.Item
                name="countryCode"
                label={<span><GlobalOutlined /> {t("country")}</span>}
                rules={[{ required: true, message: t("selectCountry") }]}
              >
                <Select
                  showSearch
                  size="small"
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
                          alt={`${country.name} flag`} 
                          style={{ width: '20px', height: '15px', marginRight: '8px' }}
                        />
                        <div>
                          {country.name} ({country.code})
                        </div>
                        <div style={{ color: '#666', marginTop: '2px' }}>
                          {country.capital} | {country.officialLanguages} | {country.currency} | {country.continent}
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
                  rules={[{ required: true, message: t('enterProvince') }]}
                >
                  <Input size="small" />
                </Form.Item>
              </Col>
            )}
            <Col span={selectedCountry === 'CN' ? 8 : 12}>
              <Form.Item
                label={<span><EnvironmentOutlined /> {t("city")}</span>}
                name="city"
                rules={[{ required: true, message: t("enterCity") }]}
              >
                <Select
                  showSearch
                  size="small"
                  disabled={!form.getFieldValue('countryCode')}
                  loading={citySearchLoading}
                  onSearch={handleCitySearch}
                  filterOption={false}
                  notFoundContent={citySearchLoading ? <Spin size="small" /> : null}
                  optionLabelProp="label"
                  dropdownMatchSelectWidth={false}
                  dropdownStyle={{ width: '300px' }}
                >
                  {cities.map(city => (
                    <Select.Option 
                      key={city.code} 
                      value={city.name}
                      label={`${city.name} (${city.enName})`}
                    >
                      <div style={{ fontSize: '10px', padding: '2px 0' }}>
                        <div>{city.name}</div>
                        <div style={{ color: '#666', marginTop: '2px' }}>
                          {city.enName} | {city.type} | 人口: {(city.population/10000).toFixed(0)}万
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={<span><EnvironmentOutlined /> {t('address')}</span>}
                name="address"
                rules={[{ required: true }]}
              >
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('locationAndOthers')}</div>
          <Row gutter={[16, 0]}>
            <Col span={24}>
              <Form.Item label={t('location')}>
                <Space.Compact style={{ width: '100%' }}>
                  <Form.Item
                    name="latitude"
                    noStyle
                  >
                    <Input 
                      style={{ width: '30%' }} 
                      size="small" 
                      prefix={t('lat')} 
                      readOnly 
                    />
                  </Form.Item>
                  <Form.Item
                    name="longitude"
                    noStyle
                  >
                    <Input 
                      style={{ width: '30%' }} 
                      size="small" 
                      prefix={t('lng')} 
                      readOnly 
                    />
                  </Form.Item>
                  <Button 
                    size="small" 
                    type="primary" 
                    icon={<EnvironmentOutlined />}
                    onClick={handleOpenMap}
                    style={{ width: '40%' }}
                  >
                    {t('selectOnMap')}
                  </Button>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('serviceAreas')}
                name="serviceAreas"
                initialValue={[t('wholeCity')]}
              >
                <Select
                  size="small"
                  mode="tags"
                  dropdownStyle={{ display: 'none' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span><GlobalOutlined /> {t('websiteUrl')}</span>}
                name="websiteUrl"
              >
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('businessInfo')}</div>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                label={<span><ClockCircleOutlined /> {t('workingHours')}</span>}
                name="workingHours"
                rules={[{ required: true }]}
                initialValue="00:00-24:00"
                getValueFromEvent={(times) => {
                  if (Array.isArray(times) && times[0] && times[1]) {
                    return `${dayjs(times[0]).format('HH:mm')}-${dayjs(times[1]).format('HH:mm')}`;
                  }
                  return undefined;
                }}
                getValueProps={(value) => {
                  if (typeof value === 'string' && value) {
                    const [start, end] = value.split('-');
                    return {
                      value: [dayjs(`2000-01-01 ${start}`), dayjs(`2000-01-01 ${end}`)]
                    };
                  }
                  return { value: undefined };
                }}
              >
                <TimeRangePicker
                  size="small"
                  format="HH:mm"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span><WalletOutlined /> {t('paymentMethods')}</span>}
                name="paymentMethods"
              >
                <Select
                  size="small"
                  mode="multiple"
                  dropdownMatchSelectWidth={false}
                  options={[
                    { value: '支付宝', label: '支付宝' },
                    { value: '微信', label: '微信' },
                    { value: '现金', label: '现金' }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('serviceTypes')}
                name="serviceTypes"
                rules={[{ required: true, message: t('pleaseSelectServiceTypes') }]}
                initialValue={['other']}
              >
                <Select
                  size="small"
                  mode="multiple"
                  options={serviceTypeOptions}
                  optionLabelProp="label"
                  optionRender={(option) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {option.data.icon}
                      <span>{option.data.label}</span>
                    </div>
                  )}
                  maxTagCount={2}
                  maxTagTextLength={10}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('licenseInfo')}</div>
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                label={t('businessLicense')}
                name="businessLicense"
              >
                <Upload
                  name="file"
                  listType="picture-card"
                  className="license-uploader-small"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={(options) => customRequest({ ...options, fileType: 'license' })}
                >
                  {licenseUrl ? (
                    <img 
                      src={licenseUrl} 
                      alt="license" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ fontSize: '10px' }}>
                      <PlusOutlined />
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('licenseExpiry')}
                name="licenseExpiry"
              >
                <DatePicker size="small" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('taxNumber')}
                name="taxNumber"
              >
                <Input size="small" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('remarks')}</div>
          <Form.Item
            label={<span><FileTextOutlined /> {t('remark')}</span>}
            name="remark"
          >
            <Input.TextArea size="small" rows={2} />
          </Form.Item>
        </div>
      </Form>

      <MapPicker 
        visible={mapVisible}
        mapType={mapType}
        onCancel={handleMapCancel}
        onSelect={handleMapSelect}
      />

      <style jsx global>{`
        .form-section {
          margin-bottom: 4px;
        }
        .section-title {
          font-size: 10px;
          margin-bottom: 2px;
          color: #666;
        }
        .ant-form-item {
          margin-bottom: 2px;
        }
        .ant-form-item-label {
          padding-bottom: 1px;
        }
        .ant-form-item-label > label {
          font-size: 10px !important;
          height: 12px;
          line-height: 12px;
        }
        .ant-input {
          height: 22px !important;
          font-size: 10px !important;
          padding: 0 4px !important;
        }
        .avatar-uploader-small .ant-upload {
          width: 40px !important;
          height: 40px !important;
          border-radius: 4px !important;
        }
        .ant-row {
          margin-bottom: 0 !important;
        }
        [class*='ant-col'] {
          padding-bottom: 0 !important;
        }
        .ant-form-item-explain-error {
          font-size: 10px;
          margin-top: 1px;
        }
        .ant-modal-header {
          padding: 8px 12px;
        }
        .ant-modal-body {
          padding: 12px;
        }
        .ant-modal-footer {
          padding: 6px 12px;
        }
        .ant-modal-footer .ant-btn {
          font-size: 10px;
          height: 22px;
          padding: 0 8px;
        }
        .ant-modal-title {
          font-size: 11px;
        }
        .ant-row {
          margin-bottom: 0 !important;
        }
        [class*='ant-col'] {
          padding-bottom: 0 !important;
        }
        .ant-form-item-label > label {
          font-size: 10px !important;
          height: 12px;
          line-height: 12px;
        }
        .ant-form .ant-form-item .ant-form-item-label > label,
        .ant-select-dropdown .ant-select-item {
          font-size: 10px !important;
        }
        .ant-form-item-required::before {
          font-size: 10px !important;
        }
        .license-uploader-small .ant-upload {
          width: 40px !important;
          height: 40px !important;
          border-radius: 4px !important;
        }
        .ant-picker {
          height: 22px !important;
        }
        .ant-picker-input > input {
          font-size: 10px !important;
        }
        .form-section .ant-row {
          align-items: flex-start !important;
        }
        .ant-input, 
        .ant-picker-input > input,
        .ant-select-selection-item {
          font-size: 10px !important;
        }
        .ant-picker-dropdown {
          font-size: 10px !important;
        }
        
        .ant-picker-time-panel-column {
          width: 50px !important;
        }
        
        .ant-picker-time-panel-column > li {
          padding: 0 0 !important;
          height: 20px !important;
          line-height: 20px !important;
        }
        
        .ant-select-dropdown {
          font-size: 10px !important;
        }
        
        .ant-picker {
          height: 22px !important;
        }
        
        .ant-picker input {
          font-size: 10px !important;
        }
        
        .ant-select-selector, 
        :where(.css-dev-only-do-not-override-1x0dypw).ant-select .ant-select-selector, 
        :where(.css-*).ant-select .ant-select-selector {
          color: #000000 !important;
        }

        .ant-modal-wrap .ant-select-selector, 
        .ant-modal-wrap :where(.css-dev-only-do-not-override-1x0dypw).ant-select .ant-select-selector, 
        .ant-modal-wrap :where(.css-*).ant-select .ant-select-selector {
          color: #000000 !important;
        }

        .ant-select.custom-class .ant-select-selector {
          color: #000000 !important;
          font-size: 10px !important;
        }

        .ant-picker {
          height: 22px !important;
        }
        
        .ant-picker input {
          font-size: 10px !important;
          height: 22px !important;
          color: #000000 !important;
        }
        
        .ant-picker-dropdown {
          font-size: 10px !important;
        }
        
        .ant-picker-time-panel-column {
          width: 50px !important;
        }
        
        .ant-picker-time-panel-column > li {
          padding: 0 0 !important;
          height: 20px !important;
          line-height: 20px !important;
        }
        
        .ant-picker-input > input,
        .ant-picker-input > input:hover {
          color: #000000 !important;
        }

        .ant-select-item-option-content {
          font-size: 10px !important;
        }

        .ant-select-item {
          padding: 4px 8px !important;
        }

        .ant-select-dropdown {
          font-size: 10px !important;
        }

        .ant-select-item-option-content > div {
          white-space: normal;
          line-height: 1.2;
        }

        .ant-select-item-option-content div {
          width: 100%;
        }
      `}</style>
    </Modal>
  );
};

export default UpdateRepairServiceMerchantsModal; 