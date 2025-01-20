import React from 'react';
import { Modal, Descriptions, Space, Tag, Row, Col, Card, Statistic, Divider, Typography, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  GlobalOutlined,
  TagOutlined,
  LinkOutlined,
  CompassOutlined,
  FlagOutlined,
  EyeOutlined,
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  BookOutlined,
  StarOutlined,
  CheckCircleOutlined,
  MobileOutlined,
  BulbOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  TwitterOutlined,
  FacebookOutlined,
  InstagramOutlined,
  WeiboOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  AppstoreOutlined,
  FieldTimeOutlined,
  AndroidOutlined,
  AppleOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-2.137-3.253H12.6v14.067c0 .722-.406 1.285-.722 1.598a2.466 2.466 0 0 1-1.612.566 2.466 2.466 0 0 1-2.334-2.334 2.466 2.466 0 0 1 2.334-2.334c.258 0 .515.052.773.155V9.67a7.295 7.295 0 0 0-.773-.052 6.461 6.461 0 0 0-6.461 6.461 6.461 6.461 0 0 0 6.461 6.461 6.461 6.461 0 0 0 6.461-6.461V9.514a9.073 9.073 0 0 0 5.378 1.751V7.158a5.786 5.786 0 0 1-2.784-1.596z"/>
  </svg>
);

