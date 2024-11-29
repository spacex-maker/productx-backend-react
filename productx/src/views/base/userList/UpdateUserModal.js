import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Row, Col, Divider, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  UserOutlined, 
  IdcardOutlined, 
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  HomeOutlined,
  NumberOutlined,
  CheckSquareOutlined,
  BankOutlined,
  AimOutlined,
  TagOutlined
} from '@ant-design/icons';

const { Title } = Typography;

// 定义统一的样式
const styles = {
  label: {
    fontSize: '10px',
    height: '16px',
    lineHeight: '16px',
    marginBottom: '2px'
  },
  input: {
    height: '20px',
    fontSize: '10px',
    padding: '0 4px',
    lineHeight: '20px',
    color: '#000000 !important',
  },
  formItem: {
    marginBottom: '4px'
  },
  title: {
    fontSize: '10px',
    marginBottom: '4px'
  },
  divider: {
    margin: '4px 0'
  },
  modal: {
    title: { fontSize: '10px' },
    body: { padding: '8px' }
  }
};

const UpdateUserModal = ({ isVisible, onCancel, onOk, form, handleUpdateUser, selectedUser }) => {
  const { t } = useTranslation();

  // 统一的图标样式
  const iconStyle = {
    fontSize: '12px',
    color: '#1890ff',
    marginRight: '4px'
  };

  // 输入框前缀图标样式
  const prefixIconStyle = {
    color: 'rgba(0, 0, 0, 0.25)',
    fontSize: '12px'
  };

  useEffect(() => {
    if (isVisible && selectedUser) {
      form.setFieldsValue({
        id: selectedUser.id,
        description: selectedUser.description,
        email: selectedUser.email,
        status: selectedUser.status,
        nickname: selectedUser.nickname,
        phoneNumber: selectedUser.phoneNumber,
        fullName: selectedUser.fullName,
        address: selectedUser.address,
        creditScore: selectedUser.creditScore,
        city: selectedUser.city,
        state: selectedUser.state,
        postalCode: selectedUser.postalCode,
        country: selectedUser.country,
        isActive: selectedUser.isActive,
      });
    }
  }, [isVisible, selectedUser, form]);

  return (
    <Modal
      title={<>
        <UserOutlined style={{ ...iconStyle, fontSize: '14px' }} />
        {t('editUserInfo')}
      </>}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={400}
      styles={styles.modal.body}
    >
      <Form form={form} onFinish={handleUpdateUser} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 基本信息部分 */}
        <Title level={5} style={styles.title}>
          <IdcardOutlined style={iconStyle} />
          <span style={{ marginLeft: '4px' }}>{t('basicInfo')}</span>
        </Title>
        <Divider style={styles.divider} />

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<><UserOutlined style={iconStyle} />{t('nickname')}</>}
              name="nickname"
              rules={[{ required: true, message: t('nicknameRequired') }]}
              style={styles.formItem}
            >
              <Input
                prefix={<UserOutlined style={prefixIconStyle} />}
                placeholder={t('enterNickname')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<><IdcardOutlined style={iconStyle} />{t('fullName')}</>}
              name="fullName"
              style={styles.formItem}
            >
              <Input
                prefix={<IdcardOutlined style={prefixIconStyle} />}
                placeholder={t('enterFullName')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<><MailOutlined style={iconStyle} />{t('email')}</>}
              name="email"
              style={styles.formItem}
            >
              <Input
                prefix={<MailOutlined style={prefixIconStyle} />}
                placeholder={t('enterEmail')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<><PhoneOutlined style={iconStyle} />{t('phoneNumber')}</>}
              name="phoneNumber"
              style={styles.formItem}
            >
              <Input
                prefix={<PhoneOutlined style={prefixIconStyle} />}
                placeholder={t('enterPhoneNumber')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<><InfoCircleOutlined style={iconStyle} />{t('description')}</>}
              name="description"
              style={styles.formItem}
            >
              <Input
                prefix={<InfoCircleOutlined style={prefixIconStyle} />}
                placeholder={t('enterDescription')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<><NumberOutlined style={iconStyle} />{t('creditScore')}</>}
              name="creditScore"
              style={styles.formItem}
            >
              <Input
                prefix={<NumberOutlined style={prefixIconStyle} />}
                type="number"
                placeholder={t('enterCreditScore')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<><CheckCircleOutlined style={iconStyle} />{t('status')}</>}
          name="status"
          valuePropName="checked"
          style={styles.formItem}
        >
          <Checkbox>{t('active')}</Checkbox>
        </Form.Item>

        {/* 地址信息部分 */}
        <Title level={5} style={styles.title}>
          <HomeOutlined style={iconStyle} />
          <span style={{ marginLeft: '4px' }}>{t('addressInfo')}</span>
        </Title>
        <Divider style={styles.divider} />

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<><GlobalOutlined style={iconStyle} />{t('country')}</>}
              name="country"
              rules={[{ required: true, message: t('countryRequired') }]}
              style={styles.formItem}
            >
              <Input
                prefix={<GlobalOutlined style={prefixIconStyle} />}
                placeholder={t('enterCountry')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<><BankOutlined style={iconStyle} />{t('state')}</>}
              name="state"
              rules={[{ required: true, message: t('stateRequired') }]}
              style={styles.formItem}
            >
              <Input
                prefix={<BankOutlined style={prefixIconStyle} />}
                placeholder={t('enterState')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<><AimOutlined style={iconStyle} />{t('city')}</>}
              name="city"
              rules={[{ required: true, message: t('cityRequired') }]}
              style={styles.formItem}
            >
              <Input
                prefix={<AimOutlined style={prefixIconStyle} />}
                placeholder={t('enterCity')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<><TagOutlined style={iconStyle} />{t('postalCode')}</>}
              name="postalCode"
              rules={[{ required: true, message: t('postalCodeRequired') }]}
              style={styles.formItem}
            >
              <Input
                prefix={<TagOutlined style={prefixIconStyle} />}
                placeholder={t('enterPostalCode')}
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<><EnvironmentOutlined style={iconStyle} />{t('addressDetail')}</>}
          name="address"
          rules={[{ required: true, message: t('addressDetailRequired') }]}
          style={styles.formItem}
        >
          <Input
            prefix={<EnvironmentOutlined style={prefixIconStyle} />}
            placeholder={t('enterAddressDetail')}
            style={styles.input}
          />
        </Form.Item>

        <Form.Item
          label={<><CheckSquareOutlined style={iconStyle} />{t('isActive')}</>}
          name="isActive"
          style={{ marginBottom: '0px' }}
        >
          <Input
            prefix={<CheckSquareOutlined style={prefixIconStyle} />}
            disabled
            placeholder={t('isActive')}
            style={styles.input}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// 添加全局样式
const globalStyles = `
  .ant-form-item {
    margin-bottom: 4px !important;
  }

  .ant-form-item-label {
    padding-bottom: 0 !important;
  }

  .ant-form-item-label > label {
    font-size: 10px !important;
    height: 14px !important;
    line-height: 14px !important;
  }

  .ant-input {
    color: #000000 !important;
  }

  .ant-input,
  .ant-input-number-input,
  .ant-select-selection-item {
    color: #000000 !important;
  }

  .ant-input[disabled],
  .ant-input-number-input[disabled],
  .ant-select-disabled .ant-select-selection-item {
    color: rgba(0, 0, 0, 0.65) !important;
  }

  .ant-row {
    margin-bottom: 4px !important;
  }

  .ant-form-item-explain {
    min-height: 12px !important;
    margin-top: 1px !important;
  }
`;

// 添加特定的样式
const additionalStyles = `
  .custom-input,
  .custom-input:hover,
  .custom-input:focus {
    color: #000000 !important;
  }

  .custom-input::placeholder {
    color: #999999 !important;
  }
`;

// 合并所有样式
const allStyles = globalStyles + additionalStyles;
const styleSheet = document.createElement('style');
styleSheet.innerText = allStyles;
document.head.appendChild(styleSheet);

export default UpdateUserModal;
