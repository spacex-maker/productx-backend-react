import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Space } from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;

const UpdateMsxCloudProviderRegionsModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateRegion,
  selectedRegion,
  t,
  statusOptions,
  countries,
  providers,
}) => {
  useEffect(() => {
    if (selectedRegion && isVisible) {
      form.setFieldsValue({
        id: selectedRegion.id,
        providerId: selectedRegion.providerId,
        countryCode: selectedRegion.countryCode,
        regionCode: selectedRegion.regionCode,
        regionName: selectedRegion.regionName,
        status: selectedRegion.status,
      });
    }
  }, [selectedRegion, isVisible, form]);

  // 渲染国家选项
  const countryOption = (country) => (
    <Option key={country.id} value={country.code}>
      <Space>
        <img 
          src={country.flagImageUrl} 
          alt={country.name}
          style={{ 
            width: 20, 
            height: 15, 
            objectFit: 'cover',
            borderRadius: 2,
            border: '1px solid #f0f0f0'
          }}
        />
        <span>{country.name}</span>
        <span style={{ color: '#999' }}>({country.code})</span>
      </Space>
    </Option>
  );

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
      title={t('editRegion')}
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
        onFinish={handleUpdateRegion}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
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
          >
            {providers.map((provider) => providerOption(provider))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('country')}
          name="countryCode"
          rules={[{ required: true, message: t('pleaseSelectCountry') }]}
        >
          <Select
            showSearch
            placeholder={t('selectCountry')}
            optionFilterProp="children"
            filterOption={(input, option) => {
              const country = countries.find((c) => c.code === option.value);
              return (
                country?.name.toLowerCase().includes(input.toLowerCase()) ||
                country?.code.toLowerCase().includes(input.toLowerCase())
              );
            }}
            dropdownMatchSelectWidth={false}
            popupMatchSelectWidth={false}
            listHeight={256}
            dropdownStyle={{ 
              minWidth: 250,
              maxWidth: 300
            }}
          >
            {countries.map((country) => countryOption(country))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('regionCode')}
          name="regionCode"
          rules={[{ required: true, message: t('pleaseInputRegionCode') }]}
        >
          <Input placeholder={t('pleaseInputRegionCode')} />
        </Form.Item>

        <Form.Item
          label={t('regionName')}
          name="regionName"
          rules={[{ required: true, message: t('pleaseInputRegionName') }]}
        >
          <Input placeholder={t('pleaseInputRegionName')} />
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

UpdateMsxCloudProviderRegionsModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateRegion: PropTypes.func.isRequired,
  selectedRegion: PropTypes.object,
  t: PropTypes.func.isRequired,
  statusOptions: PropTypes.array.isRequired,
  countries: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
};

export default UpdateMsxCloudProviderRegionsModel;
