import React from 'react';
import { Modal, Descriptions, Tag, Card, Row, Col, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const LogisticsRoutesDetailModal = ({
  isVisible,
  onCancel,
  record,
  countries = []
}) => {
  const renderBooleanTag = (value) => {
    return value ? (
      <Tag icon={<CheckCircleOutlined />} color="success">是</Tag>
    ) : (
      <Tag icon={<CloseCircleOutlined />} color="default">否</Tag>
    );
  };

  const renderCountry = (countryCode) => {
    if (!countries || !countryCode) return countryCode;
    
    const country = countries.find(c => c.code === countryCode);
    if (!country) return countryCode;
    
    return (
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
      </Space>
    );
  };

  const renderTransportCard = (type) => {
    const typeMap = {
      air: '空运',
      sea: '海运',
      land: '陆运'
    };
    const name = typeMap[type];
    
    return (
      <Col span={8}>
        <Card 
          title={name}
          size="small"
          headStyle={{ fontWeight: 'bold' }}
          bodyStyle={{ padding: '12px' }}
        >
          <div style={{ marginBottom: '8px' }}>
            <span style={{ display: 'inline-block', width: '80px' }}>支持运输：</span>
            {renderBooleanTag(record?.[`${type}Freight`])}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ display: 'inline-block', width: '80px' }}>支持追踪：</span>
            {renderBooleanTag(record?.[`${type}TrackingService`])}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ display: 'inline-block', width: '80px' }}>支持保险：</span>
            {renderBooleanTag(record?.[`${type}Insurance`])}
          </div>
          <div>
            <span style={{ display: 'inline-block', width: '80px' }}>运输时效：</span>
            <span>{record?.[`${type}TransitTime`] || '未设置'}</span>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <Modal
      title="物流路线详情"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card size="small" title="起始国家" headStyle={{ fontWeight: 'bold' }}>
            {renderCountry(record?.originCountry)}
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="目的国家" headStyle={{ fontWeight: 'bold' }}>
            {renderCountry(record?.destinationCountry)}
          </Card>
        </Col>
      </Row>

      <div style={{ margin: '16px 0' }}>
        <Row gutter={16}>
          {renderTransportCard('air')}
          {renderTransportCard('sea')}
          {renderTransportCard('land')}
        </Row>
      </div>

      <Descriptions
        bordered
        column={3}
        size="small"
        labelStyle={{ width: '120px' }}
      >
        <Descriptions.Item label="环保友好">
          {renderBooleanTag(record?.ecoFriendly)}
        </Descriptions.Item>
        <Descriptions.Item label="运营时间" span={2}>
          {record?.operationalDays}
        </Descriptions.Item>

        <Descriptions.Item label="合同条款" span={3}>
          {record?.contractTerms || '未设置'}
        </Descriptions.Item>
        
        <Descriptions.Item label="附加信息" span={3}>
          {record?.additionalInfo || '无'}
        </Descriptions.Item>

        <Descriptions.Item label="状态">
          {record?.status ? (
            <Tag icon={<CheckCircleOutlined />} color="success">启用</Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">禁用</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{record?.createTime}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{record?.updateTime}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default LogisticsRoutesDetailModal; 