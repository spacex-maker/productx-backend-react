import React from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import { useTranslation } from 'react-i18next';

const SaAiAgentCreateFormModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      title={t('addTitle')}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk(values);
            form.resetFields();
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
          temperature: 0.7,
          maxTokens: 2000,
          status: 'active'
        }}
      >
        <Form.Item
          name="userId"
          label={t('userId')}
          rules={[{ required: true, message: t('pleaseInputUserId') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label={t('agentName')}
          rules={[{ required: true, message: t('pleaseInputAgentName') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="avatarUrl"
          label={t('avatarUrl')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="modelType"
          label={t('modelType')}
          rules={[{ required: true, message: t('pleaseSelectModelType') }]}
        >
          <Select>
            <Select.Option value="gpt-4-turbo">GPT-4 Turbo</Select.Option>
            <Select.Option value="gpt-4">GPT-4</Select.Option>
            <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="roles"
          label={t('roles')}
          rules={[{ required: true, message: t('pleaseInputRoles') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="mbtiCode"
          label={t('mbtiCode')}
          rules={[{ required: true, message: t('pleaseInputMbtiCode') }]}
        >
          <Select>
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
        <Form.Item
          name="prompt"
          label={t('prompt')}
          rules={[{ required: true, message: t('pleaseInputPrompt') }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="temperature"
          label={t('temperature')}
          rules={[{ required: true, message: t('pleaseInputTemperature') }]}
        >
          <InputNumber min={0} max={2} step={0.1} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="maxTokens"
          label={t('maxTokens')}
          rules={[{ required: true, message: t('pleaseInputMaxTokens') }]}
        >
          <InputNumber min={1} max={4096} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="status"
          label={t('status')}
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select>
            <Select.Option value="active">{t('active')}</Select.Option>
            <Select.Option value="inactive">{t('inactive')}</Select.Option>
            <Select.Option value="archived">{t('archived')}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaAiAgentCreateFormModal;
