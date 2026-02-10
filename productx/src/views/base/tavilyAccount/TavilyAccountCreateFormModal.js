import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const TavilyAccountCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t
}) => {
  return (
    <Modal
      title={t('addTavilyAccount') || '新增 Tavily 账号'}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm') || '确认'}
      cancelText={t('cancel') || '取消'}
      width={600}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label={t('apiKey') || 'API Key'}
          name="apiKey"
          rules={[{ required: true, message: t('pleaseInputApiKey') || '请输入 API Key' }]}
        >
          <Input placeholder={t('pleaseInputApiKey') || '请输入 API Key'} />
        </Form.Item>

        <Form.Item
          label={t('accountAlias') || '账号别名'}
          name="accountAlias"
        >
          <Input placeholder={t('pleaseInputAccountAlias') || '请输入账号别名/备注'} />
        </Form.Item>

        <Form.Item
          label={t('currentPlan') || '套餐计划'}
          name="currentPlan"
          initialValue="Free"
        >
          <Select placeholder={t('pleaseSelectPlan') || '请选择套餐计划'}>
            <Option value="Free">Free</Option>
            <Option value="Bootstrap">Bootstrap</Option>
            <Option value="Pro">Pro</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('status') || '状态'}
          name="isActive"
          initialValue={true}
        >
          <Select placeholder={t('pleaseSelectStatus') || '请选择状态'}>
            <Option value={true}>{t('active') || '启用'}</Option>
            <Option value={false}>{t('inactive') || '禁用'}</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TavilyAccountCreateFormModal;
