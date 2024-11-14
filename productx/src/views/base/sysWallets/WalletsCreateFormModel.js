import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import api from 'src/axiosInstance';

const WalletCreateFormModal = ({
                                 isVisible,
                                 onCancel,
                                 onFinish,
                                 form,
                               }) => {
  const [countries, setCountries] = useState([]);  // 存储获取到的国家列表
  const [cryptoCurrencies, setCryptoCurrencies] = useState([]);  // 存储获取到的钱包类型列表

  // 获取国家列表
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);  // 设置国家列表
        } else {
          message.error('获取国家列表失败');
        }
      } catch (error) {
        message.error('请求失败，请检查网络连接');
        console.error('获取国家列表失败:', error);
      }
    };
    fetchCountries();
  }, []);

  // 获取钱包类型列表
  useEffect(() => {
    const fetchCryptoCurrencies = async () => {
      try {
        const response = await api.get('/manage/sys-crypto-currencies/list-all-enable');
        if (response) {
          setCryptoCurrencies(response);  // 设置钱包类型列表
        } else {
          message.error('获取钱包类型列表失败');
        }
      } catch (error) {
        message.error('请求失败，请检查网络连接');
        console.error('获取钱包类型列表失败:', error);
      }
    };
    fetchCryptoCurrencies();
  }, []);

  return (
    <Modal
      title="新增钱包"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="钱包类型"
          name="type"
          rules={[{ required: true, message: '请选择钱包类型' }]}
        >
          <Select placeholder="请选择钱包类型" allowClear>
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
          <Input placeholder="例如：My Wallet" />
        </Form.Item>
        <Form.Item
          label="国家码"
          name="countryCode"
          rules={[{ required: true, message: '请选择国家码' }]}
        >
          <Select placeholder="请选择国家" allowClear>
            {countries.map((country) => (
              <Select.Option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入钱包密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WalletCreateFormModal;
