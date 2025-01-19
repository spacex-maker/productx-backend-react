import React, { useEffect, useState } from 'react';
import {
  Input,
  Modal,
  Form,
  Alert,
  Row,
  Col,
  Select,
  InputNumber,
  Upload,
  Tag,
  Cascader,
} from 'antd';
import {
  PlusOutlined,
  CheckCircleOutlined,
  EditOutlined,
  StopOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import COS from 'cos-js-sdk-v5';
import { message } from 'antd';
import api from 'src/axiosInstance';
import { getCategoryListService } from 'src/service/category.service';

/**
 *
 * @param {{
 * form: import("antd").FormInstance;
 * narrow?: boolean;
 * selectedProduct: any;
 * open: boolean;
 * }} props
 * @returns
 */
const UpdateUserProductModal = (props) => {
  // eslint-disable-next-line react/prop-types
  const { narrow, form, selectedProduct, ...modalProps } = props;
  const { t } = useTranslation();
  const [cosInstance, setCosInstance] = useState(null);
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';

  const [categoryList, setCategoryList] = useState([]);
  const getCategoryList = async (id) => {
    const [error, responseData] = await getCategoryListService(id);
    if (error) {
      return [];
    }
    return (responseData ?? []).map((item) => ((item.isLeaf = false), item));
  };
  const initSetCategoryList = async () => {
    if (!selectedProduct?.category) {
      return;
    }
    const categoryList = await getCategoryList(0);
    const selectCategory = (selectedProduct.category?.split(',') ?? []).map((id, index) => {
      console.log(id);
      if (index === 0) {
        return { id: Number(id), list: categoryList };
      }
      return { id: Number(id), list: [] };
    });
    for (let [index, item] of selectCategory.entries()) {
      const children = await getCategoryList(item.id);
      const { id, list } = item;
      const selectOption = list.find((option) => option.id == id);
      if (selectOption) {
        const nextItem = selectCategory[index + 1];
        if (nextItem) {
          nextItem.list = children;
        }
        selectOption.children = children;
      }
    }
    setCategoryList(categoryList);
  };

  const loadCategoryData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (!targetOption.children) {
      const list = await getCategoryList(targetOption.id);
      if (Array.isArray(list) && list.length === 0) {
        targetOption.isLeaf = true;
      } else {
        targetOption.children = list;
      }
      setCategoryList([...categoryList]);
    }
  };

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
  }, []);

  useEffect(() => {
    initSetCategoryList();
  }, [selectedProduct]);

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

  // 修改 normFile 函数，在表单提交时转换格式
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.map((file) => ({
      ...file,
      url: file.response?.url || file.url,
    }));
  };

  useEffect(() => {
    if (modalProps.open && selectedProduct) {
      const coverImage = selectedProduct.imageCover
        ? [
            {
              uid: '-1',
              name: 'cover.jpg',
              status: 'done',
              url: selectedProduct.imageCover,
            },
          ]
        : [];
      const category = (selectedProduct.category?.split(',') ?? []).map(Number);
      form.setFieldsValue({
        ...selectedProduct,
        category: category,
        status: selectedProduct.status,
        imageCover: coverImage,
        imageList: selectedProduct.imageList || [],
      });
    }
  }, [modalProps.open, selectedProduct, form]);

  // 添加状态配置对象
  const statusOptions = [
    {
      value: 0,
      label: 'normal',
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      value: 1,
      label: 'draft',
      icon: <EditOutlined />,
      color: '#faad14',
    },
    {
      value: 2,
      label: 'offShelf',
      icon: <StopOutlined />,
      color: '#ff4d4f',
    },
    {
      value: 3,
      label: 'deleted',
      icon: <DeleteOutlined />,
      color: '#d9d9d9',
    },
  ];

  return (
    <Modal
      title={t('updateProduct')}
      {...modalProps}
      okText={t('submit')}
      cancelText={t('cancel')}
      width={600}
      maskClosable={false}
      destroyOnClose
    >
      <Alert message={t('updateProductWarning')} type="warning" showIcon />

      <Form form={form} layout="vertical" colon={false}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="userId"
              label={t('userId')}
              rules={[{ required: true, message: t('enterUserId') }]}
            >
              <Input placeholder={t('enterUserId')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="productName"
              label={t('productName')}
              rules={[
                { required: true, message: t('enterProductName') },
                { max: 30, message: t('productNameMaxLength') },
              ]}
            >
              <Input maxLength={30} showCount placeholder={t('enterProductName')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="productDescription"
          label={t('productDescription')}
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
              label={t('price')}
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
              label={t('originalPrice')}
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
              label={t('stock')}
              rules={[
                { required: true, message: t('enterStock') },
                { type: 'number', min: 1, max: 999999999, message: t('productNameMaxLength') },
              ]}
            >
              <InputNumber placeholder={t('enterStock')} style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              name="category"
              label={t('category')}
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
              name="province"
              label={t('province')}
              rules={[{ required: true, message: t('enterProvince') }]}
            >
              <Input placeholder={t('enterProvince')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="city"
              label={t('city')}
              rules={[{ required: true, message: t('enterCity') }]}
            >
              <Input placeholder={t('enterCity')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="imageCover"
          label={t('coverImage')}
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
          label={t('productImages')}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload listType="picture-card" multiple customRequest={customRequest}>
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t('upload')}</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          name="status"
          label={t('productStatus')}
          rules={[{ required: true, message: t('selectStatus') }]}
        >
          <Select placeholder={t('selectStatus')}>
            {statusOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {React.cloneElement(option.icon, { style: { color: option.color } })}
                  <Tag color={option.color} style={{ margin: 0 }}>
                    {t(option.label)}
                  </Tag>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserProductModal;
