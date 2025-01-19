import React from 'react';
import { Modal, Descriptions, Space, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const WebsiteApplicationDetailModal = ({
  isVisible,
  onCancel,
  applicationData,
  countries,
}) => {
  const { t } = useTranslation();

  const getCountryInfo = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    if (!country) return { name: countryCode, flagImageUrl: '' };
    return country;
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: 'warning', text: t('pending') },
      approved: { color: 'success', text: t('approved') },
      rejected: { color: 'error', text: t('rejected') }
    };
    const config = statusConfig[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Modal
      title={t('applicationDetail')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label={t('websiteName')} span={2}>
          {applicationData?.websiteName}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('websiteUrl')} span={2}>
          <a href={applicationData?.url} target="_blank" rel="noopener noreferrer">
            {applicationData?.url}
          </a>
        </Descriptions.Item>
        
        <Descriptions.Item label={t('contactEmail')}>
          {applicationData?.contactEmail}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('contactPhone')}>
          {applicationData?.contactPhone}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('country')}>
          {applicationData?.countryCode && (
            <Space>
              <img 
                src={getCountryInfo(applicationData.countryCode).flagImageUrl} 
                alt={applicationData.countryCode}
                style={{ 
                  width: 20, 
                  height: 15, 
                  objectFit: 'cover',
                  borderRadius: 2,
                  border: '1px solid #f0f0f0'
                }}
              />
              <span>{getCountryInfo(applicationData.countryCode).name}</span>
            </Space>
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('applicationStatus')}>
          {applicationData?.status && getStatusTag(applicationData.status)}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('description')} span={2}>
          {applicationData?.description}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('reviewComments')} span={2}>
          {applicationData?.reviewComments || '-'}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('reviewedAt')}>
          {applicationData?.reviewedAt || '-'}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('createTime')}>
          {applicationData?.createTime}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('createBy')}>
          {applicationData?.createBy}
        </Descriptions.Item>
        
        <Descriptions.Item label={t('updateTime')}>
          {applicationData?.updateTime}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default WebsiteApplicationDetailModal;
