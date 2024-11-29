import React from 'react';
import { Modal, Form, Input, Row, Col, Divider, Typography, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  UserOutlined, 
  IdcardOutlined, 
  LockOutlined, 
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
  SafetyCertificateOutlined,
  TagOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const UserCreateFormModal = ({
                               isVisible,
                               onCancel,
                               onFinish,
                               form,
                             }) => {
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

  // 修改输入框样式
  const inputStyle = {
    backgroundColor: '#fff',
    '&::placeholder': {
      color: '#BFBFBF !important',
      opacity: 1,
    },
  };

  // 添加全局样式
  const globalStyle = `
    .ant-input::placeholder {
      color: #BFBFBF !important;
    }
    .ant-input-password input::placeholder {
      color: #BFBFBF !important;
    }
  `;

  return (
    <>
      <style>{globalStyle}</style>
      <Modal
        title={<>
          <UserOutlined style={{ ...iconStyle, fontSize: '14px' }} />
          {t('createUser')}
        </>}
        open={isVisible}
        onCancel={onCancel}
        onOk={() => form.submit()}
        cancelText={t('cancel')}
        okText={t('save')}
        width={500} // 设置模态框宽度为500px
      >
        <Form form={form} onFinish={onFinish} layout="vertical" style={{ gap: '8px' }}>

          {/* 基本信息部分 */}
          <Title level={5}>
            <IdcardOutlined style={iconStyle} />
            <span style={{ marginLeft: '4px' }}>{t('basicInfo')}</span>
          </Title>
          <Divider style={{ margin: '8px 0' }} />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<><UserOutlined style={iconStyle} />{t('nickname')}</>}
                name="nickname"
                rules={[{ required: true, message: '请输入用户昵称' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input 
                  prefix={<UserOutlined style={prefixIconStyle} />}
                  placeholder={t('enterNickname')}
                  className="custom-input"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><IdcardOutlined style={iconStyle} />{t('fullName')}</>}
                name="fullName"
                rules={[{ required: true, message: '请输入用户全名' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input 
                  prefix={<IdcardOutlined style={prefixIconStyle} />}
                  placeholder={t('enterFullName')}
                  style={inputStyle}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<><SafetyCertificateOutlined style={iconStyle} />{t('password')}</>}
                name="password"
                rules={[{ required: true, message: '请输入用户密码' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input.Password 
                  prefix={<LockOutlined style={prefixIconStyle} />}
                  placeholder={t('enterPassword')}
                  style={inputStyle}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><PhoneOutlined style={iconStyle} />{t('phoneNumber')}</>}
                name="phoneNumber"
                rules={[{ required: true, message: '请输入用户电话号码' }]}
                style={{ marginBottom: '12px' }}
              >
                <Input 
                  prefix={<PhoneOutlined style={prefixIconStyle} />}
                  placeholder={t('enterPhoneNumber')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            label={<><MailOutlined style={iconStyle} />{t('email')}</>}
            name="email"
            style={{ marginBottom: '12px' }}
          >
            <Input prefix={<MailOutlined />} placeholder="请输入用户电子邮件" />
          </Form.Item>

          <Form.Item 
            label={<><InfoCircleOutlined style={iconStyle} />{t('description')}</>}
            name="description"
            style={{ marginBottom: '12px' }}
          >
            <Input prefix={<InfoCircleOutlined />} placeholder="请输入用户介绍" />
          </Form.Item>

          <Form.Item label={t('status')} name="status" valuePropName="checked" style={{ marginBottom: '12px' }}>
            <Checkbox>{t('active')}</Checkbox>
          </Form.Item>

          {/* 地址信息部分 */}
          <Title level={5}>
            <HomeOutlined style={iconStyle} />
            <span style={{ marginLeft: '4px' }}>{t('addressInfo')}</span>
          </Title>
          <Divider style={{ margin: '8px 0' }} />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<><GlobalOutlined style={iconStyle} />{t('country')}</>}
                name="country"
                style={{ marginBottom: '12px' }}
              >
                <Input 
                  prefix={<GlobalOutlined style={prefixIconStyle} />}
                  placeholder={t('enterCountry')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><BankOutlined style={iconStyle} />{t('state')}</>}
                name="state"
                style={{ marginBottom: '12px' }}
              >
                <Input 
                  prefix={<BankOutlined style={prefixIconStyle} />}
                  placeholder={t('enterState')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<><AimOutlined style={iconStyle} />{t('city')}</>}
                name="city"
                style={{ marginBottom: '12px' }}
              >
                <Input 
                  prefix={<AimOutlined style={prefixIconStyle} />}
                  placeholder={t('enterCity')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<><TagOutlined style={iconStyle} />{t('postalCode')}</>}
                name="postalCode"
                style={{ marginBottom: '12px' }}
              >
                <Input 
                  prefix={<TagOutlined style={prefixIconStyle} />}
                  placeholder={t('enterPostalCode')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<><EnvironmentOutlined style={iconStyle} />{t('address')}</>}
            name="address"
            style={{ marginBottom: '12px' }}
          >
            <Input 
              prefix={<EnvironmentOutlined style={prefixIconStyle} />}
              placeholder={t('enterAddress')}
            />
          </Form.Item>

          {/* 其他信息部分 */}
          <Form.Item 
            label={<><NumberOutlined style={iconStyle} />{t('creditScore')}</>}
            name="creditScore"
            style={{ marginBottom: '12px' }}
          >
            <Input 
              prefix={<NumberOutlined style={prefixIconStyle} />}
              type="number"
              placeholder={t('enterCreditScore')}
            />
          </Form.Item>

          <Form.Item 
            label={<><CheckSquareOutlined style={iconStyle} />{t('isActive')}</>}
            name="isActive"
            valuePropName="checked"
            style={{ marginBottom: '0px' }}
          >
            <Checkbox>{t('isAccountActive')}</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserCreateFormModal;
