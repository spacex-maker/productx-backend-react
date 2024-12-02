import React, { useEffect, useState } from 'react';
import { Input, Modal, Form, Switch, Alert, Row, Col, Select, InputNumber, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import COS from 'cos-js-sdk-v5';
import { message } from 'antd';
import api from 'src/axiosInstance';
const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: ${props => props.$narrow ? '8px' : '12px'};
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
      line-height: 24px;
      padding: 0 8px;
    }

    .ant-input-number-input {
      height: 22px;
    }

    .ant-select-selection-item {
      line-height: 22px;
    }

    textarea.ant-input {
      height: auto !important;
      min-height: 48px;
      padding: 4px 8px;
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

const UpdateUserProductModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateProduct,
  selectedProduct,
  narrow
}) => {
  const { t } = useTranslation();
  const [cosInstance, setCosInstance] = useState(null);
  const [uploading, setUploading] = useState(false);
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';

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

  useEffect(() => {
    if (isVisible && selectedProduct) {
      // 将已有图片转换为Upload组件需要的格式
      const coverImage = selectedProduct.imageCover ? [{
        uid: '-1',
        name: 'cover.jpg',
        status: 'done',
        url: selectedProduct.imageCover,
      }] : [];

      const productImages = selectedProduct.imageList ? 
        selectedProduct.imageList.map((url, index) => ({
          uid: `-${index + 1}`,
          name: `product-${index + 1}.jpg`,
          status: 'done',
          url: url,
        })) : [];

      form.setFieldsValue({
        ...selectedProduct,
        status: selectedProduct.status === 1,
        imageCover: coverImage,
        imageList: productImages,
      });
    }
  }, [isVisible, selectedProduct, form]);

  return (
    <StyledModal
      $narrow={narrow}
      title={t("updateProduct")}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t("submit")}
      cancelText={t("cancel")}
      width={480}
      maskClosable={false}
      destroyOnClose
    >
      <Alert
        message={t("updateProductWarning")}
        type="warning"
        showIcon
      />

      <Form
        form={form}
        layout="vertical"
        colon={false}
        onFinish={handleUpdateProduct}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="userId"
              label={t("userId")}
              rules={[{ required: true, message: t("enterUserId") }]}
            >
              <Input placeholder={t("enterUserId")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="productName"
              label={t("productName")}
              rules={[{ required: true, message: t("enterProductName") }]}
            >
              <Input placeholder={t("enterProductName")} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="productDescription"
          label={t("productDescription")}
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
              label={t("price")}
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
              label={t("originalPrice")}
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
              label={t("stock")}
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
              label={t("category")}
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
              name="province"
              label={t("province")}
              rules={[{ required: true, message: t("enterProvince") }]}
            >
              <Input placeholder={t("enterProvince")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="city"
              label={t("city")}
              rules={[{ required: true, message: t("enterCity") }]}
            >
              <Input placeholder={t("enterCity")} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="imageCover"
          label={t("coverImage")}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: t("uploadCoverImage") }]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            customRequest={customRequest}
            onChange={({ fileList }) => form.setFieldsValue({ imageCover: fileList })}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t("upload")}</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          name="imageList"
          label={t("productImages")}
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

        <Form.Item
          name="status"
          label={t("productStatus")}
          valuePropName="checked"
        >
          <Switch
            checkedChildren={t("enabled")}
            unCheckedChildren={t("disabled")}
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default UpdateUserProductModal;
