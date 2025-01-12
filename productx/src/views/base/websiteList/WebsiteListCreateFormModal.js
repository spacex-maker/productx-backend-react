import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Space, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { GlobalOutlined } from '@ant-design/icons';

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

const WebsiteListCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  countries,
}) => {
  const { t } = useTranslation();

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
        onFinish={onFinish}
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
            <Form.Item label={t('priorityLevel')} name="priority">
              <Input type="number" placeholder={t('pleaseInputPriorityLevel')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={6}>
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
          <Col span={6}>
            <Form.Item label={t('subClassification')} name="subCategory">
              <Input placeholder={t('pleaseInputSubClassification')} />
            </Form.Item>
          </Col>
          <Col span={6}>
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
          <Col span={6}>
            <Form.Item label={t('language')} name="language">
              <Select placeholder={t('pleaseSelectLanguage')}>
                <Option value="zh">中文</Option>
                <Option value="en">English</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={t('websiteDescription')} name="description">
              <Input.TextArea rows={2} placeholder={t('pleaseInputWebsiteDescription')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('label')} name="tags">
              <Select mode="tags" placeholder={t('pleaseInputLabel')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label={t('logoLink')} name="logoUrl">
              <Input placeholder={t('pleaseInputLogoLink')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('faviconLink')} name="faviconUrl">
              <Input placeholder={t('pleaseInputFaviconLink')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={24}>
            <Row>
              <Col span={12}>
                <Form.Item label={t('characteristics')}>
                  <Space size={[16, 8]} wrap>
                    <Space size={4}>
                      <Form.Item name="isFeatured" valuePropName="checked" noStyle>
                        <Switch size="small" />
                      </Form.Item>
                      <span>{t('recommended')}</span>
                    </Space>
                    
                    <Space size={4}>
                      <Form.Item name="isPopular" valuePropName="checked" noStyle>
                        <Switch size="small" />
                      </Form.Item>
                      <span>{t('popular')}</span>
                    </Space>
                    
                    <Space size={4}>
                      <Form.Item name="isNew" valuePropName="checked" noStyle>
                        <Switch size="small" />
                      </Form.Item>
                      <span>{t('newOnline')}</span>
                    </Space>
                    
                    <Space size={4}>
                      <Form.Item name="isVerified" valuePropName="checked" noStyle>
                        <Switch size="small" />
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
                        <Switch size="small" />
                      </Form.Item>
                      <span>{t('mobileSideSupport')}</span>
                    </Space>
                    
                    <Space size={4}>
                      <Form.Item name="hasDarkMode" valuePropName="checked" noStyle>
                        <Switch size="small" />
                      </Form.Item>
                      <span>{t('darkMode')}</span>
                    </Space>
                    
                    <Space size={4}>
                      <Form.Item name="hasSsl" valuePropName="checked" noStyle>
                        <Switch size="small" />
                      </Form.Item>
                      <span>{t('secureConnection')}</span>
                    </Space>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
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
          <Col span={12}>
            <Form.Item label={t('relatedWebsites')} name="relatedSites">
              <Input.TextArea rows={2} placeholder={t('pleaseInputRelatedWebsites')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={t('socialMediaLinks')} name="socialLinks">
              <Input.TextArea rows={2} placeholder={t('pleaseInputSocialMediaLinks')} />
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
