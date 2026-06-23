import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';

const PRESET_REASONS = [
  {
    value: '检测到多账号关联及批量注册行为，属于滥用平台资源，违反服务条款。',
    label: '多账号关联及批量注册',
  },
  { value: '异常高频调用及滥用平台服务行为，违反平台使用规范。', label: '异常高频调用' },
  { value: '账号存在安全风险，访问已被限制。', label: '安全风险' },
  { value: '涉嫌欺诈或违法活动，访问已被限制。', label: '涉嫌欺诈/违法' },
  { value: 'custom', label: '其他（自定义）' },
];

const IpBlockModal = ({ open, ip, loading, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const preset = Form.useWatch('presetReason', form);

  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const reason = values.presetReason === 'custom' ? values.customReason?.trim() : values.presetReason;
    onSubmit(reason);
  };

  return (
    <Modal
      title={`封禁 IP${ip ? `：${ip}` : ''}`}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="确认封禁"
      cancelText="取消"
      destroyOnClose
      width={520}
    >
      <p style={{ color: '#666', marginBottom: 16 }}>
        封禁后该 IP 将无法访问 C 端所有接口，并跳转至禁止访问页面。
      </p>
      <Form form={form} layout="vertical">
        <Form.Item
          name="presetReason"
          label="封禁原因"
          rules={[{ required: true, message: '请选择封禁原因' }]}
        >
          <Select placeholder="请选择封禁原因" options={PRESET_REASONS} />
        </Form.Item>
        {preset === 'custom' ? (
          <Form.Item
            name="customReason"
            label="自定义原因"
            rules={[
              { required: true, message: '请填写封禁原因' },
              { max: 500, message: '原因不能超过500字' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="请详细说明封禁原因" maxLength={500} showCount />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

export default IpBlockModal;
