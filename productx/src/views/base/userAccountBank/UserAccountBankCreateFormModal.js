import React, { useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, Typography, Divider, Space, Avatar, Tag, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';
import {
  UserOutlined,
  BankOutlined,
  NumberOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  DollarOutlined
} from '@ant-design/icons';
import api from 'src/axiosInstance';

const { Title } = Typography;
const { Option } = Select;

const UserAccountBankCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);

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
          <Avatar  src={user.avatar} />
          <span>{user.username}</span>
        </Space>
      }
    >
      <Space align="center">
        <Avatar

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

  return (
    <Modal
      title={
        <span style={{ fontSize: '12px' }}>
          <BankOutlined style={{ marginRight: '4px' }} />
          {t('createAccount')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={500}
      maskClosable={false}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Title level={5} style={{ fontSize: '12px', marginBottom: '8px' }}>
          <UserOutlined style={{ marginRight: '4px' }} />
          {t('userInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

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
            notFoundContent={fetching ? <Spin  /> : null}
            optionLabelProp="label"
            dropdownStyle={{
              padding: 4,
              minWidth: 300
            }}
          >
            {users.map(user => userOption(user))}
          </Select>
        </Form.Item>

        <Title level={5} style={{ fontSize: '12px', marginBottom: '8px' }}>
          <BankOutlined style={{ marginRight: '4px' }} />
          {t('bankInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('bankName')}
          name="bankName"
          rules={[{ required: true, message: t('pleaseEnterBankName') }]}
        >
          <Input
            prefix={<BankOutlined />}
            placeholder={t('enterBankName')}
          />
        </Form.Item>

        <Form.Item
          label={t('accountNumber')}
          name="accountNumber"
          rules={[{ required: true, message: t('pleaseEnterAccountNumber') }]}
        >
          <Input
            prefix={<NumberOutlined />}
            placeholder={t('enterAccountNumber')}
          />
        </Form.Item>

        <Form.Item
          label={t('accountHolderName')}
          name="accountHolderName"
          rules={[{ required: true, message: t('pleaseEnterAccountHolderName') }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder={t('enterAccountHolderName')}
          />
        </Form.Item>

        <Form.Item
          label={t('swiftCode')}
          name="swiftCode"
          rules={[{ required: true, message: t('pleaseEnterSwiftCode') }]}
        >
          <Input
            prefix={<SafetyCertificateOutlined />}
            placeholder={t('enterSwiftCode')}
          />
        </Form.Item>

        <Form.Item
          label={t('currencyCode')}
          name="currencyCode"
          rules={[{ required: true, message: t('pleaseEnterCurrencyCode') }]}
        >
          <Input
            prefix={<DollarOutlined />}
            placeholder={t('enterCurrencyCode')}
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          valuePropName="checked"
        >
          <Checkbox>{t('isActive')}</Checkbox>
        </Form.Item>
      </Form>

      <style jsx global>{`
        .ant-input::placeholder {
          color: #bfbfbf; /* 灰色 */
        }
        .ant-select-selection-placeholder {
          color: #bfbfbf; /* 灰色 */
        }
      `}</style>
    </Modal>
  );
};

export default UserAccountBankCreateFormModal;
