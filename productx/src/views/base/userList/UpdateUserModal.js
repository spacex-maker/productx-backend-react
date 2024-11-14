import React, { useEffect } from 'react';
import { Modal, Form, Input, Checkbox, Row, Col, Divider, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

// 定义统一的样式
const styles = {
  label: {
    fontSize: '8px',
    height: '16px',
    lineHeight: '16px',
    marginBottom: '2px'
  },
  input: {
    height: '20px',
    fontSize: '8px',
    padding: '0 4px',
    lineHeight: '20px'
  },
  formItem: {
    marginBottom: '4px'
  },
  title: {
    fontSize: '8px',
    marginBottom: '4px'
  },
  divider: {
    margin: '4px 0'
  },
  modal: {
    title: { fontSize: '8px' },
    body: { padding: '8px' }
  }
};

const UpdateUserModal = ({ isVisible, onCancel, onOk, form, handleUpdateUser, selectedUser }) => {
  const { t } = useTranslation();

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
      title={<span style={styles.modal.title}>{t('editUserInfo')}</span>}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={400}
      bodyStyle={styles.modal.body}
    >
      <Form
        form={form}
        onFinish={handleUpdateUser}
        layout="vertical"
        style={{ gap: '4px' }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 基本信息部分 */}
        <Title level={5} style={styles.title}>{t('basicInfo')}</Title>
        <Divider style={styles.divider} />

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<span style={styles.label}>{t('nickname')}</span>}
              name="nickname"
              rules={[{ required: true, message: t('nicknameRequired') }]}
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterNickname')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label={<span style={styles.label}>{t('fullName')}</span>}
              name="fullName" 
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterFullName')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item 
              label={<span style={styles.label}>{t('email')}</span>}
              name="email" 
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterEmail')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label={<span style={styles.label}>{t('phoneNumber')}</span>}
              name="phoneNumber" 
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterPhoneNumber')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item 
              label={<span style={styles.label}>{t('description')}</span>}
              name="description" 
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterDescription')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label={<span style={styles.label}>{t('creditScore')}</span>}
              name="creditScore" 
              style={styles.formItem}
            >
              <Input 
                type="number" 
                placeholder={t('enterCreditScore')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          label={<span style={styles.label}>{t('status')}</span>}
          name="status" 
          valuePropName="checked" 
          style={styles.formItem}
        >
          <Checkbox>{t('active')}</Checkbox>
        </Form.Item>

        {/* 地址信息部分 */}
        <Title level={5} style={styles.title}>{t('addressInfo')}</Title>
        <Divider style={styles.divider} />

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<span style={styles.label}>{t('country')}</span>}
              name="country"
              rules={[{ required: true, message: t('countryRequired') }]}
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterCountry')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={styles.label}>{t('state')}</span>}
              name="state"
              rules={[{ required: true, message: t('stateRequired') }]}
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterState')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<span style={styles.label}>{t('city')}</span>}
              name="city"
              rules={[{ required: true, message: t('cityRequired') }]}
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterCity')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={styles.label}>{t('postalCode')}</span>}
              name="postalCode"
              rules={[{ required: true, message: t('postalCodeRequired') }]}
              style={styles.formItem}
            >
              <Input 
                placeholder={t('enterPostalCode')} 
                style={styles.input}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={<span style={styles.label}>{t('addressDetail')}</span>}
          name="address"
          rules={[{ required: true, message: t('addressDetailRequired') }]}
          style={styles.formItem}
        >
          <Input 
            placeholder={t('enterAddressDetail')} 
            style={styles.input}
          />
        </Form.Item>

        <Form.Item 
          label={<span style={styles.label}>{t('isActive')}</span>}
          name="isActive" 
          style={{ marginBottom: '0px' }}
        >
          <Input 
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
    font-size: 8px !important;
    height: 14px !important;
    line-height: 14px !important;
  }
  
  .ant-row {
    margin-bottom: 4px !important;
  }
  
  .ant-form-item-explain {
    min-height: 12px !important;
    margin-top: 1px !important;
  }
`;

// 将全局样式添加到文档中
const styleSheet = document.createElement('style');
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

export default UpdateUserModal;
