import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Modal, Form, Input, Upload, message, DatePicker, Select, Row, Col, TimePicker, Spin, Button, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, GlobalOutlined, CalendarOutlined, FileOutlined, AppstoreOutlined, NumberOutlined } from '@ant-design/icons';
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
      const formData = {
        ...selectedMerchant,
        licenseExpiry: selectedMerchant.licenseExpiry ? dayjs(selectedMerchant.licenseExpiry) : undefined,
        workingHours: selectedMerchant.workStartTime && selectedMerchant.workEndTime ? [
          dayjs(selectedMerchant.workStartTime, 'HH:mm'),
          dayjs(selectedMerchant.workEndTime, 'HH:mm')
        ] : undefined,
        paymentMethods: Array.isArray(selectedMerchant.paymentMethods)
          ? selectedMerchant.paymentMethods
          : (selectedMerchant.paymentMethods?.split(',').filter(Boolean) || []),
        serviceTypes: Array.isArray(selectedMerchant.serviceTypes)
          ? selectedMerchant.serviceTypes
          : (selectedMerchant.serviceTypes?.split(',').filter(Boolean) || []),
        serviceAreas: Array.isArray(selectedMerchant.serviceAreas)
          ? selectedMerchant.serviceAreas
          : (selectedMerchant.serviceAreas?.split(',').filter(Boolean) || [])
      };

      form.setFieldsValue(formData);
      setLogoUrl(selectedMerchant.merchantLogo);
      setLicenseUrl(selectedMerchant.businessLicense);
      setSelectedCountry(selectedMerchant.countryCode);
      setMapType(selectedMerchant.countryCode === 'CN' ? 'amap' : 'google');
      setLocation({
        lat: selectedMerchant.latitude ? parseFloat(selectedMerchant.latitude) : null,
        lng: selectedMerchant.longitude ? parseFloat(selectedMerchant.longitude) : null
      });
    }
  }, [selectedMerchant, form]);

  // 初始化 COS 实例
  const initCOS = async () => {
    try {
      const response = await api.get(`/manage/tencent/cos-credential?bucketName=${bucketName}`);
      const { secretId, secretKey, sessionToken, expiredTime } = response;

      if (!secretId || !secretKey || !sessionToken) {
        throw new Error('获取临时密钥失败：密钥信息不完整');
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
    if (!timeString) return null;
    if (timeString === '24时营业') return null;
    if (Array.isArray(timeString)) return timeString;

    try {
      if (typeof timeString !== 'string') {
        console.warn('Invalid timeString format:', timeString);
        return null;
      }

      const [start, end] = timeString.split('-');
      if (!start || !end) {
        console.warn('Invalid time range format:', timeString);
        return null;
      }

      const startTime = dayjs(start.trim(), 'HH:mm');
      const endTime = dayjs(end.trim(), 'HH:mm');

      if (!startTime.isValid() || !endTime.isValid()) {
        console.warn('Invalid time values:', start, end);
        return null;
      }

      return [startTime, endTime];
    } catch (error) {
      console.error('解析时间范围失败:', error);
      return null;
    }
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
          <Button key="cancel" onClick={onCancel}   >
            {t('cancel')}
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={onCancel}

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
      workStartTime: values.workingHours?.[0]?.format('HH:mm:00') || null,
      workEndTime: values.workingHours?.[1]?.format('HH:mm:00') || null,
      workingHours: undefined,
      licenseExpiry: values.licenseExpiry ? values.licenseExpiry.format('YYYY-MM-DD') : null
    };
    handleUpdateMerchant(formData);
  };

  // 处理工作时间的转换
  const normalizeWorkingHours = (workingHours) => {
    if (!workingHours) return undefined;

    // 如果是字符串格式 "HH:mm-HH:mm"
    if (typeof workingHours === 'string' && workingHours.includes('-')) {
      const [start, end] = workingHours.split('-');
      return [
        dayjs(`2000-01-01 ${start.trim()}`),
        dayjs(`2000-01-01 ${end.trim()}`)
      ];
    }

    return undefined;
  };

  // 初始化表单数据
  useEffect(() => {
    if (selectedMerchant) {
      const formData = {
        ...selectedMerchant,
        licenseExpiry: selectedMerchant.licenseExpiry ? dayjs(selectedMerchant.licenseExpiry) : undefined,
        workingHours: selectedMerchant.workStartTime && selectedMerchant.workEndTime ? [
          dayjs(selectedMerchant.workStartTime, 'HH:mm'),
          dayjs(selectedMerchant.workEndTime, 'HH:mm')
        ] : undefined,
      };

      form.setFieldsValue(formData);
    }
  }, [selectedMerchant, form]);

  return (
    <Modal
      title={t('updateMerchant')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={1000}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
      >
        <Typography.Title level={5}>{t('basicInfo')}</Typography.Title>
        <Row gutter={24}>
          <Col span={20}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={t('merchantName')}
                  name="merchantName"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<ShopOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('contactPerson')}
                  name="contactPerson"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('contactPhone')}
                  name="contactPhone"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<PhoneOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('contactEmail')}
                  name="contactEmail"
                  rules={[{ required: true, type: 'email' }]}
                >
                  <Input prefix={<MailOutlined />} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Form.Item
              label={t('logo')}
              name="merchantLogo"
              rules={[{ required: true }]}
            >
              <Upload
                name="file"
                listType="picture-card"
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

        <Typography.Title level={5}>{t('addressInfo')}</Typography.Title>
        <Row gutter={24}>
          <Col span={4}>
            <Form.Item
              name="countryCode"
              label={<span><GlobalOutlined /> {t("country")}</span>}
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleCountryChange}
                dropdownMatchSelectWidth={false}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                optionLabelProp="customLabel"
              >
                {countries.map(country => (
                  <Select.Option
                    key={country.code}
                    value={country.code}
                    label={`${country.name} (${country.code})`}
                    customLabel={
                      <Space>
                        <img
                          src={country.flagImageUrl}
                          alt={country.name}
                          style={{
                            width: 16,
                            height: 12,
                            objectFit: 'cover',
                            display: 'block',
                            border: '1px solid #f0f0f0',
                            borderRadius: 0,
                            padding: 0,
                            overflow: 'hidden'
                          }}
                        />
                        {country.name}
                      </Space>
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <img
                          src={country.flagImageUrl}
                          alt={country.name}
                          style={{
                            width: 16,
                            height: 12,
                            objectFit: 'cover',
                            display: 'block',
                            border: '1px solid #f0f0f0',
                            borderRadius: 0,
                            padding: 0,
                            overflow: 'hidden'
                          }}
                        />
                        {country.name}
                        <Typography.Text type="secondary">
                          ({country.code})
                        </Typography.Text>
                      </Space>
                      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        {country.continent} · {country.capital} · {country.officialLanguages}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        {country.governmentType} · {country.timezone} · {country.currency}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        人口: {country.population?.toLocaleString()} ·
                        面积: {country.area?.toLocaleString()} km² ·
                        GDP: {country.gdp} B
                      </Typography.Text>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={<span><EnvironmentOutlined /> {t("city")}</span>}
              name="city"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                disabled={!form.getFieldValue('countryCode')}
                loading={citySearchLoading}
                onSearch={handleCitySearch}
                filterOption={false}
                dropdownMatchSelectWidth={false}
                options={cities.map(city => ({
                  value: city.name,
                  label: (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        {city.name}
                        <Typography.Text type="secondary">
                          ({city.enName})
                        </Typography.Text>
                      </Space>
                      <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        {city.type} · {city.region} · {city.code}
                      </Typography.Text>
                    </Space>
                  )
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={<span><EnvironmentOutlined /> {t('address')}</span>}
              name="address"
              rules={[{ required: true }]}
            >
              <Input prefix={<EnvironmentOutlined />} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<span><EnvironmentOutlined /> {t('location')}</span>}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item name="latitude" noStyle>
                  <Input prefix={t('lat')} />
                </Form.Item>
                <Form.Item name="longitude" noStyle>
                  <Input prefix={t('lng')} />
                </Form.Item>
                <Button
                  type="primary"
                  icon={<EnvironmentOutlined />}
                  onClick={handleOpenMap}
                >
                  {t('selectOnMap')}
                </Button>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        <Typography.Title level={5}>{t('businessInfo')}</Typography.Title>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label={<span><ClockCircleOutlined /> {t('workingHours')}</span>}
              name="workingHours"
              rules={[{ required: true, message: t('pleaseSelectWorkingHours') }]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                minuteStep={30}
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
                mode="multiple"
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
              label={<span><AppstoreOutlined /> {t('serviceTypes')}</span>}
              name="serviceTypes"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                options={serviceTypeOptions}
                optionLabelProp="label"
              />
            </Form.Item>
          </Col>
        </Row>

        <Typography.Title level={5}>{t('licenseInfo')}</Typography.Title>
        <Row gutter={24}>
          <Col span={20}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label={<span><CalendarOutlined /> {t('licenseExpiry')}</span>}
                  name="licenseExpiry"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<span><NumberOutlined /> {t('taxNumber')}</span>}
                  name="taxNumber"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label={<span><FileTextOutlined /> {t('remark')}</span>}
                  name="remark"
                >
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={4}>
            <Form.Item
              label={<span><FileOutlined /> {t('businessLicense')}</span>}
              name="businessLicense"
            >
              <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={(options) => customRequest({ ...options, fileType: 'license' })}
              >
                {licenseUrl ? (
                  <img src={licenseUrl} alt="license" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <MapPicker
        visible={mapVisible}
        mapType={mapType}
        onCancel={handleMapCancel}
        onSelect={handleMapSelect}
      />
    </Modal>
  );
};

export default UpdateRepairServiceMerchantsModal;
