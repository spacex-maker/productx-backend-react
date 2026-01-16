import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, InputNumber, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import UserSearchSelect from 'src/views/common/UserSearchSelect';

const { Option } = Select;
const { TextArea } = Input;

const SysAiOperatorCreateModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
  languageStyleOptions,
  postSourceTypeOptions,
}) => {
  useEffect(() => {
    if (!isVisible) {
      form.resetFields();
    }
  }, [isVisible, form]);

  const handleFinish = (values) => {
    // 处理JSON字段 - 标签字段转换为JSON字符串
    if (values.interestedTags) {
      try {
        if (Array.isArray(values.interestedTags)) {
          values.interestedTags = JSON.stringify(values.interestedTags);
        } else if (typeof values.interestedTags === 'string') {
          // 如果已经是字符串，尝试解析验证
          JSON.parse(values.interestedTags);
        } else {
          values.interestedTags = JSON.stringify([]);
        }
      } catch (e) {
        values.interestedTags = JSON.stringify([]);
      }
    } else {
      values.interestedTags = JSON.stringify([]);
    }

    if (values.excludeTags) {
      try {
        if (Array.isArray(values.excludeTags)) {
          values.excludeTags = JSON.stringify(values.excludeTags);
        } else if (typeof values.excludeTags === 'string') {
          // 如果已经是字符串，尝试解析验证
          JSON.parse(values.excludeTags);
        } else {
          values.excludeTags = JSON.stringify([]);
        }
      } catch (e) {
        values.excludeTags = JSON.stringify([]);
      }
    } else {
      values.excludeTags = JSON.stringify([]);
    }

    if (values.postPromptTemplate) {
      try {
        values.postPromptTemplate = typeof values.postPromptTemplate === 'string'
          ? values.postPromptTemplate
          : JSON.stringify(values.postPromptTemplate);
      } catch (e) {
        values.postPromptTemplate = JSON.stringify({});
      }
    }
    if (values.modelConfig) {
      try {
        values.modelConfig = typeof values.modelConfig === 'string'
          ? values.modelConfig
          : JSON.stringify(values.modelConfig);
      } catch (e) {
        values.modelConfig = JSON.stringify({});
      }
    }
    onFinish(values);
  };

  return (
    <Modal
      title={t('addAiOperator') || t('add') || '添加AI运营配置'}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm') || '确认'}
      cancelText={t('cancel') || '取消'}
      width={900}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          languageStyle: 'CASUAL',
          canPost: false,
          canComment: true,
          canLike: true,
          canReply: false,
          activeTimeRange: '09:00-23:00',
          timeZone: 'Asia/Shanghai',
          actionsPerDay: 20,
          actionIntervalMin: 5,
          actionIntervalMax: 60,
          probabilityLike: 0.80,
          probabilityComment: 0.20,
          postSourceType: 'STOCK_POOL',
          postFrequencyDays: 1,
          status: true,
          tokenUsageLimit: 1000,
          interestedTags: [],
          excludeTags: [],
          postPromptTemplate: '{}',
          modelConfig: '{}',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('userId') || '用户ID'}
              name="userId"
              rules={[{ required: true, message: t('enterUserId') || '请输入或选择用户' }]}
            >
              <UserSearchSelect
                placeholder={t('enterUserId') || '请输入用户ID或用户名搜索'}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('internalName') || '内部代号'}
              name="internalName"
              rules={[{ required: true, message: t('enterInternalName') || '请输入内部代号' }]}
            >
              <Input placeholder={t('enterInternalName') || '请输入内部代号（如: 001-二次元狂热粉）'} maxLength={50} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('personaPreset') || 'LLM系统提示词'}
          name="personaPreset"
        >
          <TextArea 
            rows={4}
            placeholder={t('enterPersonaPreset') || '请输入系统提示词，用于定义AI人设'}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('languageStyle') || '语言风格'}
              name="languageStyle"
            >
              <Select placeholder={t('selectLanguageStyle') || '请选择语言风格'}>
                {languageStyleOptions.map((style) => (
                  <Option key={style.value} value={style.value}>
                    {style.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('activeTimeRange') || '活跃时间段'}
              name="activeTimeRange"
            >
              <Input placeholder={t('enterActiveTimeRange') || '如: 09:00-23:00'} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('timeZone') || '时区'}
              name="timeZone"
            >
              <Input placeholder={t('enterTimeZone') || '如: Asia/Shanghai'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('status') || '状态'}
              name="status"
              valuePropName="checked"
            >
              <Switch checkedChildren={t('running') || '运行'} unCheckedChildren={t('paused') || '暂停'} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label={t('canPost') || '自动发帖'}
              name="canPost"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t('canComment') || '自动评论'}
              name="canComment"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t('canLike') || '自动点赞'}
              name="canLike"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={t('canReply') || '回复评论'}
              name="canReply"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t('actionsPerDay') || '每日最大互动数'}
              name="actionsPerDay"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder={t('enterActionsPerDay') || '请输入每日最大互动数'} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('actionIntervalMin') || '最小间隔(分)'}
              name="actionIntervalMin"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder={t('enterMinInterval') || '请输入最小间隔'} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('actionIntervalMax') || '最大间隔(分)'}
              name="actionIntervalMax"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder={t('enterMaxInterval') || '请输入最大间隔'} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('probabilityLike') || '点赞概率'}
              name="probabilityLike"
            >
              <InputNumber 
                min={0} 
                max={1} 
                step={0.01}
                style={{ width: '100%' }} 
                placeholder={t('enterProbabilityLike') || '请输入点赞概率 (0-1)'}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('probabilityComment') || '评论概率'}
              name="probabilityComment"
            >
              <InputNumber 
                min={0} 
                max={1} 
                step={0.01}
                style={{ width: '100%' }} 
                placeholder={t('enterProbabilityComment') || '请输入评论概率 (0-1)'}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('postSourceType') || '发帖来源'}
              name="postSourceType"
            >
              <Select placeholder={t('selectPostSourceType') || '请选择发帖来源'}>
                {postSourceTypeOptions.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('postFrequencyDays') || '发帖频率(天)'}
              name="postFrequencyDays"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder={t('enterPostFrequency') || '请输入发帖频率'} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('postPromptTemplate') || '生成参数模板 (JSON)'}
          name="postPromptTemplate"
        >
          <TextArea 
            rows={3}
            placeholder={t('enterPostPromptTemplate') || '请输入JSON格式的生成参数模板，如: {"style": "anime", "aspect": "16:9"}'}
          />
        </Form.Item>

        <Form.Item
          label={t('interestedTags') || '感兴趣的标签'}
          name="interestedTags"
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder={t('enterInterestedTags') || '请输入标签，按回车添加，如: horror, cthulhu, monster'}
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Form.Item
          label={t('excludeTags') || '避雷标签'}
          name="excludeTags"
        >
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder={t('enterExcludeTags') || '请输入标签，按回车添加，如: nsfw, violence'}
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('tokenUsageLimit') || '每日Token上限'}
              name="tokenUsageLimit"
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder={t('enterTokenLimit') || '请输入每日Token上限'} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('modelConfig') || '模型配置 (JSON)'}
              name="modelConfig"
            >
              <TextArea 
                rows={2}
                placeholder={t('enterModelConfig') || '请输入JSON格式的模型配置'}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

SysAiOperatorCreateModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  languageStyleOptions: PropTypes.array.isRequired,
  postSourceTypeOptions: PropTypes.array.isRequired,
};

export default SysAiOperatorCreateModal;

