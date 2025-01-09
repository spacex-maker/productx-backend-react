import React from 'react';
import { Modal, Form, Input, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

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
      title="新增钱包"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入钱包密码' }]}
        >
          <Input.Password 
            placeholder="请输入密码" 
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          label="钱包类型"
          name="type"
          rules={[{ required: true, message: '请选择钱包类型' }]}
        >
          <Select 
            placeholder="请选择钱包类型" 
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
          label="钱包标签"
          name="label"
          rules={[{ required: true, message: '请输入钱包标签' }]}
        >
          <Input 
            placeholder="例如：My Wallet" 
            autoComplete="off"
          />
        </Form.Item>

        <Form.Item
          label="国家码"
          name="countryCode"
          rules={[{ required: true, message: '请选择国家码' }]}
        >
          <Select
            showSearch
            placeholder="请选择国家"
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
