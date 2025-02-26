import React from 'react';
import { Modal, Form, Input, Select, Space, Alert, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { Text } = Typography;

const WalletCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  countries,
  cryptoCurrencies
}) => {
  const { t } = useTranslation();

  // 渲染国家选项
  const countryOption = (country) => (
    <Option key={country.code} value={country.code}>
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
      title={t('addWallet')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
    >
      <Alert
        message={t('wallet_passwordWarningTitle')}
        description={
          <div>
            <Text>{t('wallet_passwordWarningDescription')}</Text>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li>{t('wallet_passwordWarningPoint1')}</li>
              <li>{t('wallet_passwordWarningPoint2')}</li>
            </ul>
          </div>
        }
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <Form 
        form={form} 
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t('password')}
          name="password"
          rules={[{ required: true, message: t('pleaseInputPassword') }]}
        >
          <Input.Password 
            placeholder={t('pleaseInputPassword')} 
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label={t('walletType')}
          name="type"
          rules={[{ required: true, message: t('pleaseSelectWalletType') }]}
        >
          <Select 
            placeholder={t('pleaseSelectWalletType')} 
            allowClear
          >
            {cryptoCurrencies.map((crypto) => (
              <Select.Option key={crypto.id} value={crypto.id}>
                {crypto.name} ({crypto.symbol})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('walletLabel')}
          name="label"
          rules={[{ required: true, message: t('pleaseInputWalletLabel') }]}
        >
          <Input 
            placeholder={t('walletLabelExample')} 
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          label={t('countryCode')}
          name="countryCode"
          rules={[{ required: true, message: t('pleaseSelectCountry') }]}
        >
          <Select
            showSearch
            placeholder={t('pleaseSelectCountry')}
            allowClear
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
      </Form>
    </Modal>
  );
};

export default WalletCreateFormModal;