const WebsiteListDetailModal = ({
  isVisible,
  onCancel,
  websiteData,
  countries,
}) => {
  const { t } = useTranslation();

  const getCountryInfo = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    if (!country) return { name: countryCode, flagImageUrl: '' };
    return country;
  };

  const renderBoolean = (value) => {
    return value === 1 ? (
      <Tag color="success">{t('yes')}</Tag>
    ) : (
      <Tag color="default">{t('no')}</Tag>
    );
  };

  const socialLinks = websiteData?.socialLinks ? JSON.parse(websiteData.socialLinks) : {};

  const formatDateTime = (dateString) => {
    return dateString ? dayjs(dateString).format('YYYY-MM-DD HH:mm:ss') : '-';
  };

  return (
    <Modal
      title={t('websiteDetails')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={900}
      bodyStyle={{ padding: '8px' }}
    >
      <Row gutter={[8, 8]} style={{ fontSize: '12px' }}>
        {/* 基本信息 */}
        <Col span={24}>
          <Card 
            title={<span style={{ fontSize: '13px' }}>{t('basicInformation')}</span>} 
            size="small" 
            bodyStyle={{ padding: '8px' }}
            headStyle={{ padding: '0 8px', minHeight: '32px' }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="start" size="small">
                <Avatar
                  src={websiteData?.logoUrl}
                  alt={websiteData?.name}
                  size={48}
                  shape="square"
                  style={{
                    backgroundColor: '#f5f5f5',
                    padding: 2,
                    border: '1px solid #d9d9d9'
                  }}
                  icon={<GlobalOutlined />}
                />
                <div>
                  <Title level={5} style={{ margin: 0 }}>{websiteData?.name}</Title>
                  <Space size="small">
                    <a href={websiteData?.url} target="_blank" rel="noopener noreferrer">
                      <LinkOutlined /> {websiteData?.url}
                    </a>
                    {websiteData?.isVerified === 1 && (
                      <Tag icon={<CheckCircleOutlined />} color="blue" style={{ marginInlineStart: '0' }}>
                        {t('verified')}
                      </Tag>
                    )}
                  </Space>
                </div>
              </Space>

              <Paragraph style={{ margin: 0, fontSize: '12px' }} ellipsis={{ rows: 2 }}>{websiteData?.description}</Paragraph>

              <Row gutter={8}>
                <Col span={8}>
                  <Card size="small" title={t('classification')} bodyStyle={{ padding: '8px' }}>
                    <Descriptions column={1} size="small" contentStyle={{ paddingBottom: '4px', fontSize: '12px' }} labelStyle={{ fontSize: '12px' }}>
                      <Descriptions.Item label={t('mainCategory')}>
                        <Tag color="blue">{websiteData?.category}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('subCategory')}>
                        <Tag color="cyan">{websiteData?.subCategory}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('tags')}>
                        <Space wrap>
                          {websiteData?.tags?.split(',').map(tag => (
                            <Tag key={tag} style={{ fontSize: '12px', padding: '0 4px' }}>{tag}</Tag>
                          ))}
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card size="small" title={t('businessInfo')} bodyStyle={{ padding: '8px' }}>
                    <Descriptions column={1} size="small" contentStyle={{ paddingBottom: '4px', fontSize: '12px' }} labelStyle={{ fontSize: '12px' }}>
                      <Descriptions.Item label={t('companyName')}>
                        {websiteData?.companyName}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('establishedYear')}>
                        <CalendarOutlined /> {websiteData?.establishedYear}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('businessModel')}>
                        <Tag color="purple">{websiteData?.businessModel}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card size="small" title={t('contact')} bodyStyle={{ padding: '8px' }}>
                    <Descriptions column={1} size="small" contentStyle={{ paddingBottom: '4px', fontSize: '12px' }} labelStyle={{ fontSize: '12px' }}>
                      <Descriptions.Item label={t('email')}>
                        <MailOutlined /> {websiteData?.contactEmail}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('phone')}>
                        <PhoneOutlined /> {websiteData?.contactPhone}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('address')}>
                        <HomeOutlined /> {websiteData?.address}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>
            </Space>
          </Card>
        </Col>

        {/* 统计数据 */}
        <Col span={24}>
          <Card 
            title={<span style={{ fontSize: '13px' }}>{t('statisticalData')}</span>}
            size="small" 
            bodyStyle={{ padding: '8px' }}
            headStyle={{ padding: '0 8px', minHeight: '32px' }}
          >
            <Row gutter={[8, 8]}>
              <Col span={4}>
                <Statistic
                  title={<span style={{ fontSize: '12px' }}>{t('userRating')}</span>}
                  value={websiteData?.userRating}
                  suffix="/5"
                  precision={1}
                  prefix={<StarOutlined />}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={<span style={{ fontSize: '12px' }}>{t('ratingCount')}</span>}
                  value={websiteData?.ratingCount}
                  prefix={<StarOutlined />}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={<span style={{ fontSize: '12px' }}>{t('views')}</span>}
                  value={websiteData?.views}
                  prefix={<EyeOutlined />}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={<span style={{ fontSize: '12px' }}>{t('averageVisitTime')}</span>}
                  value={websiteData?.averageVisitTime}
                  suffix="s"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={<span style={{ fontSize: '12px' }}>{t('likes')}</span>}
                  value={websiteData?.likes}
                  prefix={<LikeOutlined />}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={<span style={{ fontSize: '12px' }}>{t('shares')}</span>}
                  value={websiteData?.shares}
                  prefix={<ShareAltOutlined />}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 特性和支持 */}
        <Col span={12}>
          <Card 
            title={<span style={{ fontSize: '13px' }}>{t('features')}</span>}
            size="small" 
            bodyStyle={{ padding: '8px' }}
            headStyle={{ padding: '0 8px', minHeight: '32px' }}
          >
            <Space wrap>
              {websiteData?.hasMobileSupport === 1 && (
                <Tag icon={<MobileOutlined />} color="blue">{t('mobileSupport')}</Tag>
              )}
              {websiteData?.hasDarkMode === 1 && (
                <Tag icon={<BulbOutlined />} color="blue">{t('darkMode')}</Tag>
              )}
              {websiteData?.hasSsl === 1 && (
                <Tag icon={<SafetyCertificateOutlined />} color="blue">{t('ssl')}</Tag>
              )}
              {websiteData?.isFeatured === 1 && (
                <Tag color="blue">{t('featured')}</Tag>
              )}
              {websiteData?.isPopular === 1 && (
                <Tag color="blue">{t('popular')}</Tag>
              )}
            </Space>
          </Card>
        </Col>

        {/* 社交媒体 */}
        <Col span={12}>
          <Card title={t('socialMedia')} size="small" bodyStyle={{ padding: '8px' }}>
            <Space wrap>
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<TwitterOutlined />} color="blue">Twitter</Tag>
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<FacebookOutlined />} color="blue">Facebook</Tag>
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<InstagramOutlined />} color="blue">Instagram</Tag>
                </a>
              )}
              {socialLinks.weibo && (
                <a href={socialLinks.weibo} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<WeiboOutlined />} color="blue">微博</Tag>
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<YoutubeOutlined />} color="blue">YouTube</Tag>
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<LinkedinOutlined />} color="blue">LinkedIn</Tag>
                </a>
              )}
              {socialLinks.douyin && (
                <a href={socialLinks.douyin} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<TiktokIcon />} color="blue">抖音</Tag>
                </a>
              )}
              {socialLinks.tiktok && (
                <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<TiktokIcon />} color="blue">TikTok</Tag>
                </a>
              )}
            </Space>
          </Card>
        </Col>

        {/* SEO信息 */}
        <Col span={24}>
          <Card title={t('seoInfo')} size="small" bodyStyle={{ padding: '8px' }}>
            <Descriptions column={1} size="small" contentStyle={{ paddingBottom: '4px', fontSize: '12px' }} labelStyle={{ fontSize: '12px' }}>
              <Descriptions.Item label={t('seoTitle')}>
                {websiteData?.seoTitle}
              </Descriptions.Item>
              <Descriptions.Item label={t('seoKeywords')}>
                {websiteData?.seoKeywords}
              </Descriptions.Item>
              <Descriptions.Item label={t('seoDescription')}>
                {websiteData?.seoDescription}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 备注 */}
        <Col span={24}>
          <Card title={t('notes')} size="small" bodyStyle={{ padding: '8px' }}>
            <Paragraph>{websiteData?.notes}</Paragraph>
          </Card>
        </Col>

        {/* 添加时间信息卡片 */}
        <Col span={24}>
          <Card title={t('timeInfo')} size="small" bodyStyle={{ padding: '8px' }}>
            <Row gutter={8}>
              <Col span={8}>
                <Statistic
                  title={t('createTime')}
                  value={formatDateTime(websiteData?.createTime)}
                  prefix={<FieldTimeOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={t('updateTime')}
                  value={formatDateTime(websiteData?.updateTime)}
                  prefix={<FieldTimeOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={t('lastAccessed')}
                  value={formatDateTime(websiteData?.lastAccessed)}
                  prefix={<FieldTimeOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 添加应用链接卡片 */}
        <Col span={24}>
          <Card title={t('appLinks')} size="small" bodyStyle={{ padding: '8px' }}>
            <Space wrap>
              {websiteData?.androidAppUrl && (
                <a href={websiteData.androidAppUrl} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<AndroidOutlined />} color="success">
                    {t('androidApp')}
                  </Tag>
                </a>
              )}
              {websiteData?.iosAppUrl && (
                <a href={websiteData.iosAppUrl} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<AppleOutlined />} color="success">
                    {t('iosApp')}
                  </Tag>
                </a>
              )}
              {websiteData?.harmonyOSAppUrl && (
                <a href={websiteData.harmonyOSAppUrl} target="_blank" rel="noopener noreferrer">
                  <Tag icon={<CloudOutlined />} color="success">
                    {t('harmonyOSApp')}
                  </Tag>
                </a>
              )}
            </Space>
          </Card>
        </Col>

        {/* 添加其他信息卡片 */}
        <Col span={24}>
          <Card title={t('additionalInfo')} size="small" bodyStyle={{ padding: '8px' }}>
            <Descriptions column={2} size="small" contentStyle={{ paddingBottom: '4px', fontSize: '12px' }} labelStyle={{ fontSize: '12px' }}>
              <Descriptions.Item label={t('trafficSource')}>
                <Tag color="orange">{websiteData?.trafficSource}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('language')}>
                <Tag color="geekblue">{websiteData?.language}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('displayMode')}>
                <Tag color="purple">{websiteData?.displayMode}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('priority')}>
                <Tag color="cyan">{websiteData?.priority}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default WebsiteListDetailModal;
