import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';
import ImageUpload from 'src/components/common/ImageUpload';

const { TextArea } = Input;

const SaAiVideoIndustriesCreateFormModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [coverImageUrl, setCoverImageUrl] = useState('');

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setCoverImageUrl('');
    }
  }, [visible, form]);

  return (
    <Modal
      title={t('addTitle')}
      open={visible}
      width={800}
      onCancel={() => {
        form.resetFields();
        setCoverImageUrl('');
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            const submitValues = {
              ...values,
              coverImage: values.coverImage || '',
              // 将 recommendModels 数组转换为逗号分隔的字符串
              recommendModels: Array.isArray(values.recommendModels) 
                ? values.recommendModels.join(',') 
                : values.recommendModels || '',
              // samplePrompts 如果是数组，转换为JSON字符串
              samplePrompts: Array.isArray(values.samplePrompts) 
                ? JSON.stringify(values.samplePrompts) 
                : values.samplePrompts || '',
            };
            onOk(submitValues);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          lang: 'zh-CN',
          status: true,
          sortWeight: 0,
          hotCount: 0,
          projectCount: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="lang"
              label={t('lang')}
              rules={[{ required: true, message: t('pleaseSelectLang') }]}
            >
              <Select placeholder={t('pleaseSelectLang')}>
                <Select.Option value="zh-CN">中文</Select.Option>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="ja">日本語</Select.Option>
                <Select.Option value="ko">한국어</Select.Option>
                <Select.Option value="es">Español</Select.Option>
                <Select.Option value="fr">Français</Select.Option>
                <Select.Option value="de">Deutsch</Select.Option>
                <Select.Option value="it">Italiano</Select.Option>
                <Select.Option value="ru">Русский</Select.Option>
                <Select.Option value="ar">العربية</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label={t('status')}
              rules={[{ required: true, message: t('pleaseSelectStatus') }]}
            >
              <Select placeholder={t('pleaseSelectStatus')}>
                <Select.Option value={true}>{t('active')}</Select.Option>
                <Select.Option value={false}>{t('inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="industryCode"
              label={t('industryCode')}
              rules={[{ required: true, message: t('pleaseInputIndustryCode') }]}
            >
              <Input placeholder={t('pleaseInputIndustryCode')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sortWeight"
              label={t('sortWeight')}
            >
              <InputNumber style={{ width: '100%' }} min={0} placeholder={t('pleaseInputSortWeight')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="industryName"
              label={t('industryName')}
              rules={[{ required: true, message: t('pleaseInputIndustryName') }]}
            >
              <Input placeholder={t('pleaseInputIndustryName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="industryNameEn"
              label={t('industryNameEn')}
            >
              <Input placeholder={t('pleaseInputIndustryNameEn')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label={t('description')}
            >
              <TextArea rows={3} placeholder={t('pleaseInputDescription')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="descriptionEn"
              label={t('descriptionEn')}
            >
              <TextArea rows={3} placeholder={t('pleaseInputDescriptionEn')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="coverImage"
              label={t('coverImage')}
            >
              <ImageUpload
                imageUrl={coverImageUrl}
                onImageChange={(url) => {
                  setCoverImageUrl(url);
                  form.setFieldsValue({ coverImage: url });
                }}
                type="background"
                tipText={t('coverImageTip')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="recommendModels"
              label={t('recommendModels')}
            >
              <Select
                mode="tags"
                placeholder={t('pleaseInputRecommendModels')}
                tokenSeparators={[',']}
                style={{ width: '100%' }}
              >
                <Select.Option value="sora">sora</Select.Option>
                <Select.Option value="stable-video">stable-video</Select.Option>
                <Select.Option value="runway-ml">runway-ml</Select.Option>
                <Select.Option value="pika">pika</Select.Option>
                <Select.Option value="luma">luma</Select.Option>
                <Select.Option value="kling">kling</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="samplePrompts"
              label={t('samplePrompts')}
              tooltip={t('samplePromptsTooltip')}
            >
              <TextArea 
                rows={4} 
                placeholder={t('pleaseInputSamplePrompts')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="tips"
              label={t('tips')}
            >
              <TextArea rows={2} placeholder={t('pleaseInputTips')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SaAiVideoIndustriesCreateFormModal;

