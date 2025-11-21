import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, DatePicker, Space, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const SaAiModelsCreateFormModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [modelType, setModelType] = useState('llm');

  useEffect(() => {
    if (visible) {
      fetchCompanies();
    } else {
      // 弹窗关闭时清空表单
      form.resetFields();
      setModelType('llm');
    }
  }, [visible, form]);

  const fetchCompanies = async () => {
    setLoadingCompanies(true);
    try {
      const response = await api.get('/manage/sa-ai-companies/enabled');
      if (response && Array.isArray(response)) {
        setCompanies(response);
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  return (
    <Modal
      title={t('addTitle')}
      open={visible}
      width={800}
      onCancel={() => {
        form.resetFields();
        setModelType('llm');
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            // 根据 companyId 获取 companyCode
            const selectedCompany = companies.find(c => c.id === values.companyId);
            const submitValues = {
              ...values,
              companyCode: selectedCompany?.companyCode || '',
              releaseYear: values.releaseYear ? values.releaseYear.format('YYYY-MM-DD') : null
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
          status: true,
          modelType: 'llm',
          contextLength: 4096,
          outputLength: 4096
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="companyId"
              label={t('companyId')}
              rules={[{ required: true, message: t('pleaseSelectCompany') }]}
            >
              <Select
                placeholder={t('pleaseSelectCompany')}
                loading={loadingCompanies}
                showSearch
                filterOption={(input, option) => {
                  const company = companies.find(c => c.id === option.value);
                  if (!company) return false;
                  return company.companyName.toLowerCase().includes(input.toLowerCase()) ||
                         company.companyCode.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {companies.map((company) => (
                  <Select.Option key={company.id} value={company.id}>
                    <Space>
                      {company.logoPath && (
                        <img
                          src={company.logoPath}
                          alt={company.companyName}
                          style={{
                            width: 20,
                            height: 20,
                            objectFit: 'contain',
                            borderRadius: 4,
                          }}
                        />
                      )}
                      <span>{company.companyName}</span>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="modelName"
              label={t('modelName')}
              rules={[{ required: true, message: t('pleaseInputModelName') }]}
            >
              <Input placeholder={t('pleaseInputModelName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="modelCode"
              label={t('modelCode')}
              rules={[{ required: true, message: t('pleaseInputModelCode') }]}
            >
              <Input placeholder={t('pleaseInputModelCode')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="modelType"
              label={t('modelType')}
              rules={[{ required: true, message: t('pleaseSelectModelType') }]}
            >
              <Select 
                placeholder={t('pleaseSelectModelType')}
                onChange={(value) => setModelType(value)}
              >
                <Select.Option value="llm">LLM</Select.Option>
                <Select.Option value="image">Image</Select.Option>
                <Select.Option value="video">Video</Select.Option>
                <Select.Option value="multimodal">Multimodal</Select.Option>
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
              name="releaseYear"
              label={t('releaseYear')}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        {/* LLM 类型字段 */}
        {(modelType === 'llm' || modelType === 'multimodal') && (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="contextLength"
                  label={t('contextLength')}
                  rules={modelType === 'llm' ? [{ required: true, message: t('pleaseInputContextLength') }] : []}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputContextLength')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="thoughtChainLength"
                  label={t('thoughtChainLength')}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputThoughtChainLength')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="outputLength"
                  label={t('outputLength')}
                  rules={modelType === 'llm' ? [{ required: true, message: t('pleaseInputOutputLength') }] : []}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputOutputLength')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="inputPrice"
                  label={t('inputPrice')}
                >
                  <InputNumber style={{ width: '100%' }} min={0} step={0.01} placeholder={t('pleaseInputInputPrice')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="outputPrice"
                  label={t('outputPrice')}
                >
                  <InputNumber style={{ width: '100%' }} min={0} step={0.01} placeholder={t('pleaseInputOutputPrice')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="currency"
                  label={t('currency')}
                >
                  <Input placeholder={t('pleaseInputCurrency')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="unit"
                  label={t('unit')}
                >
                  <Input placeholder={t('pleaseInputUnit')} />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* Image 类型字段 */}
        {(modelType === 'image' || modelType === 'multimodal') && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="imageDefaultResolution"
                  label={t('imageDefaultResolution')}
                >
                  <Input placeholder={t('pleaseInputImageDefaultResolution')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="imageMaxResolution"
                  label={t('imageMaxResolution')}
                >
                  <Input placeholder={t('pleaseInputImageMaxResolution')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="imageAspectRatios"
                  label={t('imageAspectRatios')}
                >
                  <Input placeholder={t('pleaseInputImageAspectRatios')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="imageFormats"
                  label={t('imageFormats')}
                >
                  <Input placeholder={t('pleaseInputImageFormats')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="supportControlnet"
                  label={t('supportControlnet')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="supportInpaint"
                  label={t('supportInpaint')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {/* Video 类型字段 */}
        {(modelType === 'video' || modelType === 'multimodal') && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="videoDefaultResolution"
                  label={t('videoDefaultResolution')}
                >
                  <Input placeholder={t('pleaseInputVideoDefaultResolution')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="videoMaxResolution"
                  label={t('videoMaxResolution')}
                >
                  <Input placeholder={t('pleaseInputVideoMaxResolution')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="videoDuration"
                  label={t('videoDuration')}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputVideoDuration')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="videoFps"
                  label={t('videoFps')}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputVideoFps')} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="videoMaxFrames"
                  label={t('videoMaxFrames')}
                >
                  <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputVideoMaxFrames')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="videoAspectRatios"
                  label={t('videoAspectRatios')}
                >
                  <Input placeholder={t('pleaseInputVideoAspectRatios')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="videoFormats"
                  label={t('videoFormats')}
                >
                  <Input placeholder={t('pleaseInputVideoFormats')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="supportImg2video"
                  label={t('supportImg2video')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="supportVideoEdit"
                  label={t('supportVideoEdit')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="supportCameraMotion"
                  label={t('supportCameraMotion')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="supportCharacterConsistency"
                  label={t('supportCharacterConsistency')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="supportReference"
                  label={t('supportReference')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Form.Item
          name="apiBaseUrl"
          label={t('apiBaseUrl')}
          rules={[{ required: true, message: t('pleaseInputApiBaseUrl') }]}
        >
          <Input placeholder={t('pleaseInputApiBaseUrl')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('description')}
        >
          <Input.TextArea rows={4} placeholder={t('pleaseInputDescription')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaAiModelsCreateFormModal;
