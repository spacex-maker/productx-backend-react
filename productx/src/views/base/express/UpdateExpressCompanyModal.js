import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Space } from 'antd';
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const UpdateExpressCompanyModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateCourier,
  selectedCourier
}) => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
        }
      } catch (error) {
        console.error('获取国家列表失败:', error);
        message.error(t('fetchCountriesFailed'));
      }
    };
    fetchCountries();
  }, [t]);

  useEffect(() => {
    if (isVisible && selectedCourier) {
      form.setFieldsValue({
        id: selectedCourier.id,
        countryCode: selectedCourier.countryCode,
        name: selectedCourier.name,
        trackingNumberFormat: selectedCourier.trackingNumberFormat,
        website: selectedCourier.website,
        contactNumber: selectedCourier.contactNumber
      });
    }
  }, [isVisible, selectedCourier, form]);

  const countryOption = (country) => (
    <Option key={country.id} value={country.code}>
      <Space>
        <img 
          src={country.flagImageUrl} 
          alt={country.name}
          style={{ 
            width: 30, 
            height: 20, 
            objectFit: 'cover',
            borderRadius: 2,
            border: '1px solid #f0f0f0'
          }}
        />
        <span>{country.name}</span>
        <span style={{ color: '#999' }}>({country.isoCode})</span>
      </Space>
    </Option>
  );

  return (
    <Modal
      title={t('editExpressCompany')}
      open={isVisible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={onOk}
      width={500}
      maskClosable={false}
    >
      <Form form={form} onFinish={handleUpdateCourier}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('country')}
          name="countryCode"
          rules={[{ required: true, message: t('pleaseSelectCountry') }]}
        >
          <Select
            showSearch
            placeholder={t('pleaseSelectCountry')}
            optionFilterProp="children"
            filterOption={(input, option) => {
              const country = countries.find(c => c.code === option.value);
              return country?.name.toLowerCase().includes(input.toLowerCase());
            }}
            dropdownMatchSelectWidth={false}
            style={{ width: '100%' }}
          >
            {countries.map(country => countryOption(country))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('companyName')}
          name="name"
          rules={[{ required: true, message: t('pleaseEnterCompanyName') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('trackingNumberFormat')}
          name="trackingNumberFormat"
          rules={[{ required: true, message: t('pleaseEnterTrackingFormat') }]}
        >
          <Input placeholder={t('trackingFormatExample')} />
        </Form.Item>

        <Form.Item
          label={t('website')}
          name="website"
          rules={[{ required: true, message: t('pleaseEnterWebsite') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t('contactNumber')}
          name="contactNumber"
          rules={[{ required: true, message: t('pleaseEnterContactNumber') }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateExpressCompanyModal;
