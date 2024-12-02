import React from 'react';
import { Input, Modal, Form, Switch, Alert, Row, Col, Select, InputNumber, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

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

const AddUserProductModal = ({ isVisible, onCancel, onFinish, form }) => {
  const { t } = useTranslation();

  const handleAddProductOk = async () => {
    try {
      const values = await form.validateFields();
      const requestData = {
        userId: values.userId,
        productName: values.productName,
        productDescription: values.productDescription,
        price: values.price,
        originalPrice: values.originalPrice,
        stock: values.stock,
        category: values.category,
        province: values.province,
        city: values.city,
        imageCover: values.imageCover,
        imageList: values.imageList,
        status: values.status ?? true,
      };

      await onFinish(requestData);
    } catch (error) {
      console.error(t('errorAddingProduct'), error);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
            beforeUpload={() => false}
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
            beforeUpload={() => false}
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

export default AddUserProductModal;
