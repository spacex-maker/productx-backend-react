import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Typography, Divider, Select, message, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';
import {
  CloudOutlined,
  KeyOutlined,
  GlobalOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

// 存储提供商枚举
const STORAGE_PROVIDERS = [
  { value: 'AWS', label: 'Amazon Web Services (AWS)' },
  { value: 'ALIYUN', label: '阿里云 (Aliyun)' },
  { value: 'GOOGLE', label: 'Google Cloud Platform (GCP)' },
  { value: 'AZURE', label: 'Microsoft Azure' },
  { value: 'TENCENT', label: '腾讯云 (Tencent Cloud)' },
  { value: 'HUAWEI', label: '华为云 (Huawei Cloud)' },
  { value: 'BAIDU', label: '百度云 (Baidu Cloud)' },
  { value: 'MINIO', label: 'MinIO' },
  { value: 'CUSTOM', label: '自定义 (Custom)' }
];

// 添加存储类型枚举
const STORAGE_TYPES = {
  AWS: [
    { value: 'S3_STANDARD', label: 'Standard' },
    { value: 'S3_INTELLIGENT_TIERING', label: 'Intelligent-Tiering' },
    { value: 'S3_STANDARD_IA', label: 'Standard-IA' },
    { value: 'S3_ONE_ZONE_IA', label: 'One Zone-IA' },
    { value: 'S3_GLACIER', label: 'Glacier' },
    { value: 'S3_GLACIER_DEEP_ARCHIVE', label: 'Glacier Deep Archive' }
  ],
  ALIYUN: [
    { value: 'OSS_STANDARD', label: '标准存储' },
    { value: 'OSS_IA', label: '低频访问' },
    { value: 'OSS_ARCHIVE', label: '归档存储' },
    { value: 'OSS_COLD_ARCHIVE', label: '冷归档存储' }
  ],
  GOOGLE: [
    { value: 'GCS_STANDARD', label: 'Standard' },
    { value: 'GCS_NEARLINE', label: 'Nearline' },
    { value: 'GCS_COLDLINE', label: 'Coldline' },
    { value: 'GCS_ARCHIVE', label: 'Archive' }
  ],
  AZURE: [
    { value: 'BLOB_HOT', label: 'Hot' },
    { value: 'BLOB_COOL', label: 'Cool' },
    { value: 'BLOB_ARCHIVE', label: 'Archive' }
  ],
  TENCENT: [
    { value: 'COS_STANDARD', label: '标准存储' },
    { value: 'COS_STANDARD_IA', label: '低频存储' },
    { value: 'COS_ARCHIVE', label: '归档存储' },
    { value: 'COS_DEEP_ARCHIVE', label: '深度归档存储' }
  ],
  HUAWEI: [
    { value: 'OBS_STANDARD', label: '标准存储' },
    { value: 'OBS_WARM', label: '低频访问存储' },
    { value: 'OBS_COLD', label: '归档存储' }
  ],
  BAIDU: [
    { value: 'BOS_STANDARD', label: '标准存储' },
    { value: 'BOS_IA', label: '低频存储' },
    { value: 'BOS_ARCHIVE', label: '归档存储' },
    { value: 'BOS_COLD', label: '冷归档存储' }
  ],
  MINIO: [
    { value: 'STANDARD', label: 'Standard' }
  ],
  CUSTOM: [
    { value: 'CUSTOM', label: '自定义' }
  ]
};

const ObjectStorageCreateModal = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  const { t } = useTranslation();
  const [selectedProvider, setSelectedProvider] = React.useState(null);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取国家列表
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        message.error(t('failedToFetchCountries'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  // 处理提供商变化
  const handleProviderChange = (value) => {
    setSelectedProvider(value);
    form.setFieldValue('storageType', undefined); // 清空存储类型
  };

  // 获取当前提供商的存储类型选项
  const getStorageTypeOptions = () => {
    return selectedProvider ? STORAGE_TYPES[selectedProvider] || [] : [];
  };

  const styles = {
    formItem: {
      marginBottom: '8px'
    },
    icon: {
      fontSize: '12px',
      color: '#1890ff',
      marginRight: '4px'
    },
    select: {
      fontSize: '10px'
    },
    modalTitle: {
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center'
    },
    sectionTitle: {
      fontSize: '10px',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center'
    },
    input: {
      fontSize: '10px'
    },
    switch: {
      fontSize: '10px'
    }
  };

  return (
    <Modal
      title={
        <span style={styles.modalTitle}>
          <CloudOutlined style={styles.icon} />
          {t('createStorage')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      maskClosable={false}
      className="storage-create-modal"
    >
      <style>
        {`
          .storage-create-modal .ant-form-item-label > label {
            font-size: 10px !important;
            height: 20px !important;
          }
          .storage-create-modal .ant-input {
            font-size: 10px !important;
            padding: 4px 8px !important;
          }
          .storage-create-modal .ant-select-selector {
            font-size: 10px !important;
            height: 24px !important;
          }
          .storage-create-modal .ant-select-selection-item {
            line-height: 22px !important;
            font-size: 10px !important;
          }
          .storage-create-modal .ant-select-dropdown {
            font-size: 10px !important;
          }
          .storage-create-modal .ant-select-item {
            font-size: 10px !important;
            min-height: 24px !important;
            line-height: 22px !important;
            padding: 2px 8px !important;
          }
          .storage-create-modal .ant-form-item {
            margin-bottom: 8px !important;
          }
          .storage-create-modal .ant-input-password {
            font-size: 10px !important;
          }
          .storage-create-modal .ant-input-password input {
            font-size: 10px !important;
          }
          .storage-create-modal .ant-switch {
            font-size: 10px !important;
          }
          .storage-create-modal .ant-modal-body {
            padding: 12px !important;
          }
          .storage-create-modal .ant-divider {
            margin: 8px 0 !important;
          }
          .storage-create-modal .ant-form-item-explain {
            font-size: 10px !important;
            min-height: 16px !important;
          }
        `}
      </style>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Title level={5} style={styles.sectionTitle}>
          <DatabaseOutlined style={styles.icon} />
          {t('basicInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('storageProvider')}
              name="storageProvider"
              rules={[{ required: true, message: t('pleaseSelectStorageProvider') }]}
              style={styles.formItem}
            >
              <Select 
                placeholder={t('selectStorageProvider')}
                style={styles.select}
                onChange={handleProviderChange}
              >
                {STORAGE_PROVIDERS.map(provider => (
                  <Option key={provider.value} value={provider.value}>
                    {provider.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('storageType')}
              name="storageType"
              rules={[{ required: true, message: t('pleaseSelectStorageType') }]}
              style={styles.formItem}
            >
              <Select
                placeholder={t('selectStorageType')}
                style={styles.select}
                disabled={!selectedProvider}
              >
                {getStorageTypeOptions().map(type => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('country')}
          name="country"
          rules={[{ required: true, message: t('pleaseSelectCountry') }]}
          style={styles.formItem}
        >
          <Select
            showSearch
            loading={loading}
            placeholder={t('selectCountry')}
            style={styles.select}
            dropdownMatchSelectWidth={false}
            optionLabelProp="label"
            filterOption={(input, option) => {
              const searchText = [
                option?.name,
                option?.code,
                option?.continent,
                option?.capital,
                option?.officialLanguages
              ].join('').toLowerCase();
              return searchText.includes(input.toLowerCase());
            }}
          >
            {(countries || []).map(country => (
              <Select.Option 
                key={country.code} 
                value={country.code}
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <img 
                      src={country.flagImageUrl} 
                      alt={country.name}
                      style={{ 
                        width: '16px', 
                        height: '12px',
                        objectFit: 'cover',
                        borderRadius: '2px'
                      }} 
                    />
                    {country.name} ({country.code})
                  </div>
                }
                name={country.name}
                {...country}
              >
                <div style={{ 
                  fontSize: '10px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  <img 
                    src={country.flagImageUrl} 
                    alt={country.name}
                    style={{ 
                      width: '24px', 
                      height: '18px',
                      objectFit: 'cover',
                      borderRadius: '2px',
                      alignSelf: 'center'
                    }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {country.name} ({country.code})
                    </div>
                    <div style={{ color: '#666' }}>
                      {country.continent} | {country.capital} | {country.officialLanguages}
                    </div>
                    <div style={{ color: '#888' }}>
                      {t('population')}: {country.population?.toLocaleString()} | 
                      {t('timezone')}: {country.timezone} | 
                      {t('currency')}: {country.currency}
                    </div>
                  </div>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Title level={5} style={styles.sectionTitle}>
          <KeyOutlined style={styles.icon} />
          {t('credentials')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('accessKey')}
          name="accessKey"
          rules={[{ required: true, message: t('pleaseEnterAccessKey') }]}
          style={styles.formItem}
        >
          <Input style={styles.input} placeholder={t('enterAccessKey')} />
        </Form.Item>

        <Form.Item
          label={t('secretKey')}
          name="secretKey"
          rules={[{ required: true, message: t('pleaseEnterSecretKey') }]}
          style={styles.formItem}
        >
          <Input.Password style={styles.input} placeholder={t('enterSecretKey')} />
        </Form.Item>

        <Form.Item
          label={t('aesKey')}
          name="aesKey"
          tooltip={t('aesKeyTooltip')}
          rules={[{ required: true, message: t('pleaseEnterAesKey') }]}
          style={styles.formItem}
        >
          <Input.Password style={styles.input} placeholder={t('enterAesKey')} />
        </Form.Item>

        <Title level={5} style={styles.sectionTitle}>
          <GlobalOutlined style={styles.icon} />
          {t('configuration')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('region')}
              name="region"
              rules={[{ required: true, message: t('pleaseEnterRegion') }]}
              style={styles.formItem}
            >
              <Input style={styles.input} placeholder={t('enterRegion')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('bucketName')}
              name="bucketName"
              rules={[{ required: true, message: t('pleaseEnterBucketName') }]}
              style={styles.formItem}
            >
              <Input style={styles.input} placeholder={t('enterBucketName')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('endpoint')}
              name="endpoint"
              rules={[{ required: true, message: t('pleaseEnterEndpoint') }]}
              style={styles.formItem}
            >
              <Input style={styles.input} placeholder={t('enterEndpoint')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('accountName')}
              name="accountName"
              rules={[{ required: true, message: t('pleaseEnterAccountName') }]}
              style={styles.formItem}
            >
              <Input style={styles.input} placeholder={t('enterAccountName')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('description')}
          name="description"
          style={styles.formItem}
        >
          <Input.TextArea style={styles.input} placeholder={t('enterDescription')} />
        </Form.Item>

        <Form.Item
          label={t('tags')}
          name="tags"
          style={styles.formItem}
        >
          <Input style={styles.input} placeholder={t('enterTags')} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="isActive"
              label={t('isActive')}
              style={styles.formItem}
            >
              <Switch 
                style={styles.switch}
                checkedChildren={t('yes')} 
                unCheckedChildren={t('no')} 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="isDefault"
              label={t('isDefault')}
              style={styles.formItem}
            >
              <Switch 
                style={styles.switch}
                checkedChildren={t('yes')} 
                unCheckedChildren={t('no')} 
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ObjectStorageCreateModal; 