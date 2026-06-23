import React from 'react';
import { Form, Select, Row, Col } from 'antd';
import PropTypes from 'prop-types';
import { generationMediaTypeOptions } from './aiOperatorFormUtils';

const { Option } = Select;

const AiOperatorPostConfigFields = ({
  t,
  channelList,
  imageModels,
  videoModels,
  form,
}) => {
  const mediaType = Form.useWatch('generationMediaType', form) || 'IMAGE';
  const modelList = mediaType === 'VIDEO' ? videoModels : imageModels;

  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label={t('postChannel') || '发帖频道'}
            name="channelId"
            rules={[{ required: true, message: t('selectPostChannel') || '请选择发帖频道' }]}
          >
            <Select
              placeholder={t('selectPostChannel') || '请选择发帖频道'}
              showSearch
              optionFilterProp="label"
              allowClear
            >
              {channelList.map((channel) => (
                <Option key={channel.id} value={channel.id} label={channel.name}>
                  {channel.name}
                  {channel.channelKey ? ` (${channel.channelKey})` : ''}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('generationMediaType') || '发帖内容类型'}
            name="generationMediaType"
          >
            <Select options={generationMediaTypeOptions(t)} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label={t('generationModelCode') || '生成模型'}
        name="generationModelCode"
        tooltip={t('generationModelCodeHint') || 'AI 自动发帖/生图时使用的模型（来自模型库）'}
        rules={[{ required: true, message: t('selectGenerationModel') || '请选择生成模型' }]}
      >
        <Select
          placeholder={t('selectGenerationModel') || '请选择生成模型'}
          showSearch
          optionFilterProp="label"
          allowClear
        >
          {modelList.map((model) => (
            <Option
              key={model.modelCode}
              value={model.modelCode}
              label={`${model.modelName || model.modelCode} (${model.modelCode})`}
            >
              {model.modelName || model.modelCode}
              <span style={{ color: '#999', marginLeft: 8, fontSize: 12 }}>
                {model.modelCode}
              </span>
            </Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

AiOperatorPostConfigFields.propTypes = {
  t: PropTypes.func.isRequired,
  channelList: PropTypes.array.isRequired,
  imageModels: PropTypes.array.isRequired,
  videoModels: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
};

export default AiOperatorPostConfigFields;
