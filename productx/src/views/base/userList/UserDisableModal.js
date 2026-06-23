import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';

const PRESET_REASONS = [
  { value: '违规发布内容', label: '违规发布内容' },
  { value: '恶意刷单/刷量', label: '恶意刷单/刷量' },
  {
    value: '检测到多账号关联及批量注册行为，属于滥用平台资源，违反服务条款，账号已禁用。',
    label: '多账号关联及批量注册',
  },
  { value: '账号存在安全风险', label: '账号存在安全风险' },
  { value: '涉嫌欺诈或违法活动', label: '涉嫌欺诈或违法活动' },
  { value: '用户申请停用账号', label: '用户申请停用账号' },
  { value: 'custom', label: '其他（自定义）' },
];

const UserDisableModal = ({ open, user, loading, onCancel, onSubmit }) => {
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
      title={`禁用用户${user?.username ? `：${user.username}` : ''}`}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      okText="确认禁用"
      cancelText="取消"
      destroyOnClose
      width={520}
    >
      <p style={{ color: '#666', marginBottom: 16 }}>
        禁用后该用户将无法登录及访问所有接口，请填写禁用原因。
      </p>
      <Form form={form} layout="vertical">
        <Form.Item
          name="presetReason"
          label="禁用原因"
          rules={[{ required: true, message: '请选择禁用原因' }]}
        >
          <Select placeholder="请选择禁用原因" options={PRESET_REASONS} />
        </Form.Item>
        {preset === 'custom' ? (
          <Form.Item
            name="customReason"
            label="自定义原因"
            rules={[
              { required: true, message: '请填写禁用原因' },
              { max: 500, message: '原因不能超过500字' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="请详细说明禁用原因" maxLength={500} showCount />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

export default UserDisableModal;
