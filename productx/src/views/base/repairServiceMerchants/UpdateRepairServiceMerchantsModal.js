import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, message, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
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

const { TextArea } = Input;

const UpdateRepairServiceMerchantsModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateMerchant,
  selectedMerchant
}) => {
  const { t, i18n } = useTranslation();
  const [logoUrl, setLogoUrl] = useState(selectedMerchant?.merchantLogo || '');
  const [cosInstance, setCosInstance] = useState(null);
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';

  useEffect(() => {
    if (isVisible && selectedMerchant) {
      form.setFieldsValue(selectedMerchant);
      setLogoUrl(selectedMerchant.merchantLogo || '');
    }
  }, [isVisible, selectedMerchant, form]);

  // 初始化 COS 实例
  const initCOS = async () => {
    try {
      const response = await api.get(`/manage/tencent/cos-credential?bucketName=${bucketName}`);
      console.log('COS credentials response:', response);

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

  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    try {
      let instance = cosInstance;
      if (!instance) {
        instance = await initCOS();
        if (!instance) {
          throw new Error('COS 实例未初始化');
        }
      }

      const key = `merchants/${Date.now()}-${file.name}`;
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
      setLogoUrl(url);
      onSuccess({ url });
      form.setFieldsValue({ merchantLogo: url });
    } catch (error) {
      console.error('上传失败:', error);
      message.error('上传失败：' + error.message);
      onError(error);
    }
  };

  const uploadButton = (
    <div style={{ fontSize: '10px' }}>
      <PlusOutlined />
    </div>
  );

  // 将选项定义移到组件内部，使其能够响应语言变化
  const serviceTypeOptions = useMemo(() => [
    { value: 'mobileRepair', label: t('mobileRepair'), icon: <MobileOutlined /> },
    { value: 'computerRepair', label: t('computerRepair'), icon: <LaptopOutlined /> },
    { value: 'applianceRepair', label: t('applianceRepair'), icon: <ToolOutlined /> },
    { value: 'furnitureRepair', label: t('furnitureRepair'), icon: <TableOutlined /> },
    { value: 'plumbing', label: t('plumbing'), icon: <ExperimentOutlined /> },
    { value: 'electricalRepair', label: t('electricalRepair'), icon: <ThunderboltOutlined /> },
    { value: 'carRepair', label: t('carRepair'), icon: <CarOutlined /> },
    { value: 'other', label: t('other'), icon: <QuestionOutlined /> }
  ], [t]); // 依赖t函数，当语言改变时重新生成选项

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
        onFinish={handleUpdateMerchant}
        layout="vertical"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <div className="form-section">
          <div className="section-title">{t('basicInfo')}</div>
          <Row gutter={[16, 0]}>
            <Col span={16}>
              <Form.Item
                label={t('merchantName')}
                name="merchantName"
                rules={[{ required: true }]}
              >
                <Input size="small" prefix={<ShopOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('logo')}
                name="merchantLogo"
              >
                <Upload
                  name="file"
                  listType="picture-card"
                  className="avatar-uploader-small"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  customRequest={customRequest}
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
            <Col span={12}>
              <Form.Item
                label={t('contactPerson')}
                name="contactPerson"
                rules={[{ required: true }]}
              >
                <Input size="small" prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('contactPhone')}
                name="contactPhone"
                rules={[{ required: true }]}
              >
                <Input size="small" prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('contactEmail')}
                name="contactEmail"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input size="small" prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('addressInfo')}</div>
          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                label={t('province')}
                name="province"
                rules={[{ required: true }]}
              >
                <Input size="small" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('city')}
                name="city"
                rules={[{ required: true }]}
              >
                <Input size="small" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={t('address')}
                name="address"
                rules={[{ required: true }]}
              >
                <Input size="small" prefix={<EnvironmentOutlined />} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('businessInfo')}</div>
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                label={t('workingHours')}
                name="workingHours"
                rules={[{ required: true }]}
              >
                <Input size="small" prefix={<ClockCircleOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t('paymentMethods')}
                name="paymentMethods"
                rules={[{ required: true }]}
              >
                <Select
                  size="small"
                  mode="multiple"
                  placeholder={t('pleaseSelect')}
                  options={[
                    { value: '支付宝', label: '支付宝' },
                    { value: '微信', label: '微信' },
                    { value: '现金', label: '现金' }
                  ]}
                  suffixIcon={<WalletOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t('serviceTypes')}
                name="serviceTypes"
                rules={[{ required: true }]}
              >
                <Select
                  size="small"
                  mode="multiple"
                  placeholder={t('pleaseSelect')}
                  options={serviceTypeOptions}
                  optionLabelProp="label"
                  optionRender={(option) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {option.data.icon}
                      <span>{option.data.label}</span>
                    </div>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="form-section">
          <div className="section-title">{t('remarks')}</div>
          <Form.Item name="remark">
            <Input.TextArea 
              size="small" 
              rows={2} 
              prefix={<FileTextOutlined />}
            />
          </Form.Item>
        </div>
      </Form>

      <style jsx global>{`
        .form-section {
          margin-bottom: 12px;
        }
        .section-title {
          font-size: 10px;
          color: #262626;
          font-weight: 500;
          margin-bottom: 6px;
          padding-left: 6px;
          border-left: 2px solid #1890ff;
        }
        .avatar-uploader-small .ant-upload {
          width: 40px !important;
          height: 40px !important;
          border-radius: 4px !important;
        }
        .ant-form-item {
          margin-bottom: 6px;
        }
        .ant-form-item-label {
          padding-bottom: 2px;
        }
        .ant-form-item-label > label {
          font-size: 10px !important;
          height: 14px !important;
          color: #666 !important;
        }
        .ant-input, 
        .ant-select-selector,
        .ant-select-selection-item,
        .ant-select-selection-placeholder {
          font-size: 10px !important;
          padding: 0 4px !important;
        }
        .ant-input {
          height: 22px !important;
        }
        .ant-select-selector {
          height: 22px !important;
          line-height: 22px !important;
        }
        .ant-select-selection-item {
          line-height: 20px !important;
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
      `}</style>
    </Modal>
  );
};

export default UpdateRepairServiceMerchantsModal;
