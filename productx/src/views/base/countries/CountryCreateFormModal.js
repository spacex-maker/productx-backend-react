import React from 'react';
import { Modal, Form, Input, Select, Typography, Divider, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { Title } = Typography;

const CountryCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();

  const continentOptions = [
    { value: '非洲', label: t('africa') },
    { value: '亚洲', label: t('asia') },
    { value: '欧洲', label: t('europe') },
    { value: '北美洲', label: t('northAmerica') },
    { value: '南美洲', label: t('southAmerica') },
    { value: '大洋洲', label: t('oceania') },
    { value: '南极洲', label: t('antarctica') },
  ];

  return (
    <Modal
      title={t('createCountry')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('save')}
      cancelText={t('cancel')}
      width={800}
      styles={{
        padding: '12px 24px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <div style={{ marginBottom: '16px' }}>
          <Title level={5} style={{ marginBottom: '8px' }}>{t('basicInfo')}</Title>
          <Divider style={{ margin: '8px 0' }} />
        </div>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label={t('countryName')}
              name="countryName"
              rules={[{ required: true, message: t('pleaseInputCountryName') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input
                placeholder={t('inputCountryNamePlaceholder')}
                size="small"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={t('countryCode')}
              name="countryCode"
              rules={[{ required: true, message: t('pleaseInputCountryCode') }]}
              style={{ marginBottom: '12px' }}
            >
              <Input
                placeholder={t('inputCountryCodePlaceholder')}
                size="small"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label={t('continent')}
              name="continent"
              rules={[{ required: true, message: t('pleaseSelectContinent') }]}
              style={{ marginBottom: '12px' }}
            >
              <Select
                placeholder={t('selectContinentPlaceholder')}
                size="small"
              >
                {continentOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CountryCreateFormModal;
