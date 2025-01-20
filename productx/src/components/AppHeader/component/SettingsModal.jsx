import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Radio, message, Progress, Space, Tabs, Upload, Card } from 'antd';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@ant-design/icons';
import COS from 'cos-js-sdk-v5';
import api from 'src/axiosInstance';
import dayjs from 'dayjs';

const SettingsModal = ({ visible, onCancel, currentUser, onSuccess }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordLevel, setPasswordLevel] = useState('');
  const [cosInstance, setCosInstance] = useState(null);
  const bucketName = 'px-1258150206';
  const region = 'ap-nanjing';

  // 初始化 COS 实例
  const initCOS = async () => {
    try {
      const response = await api.get(`/manage/tencent/cos-credential?bucketName=${bucketName}`);
      const { secretId, secretKey, sessionToken, expiredTime } = response;

      if (!secretId || !secretKey || !sessionToken) {
        throw new Error(t('cosInitFailed'));
      }

      const cos = new COS({
        getAuthorization: function (options, callback) {
          callback({
            TmpSecretId: secretId,
            TmpSecretKey: secretKey,
            SecurityToken: sessionToken,
            ExpiredTime: expiredTime || Math.floor(Date.now() / 1000) + 1800,
          });
        },
        Region: region,
      });

      setCosInstance(cos);
      return cos;
    } catch (error) {
      message.error(t('cosInitFailed') + ': ' + error.message);
      return null;
    }
  };

  useEffect(() => {
    initCOS();
  }, []);

  // 处理文件上传
  const handleUpload = async (file) => {
    try {
      let instance = cosInstance;
      if (!instance) {
        instance = await initCOS();
        if (!instance) {
          throw new Error(t('cosNotInitialized'));
        }
      }

      const key = `manageAvatar/${Date.now()}-${file.name}`;

      const result = await instance.uploadFile({
        Bucket: bucketName,
        Region: region,
        Key: key,
        Body: file,
        onProgress: (progressData) => {
          const percent = Math.round(progressData.percent * 100);
          file.onProgress({ percent });
        },
      });

      return `https://${bucketName}.cos.${region}.myqcloud.com/${key}`;
    } catch (error) {
      message.error(t('uploadFailed') + ': ' + error.message);
      throw error;
    }
  };

  // 自定义上传方法
  const customRequest = async ({ file, onSuccess, onError, onProgress }) => {
    try {
      file.onProgress = onProgress;
      const url = await handleUpload(file);
      onSuccess({ url });
    } catch (error) {
      onError(error);
    }
  };

  // 处理文件列表变化
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList.map((file) => ({
      ...file,
      url: file.response?.url || file.url,
    }));
  };

  // 处理个人信息提交
  const handleProfileSubmit = async (values) => {
    try {
      const formData = {
        ...values,
        nickname: values.nickname?.trim(),
        email: values.email?.trim(),
        phone: values.phone?.trim(),
        birthday: values.birthday?.format('YYYY-MM-DD'),
        gender: values.gender === 1,
        avatar: values.avatar?.[0]?.url || undefined
      };
      
      await api.post('/manage/manager/update-my-info', formData);
      message.success(t('updateSuccess'));
      onSuccess?.();
      onCancel();
    } catch (error) {
      message.error(error.response?.data?.message || t('updateFailed'));
    }
  };

  // 处理安全设置提交
  const handleSecuritySubmit = async (values) => {
    try {
      // 验证密码字段
      if (!values.oldPassword?.trim()) {
        message.error(t('oldPasswordRequired'));
        return;
      }
      if (!values.newPassword?.trim()) {
        message.error(t('newPasswordRequired'));
        return;
      }

      const formData = {
        oldPassword: values.oldPassword.trim(),
        newPassword: values.newPassword.trim()
      };

      await api.post('/manage/manager/update-password', formData);
      message.success(t('updateSuccess'));
      onSuccess?.();
      onCancel();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  // 根据当前标签页选择提交方法
  const handleSubmit = (values) => {
    if (activeTab === 'profile') {
      return handleProfileSubmit(values);
    } else {
      return handleSecuritySubmit(values);
    }
  };

  // 处理 Modal 确认按钮点击
  const handleOk = () => {
    form.validateFields()
      .then(values => {
        if (activeTab === 'profile') {
          return handleProfileSubmit(values);
        } else {
          return handleSecuritySubmit(values);
        }
      })
      .catch(({ errorFields }) => {
        // 显示第一个错误信息
        if (errorFields?.length > 0) {
          message.error(errorFields[0].errors[0]);
        }
      });
  };

  const renderProfileSettings = () => (
    <Card bordered={false}>
      <div style={{ display: 'grid', gridTemplateColumns: '104px 1fr', gap: 24 }}>
        {/* 头像上传区域 */}
        <Form.Item
          name="avatar"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          style={{ marginBottom: 0 }}
        >
          <Upload
            listType="picture-circle"
            maxCount={1}
            customRequest={customRequest}
            accept="image/*"
            className="avatar-uploader"
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>{t('upload')}</div>
            </div>
          </Upload>
        </Form.Item>

        {/* 右侧表单项 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Form.Item
            label={t('username')}
            style={{ marginBottom: 0 }}
          >
            <Input value={currentUser?.username} disabled />
          </Form.Item>

          <Form.Item
            label={t('nickname')}
            name="nickname"
            style={{ marginBottom: 0 }}
          >
            <Input placeholder={t('enterNickname')} />
          </Form.Item>

          <Form.Item
            label={t('email')}
            name="email"
            rules={[
              { required: true, whitespace: true, message: t('emailRequired') },
              { type: 'email', message: t('invalidEmail') }
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder={t('enterEmail')} />
          </Form.Item>

          <Form.Item
            label={t('phone')}
            name="phone"
            rules={[{ pattern: /^[0-9-+]{8,}$/, message: t('invalidPhone') }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder={t('enterPhone')} />
          </Form.Item>

          <Form.Item
            label={t('birthday')}
            name="birthday"
            style={{ marginBottom: 0 }}
          >
            <DatePicker style={{ width: '100%' }} placeholder={t('selectBirthday')} />
          </Form.Item>

          <Form.Item
            label={t('gender')}
            name="gender"
            style={{ marginBottom: 0 }}
          >
            <Radio.Group buttonStyle="solid" style={{ width: '100%' }}>
              <Radio.Button value={1} style={{ width: '50%', textAlign: 'center' }}>
                {t('male')}
              </Radio.Button>
              <Radio.Button value={0} style={{ width: '50%', textAlign: 'center' }}>
                {t('female')}
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>

      <Form.Item
        label={t('address')}
        name="address"
        style={{ marginTop: 24, marginBottom: 0 }}
      >
        <Input.TextArea
          rows={3}
          placeholder={t('enterAddress')}
          style={{ resize: 'none' }}
        />
      </Form.Item>
    </Card>
  );

  const renderSecuritySettings = () => (
    <Card bordered={false}>
      <Form.Item
        label={t('oldPassword')}
        name="oldPassword"
        rules={[{ required: true, message: t('required') }]}
        style={{ marginBottom: 16 }}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label={t('newPassword')}
        name="newPassword"
        rules={[
          { required: true, message: t('required') },
          { min: 6, message: t('passwordTooSimple') },
          {
            validator: (_, value) => {
              if (value && passwordStrength <= 20) {
                return Promise.reject(t('passwordTooSimple'));
              }
              return Promise.resolve();
            }
          }
        ]}
        style={{ marginBottom: 0 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Input.Password
            onChange={(e) => checkPasswordStrength(e.target.value)}
          />
          {passwordStrength > 0 && (
            <Progress
              percent={passwordStrength}
              strokeColor={getPasswordStrengthColor()}
              format={() => passwordLevel}
              size="small"
            />
          )}
        </div>
      </Form.Item>
    </Card>
  );

  // 处理标签页切换
  const handleTabChange = (key) => {
    setActiveTab(key);
    form.resetFields();
    
    // 根据不同标签页设置不同的初始值
    if (key === 'profile') {
      form.setFieldsValue({
        ...currentUser,
        birthday: currentUser?.birthday ? dayjs(currentUser.birthday) : undefined,
        gender: currentUser?.gender === true ? 1 : currentUser?.gender === false ? 0 : undefined,
        avatar: currentUser?.avatar ? [{ url: currentUser.avatar }] : []
      });
    } else {
      // 安全设置标签页不需要设置初始值
      form.setFieldsValue({
        oldPassword: undefined,
        newPassword: undefined
      });
    }
  };

  const items = [
    {
      key: 'profile',
      label: t('profile'),
      children: renderProfileSettings()
    },
    {
      key: 'security',
      label: t('security'),
      children: renderSecuritySettings()
    }
  ];

  return (
    <Modal
      title={t('settings')}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={640}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...currentUser,
          birthday: currentUser?.birthday ? dayjs(currentUser.birthday) : undefined,
          gender: currentUser?.gender === true ? 1 : currentUser?.gender === false ? 0 : undefined,
          avatar: currentUser?.avatar ? [{ url: currentUser.avatar }] : []
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={items}
          animated
        />
      </Form>
    </Modal>
  );
};

export default SettingsModal; 