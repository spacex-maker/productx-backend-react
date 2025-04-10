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
  Upload,
  message,
  Button,
  Image,
} from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import ImageUpload from 'src/components/common/ImageUpload';
import './updateSaAiAgentStyle.css';

const UpdateSaAiAgentSystemModel = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  confirmLoading,
  companiesData,
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bgImgUrl, setBgImgUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
      setBgImgUrl(initialValues.bgImg || '');
      setImageUrl(initialValues.avatarUrl || '');
      // 根据当前模型找到对应的公司
      const company = companiesData?.find((c) => 
        c.models.some((m) => m.modelCode === initialValues.modelType)
      );
      setSelectedCompany(company?.id);
    }
  }, [visible, initialValues, form, companiesData]);

  const handleCompanyChange = (value) => {
    const companyId = value?.value;
    form.setFieldsValue({
      modelType: undefined,
      companyId,
    });
    setSelectedCompany(companyId);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values);
    } catch (error) {
      console.error('Form validation failed:', error);
      message.error(t('formValidationFailed'));
    }
  };

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      render: (c) => <Tag>{c}</Tag>,
    },
  ];

  return (
    <Modal
      title={t('editTitle')}
      open={visible}
      width={800}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="id"
          hidden
        >
          <Input />
        </Form.Item>

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
                imageUrl={imageUrl}
                onImageChange={(url) => {
                  setImageUrl(url);
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
                value={selectedCompany}
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
                <Select 
                  placeholder={t('pleaseSelectModelType')}
                  allowClear
                >
                  {companiesData
                    ?.find((c) => c.id === selectedCompany)
                    ?.models.map((model) => (
                      <Select.Option
                        key={model.id}
                        value={model.modelCode}
                        title={model.description}
                      >
                        {model.description}
                      </Select.Option>
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
                <Select.Option value="ISTJ">ISTJ</Select.Option>
                <Select.Option value="ISFJ">ISFJ</Select.Option>
                <Select.Option value="INFJ">INFJ</Select.Option>
                <Select.Option value="INTJ">INTJ</Select.Option>
                <Select.Option value="ISTP">ISTP</Select.Option>
                <Select.Option value="ISFP">ISFP</Select.Option>
                <Select.Option value="INFP">INFP</Select.Option>
                <Select.Option value="INTP">INTP</Select.Option>
                <Select.Option value="ESTP">ESTP</Select.Option>
                <Select.Option value="ESFP">ESFP</Select.Option>
                <Select.Option value="ENFP">ENFP</Select.Option>
                <Select.Option value="ENTP">ENTP</Select.Option>
                <Select.Option value="ESTJ">ESTJ</Select.Option>
                <Select.Option value="ESFJ">ESFJ</Select.Option>
                <Select.Option value="ENFJ">ENFJ</Select.Option>
                <Select.Option value="ENTJ">ENTJ</Select.Option>
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
                <Select.Option value="active">{t('active')}</Select.Option>
                <Select.Option value="inactive">{t('inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

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
                placeholder={t('pleaseInputTemperature')}
                style={{ width: '100%' }}
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
                max={32000}
                placeholder={t('pleaseInputMaxTokens')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="prompt"
          label={t('prompt')}
          rules={[{ required: true, message: t('pleaseInputPrompt') }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder={t('pleaseInputPrompt')}
            showCount
            maxLength={1000}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSaAiAgentSystemModel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  confirmLoading: PropTypes.bool,
  companiesData: PropTypes.array
};

export default UpdateSaAiAgentSystemModel; 