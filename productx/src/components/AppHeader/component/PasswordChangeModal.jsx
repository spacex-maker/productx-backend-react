import React, { useState } from 'react';
import { Modal, Form, Input, Progress, Space, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { LockOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const { Text } = Typography;

const PasswordChangeModal = ({ visible, onCancel, onSuccess }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordLevel, setPasswordLevel] = useState('');

  // 密码强度检查
  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordLevel('');
      return;
    }

    let strength = 0;
    let level = '';

    // 长度检查
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 10;

    // 包含数字
    if (/\d/.test(password)) strength += 20;
    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 20;
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 20;
    // 包含特殊字符
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    if (strength >= 90) level = t('passwordStrengthVeryStrong');
    else if (strength >= 80) level = t('passwordStrengthStrong');
    else if (strength >= 60) level = t('passwordStrengthMedium');
    else if (strength >= 40) level = t('passwordStrengthWeak');
    else level = t('passwordStrengthVeryWeak');

    setPasswordStrength(Math.min(strength, 100));
    setPasswordLevel(level);
  };

  // 获取密码强度对应的颜色
  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 80) return '#52c41a';
    if (passwordStrength >= 60) return '#1890ff';
    if (passwordStrength >= 40) return '#faad14';
    return '#ff4d4f';
  };

  // 密码验证规则
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }

    if (value.length < 6) {
      return Promise.reject(t('passwordTooShort'));
    }

    if (!/\d/.test(value)) {
      return Promise.reject(t('passwordNeedNumber'));
    }

    if (!/[a-zA-Z]/.test(value)) {
      return Promise.reject(t('passwordNeedLetter'));
    }

    if (passwordStrength < 60) {
      return Promise.reject(t('passwordTooSimple'));
    }

    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      await api.post('/manage/manager/change-password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      form.resetFields();
      onSuccess?.();
      message.success(t('passwordChangeSuccess'));
    } catch (error) {
      message.error(error.response?.data?.message || t('passwordChangeError'));
    }
  };

  return (
    <Modal
      title={
        <Space>
          <LockOutlined />
          {t('changePassword')}
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={480}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label={t('oldPassword')}
          name="oldPassword"
          rules={[{ required: true, message: t('pleaseInputOldPassword') }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label={t('newPassword')}
          name="newPassword"
          rules={[
            { required: true },
            { validator: validatePassword }
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Input.Password
              onChange={(e) => checkPasswordStrength(e.target.value)}
            />
            {passwordStrength > 0 && (
              <Progress
                percent={passwordStrength}
                strokeColor={getPasswordStrengthColor()}
                showInfo={false}
                size="small"
              />
            )}
            {passwordLevel && (
              <Text style={{ color: getPasswordStrengthColor() }}>
                {passwordLevel}
              </Text>
            )}
          </Space>
        </Form.Item>

        <Form.Item
          label={t('confirmPassword')}
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('passwordsDoNotMatch'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordChangeModal; 