import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Avatar,
  Tag,
  message,
  Upload,
  Button,
  Image,
} from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import api from 'src/axiosInstance';
import { UploadOutlined } from '@ant-design/icons';
import ImageUpload from 'src/components/common/ImageUpload';

const MBTI_OPTIONS = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'active' },
  { value: 'inactive', label: 'inactive' },
  { value: 'archived', label: 'archived' },
];

const tagRenderPropTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.any.isRequired,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
};

const SaAiAgentSystemCreateFormModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  companiesData = [],
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bgImgUrl, setBgImgUrl] = useState('');

  const handleCompanyChange = (value) => {
    setSelectedCompany(value.value);
    form.setFieldsValue({ modelType: undefined });
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const company = companiesData.find((c) => c.id === value);
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <Avatar src={company?.logoPath} size="small" />
        {label}
      </Tag>
    );
  };

  tagRender.propTypes = tagRenderPropTypes;

  const initialValues = {
    temperature: 0.7,
    maxTokens: 2000,
    status: 'active',
  };

  return (
    <Modal
      title={t('addSystemTitle')}
      open={visible}
      width={800}
      onCancel={() => {
        form.resetFields();
        setAvatarUrl('');
        setBgImgUrl('');
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk({ ...values, isSystem: true })
              .then(() => {
                form.resetFields();
                setAvatarUrl('');
                setBgImgUrl('');
              });
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
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="bgImg"
              label={t('bgImg')}
              rules={[{ required: true, message: t('pleaseUploadBgImg') }]}
            >
              <ImageUpload 
                imageUrl={bgImgUrl}
                onImageChange={(url) => {
                  setBgImgUrl(url);
                  form.setFieldsValue({ bgImg: url });
                }}
                type="background"
                tipText={t('bgImgTip')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="name"
              label={t('agentName')}
              rules={[{ required: true, message: t('pleaseInputAgentName') }]}
            >
              <Input placeholder={t('pleaseInputAgentName')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="avatarUrl"
              label={t('avatarUrl')}
              style={{ marginBottom: 0 }}
            >
              <ImageUpload 
                imageUrl={avatarUrl}
                onImageChange={(url) => {
                  setAvatarUrl(url);
                  form.setFieldsValue({ avatarUrl: url });
                }}
                type="avatar"
                tipText={t('avatarTip')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="companyId"
              label={t('company')}
            >
              <Select
                placeholder={t('pleaseSelectCompany')}
                onChange={handleCompanyChange}
                labelInValue
                optionLabelProp="label"
                allowClear
              >
                {companiesData?.map((company) => (
                  <Select.Option
                    key={company.id}
                    value={company.id}
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar src={company.logoPath} size="small" />
                        <span>{company.companyName}</span>
                      </div>
                    }
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Avatar src={company.logoPath} size="small" />
                      <span>{company.companyName}</span>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="modelType"
              label={t('modelType')}
              rules={[{ required: true, message: t('pleaseSelectModelType') }]}
            >
              {selectedCompany ? (
                <Select placeholder={t('pleaseSelectModelType')} allowClear>
                  {companiesData
                    ?.find((c) => c.id === selectedCompany)
                    ?.models.map((model) => (
                      <Select.Option key={model.id} value={model.modelCode} title={model.description}>{model.description}</Select.Option>
                    ))}
                </Select>
              ) : (
                <Input placeholder={t('pleaseInputModelType')} />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="roles"
          label={t('roles')}
          rules={[{ required: true, message: t('pleaseInputRoles') }]}
        >
          <Input placeholder={t('pleaseInputRoles')} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="mbtiCode"
              label={t('mbtiCode')}
              rules={[{ required: true, message: t('pleaseInputMbtiCode') }]}
            >
              <Select placeholder={t('pleaseSelectMbtiCode')}>
                {MBTI_OPTIONS.map((mbtiOption) => (
                  <Select.Option key={mbtiOption} value={mbtiOption}>{mbtiOption}</Select.Option>
                ))}
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
                {STATUS_OPTIONS.map((statusOption) => (
                  <Select.Option key={statusOption.value} value={statusOption.value}>{t(statusOption.label)}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="prompt"
          label={t('prompt')}
          rules={[{ required: true, message: t('pleaseInputPrompt') }]}
        >
          <Input.TextArea rows={4} placeholder={t('pleaseInputPrompt')} showCount maxLength={1000} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="temperature"
              label={t('temperature')}
              rules={[{ required: true, message: t('pleaseInputTemperature') }]}
            >
              <InputNumber
                min={0}
                max={2}
                step={0.1}
                style={{ width: '100%' }}
                placeholder={t('pleaseInputTemperature')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="maxTokens"
              label={t('maxTokens')}
              rules={[{ required: true, message: t('pleaseInputMaxTokens') }]}
            >
              <InputNumber
                min={1}
                max={4096}
                style={{ width: '100%' }}
                placeholder={t('pleaseInputMaxTokens')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

SaAiAgentSystemCreateFormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  confirmLoading: PropTypes.bool.isRequired,
  companiesData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      companyName: PropTypes.string,
      logoPath: PropTypes.string,
      models: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          modelCode: PropTypes.string,
          modelName: PropTypes.string,
          description: PropTypes.string,
        }),
      ),
    }),
  ),
};

export default SaAiAgentSystemCreateFormModal; 