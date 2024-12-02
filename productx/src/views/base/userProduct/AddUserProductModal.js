import React, { useState, useEffect } from 'react';
import { Input, Modal, Form, Switch, Alert, Row, Col, Select, InputNumber, Upload, Spin } from 'antd';
import { PlusOutlined, UserOutlined, TagOutlined, DollarOutlined, PictureOutlined, AppstoreOutlined, GlobalOutlined, EnvironmentOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import COS from 'cos-js-sdk-v5';
import { message } from 'antd';
import api from 'src/axiosInstance';
const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 12px;
  }

  .ant-modal-header {
    margin-bottom: 8px;
  }

  .ant-modal-title {
    font-size: 12px;
    color: #000000;
  }

  .ant-form {
    .ant-form-item {
      margin-bottom: 4px;
    }

    .ant-form-item-label {
      padding: 0;

      > label {
        font-size: 10px;
        color: #666;
        height: 20px;
      }
    }

    .ant-input,
    .ant-input-number,
    .ant-picker,
    .ant-select-selector {
      font-size: 10px;
      height: 24px !important;
      line-height: 24px !important;
      padding: 0 8px !important;
    }

    .ant-select-single {
      font-size: 10px !important;
      height: 24px !important;

      .ant-select-selector {
        height: 24px !important;
        line-height: 24px !important;
        
        .ant-select-selection-search-input {
          height: 22px !important;
          line-height: 22px !important;
        }

        .ant-select-selection-item {
          line-height: 22px !important;
          padding-right: 24px !important;
        }
      }
    }

    .ant-input-number-input {
      height: 22px !important;
      line-height: 22px !important;
    }

    .ant-select-selection-item {
      line-height: 22px !important;
    }

    textarea.ant-input {
      height: auto !important;
      min-height: 48px;
      padding: 4px 8px;
    }

    .ant-select {
      .ant-select-selection-item,
      .ant-select-selection-search-input {
        font-size: 10px;
        color: #000000 !important;
      }
    }

    .ant-select-dropdown {
      .ant-select-item {
        font-size: 10px;
        color: #000000 !important;
      }

      .ant-select-item-option-selected {
        color: #000000 !important;
        background-color: #f5f5f5;
      }
    }
  }

  .ant-alert {
    margin-bottom: 8px;
    padding: 4px 8px;
    font-size: 10px;
  }

  .ant-form-item-explain {
    font-size: 10px;
    min-height: 16px;
  }

  .ant-modal-footer {
    margin-top: 8px;
    padding: 8px 0 0;
    border-top: 1px solid #f0f0f0;

    .ant-btn {
      height: 24px;
      padding: 0 12px;
      font-size: 10px;
    }
  }
