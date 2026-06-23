import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';
import ImageUpload from 'src/components/common/ImageUpload';

const UpdateSaAiVoiceModelsModal = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  confirmLoading,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [engines, setEngines] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState('');

  useEffect(() => {
    if (visible) {
      fetchCompanies();
      fetchEngines();
    }
  }, [visible]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setCoverImageUrl(initialValues.coverImage || '');
    }
  }, [initialValues, form]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/manage/sa-ai-companies/enabled');
      if (response && Array.isArray(response)) {
        setCompanies(response);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchEngines = async () => {
    try {
      const response = await api.get('/manage/sa-ai-models/list', {
        params: { currentPage: 1, pageSize: 200, modelType: 't2a' },
      });
      setEngines(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch TTS engines:', error);
    }
  };

  return (
    <Modal
      title={t('editVoiceTitle')}
      open={visible}
      width={900}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            const selectedCompany = companies.find((c) => c.id === values.companyId);
            onOk({
              ...values,
              id: initialValues?.id,
              companyCode: selectedCompany?.companyCode || initialValues?.companyCode || '',
            });
          })
          .catch(() => {});
      }}
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="companyId" label={t('companyId')}>
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                options={companies.map((c) => ({ value: c.id, label: `${c.companyName} (${c.companyCode})` }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="engineModelCode" label={t('engineModelCode')} rules={[{ required: true }]}>
              <Select
                showSearch
                optionFilterProp="label"
                options={engines.map((e) => ({ value: e.modelCode, label: `${e.modelName} (${e.modelCode})` }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="voiceCode" label={t('voiceCode')} rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="voiceName" label={t('voiceName')} rules={[{ required: true }]}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="voiceNameEn" label={t('voiceNameEn')}><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}><Form.Item name="language" label={t('language')}><Input /></Form.Item></Col>
          <Col span={6}>
            <Form.Item name="gender" label={t('gender')}>
              <Select allowClear options={[
                { value: 'male', label: t('male') },
                { value: 'female', label: t('female') },
                { value: 'neutral', label: t('neutral') },
              ]} />
            </Form.Item>
          </Col>
          <Col span={6}><Form.Item name="style" label={t('style')}><Input /></Form.Item></Col>
          <Col span={6}><Form.Item name="dialect" label={t('dialect')}><Input /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="ttsModel" label={t('ttsModel')}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="resourceId" label={t('resourceId')}><Input /></Form.Item></Col>
          <Col span={8}><Form.Item name="tokenCost" label={t('tokenCost')}><InputNumber style={{ width: '100%' }} min={0} step={0.0001} /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}><Form.Item name="sampleRate" label={t('sampleRate')}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={6}><Form.Item name="audioFormats" label={t('audioFormats')}><Input /></Form.Item></Col>
          <Col span={6}><Form.Item name="defaultFormat" label={t('defaultFormat')}><Input /></Form.Item></Col>
          <Col span={6}><Form.Item name="maxTextLength" label={t('maxTextLength')}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}><Form.Item name="supportEmotion" label={t('supportEmotion')} valuePropName="checked"><Switch /></Form.Item></Col>
          <Col span={6}><Form.Item name="supportContextTexts" label={t('supportContextTexts')} valuePropName="checked"><Switch /></Form.Item></Col>
          <Col span={6}><Form.Item name="supportSubtitle" label={t('supportSubtitle')} valuePropName="checked"><Switch /></Form.Item></Col>
          <Col span={6}><Form.Item name="supportDialect" label={t('supportDialect')} valuePropName="checked"><Switch /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="supportEmotions" label={t('supportEmotions')}><Input /></Form.Item></Col>
          <Col span={6}><Form.Item name="sortOrder" label={t('sortOrder')}><InputNumber style={{ width: '100%' }} /></Form.Item></Col>
          <Col span={6}><Form.Item name="status" label={t('status')} valuePropName="checked"><Switch /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="previewUrl" label={t('previewUrl')}><Input /></Form.Item></Col>
          <Col span={12}>
            <Form.Item name="coverImage" label={t('coverImage')}>
              <ImageUpload
                imageUrl={coverImageUrl}
                onImageChange={(url) => {
                  setCoverImageUrl(url);
                  form.setFieldsValue({ coverImage: url });
                }}
                type="background"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateSaAiVoiceModelsModal;
