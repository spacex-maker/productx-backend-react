import React from 'react';
import { Modal, Descriptions, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const BankDetailModal = ({
  isVisible,
  onCancel,
  bankData,
  countries,
}) => {
  const { t } = useTranslation();

  const getCountryInfo = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    if (!country) return { name: countryCode, flagImageUrl: '' };
    return country;
  };

  return (
    <Modal
      title={t('bankDetail')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label={t('bankName')} span={2}>
          {bankData?.bankName}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('swiftCode')}>
          {bankData?.swiftCode}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('bin')}>
          {bankData?.bin ? bankData.bin.join(', ') : '-'}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('country')}>
          {bankData?.countryCode && (
            <Space>
              <img 
                src={getCountryInfo(bankData.countryCode).flagImageUrl} 
                alt={bankData.countryCode}
                style={{ 
                  width: 20, 
                  height: 15, 
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid #f0f0f0'
                }}
              />
              <span>{getCountryInfo(bankData.countryCode).name}</span>
            </Space>
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('city')}>
          {bankData?.city}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('address')} span={2}>
          {bankData?.address}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('postalCode')}>
          {bankData?.postalCode}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('phoneNumber')}>
          {bankData?.phoneNumber}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('email')}>
          {bankData?.email}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('website')}>
          <a href={bankData?.website} target="_blank" rel="noopener noreferrer">
            {bankData?.website}
          </a>
        </Descriptions.Item>
        
        <Descriptions.Item label={t('status')}>
          {bankData?.supported ? t('enabled') : t('disabled')}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('createTime')}>
          {bankData?.createTime}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('updateTime')}>
          {bankData?.updateTime}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BankDetailModal; 