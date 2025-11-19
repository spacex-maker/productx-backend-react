import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Space } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const UpdateMsxCloudCredentialsModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateCredential,
  selectedCredential,
  t,
  typeOptions,
  statusOptions,
  providers,
}) => {
  const [selectedProviderId, setSelectedProviderId] = useState(null);

  // 判断是否为腾讯云
  const isTencentCloud = (providerId) => {
    const checkId = providerId || selectedProviderId;
    if (!checkId || !providers.length) return false;
    const provider = providers.find((p) => p.id === checkId);
    return provider && (provider.providerName?.includes('腾讯') || provider.providerName?.includes('Tencent') || provider.providerName?.toLowerCase().includes('tencent'));
  };

  // 监听服务商选择变化
  const handleProviderChange = (providerId) => {
    setSelectedProviderId(providerId);
    // 如果不是腾讯云，清空appId
    if (!isTencentCloud(providerId)) {
      form.setFieldsValue({ appId: undefined });
    }
  };

  useEffect(() => {
    if (selectedCredential && isVisible) {
      const providerId = selectedCredential.providerId;
      setSelectedProviderId(providerId);
      form.setFieldsValue({
        id: selectedCredential.id,
        name: selectedCredential.name,
        providerId: providerId,
        accessKey: selectedCredential.accessKey,
        secretKey: selectedCredential.secretKey,
        appId: selectedCredential.appId,
        type: selectedCredential.type,
        status: selectedCredential.status,
      });
    } else {
      setSelectedProviderId(null);
    }
  }, [selectedCredential, isVisible, form]);

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
      title={t('editCredential')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={560}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateCredential}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('name')}
          name="name"
          rules={[{ required: true, message: t('pleaseInputName') }]}
        >
          <Input placeholder={t('pleaseInputName')} />
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
          label={t('accessKey')}
          name="accessKey"
          rules={[{ required: true, message: t('pleaseInputAccessKey') }]}
        >
          <Input placeholder={t('pleaseInputAccessKey')} />
        </Form.Item>

        <Form.Item
          label={t('secretKey')}
          name="secretKey"
          rules={[{ required: true, message: t('pleaseInputSecretKey') }]}
        >
          <Input.Password placeholder={t('pleaseInputSecretKey')} />
        </Form.Item>

        {isTencentCloud() && (
          <Form.Item
            label={t('appId')}
            name="appId"
          >
            <Input placeholder={t('pleaseInputAppId')} />
          </Form.Item>
        )}

        <Form.Item
          label={t('type')}
          name="type"
          rules={[{ required: true, message: t('pleaseSelectType') }]}
        >
          <Select
            placeholder={t('pleaseSelectType')}
            options={typeOptions}
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

UpdateMsxCloudCredentialsModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateCredential: PropTypes.func.isRequired,
  selectedCredential: PropTypes.object,
  t: PropTypes.func.isRequired,
  typeOptions: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
};

export default UpdateMsxCloudCredentialsModel;
