import React, { useState } from 'react';
import { Modal, Form, Input, Upload, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const PartnersCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

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

  const customRequest = async ({ file, onSuccess, onError }) => {
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
        setImageUrl(url);
        form.setFieldsValue({ logoUrl: url });
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
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{t('upload')}</div>
    </div>
  );

  return (
    <Modal
      title={t('createPartner')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label={t('partnerName')}
          name="name"
          rules={[{ required: true, message: t('pleaseInputPartnerName') }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item
          label="Logo"
          name="logoUrl"
          rules={[{ required: true, message: t('pleaseUploadLogo') }]}
        >
          <Upload
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={customRequest}
          >
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            ) : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item
          label={t('websiteUrl')}
          name="websiteUrl"
          rules={[{ required: true, message: t('pleaseInputWebsiteUrl') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('description')}
          name="description"
          rules={[{ required: true, message: t('pleaseInputDescription') }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PartnersCreateFormModal;
