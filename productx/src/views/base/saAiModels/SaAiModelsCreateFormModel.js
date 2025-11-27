import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, DatePicker, Space, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';
import ImageUpload from 'src/components/common/ImageUpload';

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
  const [taskTypes, setTaskTypes] = useState([]);
  const [loadingTaskTypes, setLoadingTaskTypes] = useState(false);
  const [modelType, setModelType] = useState('llm');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  useEffect(() => {
    if (visible) {
      fetchCompanies();
      fetchTaskTypes();
      } else {
      // 弹窗关闭时清空表单
      form.resetFields();
      setModelType('');
      setCoverImageUrl('');
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

  const fetchTaskTypes = async () => {
    setLoadingTaskTypes(true);
    try {
      const response = await api.get('/manage/base/task-types/list');
      if (response && Array.isArray(response)) {
        setTaskTypes(response);
      }
    } catch (error) {
      console.error('Failed to fetch task types:', error);
    } finally {
      setLoadingTaskTypes(false);
    }
  };

  // 判断是否为生图相关的任务类型
  const isImageTaskType = (taskTypeCode) => {
    const imageTaskTypes = [
      't2i', 'i2i', 'upscale', 'restore', 'inpainting', 
      'outpainting', 'style_transfer', 'remove_bg', 'colorize', 'enhance'
    ];
    return imageTaskTypes.includes(taskTypeCode);
  };

  // 判断是否为生视频相关的任务类型
  const isVideoTaskType = (taskTypeCode) => {
    const videoTaskTypes = [
      't2v', 'i2v', 'v2v', 'video_upscale', 'video_enhance', 'a2v'
    ];
    return videoTaskTypes.includes(taskTypeCode);
  };

  // 判断是否为文本/LLM相关的任务类型
  const isTextTaskType = (taskTypeCode) => {
    const textTaskTypes = [
      'chat', 'qa', 'completion', 'rewrite', 'translate', 'summarize'
    ];
    return textTaskTypes.includes(taskTypeCode);
  };

  return (
    <Modal
      title={t('addTitle')}
      open={visible}
      width={800}
      onCancel={() => {
        form.resetFields();
        setModelType('');
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
              releaseYear: values.releaseYear ? values.releaseYear.format('YYYY-MM-DD') : null,
              cover_image: values.coverImage || '',
              // 将 imageAspectRatios 数组转换为逗号分隔的字符串
              imageAspectRatios: Array.isArray(values.imageAspectRatios) 
                ? values.imageAspectRatios.join(',') 
                : values.imageAspectRatios,
              // 将 videoAspectRatios 数组转换为逗号分隔的字符串
              videoAspectRatios: Array.isArray(values.videoAspectRatios) 
                ? values.videoAspectRatios.join(',') 
                : values.videoAspectRatios,
              // 将 videoFormats 数组转换为逗号分隔的字符串
              videoFormats: Array.isArray(values.videoFormats) 
                ? values.videoFormats.join(',') 
                : values.videoFormats,
              // 将 videoAspectResolution 数组转换为逗号分隔的字符串
              videoAspectResolution: Array.isArray(values.videoAspectResolution) 
                ? values.videoAspectResolution.join(',') 
                : values.videoAspectResolution,
              // 将 videoDurationEnum 数组转换为逗号分隔的字符串
              videoDurationEnum: Array.isArray(values.videoDurationEnum) 
                ? values.videoDurationEnum.join(',') 
                : values.videoDurationEnum,
              // 将 videoSupportStyle 数组转换为逗号分隔的字符串
              videoSupportStyle: Array.isArray(values.videoSupportStyle) 
                ? values.videoSupportStyle.join(',') 
                : values.videoSupportStyle,
              // 将 videoAspectRatiosEnum 数组转换为逗号分隔的字符串
              videoAspectRatiosEnum: Array.isArray(values.videoAspectRatiosEnum) 
                ? values.videoAspectRatiosEnum.join(',') 
                : values.videoAspectRatiosEnum
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
          status: true
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
                loading={loadingTaskTypes}
                onChange={(value) => setModelType(value)}
                showSearch
                filterOption={(input, option) => {
                  const taskType = taskTypes.find(t => t.code === option.value);
                  if (!taskType) return false;
                  return taskType.englishName.toLowerCase().includes(input.toLowerCase()) ||
                         taskType.description.toLowerCase().includes(input.toLowerCase()) ||
                         taskType.code.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {taskTypes.map((taskType) => (
                  <Select.Option key={taskType.code} value={taskType.code}>
                    {taskType.englishName} ({taskType.description})
                  </Select.Option>
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

        {/* LLM/文本 类型字段 */}
        {isTextTaskType(modelType) && (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="contextLength"
                  label={t('contextLength')}
                  rules={[{ required: true, message: t('pleaseInputContextLength') }]}
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
                  rules={[{ required: true, message: t('pleaseInputOutputLength') }]}
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
                  <Select placeholder={t('pleaseSelectCurrency')}>
                    <Select.Option value="USD">USD (美元)</Select.Option>
                    <Select.Option value="CNY">CNY (人民币)</Select.Option>
                  </Select>
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
        {isImageTaskType(modelType) && (
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
                  <Select
                    mode="multiple"
                    placeholder={t('pleaseSelectImageAspectRatios')}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="16:9">16:9 (横屏)</Select.Option>
                    <Select.Option value="9:16">9:16 (竖屏)</Select.Option>
                    <Select.Option value="4:3">4:3 (传统横屏)</Select.Option>
                    <Select.Option value="3:4">3:4 (传统竖屏)</Select.Option>
                    <Select.Option value="1:1">1:1 (正方形)</Select.Option>
                    <Select.Option value="21:9">21:9 (超宽屏)</Select.Option>
                    <Select.Option value="2:1">2:1 (宽屏)</Select.Option>
                    <Select.Option value="1:2">1:2 (竖屏宽)</Select.Option>
                  </Select>
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
        {isVideoTaskType(modelType) && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="videoDefaultResolution"
                  label={t('videoDefaultResolution')}
                >
                  <Select
                    placeholder={t('pleaseSelectVideoDefaultResolution')}
                    allowClear
                    showSearch
                    filterOption={(input, option) => {
                      const label = option?.children || option?.label || '';
                      return String(label).toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    <Select.Option value="854x480">854x480 (480p SD)</Select.Option>
                    <Select.Option value="1280x720">1280x720 (720p HD)</Select.Option>
                    <Select.Option value="1920x1080">1920x1080 (1080p Full HD)</Select.Option>
                    <Select.Option value="2560x1440">2560x1440 (1440p 2K)</Select.Option>
                    <Select.Option value="3840x2160">3840x2160 (2160p 4K UHD)</Select.Option>
                  </Select>
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
              <Col span={24}>
                <Form.Item
                  name="videoAspectResolution"
                  label={t('videoAspectResolution')}
                >
                  <Select
                    mode="multiple"
                    placeholder={t('pleaseSelectVideoAspectResolution')}
                    allowClear
                    showSearch
                    filterOption={(input, option) => {
                      const label = option?.children || option?.label || '';
                      return String(label).toLowerCase().includes(input.toLowerCase());
                    }}
                  >
                    <Select.Option value="854x480">854x480 (480p SD)</Select.Option>
                    <Select.Option value="1280x720">1280x720 (720p HD)</Select.Option>
                    <Select.Option value="1920x1080">1920x1080 (1080p Full HD)</Select.Option>
                    <Select.Option value="2560x1440">2560x1440 (1440p 2K)</Select.Option>
                    <Select.Option value="3840x2160">3840x2160 (2160p 4K UHD)</Select.Option>
                  </Select>
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
                  <Select
                    mode="multiple"
                    placeholder={t('pleaseSelectVideoAspectRatios')}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="16:9">16:9 (横屏)</Select.Option>
                    <Select.Option value="9:16">9:16 (竖屏)</Select.Option>
                    <Select.Option value="4:3">4:3 (传统横屏)</Select.Option>
                    <Select.Option value="3:4">3:4 (传统竖屏)</Select.Option>
                    <Select.Option value="1:1">1:1 (正方形)</Select.Option>
                    <Select.Option value="21:9">21:9 (超宽屏)</Select.Option>
                    <Select.Option value="2:1">2:1 (宽屏)</Select.Option>
                    <Select.Option value="1:2">1:2 (竖屏宽)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="videoFormats"
                  label={t('videoFormats')}
                >
                  <Select
                    mode="multiple"
                    placeholder={t('pleaseSelectVideoFormats')}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="mp4">MP4</Select.Option>
                    <Select.Option value="avi">AVI</Select.Option>
                    <Select.Option value="mov">MOV</Select.Option>
                    <Select.Option value="webm">WebM</Select.Option>
                    <Select.Option value="mkv">MKV</Select.Option>
                    <Select.Option value="flv">FLV</Select.Option>
                    <Select.Option value="wmv">WMV</Select.Option>
                    <Select.Option value="m4v">M4V</Select.Option>
                    <Select.Option value="3gp">3GP</Select.Option>
                    <Select.Option value="ogv">OGV</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="outputPrice"
                  label={t('videoOutputPrice')}
                >
                  <InputNumber style={{ width: '100%' }} min={0} step={0.01} placeholder={t('pleaseInputVideoOutputPrice')} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="currency"
                  label={t('currency')}
                >
                  <Select placeholder={t('pleaseSelectCurrency')}>
                    <Select.Option value="USD">USD (美元)</Select.Option>
                    <Select.Option value="CNY">CNY (人民币)</Select.Option>
                  </Select>
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

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="videoQuality"
                  label={t('videoQuality')}
                >
                  <Select placeholder={t('pleaseSelectVideoQuality')}>
                    <Select.Option value="standard">Standard (标准)</Select.Option>
                    <Select.Option value="high">High (高清)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="videoRemoveWatermark"
                  label={t('videoRemoveWatermark')}
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="videoDurationEnum"
                  label={t('videoDurationEnum')}
                >
                  <Select
                    mode="multiple"
                    placeholder={t('pleaseSelectVideoDurationEnum')}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="10">10秒</Select.Option>
                    <Select.Option value="15">15秒</Select.Option>
                    <Select.Option value="25">25秒</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="videoSupportStyle"
                  label={t('videoSupportStyle')}
                >
                  <Select
                    mode="multiple"
                    placeholder={t('pleaseSelectVideoSupportStyle')}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="fun">Fun (有趣)</Select.Option>
                    <Select.Option value="normal">Normal (正常)</Select.Option>
                    <Select.Option value="spicy">Spicy (辛辣)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="videoAspectRatiosEnum"
                  label={t('videoAspectRatiosEnum')}
                >
                  <Select
                    mode="multiple"
                    placeholder={t('pleaseSelectVideoAspectRatiosEnum')}
                    allowClear
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="portrait">Portrait (竖屏)</Select.Option>
                    <Select.Option value="landscape">Landscape (横屏)</Select.Option>
                  </Select>
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
