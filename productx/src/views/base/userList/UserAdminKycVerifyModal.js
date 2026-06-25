import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Alert,
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { Option } = Select;

const COUNTRY_OPTIONS = [
  { value: 'CN', label: '中国' },
  { value: 'HK', label: '香港' },
  { value: 'TW', label: '台湾' },
  { value: 'US', label: '美国' },
  { value: 'JP', label: '日本' },
  { value: 'KR', label: '韩国' },
  { value: 'SG', label: '新加坡' },
  { value: 'WW', label: '其他' },
];

const ID_TYPE_OPTIONS = [
  { value: 'CHINA_ID_CARD', label: '中国身份证' },
  { value: 'PASSPORT', label: '护照' },
  { value: 'HK_ID_CARD', label: '香港身份证' },
  { value: 'OTHER', label: '其他证件' },
];

const uploadKycPhoto = async (file, countryCode) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(
    `/manage/user/kyc/upload-photo?countryCode=${encodeURIComponent(countryCode)}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
};

const KycPhotoUpload = ({ value, onChange, countryCode, label }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  const handleCustomUpload = async ({ file, onSuccess, onError }) => {
    if (!countryCode) {
      message.warning(t('userKycAdminSelectCountryFirst'));
      onError(new Error('no country'));
      return;
    }
    setUploading(true);
    try {
      const url = await uploadKycPhoto(file, countryCode);
      onChange?.(url);
      onSuccess?.(url);
    } catch (e) {
      message.error(e?.message || t('userKycAdminUploadFailed'));
      onError?.(e);
    } finally {
      setUploading(false);
    }
  };

  const fileList = value
    ? [{
      uid: '-1',
      name: label,
      status: 'done',
      url: value,
    }]
    : [];

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      maxCount={1}
      accept="image/*"
      customRequest={handleCustomUpload}
      onRemove={() => onChange?.(undefined)}
      beforeUpload={(file) => {
        if (!file.type?.startsWith('image/')) {
          message.error(t('pleaseUploadImageFile'));
          return Upload.LIST_IGNORE;
        }
        return true;
      }}
    >
      {fileList.length >= 1 ? null : (
        <div>
          {uploading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>{label}</div>
        </div>
      )}
    </Upload>
  );
};

const UserAdminKycVerifyModal = ({ visible, user, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const countryCode = Form.useWatch('countryCode', form);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      countryCode: user?.kycCountry || 'CN',
      idType: 'CHINA_ID_CARD',
    });
  }, [visible, user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await api.post('/manage/user/kyc/admin-verify', {
        userId: user.id,
        fullName: values.fullName?.trim(),
        countryCode: values.countryCode,
        idType: values.idType,
        idNumber: values.idNumber?.trim(),
        idFrontPhoto: values.idFrontPhoto,
        idBackPhoto: values.idBackPhoto || undefined,
      });
      message.success(t('userKycAdminVerifySuccess'));
      onSuccess?.();
    } catch (e) {
      if (e?.errorFields) return;
      message.error(e?.message || t('userKycAdminVerifyFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={t('userKycAdminVerifyTitle')}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={t('userKycAdminVerifySubmit')}
      cancelText={t('cancel')}
      confirmLoading={submitting}
      width={640}
      destroyOnClose
    >
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message={t('userKycAdminVerifyHint')}
      />

      <Form form={form} layout="vertical">
        <Form.Item
          name="fullName"
          label={t('userKycAdminFullName')}
          rules={[
            { required: true, message: t('userKycAdminFullNameRequired') },
            { min: 2, message: t('userKycAdminFullNameMin') },
          ]}
        >
          <Input placeholder={t('userKycAdminFullNamePlaceholder')} maxLength={64} />
        </Form.Item>

        <Form.Item
          name="countryCode"
          label={t('userKycAdminCountry')}
          rules={[{ required: true, message: t('userKycAdminCountryRequired') }]}
        >
          <Select
            placeholder={t('userKycAdminCountryPlaceholder')}
            onChange={(code) => {
              if (code === 'CN') {
                form.setFieldsValue({ idType: 'CHINA_ID_CARD' });
              }
            }}
          >
            {COUNTRY_OPTIONS.map((item) => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="idType"
          label={t('userKycAdminIdType')}
          rules={[{ required: true, message: t('userKycAdminIdTypeRequired') }]}
        >
          <Select placeholder={t('userKycAdminIdTypePlaceholder')}>
            {ID_TYPE_OPTIONS.map((item) => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="idNumber"
          label={t('userKycAdminIdNumber')}
          rules={[
            { required: true, message: t('userKycAdminIdNumberRequired') },
            { min: 4, message: t('userKycAdminIdNumberMin') },
          ]}
        >
          <Input placeholder={t('userKycAdminIdNumberPlaceholder')} maxLength={64} />
        </Form.Item>

        <Form.Item
          name="idFrontPhoto"
          label={t('userKycAdminIdFront')}
          rules={[{ required: true, message: t('userKycAdminIdFrontRequired') }]}
        >
          <KycPhotoUpload
            countryCode={countryCode}
            label={t('userKycAdminIdFront')}
          />
        </Form.Item>

        <Form.Item name="idBackPhoto" label={t('userKycAdminIdBack')}>
          <KycPhotoUpload
            countryCode={countryCode}
            label={t('userKycAdminIdBack')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserAdminKycVerifyModal;
