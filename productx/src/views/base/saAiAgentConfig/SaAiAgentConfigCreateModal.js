import React from 'react';
import { Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;
const { Option } = Select;

const SaAiAgentConfigCreateModal = ({ isVisible, onCancel, onFinish, form, providerOptions }) => {
  const handleFinish = (values) => {
    onFinish(values);
  };

  return (
    <Modal
      title="新增 Agent 配置"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
      width={800}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          provider: 'openai',
          temperature: 0.7,
          topP: 1,
          maxTokens: 2048,
          status: true,
          isPublic: false,
          version: 1,
        }}
      >
        <Form.Item
          label="Agent UUID"
          name="agentUuid"
          rules={[{ required: true, message: '请输入业务标识' }]}
        >
          <Input placeholder="唯一业务标识" maxLength={64} />
        </Form.Item>

        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入名称' }]}
        >
          <Input placeholder="如：中英翻译官" maxLength={64} />
        </Form.Item>

        <Form.Item label="功能简述" name="description">
          <TextArea rows={2} maxLength={255} placeholder="简单描述该 Agent 的用途" />
        </Form.Item>

        <Form.Item label="头像/图标" name="avatar">
          <Input placeholder="头像链接" maxLength={255} />
        </Form.Item>

        <Form.Item label="标签" name="tags">
          <Input placeholder="逗号分隔，如 翻译,工具,写作" maxLength={255} />
        </Form.Item>

        <Form.Item
          label="厂商"
          name="provider"
          rules={[{ required: true, message: '请选择厂商' }]}
        >
          <Select placeholder="选择厂商">
            {providerOptions.map((p) => (
              <Option key={p.value} value={p.value}>
                {p.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="模型代号"
          name="model"
          rules={[{ required: true, message: '请输入模型代号' }]}
        >
          <Input placeholder="如：gpt-4o, deepseek-chat" maxLength={64} />
        </Form.Item>

        <Form.Item label="自定义 API 地址" name="endpoint">
          <Input placeholder="留空则使用默认" maxLength={255} />
        </Form.Item>

        <Form.Item label="专属 API Key 密文" name="apiKeyCiphertext">
          <Input placeholder="可空，使用系统默认" maxLength={512} />
        </Form.Item>

        <Form.Item label="系统提示词" name="systemPrompt">
          <TextArea rows={3} placeholder="System Prompt" />
        </Form.Item>

        <Form.Item label="用户提问模板" name="userPromptTemplate">
          <TextArea rows={3} placeholder="User Prompt 模板，支持 {text}" />
        </Form.Item>

        <Form.Item label="随机性 (temperature)" name="temperature">
          <InputNumber min={0} max={2} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="top_p" name="topP">
          <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="最大Token数" name="maxTokens">
          <InputNumber min={1} max={32768} step={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="高级配置(JSON)" name="advancedConfig">
          <TextArea rows={3} placeholder='JSON字符串，如 {"json_mode":true}' />
        </Form.Item>

        <Form.Item label="是否公开" name="isPublic" valuePropName="checked">
          <Switch checkedChildren="是" unCheckedChildren="否" />
        </Form.Item>

        <Form.Item label="状态" name="status" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>

        <Form.Item label="版本号" name="version">
          <InputNumber min={1} max={999} step={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="创建人ID" name="creatorId">
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

SaAiAgentConfigCreateModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  providerOptions: PropTypes.array.isRequired,
};

export default SaAiAgentConfigCreateModal;


