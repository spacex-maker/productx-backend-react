import React from 'react';
import { Modal, Descriptions, Image, Row, Col, Typography, Tag, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const PartnerDetail = ({ isVisible, onCancel, partner }) => {
  const { t } = useTranslation();

  if (!partner) {
    return null;
  }

  const descriptionStyle = {
    marginBottom: 0,
  };

  return (
    <Modal
      title={t('partnerDetails')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
      bodyStyle={{ padding: '24px' }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row align="middle" gutter={16}>
            <Col span={8}>
              <Image
                src={partner.logoUrl}
                alt={partner.name}
                style={{ 
                  width: '100%', 
                  maxHeight: '120px',
                  objectFit: 'contain',
                  padding: '8px',
                  borderRadius: '4px'
                }}
              />
            </Col>
            <Col span={16}>
              <Descriptions column={1} style={descriptionStyle} bordered={false}>
                <Descriptions.Item label={t('partnerName')}>
                  <Space>
                    <Text strong>{partner.name}</Text>
                    <Tag color={partner.status ? 'success' : 'error'}>
                      {partner.status ? t('enable') : t('disable')}
                    </Tag>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label={t('websiteUrl')}>
                  <a 
                    href={partner.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {partner.websiteUrl}
                  </a>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Descriptions 
            bordered 
            column={1} 
            style={descriptionStyle}
          >
            <Descriptions.Item label={t('description')}>
              {partner.description}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label={t('createTime')}>
                  {partner.createTime}
                </Descriptions.Item>
                <Descriptions.Item label={t('createBy')}>
                  {partner.createBy}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label={t('updateTime')}>
                  {partner.updateTime}
                </Descriptions.Item>
                <Descriptions.Item label={t('updateBy')}>
                  {partner.updateBy}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default PartnerDetail; 