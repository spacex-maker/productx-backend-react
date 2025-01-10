import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, DatePicker, Space, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const UpdateWebsiteListModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  selectedWebsite,
  countries,
}) => {
  const { t } = useTranslation();

  // 处理表单提交，转换布尔值为字节
  const handleFinish = (values) => {
    onFinish(values);
  };

  useEffect(() => {
    if (isVisible && selectedWebsite) {
      form.setFieldsValue({
        ...selectedWebsite,
        startDate: selectedWebsite.startDate ? dayjs(selectedWebsite.startDate) : null,
        endDate: selectedWebsite.endDate ? dayjs(selectedWebsite.endDate) : null,
        tags: selectedWebsite.tags ? selectedWebsite.tags.split(',') : [],
        isFeatured: Boolean(selectedWebsite.isFeatured),
        isPopular: Boolean(selectedWebsite.isPopular),
        isNewWebsite: Boolean(selectedWebsite.isNew),
        isVerified: Boolean(selectedWebsite.isVerified),
        supportsMobile: Boolean(selectedWebsite.hasMobileSupport),
        supportsDarkMode: Boolean(selectedWebsite.hasDarkMode),
        enableHttps: Boolean(selectedWebsite.hasSsl),
      });
    }
  }, [isVisible, selectedWebsite, form]);

  return (
    <Modal
      title={t('updateSite')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={720}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleFinish}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('siteName')}
              name="name"
              rules={[{ required: true, message: t('pleaseEnterSiteName') }]}
            >
              <Input placeholder={t('pleaseEnterSiteName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('siteUrl')}
              name="url"
              rules={[
                { required: true, message: t('pleaseEnterSiteUrl') },
                { type: 'url', message: t('pleaseEnterValidUrl') }
              ]}
            >
              <Input placeholder={t('pleaseEnterSiteUrl')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t('classification')}
              name="category"
              rules={[{ required: true, message: t('pleaseSelectClassification') }]}
            >
              <Select placeholder={t('pleaseSelectClassification')}>
                <Option value="购物">{t('shopping')}</Option>
                <Option value="娱乐">{t('entertainment')}</Option>
                <Option value="教育">{t('education')}</Option>
                <Option value="新闻">{t('news')}</Option>
                <Option value="社交">{t('social')}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('subClassification')}
              name="subCategory"
            >
              <Input placeholder={t('pleaseEnterSubClassification')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('country')}
              name="countryCode"
              rules={[{ required: true, message: t('pleaseSelectCountry') }]}
            >
              <Select
                showSearch
                placeholder={t('pleaseSelectCountry')}
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

        <Form.Item
          label={t('description')}
          name="description"
        >
          <TextArea rows={3} placeholder={t('pleaseEnterDescription')} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('logoLink')}
              name="logoUrl"
            >
              <Input placeholder={t('pleaseEnterLogoLink')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('faviconLink')}
              name="faviconUrl"
            >
              <Input placeholder={t('pleaseEnterFaviconLink')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('tags')}
          name="tags"
        >
          <Select
            mode="tags"
            placeholder={t('pleaseEnterTags')}
          />
        </Form.Item>

        <Form.Item label={t('characteristics')}>
          <Space size="large">
            <Form.Item
              name="isFeatured"
              valuePropName="checked"
              noStyle
            >
              <Switch checkedChildren={t('recommended')} unCheckedChildren={t('recommended')} />
            </Form.Item>
            <Form.Item
              name="isPopular"
              valuePropName="checked"
              noStyle
            >
              <Switch checkedChildren={t('popular')} unCheckedChildren={t('popular')} />
            </Form.Item>
            <Form.Item
              name="isNewWebsite"
              valuePropName="checked"
              noStyle
            >
              <Switch checkedChildren={t('newWebsite')} unCheckedChildren={t('newWebsite')} />
            </Form.Item>
            <Form.Item
              name="isVerified"
              valuePropName="checked"
              noStyle
            >
              <Switch checkedChildren={t('verified')} unCheckedChildren={t('verified')} />
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item label={t('supportFeatures')}>
          <Space size="large">
            <Form.Item
              name="supportsMobile"
              valuePropName="checked"
              noStyle
            >
              <Switch checkedChildren={t('mobileVersion')} unCheckedChildren={t('mobileVersion')} />
            </Form.Item>
            <Form.Item
              name="supportsDarkMode"
              valuePropName="checked"
              noStyle
            >
              <Switch checkedChildren={t('darkMode')} unCheckedChildren={t('darkMode')} />
            </Form.Item>
            <Form.Item
              name="enableHttps"
              valuePropName="checked"
              noStyle
            >
              <Switch checkedChildren={t('https')} unCheckedChildren={t('https')} />
            </Form.Item>
          </Space>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('businessModel')}
              name="businessModel"
            >
              <Select placeholder={t('pleaseSelectBusinessModel')}>
                <Option value="free">{t('free')}</Option>
                <Option value="freemium">{t('freemium')}</Option>
                <Option value="premium">{t('paid')}</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('companyName')}
              name="companyName"
            >
              <Input placeholder={t('pleaseEnterCompanyName')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('remarks')}
          name="notes"
        >
          <TextArea rows={3} placeholder={t('pleaseEnterRemarks')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateWebsiteListModal;
