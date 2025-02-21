import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Switch, Typography, Divider, Select, message, Row, Col, Space } from 'antd';
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
    icon: {
      color: '#1890ff',
      marginRight: '8px'
    },
    modalTitle: {
      display: 'flex',
      alignItems: 'center'
    },
    sectionTitle: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    divider: {
      margin: '16px 0'
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
      width={800}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={onFinish} 
        layout="vertical"
      >
        <Title level={5} style={styles.sectionTitle}>
          <DatabaseOutlined style={styles.icon} />
          {t('basicInfo')}
        </Title>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t('storageProvider')}
              name="storageProvider"
              rules={[{ required: true, message: t('pleaseSelectStorageProvider') }]}
            >
              <Select 
                placeholder={t('selectStorageProvider')}
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
          <Col span={8}>
            <Form.Item
              label={t('storageType')}
              name="storageType"
              rules={[{ required: true, message: t('pleaseSelectStorageType') }]}
            >
              <Select
                placeholder={t('selectStorageType')}
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
          <Col span={8}>
            <Form.Item
              label={t('country')}
              name="country"
              rules={[{ required: true, message: t('pleaseSelectCountry') }]}
            >
              <Select
                showSearch
                loading={loading}
                placeholder={t('selectCountry')}
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
                      <Space>
                        <img 
                          src={country.flagImageUrl} 
                          alt={country.name}
                          style={{ 
                            width: 20, 
                            height: 15, 
                            objectFit: 'cover',
                            borderRadius: 2
                          }} 
                        />
                        {country.name} ({country.code})
                      </Space>
                    }
                    name={country.name}
                    {...country}
                  >
                    <Space align="start">
                      <img 
                        src={country.flagImageUrl} 
                        alt={country.name}
                        style={{ 
                          width: 24, 
                          height: 18, 
                          objectFit: 'cover',
                          borderRadius: 2
                        }} 
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>
                          {country.name} ({country.code})
                        </div>
                        <div style={{ color: '#666', fontSize: 12 }}>
                          {country.continent} | {country.capital}
                        </div>
                      </div>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} style={styles.sectionTitle}>
          <KeyOutlined style={styles.icon} />
          {t('credentials')}
        </Title>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t('accessKey')}
              name="accessKey"
              rules={[{ required: true, message: t('pleaseEnterAccessKey') }]}
            >
              <Input placeholder={t('enterAccessKey')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('secretKey')}
              name="secretKey"
              rules={[{ required: true, message: t('pleaseEnterSecretKey') }]}
            >
              <Input.Password placeholder={t('enterSecretKey')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('aesKey')}
              name="aesKey"
              tooltip={t('aesKeyTooltip')}
              rules={[{ required: true, message: t('pleaseEnterAesKey') }]}
            >
              <Input.Password placeholder={t('enterAesKey')} />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5} style={styles.sectionTitle}>
          <GlobalOutlined style={styles.icon} />
          {t('configuration')}
        </Title>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t('region')}
              name="region"
              rules={[{ required: true, message: t('pleaseEnterRegion') }]}
            >
              <Input placeholder={t('enterRegion')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('bucketName')}
              name="bucketName"
              rules={[{ required: true, message: t('pleaseEnterBucketName') }]}
            >
              <Input placeholder={t('enterBucketName')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('endpoint')}
              name="endpoint"
              rules={[{ required: true, message: t('pleaseEnterEndpoint') }]}
            >
              <Input placeholder={t('enterEndpoint')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label={t('accountName')}
              name="accountName"
              rules={[{ required: true, message: t('pleaseEnterAccountName') }]}
            >
              <Input placeholder={t('enterAccountName')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('tags')}
              name="tags"
            >
              <Input placeholder={t('enterTags')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', gap: '24px', marginTop: '29px' }}>
              <Form.Item
                name="isActive"
                label={t('isActive')}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch 
                  checkedChildren={t('yes')} 
                  unCheckedChildren={t('no')} 
                />
              </Form.Item>
              <Form.Item
                name="isDefault"
                label={t('isDefault')}
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch 
                  checkedChildren={t('yes')} 
                  unCheckedChildren={t('no')} 
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <Form.Item
          label={t('description')}
          name="description"
        >
          <Input.TextArea 
            placeholder={t('enterDescription')} 
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ObjectStorageCreateModal; 