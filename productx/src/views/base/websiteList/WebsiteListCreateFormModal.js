import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Space, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined, TwitterOutlined, FacebookOutlined, InstagramOutlined, LinkedinOutlined, YoutubeOutlined, WeiboOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const CountryOption = ({ country }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    {country.flag ? (
      <img
        src={country.flag}
        alt={country.name}
        style={{ width: '16px', height: '16px', objectFit: 'cover' }}
      />
    ) : (
      <GlobalOutlined />
    )}
    <span>{country.name}</span>
    <span style={{ color: '#999', marginLeft: 'auto' }}>{country.code}</span>
  </div>
);

// 添加自定义抖音和TikTok图标组件
const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-2.137-3.253H12.6v14.067c0 .722-.406 1.285-.722 1.598a2.466 2.466 0 0 1-1.612.566 2.466 2.466 0 0 1-2.334-2.334 2.466 2.466 0 0 1 2.334-2.334c.258 0 .515.052.773.155V9.67a7.295 7.295 0 0 0-.773-.052 6.461 6.461 0 0 0-6.461 6.461 6.461 6.461 0 0 0 6.461 6.461 6.461 6.461 0 0 0 6.461-6.461V9.514a9.073 9.073 0 0 0 5.378 1.751V7.158a5.786 5.786 0 0 1-2.784-1.596z"/>
  </svg>
);

const WebsiteListCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  countries,
}) => {
  const { t } = useTranslation();

  const socialPlatforms = [
    { key: 'twitter', icon: <TwitterOutlined />, name: 'Twitter', urlPrefix: 'https://twitter.com/' },
    { key: 'facebook', icon: <FacebookOutlined />, name: 'Facebook', urlPrefix: 'https://facebook.com/' },
    { key: 'instagram', icon: <InstagramOutlined />, name: 'Instagram', urlPrefix: 'https://instagram.com/' },
    { key: 'linkedin', icon: <LinkedinOutlined />, name: 'LinkedIn', urlPrefix: 'https://linkedin.com/company/' },
    { key: 'youtube', icon: <YoutubeOutlined />, name: 'YouTube', urlPrefix: 'https://youtube.com/' },
    { key: 'weibo', icon: <WeiboOutlined />, name: '微博', urlPrefix: 'https://weibo.com/' },
    { key: 'douyin', icon: <TiktokIcon />, name: '抖音', urlPrefix: 'https://www.douyin.com/' },
    { key: 'tiktok', icon: <TiktokIcon />, name: 'TikTok', urlPrefix: 'https://www.tiktok.com/@' }
  ];

  const handleSubmit = (values) => {
    const socialLinksObj = {};
    socialPlatforms.forEach(platform => {
      if (values[`social_${platform.key}`]) {
        const value = values[`social_${platform.key}`];
        socialLinksObj[platform.key] = value.startsWith('http') ? value : `${platform.urlPrefix}${value}`;
      }
    });

    const formattedValues = {
      ...values,
      tags: Array.isArray(values.tags) ? values.tags : [],
      socialLinks: JSON.stringify(socialLinksObj)
    };

    socialPlatforms.forEach(platform => {
      delete formattedValues[`social_${platform.key}`];
    });

    onFinish(formattedValues);
  };

  return (
    <Modal
      title={t('createWebsite')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
      maskClosable={false}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        labelCol={{ style: { padding: '0 4px' } }}
      >
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              label={t('websiteName')}
              name="name"
              rules={[{ required: true, message: t('pleaseInputWebsiteName') }]}
            >
              <Input placeholder={t('pleaseInputWebsiteName')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('websiteLink')}
              name="url"
              rules={[
                { required: true, message: t('pleaseInputWebsiteLink') },
                { type: 'url', message: t('pleaseInputValidWebsiteLink') }
              ]}
            >
              <Input placeholder={t('pleaseInputWebsiteLink')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('logoLink')} name="logoUrl">
              <Input placeholder={t('pleaseInputLogoLink')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              label={t('androidAppDownloadLink')}
              name="androidAppUrl"
              rules={[
                { type: 'url', message: t('pleaseInputValidAndroidAppLink') }
              ]}
            >
              <Input placeholder={t('pleaseInputAndroidAppLink')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('iosAppDownloadLink')}
              name="iosAppUrl"
              rules={[
                { type: 'url', message: t('pleaseInputValidIosAppLink') }
              ]}
            >
              <Input placeholder={t('pleaseInputIosAppLink')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('harmonyOSAppDownloadLink')}
              name="harmonyOSAppUrl"
              rules={[
                { type: 'url', message: t('pleaseInputValidHarmonyOSAppLink') }
              ]}
            >
              <Input placeholder={t('pleaseInputHarmonyOSAppLink')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={4}>
            <Form.Item label={t('classification')} name="category">
              <Select placeholder={t('pleaseSelectClassification')}>
                <Option value="shopping">{t('shopping')}</Option>
                <Option value="entertainment">{t('entertainment')}</Option>
                <Option value="education">{t('education')}</Option>
                <Option value="news">{t('news')}</Option>
                <Option value="socialNetwork">{t('socialNetwork')}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t('subClassification')} name="subCategory">
              <Select placeholder={t('pleaseSelectSubClassification')}>
                <Option value="general">{t('general')}</Option>
                <Option value="special">{t('special')}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t('language')} name="language">
              <Select placeholder={t('pleaseSelectLanguage')}>
                <Option value="zh">中文</Option>
                <Option value="en">English</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={t('priorityLevel')} name="priority">
              <Input type="number" placeholder={t('pleaseInputPriorityLevel')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('countryRegion')} name="countryCode">
              <Select
                showSearch
                placeholder={t('pleaseSelectCountryRegion')}
                filterOption={(input, option) => {
                  const country = countries.find(c => c.code === option.value);
                  return (
                    country?.name.toLowerCase().includes(input.toLowerCase()) ||
                    country?.code.toLowerCase().includes(input.toLowerCase())
                  );
                }}
              >
                {countries.map(country => (
                  <Option key={country.code} value={country.code}>
                    <Space>
                      <img
                        src={country.flagImageUrl}
                        alt={country.name}
                        style={{ width: 20, height: 15, borderRadius: 0 }}
                      />
                      <span>{country.name}</span>
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label={t('websiteDescription')} name="description">
              <Input.TextArea rows={2} placeholder={t('pleaseInputWebsiteDescription')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('label')} name="tags">
              <Select mode="tags" placeholder={t('pleaseInputLabel')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('logoLink')} name="logoUrl">
              <Input placeholder={t('pleaseInputLogoLink')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={t('characteristics')}>
              <Space size={[16, 8]} wrap>
                <Space size={4}>
                  <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                    <Switch   />
                  </Form.Item>
                  <span>{t('recommended')}</span>
                </Space>

                <Space size={4}>
                  <Form.Item name="isPopular" valuePropName="checked" noStyle>
                    <Switch   />
                  </Form.Item>
                  <span>{t('popular')}</span>
                </Space>

                <Space size={4}>
                  <Form.Item name="isNew" valuePropName="checked" noStyle>
                    <Switch   />
                  </Form.Item>
                  <span>{t('newOnline')}</span>
                </Space>

                <Space size={4}>
                  <Form.Item name="isVerified" valuePropName="checked" noStyle>
                    <Switch   />
                  </Form.Item>
                  <span>{t('verified')}</span>
                </Space>
              </Space>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label={t('technicalCharacteristics')}>
              <Space size={[16, 8]} wrap>
                <Space size={4}>
                  <Form.Item name="hasMobileSupport" valuePropName="checked" noStyle>
                    <Switch   />
                  </Form.Item>
                  <span>{t('mobileSideSupport')}</span>
                </Space>

                <Space size={4}>
                  <Form.Item name="hasDarkMode" valuePropName="checked" noStyle>
                    <Switch   />
                  </Form.Item>
                  <span>{t('darkMode')}</span>
                </Space>

                <Space size={4}>
                  <Form.Item name="hasSsl" valuePropName="checked" noStyle>
                    <Switch   />
                  </Form.Item>
                  <span>{t('secureConnection')}</span>
                </Space>
              </Space>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label={t('seoTitle')} name="seoTitle">
              <Input placeholder={t('pleaseInputSeoTitle')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('seoKeywords')} name="seoKeywords">
              <Input.TextArea rows={1} placeholder={t('pleaseInputSeoKeywords')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('seoDescription')} name="seoDescription">
              <Input.TextArea rows={1} placeholder={t('pleaseInputSeoDescription')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label={t('companyName')} name="companyName">
              <Input placeholder={t('pleaseInputCompanyName')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('establishmentYear')} name="establishedYear">
              <Input type="number" placeholder={t('pleaseInputEstablishmentYear')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('businessModel')} name="businessModel">
              <Select placeholder={t('pleaseSelectBusinessModel')}>
                <Option value="free">{t('free')}</Option>
                <Option value="freemium">{t('freePlusValue')}</Option>
                <Option value="premium">{t('paid')}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label={t('contactMailbox')} name="contactEmail">
              <Input placeholder={t('pleaseInputContactMailbox')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('contactPhone')} name="contactPhone">
              <Input placeholder={t('pleaseInputContactPhone')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('address')} name="address">
              <Input placeholder={t('pleaseInputAddress')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item label={t('customCss')} name="customCss">
              <Input.TextArea rows={2} placeholder={t('pleaseInputCustomCss')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('customJavaScript')} name="customJs">
              <Input.TextArea rows={2} placeholder={t('pleaseInputCustomJavaScript')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={t('dataSourceApi')} name="apiDataSource">
              <Input.TextArea rows={2} placeholder={t('pleaseInputDataSourceApi')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={24}>
            <Form.Item label={t('relatedWebsites')} name="relatedSites">
              <Input.TextArea rows={2} placeholder={t('pleaseInputRelatedWebsites')} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={t('socialMediaLinks')}
              style={{ marginBottom: 0 }}
            >
              <Row gutter={[16, 16]}>
                {socialPlatforms.map(platform => (
                  <Col span={12} key={platform.key}>
                    <Form.Item
                      name={`social_${platform.key}`}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        prefix={
                          <Space>
                            {platform.icon}
                            <span style={{
                              minWidth: '60px',
                              display: 'inline-block'
                            }}>
                              {platform.name}
                            </span>
                          </Space>
                        }
                        placeholder={`${t('pleaseInput')}${platform.name}${t('link')}`}
                        allowClear
                        style={{
                          borderRadius: '6px',
                          height: '36px'
                        }}
                      />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={t('managementRemarks')} name="notes">
              <Input.TextArea rows={2} placeholder={t('pleaseInputManagementRemarks')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('customData')} name="customData">
              <Input.TextArea rows={2} placeholder={t('pleaseInputCustomData')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default WebsiteListCreateFormModal;
