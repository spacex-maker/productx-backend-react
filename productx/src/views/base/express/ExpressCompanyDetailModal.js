import React from 'react';
import { Modal, Descriptions, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const ExpressCompanyDetailModal = ({ isVisible, onCancel, courier, countries }) => {
  const { t } = useTranslation();
  const country = countries.find(c => c.code === courier?.countryCode);

  return (
    <Modal
      title={t('expressCompanyDetails')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label={t('country')}>
          {country && (
            <Space>
              <img
                src={country.flagImageUrl}
                alt={country.name}
                style={{
                  width: 30,
                  height: 20,
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid #f0f0f0'
                }}
              />
              <span>{country.name}</span>
              <span style={{ color: '#999' }}>({country.isoCode})</span>
            </Space>
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t('companyName')}>{courier?.name}</Descriptions.Item>
        <Descriptions.Item label={t('trackingNumberFormat')}>{courier?.trackingNumberFormat}</Descriptions.Item>
        <Descriptions.Item label={t('website')}>
          <a href={courier?.website} target="_blank" rel="noopener noreferrer">
            {courier?.website}
          </a>
        </Descriptions.Item>
        <Descriptions.Item label={t('contactNumber')}>{courier?.contactNumber}</Descriptions.Item>
        <Descriptions.Item label={t('status')}>
          {courier?.status ? t('enable') : t('disable')}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ExpressCompanyDetailModal; 