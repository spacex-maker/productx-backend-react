import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { TextArea } = Input;
const { Option } = Select;

const BankCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取国家列表
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
          // 设置默认国家为中国
          const defaultCountry = response.find(c => c.code === 'CN');
          if (defaultCountry) {
            form.setFieldsValue({
              country: defaultCountry.code
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (isVisible) {
      fetchCountries();
    }
  }, [isVisible, form]);

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

  // BIN码输入前的验证
  const handleBinBeforeChange = (_, newValue) => {
    if (!/^\d*$/.test(newValue)) {
      return false;
    }
    if (newValue.length > 8) {
      return false;
    }
    return true;
  };

  return (
    <Modal
      title={t('createBank')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={560}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('bankName')}
              name="bankName"
              rules={[{ required: true, message: t('pleaseEnterBankName') }]}
            >
              <Input placeholder={t('enterBankName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('swiftCode')}
              name="swiftCode"
            >
              <Input placeholder={t('enterSwiftCode')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('bin')}
          name="bin"
          extra={t('binInputTip')}
        >
          <Select
            mode="tags"
            placeholder={t('enterBankBIN')}
            style={{ width: '100%' }}
            tokenSeparators={[',', ' ']}
            beforeTagAdd={handleBinBeforeChange}
            notFoundContent={null}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('country')}
              name="country"
            >
              <Select
                showSearch
                placeholder={t('selectCountry')}
                optionFilterProp="children"
                loading={loading}
                filterOption={(input, option) => {
                  const country = countries.find(c => c.code === option.value);
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
                {countries.map(country => countryOption(country))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('city')}
              name="city"
            >
              <Input placeholder={t('enterCity')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('address')}
          name="address"
        >
          <TextArea 
            rows={2} 
            placeholder={t('enterAddress')}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('postalCode')}
              name="postalCode"
            >
              <Input placeholder={t('enterPostalCode')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('phoneNumber')}
              name="phoneNumber"
            >
              <Input placeholder={t('enterPhoneNumber')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('email')}
              name="email"
            >
              <Input placeholder={t('enterEmail')} type="email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('website')}
              name="website"
            >
              <Input placeholder={t('enterWebsite')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BankCreateFormModal;
