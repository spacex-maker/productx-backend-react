import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, DatePicker, message, theme } from 'antd';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';
import dayjs from 'dayjs';
import api from 'src/axiosInstance';
import MDEditor from '@uiw/react-md-editor';

const { Option } = Select;
const { TextArea } = Input;

// Markdown 编辑器包装组件，用于与 Ant Design Form 集成
// Form.Item 会自动注入 value 和 onChange 属性
const MarkdownEditor = ({ value = '', onChange, placeholder, ...rest }) => {
  const { token } = theme.useToken();

  const handleChange = (val) => {
    if (onChange) {
      onChange(val || '');
    }
  };

  return (
    <div data-color-mode={token.colorBgContainer === '#ffffff' ? 'light' : 'dark'}>
      <MDEditor
        value={value || ''}
        onChange={handleChange}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={false}
        textareaProps={{
          placeholder: placeholder || '请输入 Markdown 内容...',
          style: {
            fontSize: 14,
            minHeight: 300,
          },
        }}
        {...rest}
      />
    </div>
  );
};

MarkdownEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

const UpdateSysDailyChallengeModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateChallenge,
  selectedChallenge,
  t,
  statusOptions,
}) => {
  const { token } = theme.useToken();
  const [coverUrl, setCoverUrl] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');
  const [modelList, setModelList] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // 当模态框打开时，获取模型列表
      fetchModelList();
    }
  }, [isVisible]);

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
    console.log('handleFinish 被调用', values);
    // 转换日期时间格式
    // 将标签数组转换为JSON字符串
    const formattedValues = {
      ...values,
      startTime: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : null,
      endTime: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : null,
      votingEndTime: values.votingEndTime ? values.votingEndTime.format('YYYY-MM-DD HH:mm:ss') : null,
      requiredTags: Array.isArray(values.requiredTags) 
        ? JSON.stringify(values.requiredTags) 
        : (values.requiredTags || ''),
    };
    console.log('formattedValues', formattedValues);
    handleUpdateChallenge(formattedValues);
  };

  const handleFinishFailed = (errorInfo) => {
    console.error('表单验证失败', errorInfo);
    message.error(t('pleaseCheckFormInput'));
  };

  useEffect(() => {
    if (selectedChallenge && isVisible) {
      const coverUrlValue = selectedChallenge.coverUrl || '';
      const referenceImageUrlValue = selectedChallenge.referenceImageUrl || '';
      
      setCoverUrl(coverUrlValue);
      setReferenceImageUrl(referenceImageUrlValue);
      
      // 安全地解析日期
      const parseDate = (dateStr) => {
        if (!dateStr) return null;
        const parsed = dayjs(dateStr);
        return parsed.isValid() ? parsed : null;
      };

      // 解析 requiredTags JSON 字符串为数组
      let requiredTagsArray = [];
      if (selectedChallenge.requiredTags) {
        try {
          requiredTagsArray = JSON.parse(selectedChallenge.requiredTags);
          if (!Array.isArray(requiredTagsArray)) {
            requiredTagsArray = [];
          }
        } catch (e) {
          console.error('解析 requiredTags 失败', e);
          requiredTagsArray = [];
        }
      }

      // 解析 rewardsConfig JSON 字符串为表单字段
      let rewardFirstBadge = '';
      let rewardFirstTokens = undefined;
      let rewardSecondBadge = '';
      let rewardSecondTokens = undefined;
      let rewardThirdBadge = '';
      let rewardThirdTokens = undefined;

      if (selectedChallenge.rewardsConfig) {
        try {
          const rewardsConfig = JSON.parse(selectedChallenge.rewardsConfig);
          if (rewardsConfig.first) {
            rewardFirstBadge = rewardsConfig.first.badge || '';
            rewardFirstTokens = rewardsConfig.first.tokens;
          }
          if (rewardsConfig.second) {
            rewardSecondBadge = rewardsConfig.second.badge || '';
            rewardSecondTokens = rewardsConfig.second.tokens;
          }
          if (rewardsConfig.third) {
            rewardThirdBadge = rewardsConfig.third.badge || '';
            rewardThirdTokens = rewardsConfig.third.tokens;
          }
        } catch (e) {
          console.error('解析 rewardsConfig 失败', e);
        }
      }

      form.setFieldsValue({
        id: selectedChallenge.id,
        title: selectedChallenge.title || '',
        description: selectedChallenge.description || '',
        coverUrl: coverUrlValue,
        referenceImageUrl: referenceImageUrlValue,
        requiredTags: requiredTagsArray,
        requiredModel: selectedChallenge.requiredModel || '',
        status: selectedChallenge.status !== undefined ? selectedChallenge.status : 0,
        startTime: parseDate(selectedChallenge.startTime),
        endTime: parseDate(selectedChallenge.endTime),
        votingEndTime: parseDate(selectedChallenge.votingEndTime),
        rewardFirstBadge,
        rewardFirstTokens,
        rewardSecondBadge,
        rewardSecondTokens,
        rewardThirdBadge,
        rewardThirdTokens,
      });
    } else {
      setCoverUrl('');
      setReferenceImageUrl('');
    }
  }, [selectedChallenge, isVisible, form]);

  return (
    <Modal
      title={t('editChallenge')}
      open={isVisible}
      onCancel={onCancel}
      onOk={async () => {
        try {
          // 验证表单
          const values = await form.validateFields();
          console.log('表单验证通过，值：', values);
          
          // 转换标签数组为JSON字符串
          // 转换奖励配置为JSON字符串
          const rewardsConfig = {};
          if (values.rewardFirstBadge || values.rewardFirstTokens) {
            rewardsConfig.first = {
              badge: values.rewardFirstBadge || '',
              tokens: values.rewardFirstTokens || 0,
            };
          }
          if (values.rewardSecondBadge || values.rewardSecondTokens) {
            rewardsConfig.second = {
              badge: values.rewardSecondBadge || '',
              tokens: values.rewardSecondTokens || 0,
            };
          }
          if (values.rewardThirdBadge || values.rewardThirdTokens) {
            rewardsConfig.third = {
              badge: values.rewardThirdBadge || '',
              tokens: values.rewardThirdTokens || 0,
            };
          }

          const formattedValues = {
            ...values,
            requiredTags: Array.isArray(values.requiredTags) 
              ? JSON.stringify(values.requiredTags) 
              : (values.requiredTags || ''),
            rewardsConfig: Object.keys(rewardsConfig).length > 0 
              ? JSON.stringify(rewardsConfig) 
              : '',
          };
          
          // 移除临时字段
          delete formattedValues.rewardFirstBadge;
          delete formattedValues.rewardFirstTokens;
          delete formattedValues.rewardSecondBadge;
          delete formattedValues.rewardSecondTokens;
          delete formattedValues.rewardThirdBadge;
          delete formattedValues.rewardThirdTokens;
          
          // 直接调用更新函数，让 handleUpdateChallenge 自己处理日期格式化
          console.log('准备调用 handleUpdateChallenge，参数：', formattedValues);
          await handleUpdateChallenge(formattedValues);
        } catch (error) {
          console.error('表单验证失败或提交失败', error);
          if (error.errorFields) {
            message.error(t('pleaseCheckFormInput'));
          } else {
            // 如果 handleUpdateChallenge 内部已经处理了错误，这里不需要再显示
            console.error('更新失败', error);
          }
        }
      }}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={800}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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
          {/* @ts-ignore Form.Item 会自动注入 value 和 onChange 属性 */}
          <MarkdownEditor
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
          <Select
            mode="tags"
            placeholder={t('requiredTagsPlaceholder')}
            style={{ width: '100%' }}
            tokenSeparators={[',']}
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

        <Form.Item label={t('rewardsConfig')}>
          <Row gutter={16}>
            <Col span={8}>
              <div style={{ marginBottom: 8, fontWeight: 500, color: '#1890ff' }}>🥇 第一名</div>
              <Form.Item name="rewardFirstBadge" style={{ marginBottom: 8 }}>
                <Input placeholder="勋章名称（如：金龙点睛特别勋章）" />
              </Form.Item>
              <Form.Item name="rewardFirstTokens">
                <InputNumber
                  placeholder="代币数量"
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 8, fontWeight: 500, color: '#1890ff' }}>🥈 第二名</div>
              <Form.Item name="rewardSecondBadge" style={{ marginBottom: 8 }}>
                <Input placeholder="勋章名称（如：银花火树勋章）" />
              </Form.Item>
              <Form.Item name="rewardSecondTokens">
                <InputNumber
                  placeholder="代币数量"
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 8, fontWeight: 500, color: '#1890ff' }}>🥉 第三名</div>
              <Form.Item name="rewardThirdBadge" style={{ marginBottom: 8 }}>
                <Input placeholder="勋章名称（如：福星高照勋章）" />
              </Form.Item>
              <Form.Item name="rewardThirdTokens">
                <InputNumber
                  placeholder="代币数量"
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSysDailyChallengeModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateChallenge: PropTypes.func.isRequired,
  selectedChallenge: PropTypes.object,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default UpdateSysDailyChallengeModal;

