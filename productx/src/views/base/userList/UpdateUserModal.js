import React, { useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Divider,
  Typography,
  Space,
  Tag,
  Switch,
  Alert,
  theme,
  Select,
} from 'antd';
import { useTranslation } from 'react-i18next';
import {
  UserOutlined,
  IdcardOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BankOutlined,
  AimOutlined,
  TagOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import SystemUserBadge from 'src/components/common/SystemUserBadge';
import ImageUpload from 'src/components/common/ImageUpload';
import { formatDate } from 'src/components/common/Common';

const { Text } = Typography;
const { TextArea } = Input;

const KYC_STATUS_MAP = {
  0: { color: 'default', text: '未认证' },
  1: { color: 'processing', text: '审核中' },
  2: { color: 'success', text: '已通过' },
  3: { color: 'error', text: '审核失败' },
  4: { color: 'warning', text: '需重新认证' },
  5: { color: 'processing', text: '解绑审核中' },
  6: { color: 'warning', text: '解绑未通过' },
};

const COUNTRY_OPTIONS = [
  { value: 'CN', label: '中国 (CN)' },
  { value: 'HK', label: '香港 (HK)' },
  { value: 'TW', label: '台湾 (TW)' },
  { value: 'US', label: '美国 (US)' },
  { value: 'JP', label: '日本 (JP)' },
  { value: 'KR', label: '韩国 (KR)' },
  { value: 'SG', label: '新加坡 (SG)' },
  { value: 'GB', label: '英国 (GB)' },
  { value: 'WW', label: '其他 (WW)' },
];

const SectionTitle = ({ icon, children }) => {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        color: token.colorTextHeading,
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      {icon}
      {children}
    </div>
  );
};

const UpdateUserModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateUser,
  selectedUser,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const avatarValue = Form.useWatch('avatar', form);

  const kycConfig = useMemo(
    () => KYC_STATUS_MAP[selectedUser?.kycStatus] || { color: 'default', text: '未知' },
    [selectedUser?.kycStatus],
  );

  useEffect(() => {
    if (!isVisible || !selectedUser) return;

    form.setFieldsValue({
      id: selectedUser.id,
      avatar: selectedUser.avatar || '',
      nickname: selectedUser.nickname,
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      phoneNumber: selectedUser.phoneNumber,
      description: selectedUser.description,
      creditScore: selectedUser.creditScore,
      countryCode: selectedUser.countryCode,
      state: selectedUser.state,
      city: selectedUser.city,
      postalCode: selectedUser.postalCode,
      address: selectedUser.address,
      status: selectedUser.status ?? true,
      isActive: selectedUser.isActive ?? false,
    });
  }, [isVisible, selectedUser, form]);

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          {t('editUserInfo')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={880}
      maskClosable={false}
      destroyOnClose
      centered
      style={{ maxWidth: 'calc(100vw - 32px)' }}
      styles={{
        content: { overflow: 'hidden' },
        body: {
          maxHeight: '78vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingTop: 16,
        },
      }}
    >
      <div style={{ overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
      <Form
        form={form}
        onFinish={handleUpdateUser}
        layout="vertical"
        requiredMark="optional"
        style={{ width: '100%' }}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 用户概要 + 头像上传 */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            padding: 16,
            marginBottom: 16,
            borderRadius: token.borderRadiusLG,
            background: token.colorFillAlter,
            border: `1px solid ${token.colorBorderSecondary}`,
            overflow: 'hidden',
          }}
        >
          <div style={{ flexShrink: 0, width: 112, textAlign: 'center' }}>
            <Form.Item name="avatar" label={t('avatar') || '头像'} style={{ marginBottom: 0 }}>
              <ImageUpload
                type="avatar"
                imageUrl={avatarValue}
                onImageChange={(url) => form.setFieldsValue({ avatar: url || '' })}
                tipText={t('uploadAvatar') || '上传头像'}
              />
            </Form.Item>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Space wrap align="center" style={{ marginBottom: 6 }}>
              <Text strong style={{ fontSize: 16, color: token.colorText }}>
                {selectedUser?.username || '—'}
              </Text>
              {selectedUser?.isBelongSystem ? <SystemUserBadge compact={false} /> : null}
              <Tag color={selectedUser?.status ? 'success' : 'error'}>
                {selectedUser?.status ? t('enabled') : t('disabled')}
              </Tag>
            </Space>
            <Space direction="vertical" size={2}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ID: {selectedUser?.id}
                {selectedUser?.inviteCode ? ` · 邀请码: ${selectedUser.inviteCode}` : ''}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('registrationTime')}: {formatDate(selectedUser?.createTime) || '—'}
              </Text>
              <Space size={4} wrap>
                <Tag icon={<SafetyCertificateOutlined />} color={kycConfig.color}>
                  实名: {kycConfig.text}
                </Tag>
                {selectedUser?.realName ? (
                  <Tag color="default">真实姓名: {selectedUser.realName}</Tag>
                ) : null}
                {selectedUser?.memberLevel != null ? (
                  <Tag color="blue">会员 Lv.{selectedUser.memberLevel}</Tag>
                ) : null}
                {selectedUser?.level != null ? (
                  <Tag color="geekblue">等级 {selectedUser.level}</Tag>
                ) : null}
              </Space>
            </Space>
          </div>
        </div>

        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="实名认证信息请在用户详情「实名认证」Tab 中查看或代为认证，此处不可修改。"
        />

        <SectionTitle icon={<UserOutlined />}>{t('basicInfo')}</SectionTitle>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              label={t('nickname')}
              name="nickname"
              rules={[{ required: true, message: t('nicknameRequired') }]}
            >
              <Input prefix={<UserOutlined />} placeholder={t('enterNickname')} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('fullName')} name="fullName">
              <Input prefix={<IdcardOutlined />} placeholder={t('enterFullName')} allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item
              label={t('email')}
              name="email"
              rules={[{ type: 'email', message: t('invalidEmail') || '邮箱格式不正确' }]}
            >
              <Input prefix={<MailOutlined />} placeholder={t('enterEmail')} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('phoneNumber')} name="phoneNumber">
              <Input prefix={<PhoneOutlined />} placeholder={t('enterPhoneNumber')} allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t('description')} name="description">
          <TextArea
            rows={3}
            placeholder={t('enterDescription')}
            showCount
            maxLength={500}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </Form.Item>

        <Divider style={{ margin: '8px 0 16px' }} />

        <SectionTitle icon={<IdcardOutlined />}>{t('accountSettings') || '账号设置'}</SectionTitle>
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Form.Item
              label={t('status')}
              name="status"
              valuePropName="checked"
              extra={t('userStatusEnabledHint') || '关闭后用户将无法登录使用'}
            >
              <Switch checkedChildren={t('enabled')} unCheckedChildren={t('disabled')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('isActive')}
              name="isActive"
              valuePropName="checked"
              extra={t('userAccountActiveHint') || '账户激活状态（与注册流程相关）'}
            >
              <Switch checkedChildren={t('active')} unCheckedChildren={t('inactive')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('creditScore')} name="creditScore">
              <InputNumber
                min={0}
                max={9999}
                style={{ width: '100%' }}
                placeholder={t('enterCreditScore')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '8px 0 16px' }} />

        <SectionTitle icon={<HomeOutlined />}>{t('addressInfo')}</SectionTitle>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item label={t('countryCode')} name="countryCode">
              <Select
                allowClear
                showSearch
                placeholder={t('countryCode')}
                optionFilterProp="label"
                options={COUNTRY_OPTIONS}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('state')} name="state">
              <Input prefix={<BankOutlined />} placeholder={t('enterState')} allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item label={t('city')} name="city">
              <Input prefix={<AimOutlined />} placeholder={t('enterCity')} allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('postalCode')} name="postalCode">
              <Input prefix={<TagOutlined />} placeholder={t('enterPostalCode')} allowClear />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={t('defaultAddress')} name="address">
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder={t('enterAddressDetail')}
            allowClear
          />
        </Form.Item>
      </Form>
      </div>
    </Modal>
  );
};

export default UpdateUserModal;
