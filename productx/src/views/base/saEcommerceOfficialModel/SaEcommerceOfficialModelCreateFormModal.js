import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import ImageUpload from 'src/components/common/ImageUpload';

const { TextArea } = Input;

const modelFormFields = (t, faceUrl, setFaceUrl, bodyUrl, setBodyUrl, composedUrl, setComposedUrl) => (
  <>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="modelCode" label={t('ecomModelCode')}>
          <Input placeholder={t('ecomModelCodeAutoHint')} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="gender" label={t('ecomModelGender')}>
          <Select placeholder={t('ecomModelGender')}>
            <Select.Option value="female">{t('ecomModelGenderFemale')}</Select.Option>
            <Select.Option value="male">{t('ecomModelGenderMale')}</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="modelName"
          label={t('ecomModelName')}
          rules={[{ required: true, message: t('pleaseInput') }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="modelNameEn" label={t('ecomModelNameEn')}>
          <Input />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="bodyType" label={t('ecomModelBodyType')}>
          <Input placeholder={t('ecomModelBodyTypeHint')} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="poseKey" label={t('ecomModelPose')}>
          <Select placeholder={t('ecomModelPose')} allowClear>
            <Select.Option value="standing">{t('ecomModelPoseStanding')}</Select.Option>
            <Select.Option value="walking">{t('ecomModelPoseWalking')}</Select.Option>
            <Select.Option value="three_quarter">{t('ecomModelPoseThreeQuarter')}</Select.Option>
            <Select.Option value="sit">{t('ecomModelPoseSit')}</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={6}>
        <Form.Item name="sortOrder" label={t('sortOrder')}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item name="status" label={t('status')}>
          <Select>
            <Select.Option value={1}>{t('active')}</Select.Option>
            <Select.Option value={0}>{t('inactive')}</Select.Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
    <Form.Item name="description" label={t('ecomModelDescription')}>
      <TextArea rows={2} />
    </Form.Item>
    <Form.Item name="promptSnippet" label={t('ecomModelPromptSnippet')}>
      <TextArea rows={3} placeholder={t('ecomModelPromptSnippetHint')} />
    </Form.Item>
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="faceImageUrl" label={t('ecomModelFaceImage')}>
          <ImageUpload
            imageUrl={faceUrl}
            onImageChange={(url) => setFaceUrl(url)}
            type="background"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="bodyImageUrl" label={t('ecomModelBodyImage')}>
          <ImageUpload
            imageUrl={bodyUrl}
            onImageChange={(url) => setBodyUrl(url)}
            type="background"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          name="composedImageUrl"
          label={t('ecomModelComposedImage')}
          rules={[{ required: true, message: t('pleaseInput') }]}
        >
          <ImageUpload
            imageUrl={composedUrl}
            onImageChange={(url) => setComposedUrl(url)}
            type="background"
          />
        </Form.Item>
      </Col>
    </Row>
  </>
);

const SaEcommerceOfficialModelCreateFormModal = ({ visible, onCancel, onOk, confirmLoading }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [faceUrl, setFaceUrl] = useState('');
  const [bodyUrl, setBodyUrl] = useState('');
  const [composedUrl, setComposedUrl] = useState('');

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setFaceUrl('');
      setBodyUrl('');
      setComposedUrl('');
    }
  }, [visible, form]);

  return (
    <Modal
      title={t('addEcomOfficialModelTitle')}
      open={visible}
      width={960}
      onCancel={() => {
        form.resetFields();
        setFaceUrl('');
        setBodyUrl('');
        setComposedUrl('');
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk({
              ...values,
              faceImageUrl: faceUrl || values.faceImageUrl || '',
              bodyImageUrl: bodyUrl || values.bodyImageUrl || '',
              composedImageUrl: composedUrl || values.composedImageUrl || '',
            });
          })
          .catch(() => {});
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 1, sortOrder: 0, gender: 'female' }}
      >
        {modelFormFields(t, faceUrl, setFaceUrl, bodyUrl, setBodyUrl, composedUrl, setComposedUrl)}
      </Form>
    </Modal>
  );
};

export default SaEcommerceOfficialModelCreateFormModal;