`;

const { Option } = Select;

const AddUserProductModal = ({ isVisible, onCancel, onFinish, form }) => {
  const { t } = useTranslation();
  const [cosInstance, setCosInstance] = useState(null);
  const [uploading, setUploading] = useState(false);
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';
  const [userOptions, setUserOptions] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);

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
      message.error('初始化 COS 失败：' + error.message);
      return null;
    }
  };

  useEffect(() => {
    initCOS();
    fetchCountries();
  }, []);

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

  // 处理文件上传
  const handleUpload = async (file) => {
    try {
      let instance = cosInstance;
      if (!instance) {
        instance = await initCOS();
        if (!instance) {
          throw new Error('COS 实例未初始化');
        }
      }

      const key = `products/${Date.now()}-${file.name}`;

      const result = await instance.uploadFile({
        Bucket: bucketName,
        Region: region,
        Key: key,
        Body: file,
        onProgress: (progressData) => {
          const percent = Math.round(progressData.percent * 100);
          file.onProgress({ percent });
        }
      });

      return `https://${bucketName}.cos.${region}.myqcloud.com/${key}`;
    } catch (error) {
      message.error('上传失败：' + error.message);
      throw error;
    }
  };

  // 自定义上传方法
  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    try {
      file.onProgress = onProgress;
      const url = await handleUpload(file);
      onSuccess({ url });
    } catch (error) {
      onError(error);
    }
  };

  // 处理文件列表变化
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    // 从上传结果中提取URL
    return e?.fileList.map(file => ({
      ...file,
      url: file.response?.url || file.url
    }));
  };

  const handleAddProductOk = async () => {
    try {
      const values = await form.validateFields();
      const requestData = {
        userId: values.userId,
        productName: values.productName,
        productDescription: values.productDescription,
        price: values.price,
        originalPrice: values.originalPrice,
        currencyCode: 'CNY',
        stock: values.stock,
        category: values.category,
        countryCode: values.countryCode,
        city: values.city,
        imageCover: values.imageCover?.[0]?.url || '',
        imageList: values.imageList?.map(file => file.url) || [],
      };

      await onFinish(requestData);
    } catch (error) {
      console.error(t('errorAddingProduct'), error);
    }
  };

  // 搜索用户
  const handleUserSearch = async (value) => {
    if (!value) {
      setUserOptions([]);
      return;
    }

    setUserSearchLoading(true);
    try {
      const response = await api.get('/manage/user/list-all', {
        params: {
          currentPage: 1,
          pageSize: 10,
          isBelongSystem: true,
          username: value
        }
      });

      if (response) {
        const options = response.map(user => ({
          label: `${user.username} (ID: ${user.id})`,
          value: user.id
        }));
        setUserOptions(options);
      }
    } catch (error) {
      console.error('搜索用户失败:', error);
      message.error(t('searchUserFailed'));
    } finally {
      setUserSearchLoading(false);
    }
  };

  // 添加城市搜索函数
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

  return (
    <StyledModal
      title={t("addNewProduct")}
      open={isVisible}
      onCancel={onCancel}
      onOk={handleAddProductOk}
      okText={t("submit")}
      cancelText={t("cancel")}
      width={480}
      maskClosable={false}
      destroyOnClose
    >
      <Alert
        message={t("productInfoWarning")}
        type="warning"
        showIcon
      />

      <Form
        form={form}
        layout="vertical"
        colon={false}
        initialValues={{ status: true }}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="userId"
              label={<span><UserOutlined /> {t("userId")}</span>}
              rules={[{ required: true, message: t("enterUserId") }]}
            >
              <Select
                showSearch
                placeholder={t("searchUserPlaceholder")}
                loading={userSearchLoading}
                onSearch={handleUserSearch}
                filterOption={false}
                notFoundContent={userSearchLoading ? <Spin size="small" /> : null}
                style={{ width: '100%' }}
              >
                {userOptions.map(option => (
                  <Option 
                    key={option.value} 
                    value={option.value}
                  >
                    <div style={{ 
                      fontSize: '10px',
                      lineHeight: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {option.label}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="productName"
              label={<span><TagOutlined /> {t("productName")}</span>}
              rules={[
                { required: true, message: t("enterProductName") },
                { max: 20, message: t("productNameMaxLength") }
              ]}
            >
              <Input 
                placeholder={t("enterProductName")} 
                maxLength={20}
                showCount
                style={{ 
                  height: '24px',
                  lineHeight: '22px',
                  padding: '0 8px'
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="productDescription"
          label={<span><UnorderedListOutlined /> {t("productDescription")}</span>}
          rules={[{ required: true, message: t("enterProductDescription") }]}
        >
          <Input.TextArea
            placeholder={t("enterProductDescription")}
            rows={3}
          />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="price"
              label={<span><DollarOutlined /> {t("price")}</span>}
              rules={[{ required: true, message: t("enterPrice") }]}
            >
              <InputNumber
                placeholder={t("enterPrice")}
                style={{ width: '100%' }}
                precision={2}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="originalPrice"
              label={<span><DollarOutlined /> {t("originalPrice")}</span>}
              rules={[{ required: true, message: t("enterOriginalPrice") }]}
            >
              <InputNumber
                placeholder={t("enterOriginalPrice")}
                style={{ width: '100%' }}
                precision={2}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="stock"
              label={<span><AppstoreOutlined /> {t("stock")}</span>}
              rules={[{ required: true, message: t("enterStock") }]}
            >
              <InputNumber
                placeholder={t("enterStock")}
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="category"
              label={<span><AppstoreOutlined /> {t("category")}</span>}
              rules={[{ required: true, message: t("selectCategory") }]}
            >
              <Select placeholder={t("selectCategory")}>
                <Select.Option value="电脑">{t("computer")}</Select.Option>
                <Select.Option value="手机">{t("phone")}</Select.Option>
                <Select.Option value="其他">{t("other")}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="countryCode"
              label={<span><GlobalOutlined /> {t("country")}</span>}
              rules={[{ required: true, message: t("selectCountry") }]}
            >
              <Select
                showSearch
                placeholder={t("selectCountry")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                optionLabelProp="label"
                onChange={() => {
                  form.setFieldValue('city', undefined);
                  setCities([]);
                }}
              >
                {countries.map(country => (
                  <Option 
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
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="city"
              label={<span><EnvironmentOutlined /> {t("city")}</span>}
              rules={[{ required: true, message: t("enterCity") }]}
            >
              <Select
                showSearch
                placeholder={form.getFieldValue('countryCode') ? t("searchCityPlaceholder") : t("pleaseSelectCountryFirst")}
                disabled={!form.getFieldValue('countryCode')}
                loading={citySearchLoading}
                onSearch={handleCitySearch}
                filterOption={false}
                notFoundContent={citySearchLoading ? <Spin size="small" /> : null}
                optionLabelProp="label"
              >
                {cities.map(city => (
                  <Option 
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
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="imageCover"
          label={<span><PictureOutlined /> {t("coverImage")}</span>}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: t("uploadCoverImage") }]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            customRequest={customRequest}
            fileList={form.getFieldValue('imageCover') || []}
            onChange={({ fileList }) => form.setFieldsValue({ imageCover: fileList })}
          >
            {(form.getFieldValue('imageCover') || []).length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>{t("upload")}</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item
          name="imageList"
          label={<span><PictureOutlined /> {t("productImages")}</span>}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            multiple
            customRequest={customRequest}
            onChange={({ fileList }) => form.setFieldsValue({ imageList: fileList })}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t("upload")}</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default AddUserProductModal;
