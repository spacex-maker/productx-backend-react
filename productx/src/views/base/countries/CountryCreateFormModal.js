import React from 'react';
import { Modal, Form, Input, Select, Typography, Divider } from 'antd';
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
    <>
      <Modal
        title={t('createCountry')}
        open={isVisible}
        onCancel={onCancel}
        onOk={() => form.submit()}
        okText={t('save')}
        cancelText={t('cancel')}
        width={500}
      >
        <Form 
          form={form} 
          onFinish={onFinish}
          layout="vertical"
          style={{ gap: '8px' }}
        >
          {/* 基本信息部分 */}
          <Title level={5} style={{ marginBottom: '16px' }}>{t('basicInfo')}</Title>
          <Divider style={{ margin: '8px 0' }} />

          <Form.Item
            label={t('countryName')}
            name="countryName"
            rules={[{ required: true, message: t('pleaseInputCountryName') }]}
            style={{ marginBottom: '12px' }}
          >
            <Input placeholder={t('inputCountryNamePlaceholder')} />
          </Form.Item>
          
          <Form.Item
            label={t('countryCode')}
            name="countryCode"
            rules={[{ required: true, message: t('pleaseInputCountryCode') }]}
            style={{ marginBottom: '12px' }}
          >
            <Input placeholder={t('inputCountryCodePlaceholder')} />
          </Form.Item>
          
          <Form.Item
            label={t('continent')}
            name="continent"
            rules={[{ required: true, message: t('pleaseSelectContinent') }]}
            style={{ marginBottom: '12px' }}
          >
            <Select placeholder={t('selectContinentPlaceholder')}>
              {continentOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>


    </>
  );
};

export default CountryCreateFormModal;
