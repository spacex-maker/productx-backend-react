import React, { useMemo } from 'react';
import { Modal, Row, Col, Tag, Divider, Space, Typography, Card, Descriptions, Statistic, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  MobileOutlined,
  LaptopOutlined,
  ToolOutlined,
  TableOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  CarOutlined,
  QuestionOutlined,
  ShopOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  FileTextOutlined,
  StarOutlined,
  CommentOutlined,
  OrderedListOutlined,
  FieldTimeOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  LinkOutlined,
  IeOutlined,
  CrownOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserSwitchOutlined,
  EditOutlined,
  CheckCircleOutlined,
  AppstoreOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  WeiboOutlined,
  WechatOutlined
} from '@ant-design/icons';
import moment from 'moment';
import dayjs from 'dayjs';

const RepairServiceMerchantsDetailModal = ({
  isVisible,
  onCancel,
  merchantData
}) => {
  const { t } = useTranslation();

  // 服务类型标签的颜色映射
  const serviceTypeColors = useMemo(() => ({
    'mobileRepair': 'blue',
    'computerRepair': 'cyan',
    'applianceRepair': 'purple',
    'furnitureRepair': 'magenta',
    'plumbing': 'green',
    'electricalRepair': 'orange',
    'carRepair': 'red',
    'other': 'default'
  }), []);

  // 服务类型图标映射
  const serviceTypeIcons = useMemo(() => ({
    'mobileRepair': <MobileOutlined />,
    'computerRepair': <LaptopOutlined />,
    'applianceRepair': <ToolOutlined />,
    'furnitureRepair': <TableOutlined />,
    'plumbing': <ExperimentOutlined />,
    'electricalRepair': <ThunderboltOutlined />,
    'carRepair': <CarOutlined />,
    'other': <QuestionOutlined />
  }), []);

  // 社交平台图标映射
  const socialMediaIcons = useMemo(() => ({
    facebook: <FacebookOutlined />,
    twitter: <TwitterOutlined />,
    instagram: <InstagramOutlined />,
    linkedin: <LinkedinOutlined />,
    youtube: <YoutubeOutlined />,
    weibo: <WeiboOutlined />,
    wechat: <WechatOutlined />
  }), []);

  const renderDetailItem = (label, value, icon) => (
    <div className="detail-item">
      <span className="detail-label">
        {icon && <span className="detail-icon">{icon}</span>}
        {label}:
      </span>
      <span className="detail-value">{value || '-'}</span>
    </div>
  );

  // 格式化营业时间显示
  const formatWorkingHours = (startTime, endTime) => {
    if (!startTime || !endTime) return '-';
    return `${startTime} - ${endTime}`;
  };

  // 处理许可证过期时间的显示
  const formatLicenseExpiry = (expiry) => {
    if (!expiry) return '-';

    try {
      // 如果是 dayjs 对象
      if (expiry?._isAMomentObject || expiry?.isValid) {
        return dayjs(expiry).format('YYYY-MM-DD');
      }

      // 如果是数组格式 [2025, 12, 31]
      if (Array.isArray(expiry)) {
        return dayjs(expiry.join('-')).format('YYYY-MM-DD');
      }

      // 如果是字符串格式
      if (typeof expiry === 'string') {
        return dayjs(expiry).isValid() ? dayjs(expiry).format('YYYY-MM-DD') : expiry;
      }

      console.warn('Unknown licenseExpiry format:', expiry);
      return '-';
    } catch (error) {
      console.error('Error formatting licenseExpiry:', error);
      return '-';
    }
  };

  // 添加数据格式检查
  const safeRenderDateTime = (dateTime) => {
    try {
      return dateTime ? moment(dateTime).format('YYYY-MM-DD HH:mm:ss') : '-';
    } catch (error) {
      console.error('Error formatting datetime:', error);
      return '-';
    }
  };

  const renderStatus = (status) => {
    return status ?
      <Tag color="success" style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
        {t('operating')}
      </Tag> :
      <Tag color="error" style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
        {t('closed')}
      </Tag>;
  };

  const renderVipLevel = (isVip) => {
    return isVip ?
      <Tag color="gold" icon={<CrownOutlined />} style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
        {t('vip')}
      </Tag> :
      <Tag color="default" style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
        {t('regular')}
      </Tag>;
  };

  const renderServiceTypes = (types) => {
    if (!types || !types.length) return '-';
    return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {types.map(type => (
          <Tag
            key={type}
            color={serviceTypeColors[type]}
            style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}
            icon={serviceTypeIcons[type]}
          >
            {t(type)}
          </Tag>
        ))}
      </div>
    );
  };

  const renderPaymentMethods = (methods) => {
    if (!methods || !methods.length) return '-';
    return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {methods.map(method => (
          <Tag
            key={method}
            style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}
          >
            {method}
          </Tag>
        ))}
      </div>
    );
  };

  // 渲染社交平台链接
  const renderSocialMediaLinks = (links) => {
    if (!links) return '-';
    try {
      const linksObj = typeof links === 'string' ? JSON.parse(links) : links;
      return (
        <Space size={4} wrap>
          {Object.entries(linksObj).map(([platform, url]) => (
            <Tag
              key={platform}
              icon={socialMediaIcons[platform.toLowerCase()]}
              color="blue"
              style={{
                margin: 0,
                fontSize: '10px',
                lineHeight: '16px',
                padding: '0 4px',
                cursor: 'pointer'
              }}
              onClick={() => window.open(url, '_blank')}
            >
              {t(platform)}
            </Tag>
          ))}
        </Space>
      );
    } catch (error) {
      console.error('Failed to parse social media links:', error);
      return '-';
    }
  };

  return (
    <Modal
      title={<Typography.Title level={4} style={{ margin: 0 }}>{t('merchantDetail')}</Typography.Title>}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      bodyStyle={{ padding: '12px 24px' }}
    >
      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col span={24}>
          <Card

            title={<Space><ShopOutlined />{t('basicInfo')}</Space>}
            bordered={false}
          >
            <div style={{ display: 'flex', gap: '24px' }}>
              {/* 左侧头像 */}
              <div style={{
                flexShrink: 0,
                width: 120,
                height: 120,
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fafafa'
              }}>
                {merchantData?.merchantLogo ? (
                  <Image
                    src={merchantData.merchantLogo}
                    width={120}
                    height={120}
                    style={{ objectFit: 'contain' }}
                    preview={true}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5'
                  }}>
                    <ShopOutlined style={{ fontSize: 40, color: '#bfbfbf' }} />
                  </div>
                )}
              </div>

              {/* 右侧信息 */}
              <div style={{ flex: 1 }}>
                <Descriptions
                  column={{ xs: 1, sm: 2, md: 3 }}

                  style={{ marginBottom: 8 }}
                >
                  <Descriptions.Item
                    label={t('merchantName')}
                    span={3}
                  >
                    <Space size={16}>
                      <Typography.Text strong>{merchantData?.merchantName}</Typography.Text>
                      {renderStatus(merchantData?.status)}
                      {renderVipLevel(merchantData?.vipLevel)}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('businessLicense')}>
                    {merchantData?.businessLicense || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('licenseExpiry')}>
                    {formatLicenseExpiry(merchantData?.licenseExpiry)}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('taxNumber')}>
                    {merchantData?.taxNumber || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('joinedPartnerProgram')}>
                    <Tag color={merchantData?.joinedPartnerProgram ? 'success' : 'default'}>
                      {merchantData?.joinedPartnerProgram ? t('yes') : t('no')}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('certifications')} span={2}>
                    {merchantData?.certifications ? (
                      <Space size={4} wrap>
                        {merchantData.certifications.split(',').map(cert => (
                          <Tag key={cert} color="blue" icon={<SafetyCertificateOutlined />}>
                            {cert.trim()}
                          </Tag>
                        ))}
                      </Space>
                    ) : '-'}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
        </Col>

        {/* 联系信息 */}
        <Col span={12}>
          <Card

            title={<Space><PhoneOutlined />{t('contactInfo')}</Space>}
            bordered={false}
          >
            <Descriptions column={1}   >
              <Descriptions.Item label={t('contactPerson')}>
                {merchantData?.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label={t('contactPhone')}>
                {merchantData?.contactPhone}
              </Descriptions.Item>
              <Descriptions.Item label={t('contactEmail')}>
                {merchantData?.contactEmail}
              </Descriptions.Item>
              <Descriptions.Item label={t('websiteUrl')}>
                <a href={merchantData?.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {merchantData?.websiteUrl}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label={t('socialMediaLinks')}>
                {renderSocialMediaLinks(merchantData?.socialMediaLinks)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 地址信息 */}
        <Col span={12}>
          <Card

            title={<Space><EnvironmentOutlined />{t('addressInfo')}</Space>}
            bordered={false}
          >
            <Descriptions column={1}   >
              <Descriptions.Item label={t('address')}>
                {`${merchantData?.province || ''} ${merchantData?.city || ''} ${merchantData?.address || ''}`}
              </Descriptions.Item>
              <Descriptions.Item label={t('postalCode')}>
                {merchantData?.postalCode}
              </Descriptions.Item>
              <Descriptions.Item label={t('countryCode')}>
                {merchantData?.countryCode}
              </Descriptions.Item>
              <Descriptions.Item label={t('coordinates')}>
                {merchantData?.latitude && merchantData?.longitude ?
                  `${merchantData.latitude}, ${merchantData.longitude}` : '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('serviceAreas')}>
                {merchantData?.serviceAreas}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 业务信息 */}
        <Col span={24}>
          <Card

            title={<Space><AppstoreOutlined />{t('businessInfo')}</Space>}
            bordered={false}
          >
            <Descriptions column={{ xs: 1, sm: 2 }}   >
              <Descriptions.Item label={t('workingHours')}>
                {formatWorkingHours(merchantData?.workStartTime, merchantData?.workEndTime)}
              </Descriptions.Item>
              <Descriptions.Item label={t('serviceTypes')}>
                {renderServiceTypes(merchantData?.serviceTypes)}
              </Descriptions.Item>
              <Descriptions.Item label={t('paymentMethods')}>
                {renderPaymentMethods(merchantData?.paymentMethods)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 绩效信息 */}
        <Col span={24}>
          <Card

            title={<Space><StarOutlined />{t('performanceInfo')}</Space>}
            bordered={false}
          >
            <Row
              gutter={[16, 16]}
              justify="space-between"
              align="middle"
            >
              <Col>
                <Statistic
                  title={t('rating')}
                  value={merchantData?.rating}
                  precision={2}
                  prefix={<StarOutlined style={{ color: '#faad14' }}/>}
                />
              </Col>
              <Col>
                <Statistic
                  title={t('totalReviews')}
                  value={merchantData?.totalReviews}
                  prefix={<CommentOutlined />}
                />
              </Col>
              <Col>
                <Statistic
                  title={t('completedOrders')}
                  value={merchantData?.completedOrders}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }}/>}
                />
              </Col>
              <Col>
                <Statistic
                  title={t('pendingOrders')}
                  value={merchantData?.pendingOrders}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col>
                <Statistic
                  title={t('avgCompletionTime')}
                  value={merchantData?.avgCompletionTime}
                  suffix="min"
                  prefix={<FieldTimeOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 系统信息 */}
        <Col span={24}>
          <Card

            title={<Space><FileTextOutlined />{t('systemInfo')}</Space>}
            bordered={false}
          >
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }}   >
              <Descriptions.Item label={t('createTime')}>
                {safeRenderDateTime(merchantData?.createTime)}
              </Descriptions.Item>
              <Descriptions.Item label={t('updateTime')}>
                {safeRenderDateTime(merchantData?.updateTime)}
              </Descriptions.Item>
              <Descriptions.Item label={t('createBy')}>
                {merchantData?.createBy}
              </Descriptions.Item>
              <Descriptions.Item label={t('updateBy')}>
                {merchantData?.updateBy}
              </Descriptions.Item>
              <Descriptions.Item label={t('registrationIp')}>
                {merchantData?.registrationIp}
              </Descriptions.Item>
              <Descriptions.Item label={t('registrationChannel')}>
                {merchantData?.registrationChannel}
              </Descriptions.Item>
              <Descriptions.Item label={t('registrationTimeZone')}>
                {merchantData?.registrationTimeZone}
              </Descriptions.Item>
              <Descriptions.Item label={t('remark')}>
                {merchantData?.remark}
              </Descriptions.Item>
              <Descriptions.Item label={t('blacklistReason')}>
                {merchantData?.blacklistReason}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default RepairServiceMerchantsDetailModal;
