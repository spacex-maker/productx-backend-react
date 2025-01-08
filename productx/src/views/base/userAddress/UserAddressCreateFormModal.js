import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Typography, Divider, Select, Spin, Avatar, Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import debounce from 'lodash/debounce';
import api from 'src/axiosInstance';

const { Title } = Typography;
const { Option } = Select;

const UserAddressCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await api.get('/manage/countries/list-all-enable');
        if (response) {
          setCountries(response);
          const defaultCountry = response.find(c => c.dialCode === '+86');
          if (defaultCountry) {
            form.setFieldsValue({
              countryCode: defaultCountry.code
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, [form]);

  const fetchUsers = debounce(async (searchText) => {
    if (!searchText) {
      setUsers([]);
      return;
    }

    setFetching(true);
    try {
      const params = {};
      if (/^\d+$/.test(searchText)) {
        params.id = parseInt(searchText);
      } else {
        params.username = searchText;
      }

      const response = await api.get('/manage/user/list-all-summary', { params });
      if (response) {
        setUsers(response);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setFetching(false);
    }
  }, 500);

  const userOption = (user) => (
    <Select.Option 
      key={user.id} 
      value={user.id}
      label={
        <Space>
          <Avatar size="small" src={user.avatar} />
          <span>{user.username}</span>
        </Space>
      }
    >
      <Space align="center">
        <Avatar 
          size="small" 
          src={user.avatar}
          style={{ marginRight: 8 }}
        />
        <span style={{ flex: 1 }}>{user.username}</span>
        <Space size={4}>
          {user.isBelongSystem && (
            <Tag color="blue">
              {t('systemUser')}
            </Tag>
          )}
          <Tag color={user.status ? 'success' : 'error'}>
            {user.status ? t('active') : t('inactive')}
          </Tag>
          <span style={{ color: '#999' }}>
            ID: {user.id}
          </span>
        </Space>
      </Space>
    </Select.Option>
  );

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
          {t('createAddress')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      maskClosable={false}
    >
      <Form form={form} onFinish={(values) => {
        console.log('Form values:', values);
        const submitData = {
          userId: values.userId,
          countryCode: values.countryCode,
          areaCode: values.phoneAreaCode?.replace('+', ''),
          phoneNum: values.phoneNumber,
          contactAddress: values.contactAddress,
          contactName: values.contactName,
          currentUse: values.setAsDefaultAddress
        };
        console.log('Submit data:', submitData);
        onFinish(submitData);
      }} layout="vertical">
        <Title level={5}>
          <UserOutlined style={{ marginRight: 4 }} />
          {t('basicInformation')}
        </Title>
        <Divider />

        <Form.Item
          label={t('selectUser')}
          name="userId"
          rules={[{ required: true, message: t('pleaseSelectUser') }]}
        >
          <Select
            showSearch
            allowClear
            placeholder={t('searchUserPlaceholder')}
            onSearch={fetchUsers}
            loading={fetching}
            filterOption={false}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            optionLabelProp="label"
            dropdownStyle={{ 
              padding: 4,
              minWidth: 300
            }}
          >
            {users.map(user => userOption(user))}
          </Select>
        </Form.Item>

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
              initialValue="+86"
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
                  console.log('Selected country:', country);
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
          name="setAsDefaultAddress"
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

export default UserAddressCreateFormModal;
