import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { Option } = Select;

const WebsiteApplicationCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  countries,
}) => {
  const { t } = useTranslation();

  // 渲染国家选项
  const countryOption = (country) => (
    <Option key={country.id} value={country.code}>
      <Space>
        <img 
          src={country.flagImageUrl} 
          alt={country.name}
          style={{ 
            width: 20, 
            height: 15, 
            objectFit: 'cover',
            borderRadius: 2,
            border: '1px solid #f0f0f0'
          }}
        />
        <span>{country.name}</span>
        <span style={{ color: '#999' }}>({country.code})</span>
      </Space>
    </Option>
  );

  return (
    <Modal
      title={t('createApplication')}
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
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('websiteName')}
              name="websiteName"
              rules={[{ required: true, message: t('pleaseInputWebsiteName') }]}
            >
              <Input placeholder={t('pleaseInputWebsiteName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('websiteUrl')}
              name="url"
              rules={[
                { required: true, message: t('pleaseInputWebsiteUrl') },
                { type: 'url', message: t('pleaseInputValidWebsiteUrl') }
              ]}
            >
              <Input placeholder={t('pleaseInputWebsiteUrl')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('contactEmail')}
              name="contactEmail"
              rules={[
                { required: true, message: t('pleaseInputContactEmail') },
                { type: 'email', message: t('pleaseInputValidEmail') }
              ]}
            >
              <Input placeholder={t('pleaseInputContactEmail')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('contactPhone')}
              name="contactPhone"
              rules={[{ required: true, message: t('pleaseInputContactPhone') }]}
            >
              <Input placeholder={t('pleaseInputContactPhone')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t('country')}
              name="countryCode"
              rules={[{ required: true, message: t('pleaseSelectCountry') }]}
            >
              <Select
                showSearch
                placeholder={t('pleaseSelectCountry')}
                optionFilterProp="children"
                filterOption={(input, option) => {
                  const country = countries.find(c => c.code === option.value);
                  return (
                    country?.name.toLowerCase().includes(input.toLowerCase()) ||
                    country?.code.toLowerCase().includes(input.toLowerCase())
                  );
                }}
              >
                {countries.map(country => countryOption(country))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('description')}
          name="description"
          rules={[{ required: true, message: t('pleaseInputDescription') }]}
        >
          <TextArea 
            rows={4} 
            placeholder={t('pleaseInputDescription')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default WebsiteApplicationCreateFormModal;
