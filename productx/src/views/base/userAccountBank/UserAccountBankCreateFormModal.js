import React from 'react';
import { Modal, Form, Input, Select, Checkbox, Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  BankOutlined,
  NumberOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  DollarOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const UserAccountBankCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  const { t } = useTranslation();

  const styles = {
    label: {
      fontSize: '10px',
      height: '16px',
      lineHeight: '16px',
      marginBottom: '2px'
    },
    input: {
      height: '24px',
      fontSize: '10px',
      padding: '0 8px'
    },
    formItem: {
      marginBottom: '8px'
    },
    icon: {
      fontSize: '12px',
      color: '#1890ff',
      marginRight: '4px'
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '12px' }}>
          <BankOutlined style={styles.icon} />
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
          <UserOutlined style={styles.icon} />
          {t('basicInfo')}
        </Title>
        <Divider style={{ margin: '8px 0' }} />

        <Form.Item
          label={t('userId')}
          name="userId"
          rules={[{ required: true, message: t('pleaseEnterUserId') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<UserOutlined />}
            style={styles.input}
            placeholder={t('enterUserId')}
          />
        </Form.Item>

        <Form.Item
          label={t('bankName')}
          name="bankName"
          rules={[{ required: true, message: t('pleaseEnterBankName') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<BankOutlined />}
            style={styles.input}
            placeholder={t('enterBankName')}
          />
        </Form.Item>

        <Form.Item
          label={t('accountNumber')}
          name="accountNumber"
          rules={[{ required: true, message: t('pleaseEnterAccountNumber') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<NumberOutlined />}
            style={styles.input}
            placeholder={t('enterAccountNumber')}
          />
        </Form.Item>

        <Form.Item
          label={t('accountHolderName')}
          name="accountHolderName"
          rules={[{ required: true, message: t('pleaseEnterAccountHolderName') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<UserOutlined />}
            style={styles.input}
            placeholder={t('enterAccountHolderName')}
          />
        </Form.Item>

        <Form.Item
          label={t('swiftCode')}
          name="swiftCode"
          rules={[{ required: true, message: t('pleaseEnterSwiftCode') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<SafetyCertificateOutlined />}
            style={styles.input}
            placeholder={t('enterSwiftCode')}
          />
        </Form.Item>

        <Form.Item
          label={t('currencyCode')}
          name="currencyCode"
          rules={[{ required: true, message: t('pleaseEnterCurrencyCode') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<DollarOutlined />}
            style={styles.input}
            placeholder={t('enterCurrencyCode')}
          />
        </Form.Item>

        <Form.Item
          name="isActive"
          valuePropName="checked"
          style={styles.formItem}
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
