import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Typography, Divider, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import api from 'src/axiosInstance';

const { Title } = Typography;
const { Option } = Select;

const UpdateUserAddressModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateAddress,
  selectedAddress
}) => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);

  // 获取国家列表
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // 设置表单初始值
  useEffect(() => {
    if (isVisible && selectedAddress) {
      form.setFieldsValue({
        id: selectedAddress.id,
        contactName: selectedAddress.contactName,
        phoneAreaCode: `+${selectedAddress.areaCode}`,
        phoneNumber: selectedAddress.phoneNum,
        contactAddress: selectedAddress.contactAddress,
        currentUse: selectedAddress.currentUse,
        countryCode: selectedAddress.countryCode
      });
    }
  }, [isVisible, selectedAddress, form]);

  const areaCodeOption = (country) => (
    <Option key={country.id} value={country.dialCode}>
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
        <span style={{ color: '#999' }}>{country.dialCode}</span>
      </Space>
    </Option>
  );

  return (
    <Modal
      title={
        <span>
          <HomeOutlined style={{ marginRight: 4 }} />
          {t('editAddress')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={(values) => {
          const submitData = {
            id: values.id,
            countryCode: values.countryCode,
            areaCode: values.phoneAreaCode?.replace('+', ''),
            phoneNum: values.phoneNumber,
            contactAddress: values.contactAddress,
            contactName: values.contactName,
            currentUse: values.currentUse
          };
          handleUpdateAddress(submitData);
        }} 
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Title level={5}>
          <UserOutlined style={{ marginRight: 4 }} />
          {t('basicInformation')}
        </Title>
        <Divider />

        <Form.Item
          label={t('contactName')}
          name="contactName"
          rules={[{ required: true, message: t('pleaseEnterContactName') }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('enterContactName')}
          />
        </Form.Item>

        <Form.Item label={t('phoneNumber')} required style={{ marginBottom: 0 }}>
          <Space.Compact style={{ width: '100%' }}>
            <Form.Item
              name="phoneAreaCode"
              noStyle
              rules={[{ required: true, message: t('pleaseSelectAreaCode') }]}
            >
              <Select 
                style={{ width: 220 }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const country = countries.find(c => c.dialCode === option.value);
                  return (
                    country?.name.toLowerCase().includes(input.toLowerCase()) ||
                    country?.dialCode.includes(input)
                  );
                }}
                onChange={(value) => {
                  const country = countries.find(c => c.dialCode === value);
                  form.setFieldsValue({
                    countryCode: country?.code || null
                  });
                }}
                dropdownMatchSelectWidth={false}
                popupMatchSelectWidth={false}
                listHeight={256}
                dropdownStyle={{ 
                  minWidth: 300,
                  maxWidth: 400
                }}
              >
                {countries.map(country => areaCodeOption(country))}
              </Select>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              noStyle
              rules={[
                { required: true, message: t('pleaseEnterPhoneNumber') },
                { pattern: /^[0-9]{5,}$/, message: t('invalidPhoneNumber') }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder={t('enterPhoneNumber')}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  form.setFieldValue('phoneNumber', value);
                }}
                style={{ flex: 1, minWidth: 200 }}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          label={t('contactAddress')}
          name="contactAddress"
          rules={[{ required: true, message: t('pleaseEnterContactAddress') }]}
        >
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder={t('enterDetailedAddress')}
          />
        </Form.Item>

        <Form.Item
          name="currentUse"
          valuePropName="checked"
        >
          <Checkbox>{t('setAsDefaultAddress')}</Checkbox>
        </Form.Item>

        <Form.Item name="countryCode">
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserAddressModal;
