import React, { useState } from 'react';
import { Modal, Form, Input, Upload, message, DatePicker, Select, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const { TextArea } = Input;

const RepairServiceMerchantsCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [licenseUrl, setLicenseUrl] = useState('');

  const getOssPolicy = async () => {
    try {
      const response = await api.get('/oss/policy');
      return response.data;
    } catch (error) {
      message.error(t('getOssPolicyFailed'));
      return null;
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error(t('pleaseUploadImageFile'));
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t('imageMustSmallerThan2MB'));
      return false;
    }
    return true;
  };

  const customRequest = async ({ file, onSuccess, onError, field }) => {
    try {
      setLoading(true);
      const policy = await getOssPolicy();
      if (!policy) {
        throw new Error('Failed to get OSS policy');
      }

      const formData = new FormData();
      formData.append('key', policy.dir + file.name);
      formData.append('policy', policy.policy);
      formData.append('OSSAccessKeyId', policy.accessKeyId);
      formData.append('success_action_status', '200');
      formData.append('signature', policy.signature);
      formData.append('file', file);

      const response = await fetch(policy.host, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const url = `${policy.host}/${policy.dir}${file.name}`;
        if (field === 'merchantLogo') {
          setLogoUrl(url);
          form.setFieldsValue({ merchantLogo: url });
        } else {
          setLicenseUrl(url);
          form.setFieldsValue({ businessLicense: url });
        }
        onSuccess();
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      message.error(t('uploadFailed'));
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div style={{ fontSize: '10px' }}>
      <PlusOutlined style={{ fontSize: '12px' }} />
    </div>
  );

  return (
    <Modal
      title={t('createMerchant')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={360}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Row gutter={8}>
          <Col span={16}>
            <Form.Item
              label={t('merchantName')}
              name="merchantName"
              rules={[{ required: true, message: t('pleaseInputMerchantName') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('logo')}
              name="merchantLogo"
              rules={[{ required: true, message: t('pleaseUploadLogo') }]}
            >
              <Upload
                name="file"
                listType="picture-card"
                className="avatar-uploader-small"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={({ file, onSuccess, onError }) => 
                  customRequest({ file, onSuccess, onError, field: 'merchantLogo' })}
              >
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : uploadButton}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('contactPerson')}
              name="contactPerson"
              rules={[{ required: true, message: t('pleaseInputContactPerson') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('contactPhone')}
              name="contactPhone"
              rules={[{ required: true, message: t('pleaseInputContactPhone') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('contactEmail')}
              name="contactEmail"
              rules={[
                { required: true, message: t('pleaseInputEmail') },
                { type: 'email', message: t('invalidEmail') }
              ]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('workingHours')}
              name="workingHours"
              rules={[{ required: true }]}
            >
              <Input size="small" placeholder="9:00-18:00" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label={t('province')}
              name="province"
              rules={[{ required: true, message: t('pleaseInputProvince') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('city')}
              name="city"
              rules={[{ required: true, message: t('pleaseInputCity') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('address')}
              name="address"
              rules={[{ required: true, message: t('pleaseInputAddress') }]}
            >
              <Input size="small" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('serviceTypes')}
              name="serviceTypes"
              rules={[{ required: true, message: t('pleaseSelectServiceTypes') }]}
            >
              <Select
                size="small"
                mode="tags"
                style={{ width: '100%' }}
                placeholder={t('pleaseSelect')}
                options={[
                  { value: '手机维修', label: '手机维修' },
                  { value: '电脑维修', label: '电脑维修' },
                  { value: '家电维修', label: '家电维修' }
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('paymentMethods')}
              name="paymentMethods"
              rules={[{ required: true, message: t('pleaseSelectPaymentMethods') }]}
            >
              <Select
                size="small"
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('pleaseSelect')}
                options={[
                  { value: '支付宝', label: '支付宝' },
                  { value: '微信', label: '微信' },
                  { value: '现金', label: '现金' }
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('remark')}
          name="remark"
        >
          <Input.TextArea size="small" rows={1} />
        </Form.Item>
      </Form>

      <style jsx global>{`
        /* 全局样式覆盖 */
        .ant-modal-root .ant-form-item .ant-form-item-label > label,
        .ant-modal-root .ant-form-item .ant-form-item-label > label.ant-form-item-required,
        :where(.css-dev-only-do-not-override-1wwf28x).ant-form-item .ant-form-item-label > label,
        :where(.css-dev-only-do-not-override-1wwf28x).ant-form-item .ant-form-item-label > label.ant-form-item-required,
        .ant-form-vertical .ant-form-item-label > label,
        .ant-form-vertical .ant-form-item-label > label.ant-form-item-required,
        .ant-modal .ant-form-item-label > label,
        .ant-modal .ant-form-item-label > label.ant-form-item-required,
        div[class*='css-']:where(.ant-form-item) .ant-form-item-label > label {
          font-size: 10px !important;
          height: 16px !important;
          line-height: 16px !important;
          color: #666 !important;
        }

        /* 必填星号 */
        .ant-modal-root .ant-form-item-required::before,
        :where(.css-dev-only-do-not-override-1wwf28x).ant-form-item .ant-form-item-required::before,
        .ant-form-vertical .ant-form-item-required::before,
        .ant-modal .ant-form-item-required::before,
        div[class*='css-']:where(.ant-form-item) .ant-form-item-required::before {
          font-size: 10px !important;
          line-height: 16px !important;
        }

        /* 输入框和选择器文字大小 */
        .ant-modal-root .ant-input,
        .ant-modal-root .ant-select-selection-item,
        .ant-modal-root .ant-select-selection-placeholder,
        .ant-modal-root .ant-select-selection-search-input {
          font-size: 10px !important;
        }

        /* 错误提示文字 */
        .ant-modal-root .ant-form-item-explain-error {
          font-size: 10px !important;
        }

        /* 下拉选项文字 */
        .ant-select-dropdown {
          font-size: 10px !important;
        }
        .ant-select-dropdown .ant-select-item {
          font-size: 10px !important;
        }

        /* 按钮文字 */
        .ant-modal-root .ant-btn {
          font-size: 10px !important;
        }

        /* 模态框标题 */
        .ant-modal-title {
          font-size: 12px !important;
        }
      `}</style>
    </Modal>
  );
};

export default RepairServiceMerchantsCreateFormModal;
