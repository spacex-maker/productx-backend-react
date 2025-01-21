import React, { useState, useEffect } from 'react';
import {
  Input,
  Modal,
  Form,
  Row,
  Col,
  Select,
  InputNumber,
  Upload,
  Spin,
  Button,
  Cascader,
} from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  TagOutlined,
  DollarOutlined,
  PictureOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  UnorderedListOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import COS from 'cos-js-sdk-v5';
import { message } from 'antd';
import api from 'src/axiosInstance';
import CreateProductJsonModal from './CreateProductJsonModal';
import { useModal } from 'src/hooks/useModal';
import { getCategoryListService } from 'src/service/category.service';
import { ConsumerAvatar } from 'src/components';

const AddUserProductModal = (props) => {
  // eslint-disable-next-line react/prop-types
  const { form, ...modalProps } = props;
  const { t } = useTranslation();
  const [cosInstance, setCosInstance] = useState(null);
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';
  const [userOptions, setUserOptions] = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [citySearchLoading, setCitySearchLoading] = useState(false);

  const [categoryList, setCategoryList] = useState([]);

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

  const initSetCategoryList = async () => {
    const [error, responseData] = await getCategoryListService(0);
    if (error) {
      return;
    }
    const list = (responseData ?? []).map((item) => ((item.isLeaf = false), item));
    setCategoryList(list);
  };

  const loadCategoryData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (!targetOption.children) {
      const [error, responseData] = await getCategoryListService(targetOption.id);
      if (error) {
        return;
      }
      if (responseData == null || (Array.isArray(responseData) && responseData.length === 0)) {
        targetOption.isLeaf = true;
      } else {
        const list = (responseData ?? []).map((item) => ((item.isLeaf = false), item));
        targetOption.children = list;
      }
      setCategoryList([...categoryList]);
    }
  };

  useEffect(() => {
    initCOS();
    fetchCountries();
    initSetCategoryList();
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
        },
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
    return e?.fileList.map((file) => ({
      ...file,
      url: file.response?.url || file.url,
    }));
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
          username: value,
        },
      });

      if (response) {
        const options = response.map((user) => {
          return Object.assign(user, {
            label: `${user.username} (ID: ${user.id})`,
            value: user.id,
          });
        });
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
          search,
        },
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

  const [jsonModal, jsonPlaceHolder] = useModal(CreateProductJsonModal);
  const onInputJson = async () => {
    jsonModal.open();
  };

  return (
    <Modal
      title={t('addNewProduct')}
      {...modalProps}
      okText={t('submit')}
      cancelText={t('cancel')}
      width={600}
      maskClosable={false}
      destroyOnClose
    >
      <div style={{ marginBottom: '8px' }}>
        <Button
          type="link"
          icon={<CodeOutlined />}
          onClick={onInputJson}
          style={{ padding: 0, height: 'auto', fontSize: '10px' }}
        >
          {t('createWithJson')}
        </Button>
      </div>

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
              label={
                <span>
                  <UserOutlined /> {t('userId')}
                </span>
              }
              rules={[{ required: true, message: t('enterUserId') }]}
            >
              <Select
                showSearch
                placeholder={t('searchUserPlaceholder')}
                loading={userSearchLoading}
                onSearch={handleUserSearch}
                filterOption={false}
                notFoundContent={userSearchLoading ? <Spin   /> : null}
              >
                {userOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    <ConsumerAvatar consumer={option}></ConsumerAvatar>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="productName"
              label={
                <span>
                  <TagOutlined /> {t('productName')}
                </span>
              }
              rules={[
                { required: true, message: t('enterProductName') },
                { max: 30, message: t('productNameMaxLength') },
              ]}
            >
              <Input placeholder={t('enterProductName')} maxLength={30} showCount />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="productDescription"
          label={
            <span>
              <UnorderedListOutlined /> {t('productDescription')}
            </span>
          }
          rules={[
            { required: true, message: t('enterProductDescription') },
            { max: 500, message: t('productNameMaxLength') },
          ]}
        >
          <Input.TextArea placeholder={t('enterProductDescription')} rows={8} />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="price"
              label={
                <span>
                  <DollarOutlined /> {t('price')}
                </span>
              }
              rules={[{ required: true, message: t('enterPrice') }]}
            >
              <InputNumber
                placeholder={t('enterPrice')}
                style={{ width: '100%' }}
                precision={2}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="originalPrice"
              label={
                <span>
                  <DollarOutlined /> {t('originalPrice')}
                </span>
              }
              rules={[{ required: true, message: t('enterOriginalPrice') }]}
            >
              <InputNumber
                placeholder={t('enterOriginalPrice')}
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
              label={
                <span>
                  <AppstoreOutlined /> {t('stock')}
                </span>
              }
              rules={[
                { required: true, message: t('enterStock') },
                { type: 'number', min: 1, max: 999999999, message: t('productNameMaxLength') },
              ]}
            >
              <InputNumber placeholder={t('enterStock')} style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="category"
              label={
                <span>
                  <AppstoreOutlined /> {t('category')}
                </span>
              }
              rules={[{ required: true, message: t('selectCategory') }]}
            >
              <Cascader
                placeholder={t('selectCategory')}
                options={categoryList}
                loadData={loadCategoryData}
                fieldNames={{
                  label: 'name',
                  value: 'id',
                }}
                changeOnSelect
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="countryCode"
              label={
                <span>
                  <GlobalOutlined /> {t('country')}
                </span>
              }
              rules={[{ required: true, message: t('selectCountry') }]}
            >
              <Select
                showSearch
                placeholder={t('selectCountry')}
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
                {countries.map((country) => (
                  <Select.Option
                    key={country.code}
                    value={country.code}
                    label={`${country.name} (${country.code})`}
                  >
                    <div>
                      <img
                        src={country.flagImageUrl}
                        alt={`${country.name} flag`}
                        style={{ width: '20px', height: '15px', marginRight: '8px' }}
                      />
                      <div>
                        {country.name} ({country.code})
                      </div>
                      <div style={{ color: '#666', marginTop: '2px' }}>
                        {country.capital} | {country.officialLanguages} | {country.currency} |{' '}
                        {country.continent}
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="city"
              label={
                <span>
                  <EnvironmentOutlined /> {t('city')}
                </span>
              }
              rules={[{ required: true, message: t('enterCity') }]}
            >
              <Select
                showSearch
                placeholder={
                  form.getFieldValue('countryCode')
                    ? t('searchCityPlaceholder')
                    : t('pleaseSelectCountryFirst')
                }
                disabled={!form.getFieldValue('countryCode')}
                loading={citySearchLoading}
                onSearch={handleCitySearch}
                filterOption={false}
                notFoundContent={citySearchLoading ? <Spin   /> : null}
                optionLabelProp="label"
              >
                {cities.map((city) => (
                  <Select.Option
                    key={city.code}
                    value={city.name}
                    label={`${city.name} (${city.enName})`}
                  >
                    <div style={{ fontSize: '10px', padding: '2px 0' }}>
                      <div>{city.name}</div>
                      <div style={{ color: '#666', marginTop: '2px' }}>
                        {city.enName} | {city.type} | 人口: {(city.population / 10000).toFixed(0)}万
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="imageCover"
          label={
            <span>
              <PictureOutlined /> {t('coverImage')}
            </span>
          }
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: t('uploadCoverImage') }]}
        >
          <Upload listType="picture-card" maxCount={1} customRequest={customRequest}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t('upload')}</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          name="imageList"
          label={
            <span>
              <PictureOutlined /> {t('productImages')}
            </span>
          }
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload listType="picture-card" multiple maxCount={15} customRequest={customRequest}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t('upload')}</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
      {jsonPlaceHolder}
    </Modal>
  );
};

export default AddUserProductModal;
