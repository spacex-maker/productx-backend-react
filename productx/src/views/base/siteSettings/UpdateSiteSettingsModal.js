import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, message } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Option } = Select;
const { TextArea } = Input;

const UpdateSiteSettingsModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateSetting,
  selectedSetting,
  t,
  statusOptions,
  langOptions,
}) => {
  // JSON 格式验证函数
  const validateJSON = (_, value) => {
    if (!value || value.trim() === '') {
      return Promise.reject(new Error(t('pleaseInputConfigValue') || 'Please input config value'));
    }
    
    try {
      JSON.parse(value);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(new Error(t('invalidJSONFormat') || 'Invalid JSON format. Please check your input.'));
    }
  };

  // 格式化 JSON
  const formatJSON = () => {
    const configValue = form.getFieldValue('configValue');
    if (!configValue || configValue.trim() === '') {
      message.warning(t('pleaseInputConfigValue') || 'Please input config value first');
      return;
    }

    try {
      const parsed = JSON.parse(configValue);
      const formatted = JSON.stringify(parsed, null, 2);
      form.setFieldsValue({ configValue: formatted });
      message.success(t('formatSuccess') || 'JSON formatted successfully');
    } catch (error) {
      message.error(t('invalidJSONFormat') || 'Invalid JSON format. Please check your input.');
    }
  };

  useEffect(() => {
    if (selectedSetting && isVisible) {
      form.setFieldsValue({
        id: selectedSetting.id,
        configKey: selectedSetting.configKey,
        description: selectedSetting.description,
        lang: selectedSetting.lang,
        configValue: selectedSetting.configValue,
        status: selectedSetting.status,
      });
    }
  }, [selectedSetting, isVisible, form]);

  return (
    <Modal
      title={t('edit') || 'Edit Site Setting'}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={680}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateSetting}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('configKey') || 'Config Key'}
          name="configKey"
          rules={[{ required: true, message: t('pleaseInputConfigKey') || 'Please input config key' }]}
        >
          <Input placeholder={t('pleaseInputConfigKey') || 'Please input config key'} disabled />
        </Form.Item>

        <Form.Item
          label={t('description') || 'Description'}
          name="description"
        >
          <Input placeholder={t('pleaseInputDescription') || 'Please input description'} />
        </Form.Item>

        <Form.Item
          label={t('language') || 'Language'}
          name="lang"
          rules={[{ required: true, message: t('pleaseSelectLanguage') || 'Please select language' }]}
        >
          <Select placeholder={t('pleaseSelectLanguage') || 'Please select language'}>
            {langOptions.map((lang) => (
              <Option key={lang.value} value={lang.value}>
                {lang.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <span>{t('configValue') || 'Config Value'}</span>
              <Button 
                type="link" 
                size="small" 
                icon={<BgColorsOutlined />} 
                onClick={formatJSON}
                style={{ padding: 0, height: 'auto' }}
              >
                {t('formatJSON') || 'Format JSON'}
              </Button>
            </Space>
          }
          name="configValue"
          rules={[
            { required: true, message: t('pleaseInputConfigValue') || 'Please input config value' },
            { validator: validateJSON }
          ]}
        >
          <TextArea 
            rows={8}
            placeholder={t('pleaseInputConfigValue') || 'Please input config value (JSON format)'}
          />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select
            placeholder={t('pleaseSelectStatus')}
            options={statusOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSiteSettingsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateSetting: PropTypes.func.isRequired,
  selectedSetting: PropTypes.object,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
  langOptions: PropTypes.array.isRequired,
};

export default UpdateSiteSettingsModal;

