import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, DatePicker, message } from 'antd';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';
import dayjs from 'dayjs';
import api from 'src/axiosInstance';

const { Option } = Select;
const { TextArea } = Input;

const SysDailyChallengeCreateModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
  statusOptions,
}) => {
  const [coverUrl, setCoverUrl] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [modelList, setModelList] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCoverUrl('');
      setReferenceImageUrl('');
      form.resetFields();
    } else {
      // 当模态框打开时，获取模型列表
      fetchModelList();
    }
  }, [isVisible, form]);

  const fetchModelList = async () => {
    setLoadingModels(true);
    try {
      const response = await api.get('/manage/sa-ai-models/list', {
        params: { 
          currentPage: 1, 
          pageSize: 1000, 
          status: true // 只获取启用的模型
        },
      });

      if (response && response.data) {
        setModelList(response.data);
      }
    } catch (error) {
      console.error('获取模型列表失败', error);
      message.error(t('fetchModelListFailed'));
    } finally {
      setLoadingModels(false);
    }
  };

  const handleFinish = (values) => {
    // 转换日期时间格式
    const formattedValues = {
      ...values,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
      votingEndTime: values.votingEndTime ? values.votingEndTime.format('YYYY-MM-DD HH:mm:ss') : null,
    };
    onFinish(formattedValues);
  };

  return (
    <Modal
      title={t('addChallenge')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={800}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          status: 0,
        }}
      >
        <Form.Item
          label={t('challengeTitle')}
          name="title"
          rules={[{ required: true, message: t('pleaseEnterChallengeTitle') }]}
        >
          <Input placeholder={t('challengeTitlePlaceholder')} maxLength={100} />
        </Form.Item>

        <Form.Item
          label={t('detailedRulesDescription')}
          name="description"
        >
          <TextArea 
            rows={4}
            placeholder={t('pleaseEnterDetailedRulesDescription')}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('activityCoverImage')}
              name="coverUrl"
            >
              <ImageUpload
                imageUrl={coverUrl}
                onImageChange={(url) => {
                  setCoverUrl(url);
                  form.setFieldsValue({ coverUrl: url });
                }}
                type="background"
                tipText={t('uploadHorizontalImageTip')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('imageToImageBaseImage')}
              name="referenceImageUrl"
            >
              <ImageUpload
                imageUrl={referenceImageUrl}
                onImageChange={(url) => {
                  setReferenceImageUrl(url);
                  form.setFieldsValue({ referenceImageUrl: url });
                }}
                type="background"
                tipText={t('imageToImageBaseImageTip')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('requiredTags')}
          name="requiredTags"
        >
          <TextArea 
            rows={2}
            placeholder={t('requiredTagsPlaceholder')}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('specifiedModelKey')}
              name="requiredModel"
            >
              <Select 
                placeholder={t('pleaseSelectModel')} 
                allowClear
                loading={loadingModels}
                showSearch
                filterOption={(input, option) => {
                  const label = String(option?.label ?? '');
                  const value = String(option?.value ?? '');
                  return label.toLowerCase().includes(input.toLowerCase()) ||
                         value.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {modelList.map((model) => (
                  <Option key={model.id} value={model.modelCode} label={model.modelName}>
                    {model.modelName} ({model.modelCode})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('status')}
              name="status"
            >
              <Select placeholder={t('pleaseSelectStatus')}>
                {statusOptions.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t('submissionStartTime')}
              name="startTime"
              rules={[{ required: true, message: t('pleaseSelectSubmissionStartTime') }]}
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder={t('pleaseSelectSubmissionStartTime')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('submissionDeadline')}
              name="endTime"
              rules={[{ required: true, message: t('pleaseSelectSubmissionDeadline') }]}
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder={t('pleaseSelectSubmissionDeadline')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('votingAnnouncementDeadline')}
              name="votingEndTime"
              rules={[{ required: true, message: t('pleaseSelectVotingAnnouncementDeadline') }]}
            >
              <DatePicker 
                showTime 
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                placeholder={t('pleaseSelectVotingAnnouncementDeadline')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('rewardsConfig')}
          name="rewardsConfig"
        >
          <TextArea 
            rows={3}
            placeholder={t('rewardsConfigPlaceholder')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

SysDailyChallengeCreateModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default SysDailyChallengeCreateModal;

