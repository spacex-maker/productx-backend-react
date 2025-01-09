import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;

const UpdateGlobalBankModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateBank,
  selectedBank,
  countries,
}) => {
  const { t } = useTranslation();

  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedBank) {
      form.setFieldsValue({
        id: selectedBank.id,
        bankName: selectedBank.bankName,
        swiftCode: selectedBank.swiftCode,
        bin: selectedBank.bin,
        countryCode: selectedBank.countryCode,
        city: selectedBank.city,
        address: selectedBank.address,
        postalCode: selectedBank.postalCode,
        phoneNumber: selectedBank.phoneNumber,
        email: selectedBank.email,
        website: selectedBank.website,
      });
    }
  }, [isVisible, selectedBank, form]);

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

  return (
    <Modal
      title={t('updateBank')}
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
        onFinish={handleUpdateBank}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

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
              name="countryCode"
            >
              <Select
                showSearch
                placeholder={t('selectCountry')}
                optionFilterProp="children"
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

export default UpdateGlobalBankModal;
