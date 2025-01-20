import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Space, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';
import { UserOutlined, PhoneOutlined, HomeOutlined, BarcodeOutlined } from '@ant-design/icons';

const { Option } = Select;

const ShipOrderModal = ({ visible, onCancel, orderData }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);

  // 获取国家列表
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
          // 设置默认区号为中国(+86)
          const defaultCountry = response.find(c => c.dialCode === '+86');
          if (defaultCountry) {
            form.setFieldsValue({
              phoneAreaCode: defaultCountry.dialCode
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, [form]);

  // 设置表单初始值
  useEffect(() => {
    if (visible && orderData) {
      const phoneNum = orderData.userOrder.phoneNum || '';
      let areaCode = '+86';
      let number = phoneNum;

      // 如果电话号码包含区号，则分离
      if (phoneNum.startsWith('+')) {
        const match = phoneNum.match(/^(\+\d+)(.*)$/);
        if (match) {
          [, areaCode, number] = match;
        }
      }

      form.setFieldsValue({
        receiverName: orderData.userOrder.receiverName,
        phoneAreaCode: areaCode,
        phoneNumber: number.trim(),
        deliveryAddress: orderData.userOrder.deliveryAddress,
        expressNumber: orderData.userOrder.expressNumber || '',
      });
    }
  }, [visible, orderData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await api.post('/manage/user-order/ship', {
        orderId: orderData.userOrder.id,
        receiverName: values.receiverName,
        phoneNum: `${values.phoneAreaCode}${values.phoneNumber}`,
        deliveryAddress: values.deliveryAddress,
        expressNumber: values.expressNumber
      });
      
      message.success(t('shipSuccess'));
      onCancel(true);
    } catch (error) {
      console.error('发货失败:', error);
      message.error(t('shipFailed'));
    }
  };

  const areaCodeOption = (country) => (
    <Option key={country.id} value={country.dialCode}>
      <Space>
        <img 
          src={country.flagImageUrl} 
          alt={country.name}
          width={20}
          height={15}
        />
        <span>{country.name}</span>
        <span>({country.isoCode})</span>
        <span>{country.dialCode}</span>
      </Space>
    </Option>
  );

  return (
    <Modal
      title={t('shipOrder')}
      open={visible}
      onCancel={() => onCancel(false)}
      onOk={handleSubmit}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={480}
      maskClosable={false}
      centered
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="receiverName"
          label={t('receiverName')}
          rules={[{ required: true, message: t('receiverNameRequired') }]}
        >
          <Input
            placeholder={t('enterReceiverName')}
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item label={t('phoneNumber')} required>
          <Space.Compact>
            <Form.Item
              name="phoneAreaCode"
              rules={[{ required: true, message: t('pleaseSelectAreaCode') }]}
              noStyle
            >
              <Select
                showSearch
                optionFilterProp="children"
                placeholder={t('areaCode')}
                style={{ width: 200 }}
              >
                {countries.map(country => areaCodeOption(country))}
              </Select>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[{ required: true, message: t('pleaseEnterPhoneNumber') }]}
              noStyle
            >
              <Input
                placeholder={t('enterPhoneNumber')}
                prefix={<PhoneOutlined />}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          name="deliveryAddress"
          label={t('deliveryAddress')}
          rules={[{ required: true, message: t('deliveryAddressRequired') }]}
        >
          <Input.TextArea
            rows={3}
            placeholder={t('enterDeliveryAddress')}
            prefix={<HomeOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="expressNumber"
          label={t('expressNumber')}
          rules={[{ required: true, message: t('expressNumberRequired') }]}
        >
          <Input
            placeholder={t('enterExpressNumber')}
            prefix={<BarcodeOutlined />}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShipOrderModal; 