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
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

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

  return (
    <Modal
      title={t('websiteDetails')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={1200}
      bodyStyle={{ padding: '16px' }}
    >
      <Row gutter={[16, 16]}>
        {/* 基本信息 */}
        <Col span={24}>
          <Card title={t('basicInformation')}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Space align="start" size="large">
                <Avatar 
                  src={websiteData?.logoUrl}
                  alt={websiteData?.name}
                  size={80}
                  shape="square"
                  style={{ 
                    backgroundColor: '#f5f5f5',
                    padding: 4,
                    border: '1px solid #d9d9d9'
                  }}
                  icon={<GlobalOutlined />}
                />
                <div>
                  <Title level={3} style={{ margin: 0 }}>{websiteData?.name}</Title>
                  <Space>
                    <a href={websiteData?.url} target="_blank" rel="noopener noreferrer">
                      <LinkOutlined /> {websiteData?.url}
                    </a>
                    {websiteData?.isVerified === 1 && (
                      <Tag icon={<CheckCircleOutlined />} color="blue">
                        {t('verified')}
                      </Tag>
                    )}
                  </Space>
                </div>
              </Space>

              <Paragraph>{websiteData?.description}</Paragraph>

              <Row gutter={16}>
                <Col span={8}>
                  <Card size="small" title={t('classification')}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label={t('mainCategory')}>
                        <Tag color="blue">{websiteData?.category}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('subCategory')}>
                        <Tag color="cyan">{websiteData?.subCategory}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('tags')}>
                        <Space wrap>
                          {websiteData?.tags?.split(',').map(tag => (
                            <Tag key={tag}>{tag}</Tag>
                          ))}
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card size="small" title={t('businessInfo')}>
                    <Descriptions column={1} size="small">
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
                  <Card size="small" title={t('contact')}>
                    <Descriptions column={1} size="small">
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
          <Card title={t('statisticalData')}>
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <Statistic 
                  title={t('userRating')}
                  value={websiteData?.userRating}
                  suffix="/5"
                  precision={1}
                  prefix={<StarOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={t('ratingCount')}
                  value={websiteData?.ratingCount}
                  prefix={<StarOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={t('views')}
                  value={websiteData?.views}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={t('averageVisitTime')}
                  value={websiteData?.averageVisitTime}
                  suffix="s"
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={t('likes')}
                  value={websiteData?.likes}
                  prefix={<LikeOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title={t('shares')}
                  value={websiteData?.shares}
                  prefix={<ShareAltOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 特性和支持 */}
        <Col span={12}>
          <Card title={t('features')} size="small">
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
          <Card title={t('socialMedia')} size="small">
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
            </Space>
          </Card>
        </Col>

        {/* SEO信息 */}
        <Col span={24}>
          <Card title={t('seoInfo')} size="small">
            <Descriptions column={1} size="small">
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
          <Card title={t('notes')} size="small">
            <Paragraph>{websiteData?.notes}</Paragraph>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default WebsiteListDetailModal;
