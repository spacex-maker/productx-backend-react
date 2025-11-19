import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space, message } from 'antd';
import PropTypes from 'prop-types';
import api from 'src/axiosInstance';

const { Option } = Select;

const MsxStorageBucketCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
  storageTypeOptions,
  statusOptions,
  providers,
}) => {
  const [regions, setRegions] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(null);
  const [credentials, setCredentials] = useState([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);

  // 获取区域列表
  const fetchRegions = async (providerId) => {
    if (!providerId) {
      setRegions([]);
      return;
    }

    setLoadingRegions(true);
    try {
      const response = await api.get(`/manage/cloud-provider-regions/active-regions/${providerId}`);
      setRegions(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      message.error(t('fetchRegionsFailed') || '获取区域列表失败');
      setRegions([]);
    } finally {
      setLoadingRegions(false);
    }
  };

  // 获取凭证列表
  const fetchCredentials = async (providerId) => {
    if (!providerId) {
      setCredentials([]);
      return;
    }

    setLoadingCredentials(true);
    try {
      const response = await api.get(`/manage/cloud-credentials/active/${providerId}`);
      // axiosInstance 已经处理了响应，直接返回 data 数组
      setCredentials(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
      message.error(t('fetchCredentialsFailed') || '获取凭证列表失败');
      setCredentials([]);
    } finally {
      setLoadingCredentials(false);
    }
  };

  // 监听服务商选择变化
  const handleProviderChange = (providerId) => {
    setSelectedProviderId(providerId);
    form.setFieldsValue({ 
      regionName: undefined,
      credentialId: undefined,
      appId: undefined
    }); // 清空区域和凭证选择
    fetchRegions(providerId);
    fetchCredentials(providerId);
  };

  // 监听凭证选择变化
  const handleCredentialChange = (credentialId) => {
    const credential = credentials.find((c) => c.id === credentialId);
    setSelectedCredential(credential);
    // 设置appId（如果凭证有appId）
    if (credential?.appId) {
      form.setFieldsValue({ appId: credential.appId });
    } else {
      form.setFieldsValue({ appId: undefined });
    }
  };

  // 当弹窗打开时，如果有已选择的服务商，加载区域列表和凭证列表
  useEffect(() => {
    if (isVisible) {
      const currentProviderId = form.getFieldValue('providerId');
      if (currentProviderId) {
        setSelectedProviderId(currentProviderId);
        fetchRegions(currentProviderId);
        fetchCredentials(currentProviderId);
      } else {
        setRegions([]);
        setCredentials([]);
        setSelectedProviderId(null);
        setSelectedCredential(null);
      }
    } else {
      // 弹窗关闭时重置
      setRegions([]);
      setCredentials([]);
      setSelectedProviderId(null);
      setSelectedCredential(null);
    }
  }, [isVisible, form]);

  // 当凭证列表加载完成后，如果有已选择的凭证，设置selectedCredential和appId
  useEffect(() => {
    if (credentials.length > 0 && isVisible) {
      const currentCredentialId = form.getFieldValue('credentialId');
      if (currentCredentialId) {
        const credential = credentials.find((c) => c.id === currentCredentialId);
        if (credential) {
          setSelectedCredential(credential);
          if (credential.appId) {
            form.setFieldsValue({ appId: credential.appId });
          }
        }
      }
    }
  }, [credentials, isVisible, form]);
  // 渲染服务商选项
  const providerOption = (provider) => (
    <Option key={provider.id} value={provider.id}>
      <Space>
        {provider.iconImg && (
          <img 
            src={provider.iconImg} 
            alt={provider.providerName}
            style={{ 
              width: 20, 
              height: 20, 
              objectFit: 'contain',
              verticalAlign: 'middle'
            }}
          />
        )}
        <span>{provider.providerName}</span>
      </Space>
    </Option>
  );
  return (
    <Modal
      title={t('addBucket')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={560}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label={t('bucketName')}
          name="bucketName"
          rules={[{ required: true, message: t('pleaseInputBucketName') }]}
        >
          <Input placeholder={t('pleaseInputBucketName')} />
        </Form.Item>

        <Form.Item
          label={t('provider')}
          name="providerId"
          rules={[{ required: true, message: t('pleaseSelectProvider') }]}
        >
          <Select
            showSearch
            placeholder={t('selectProvider')}
            optionFilterProp="children"
            filterOption={(input, option) => {
              const provider = providers.find((p) => p.id === option.value);
              return provider?.providerName.toLowerCase().includes(input.toLowerCase());
            }}
            dropdownMatchSelectWidth={false}
            popupMatchSelectWidth={false}
            listHeight={256}
            dropdownStyle={{ 
              minWidth: 250,
              maxWidth: 300
            }}
            onChange={handleProviderChange}
          >
            {providers.map((provider) => providerOption(provider))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('credentials')}
          name="credentialId"
          rules={[{ required: true, message: t('pleaseSelectCredential') }]}
        >
          <Select
            placeholder={t('pleaseSelectCredential')}
            loading={loadingCredentials}
            disabled={!selectedProviderId || credentials.length === 0}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              const credential = credentials.find((c) => c.id === option.value);
              return credential?.name?.toLowerCase().includes(input.toLowerCase());
            }}
            onChange={handleCredentialChange}
          >
            {credentials.map((credential) => (
              <Option key={credential.id} value={credential.id}>
                {credential.name} ({credential.type})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('regionName')}
          name="regionName"
          rules={[{ required: true, message: t('pleaseSelectRegionName') || t('pleaseInputRegionName') }]}
        >
          <Select
            placeholder={t('pleaseSelectRegionName') || t('pleaseInputRegionName')}
            loading={loadingRegions}
            disabled={!selectedProviderId || regions.length === 0}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              const text = String(option.children || '').toLowerCase();
              return text.includes(input.toLowerCase());
            }}
          >
            {regions.map((region) => (
              <Option key={region.regionCode} value={region.regionCode}>
                {region.regionName} ({region.regionCode})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('storageType')}
          name="storageType"
          rules={[{ required: true, message: t('pleaseSelectStorageType') }]}
        >
          <Select
            placeholder={t('pleaseSelectStorageType')}
            options={storageTypeOptions}
          />
        </Form.Item>

        {/* 隐藏的appId字段，用于提交时传递给后端 */}
        <Form.Item name="appId" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
          initialValue={true}
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select
            placeholder={t('pleaseSelectStatus')}
            options={statusOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('remark')}
          name="remark"
        >
          <Input.TextArea placeholder={t('pleaseInputRemark')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

MsxStorageBucketCreateFormModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  storageTypeOptions: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
};

export default MsxStorageBucketCreateFormModel;
