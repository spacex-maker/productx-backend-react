import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Space, message } from 'antd';
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ExpressCompanyCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
          const defaultCountry = response.find(c => c.code === 'CN');
          if (defaultCountry) {
            form.setFieldsValue({
              countryCode: defaultCountry.code
            });
          }
        }
      } catch (error) {
        console.error('获取国家列表失败:', error);
        message.error(t('fetchCountriesFailed'));
      }
    };
    fetchCountries();
  }, [form, t]);

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
      title={t('addExpressCompany')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
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

export default ExpressCompanyCreateFormModal;
