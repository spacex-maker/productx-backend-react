import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import ImageUpload from 'src/components/common/ImageUpload';

const { TextArea } = Input;

const UpdateSaI2iOfficialPlayModal = ({ visible, onCancel, onOk, initialValues, confirmLoading }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [beforeUrl, setBeforeUrl] = useState('');
  const [afterUrl, setAfterUrl] = useState('');

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setBeforeUrl(initialValues.referenceBeforeImage || '');
      setAfterUrl(initialValues.referenceAfterImage || '');
    }
  }, [initialValues, form]);

  return (
    <Modal
      title={t('editI2iOfficialPlayTitle')}
      open={visible}
      width={960}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onOk({
              ...values,
              id: initialValues?.id,
              referenceBeforeImage: beforeUrl || values.referenceBeforeImage || '',
              referenceAfterImage: afterUrl || values.referenceAfterImage || '',
            });
          })
          .catch(() => {});
      }}
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="playCode" label={t('i2iPlayCode')}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="category" label={t('i2iPlayCategory')}>
              <Select>
                <Select.Option value="style">{t('i2iPlayCategoryStyle')}</Select.Option>
                <Select.Option value="portrait">{t('i2iPlayCategoryPortrait')}</Select.Option>
                <Select.Option value="fun">{t('i2iPlayCategoryFun')}</Select.Option>
                <Select.Option value="scene">{t('i2iPlayCategoryScene')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="playName" label={t('i2iPlayName')}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="playNameEn" label={t('i2iPlayNameEn')}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="coverEmoji" label={t('i2iPlayEmoji')}>
              <Input maxLength={8} />
            </Form.Item>
          </Col>
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
        <Form.Item name="description" label={t('i2iPlayDescription')}>
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="descriptionEn" label={t('i2iPlayDescriptionEn')}>
          <TextArea rows={2} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="referenceBeforeImage" label={t('i2iPlayRefBefore')}>
              <ImageUpload imageUrl={beforeUrl} onImageChange={setBeforeUrl} type="background" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="referenceAfterImage" label={t('i2iPlayRefAfter')}>
              <ImageUpload imageUrl={afterUrl} onImageChange={setAfterUrl} type="background" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="promptTemplate" label={t('i2iPlayPromptTemplate')}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="promptTemplateEn" label={t('i2iPlayPromptTemplateEn')}>
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSaI2iOfficialPlayModal;
