import React from 'react';
import { Modal, Descriptions, Tag, Card, Row, Col } from 'antd';

const LogisticsProviderRoutesDetailModel = ({
  isVisible,
  onCancel,
  record
}) => {
  const renderTransportTypes = (record) => {
    const types = [];
    if (record?.airFreight) types.push(<Tag color="blue" key="air">空运</Tag>);
    if (record?.seaFreight) types.push(<Tag color="green" key="sea">海运</Tag>);
    if (record?.landFreight) types.push(<Tag color="orange" key="land">陆运</Tag>);
    return types;
  };


  const renderServiceQualityTag = (quality) => {
    const colorMap = {
      '经济': 'blue',
      '标准': 'green',
      '优先': 'orange'
    };
    return <Tag color={colorMap[quality]}>{quality}</Tag>;
  };

  return (
    <Modal
      title="物流路线详情"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Card size="small" title="基本信息">
        <Descriptions column={2}>
          <Descriptions.Item label="提供商ID">{record?.providerId}</Descriptions.Item>
          <Descriptions.Item label="路线ID">{record?.routeId}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{record?.createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{record?.updateTime}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="运输方式" style={{ marginTop: 16 }}>
        <Row>{renderTransportTypes(record)}</Row>
      </Card>

      <Card size="small" title="追踪服务" style={{ marginTop: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="空运追踪">
            {record?.airTrackingService ? <Tag color="success">支持</Tag> : <Tag color="error">不支持</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="海运追踪">
            {record?.seaTrackingService ? <Tag color="success">支持</Tag> : <Tag color="error">不支持</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="陆运追踪">
            {record?.landTrackingService ? <Tag color="success">支持</Tag> : <Tag color="error">不支持</Tag>}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="保险服务" style={{ marginTop: 16 }}>
        <Descriptions column={3}>
          <Descriptions.Item label="空运保险">
            {record?.airInsurance ? <Tag color="success">支持</Tag> : <Tag color="error">不支持</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="海运保险">
            {record?.seaInsurance ? <Tag color="success">支持</Tag> : <Tag color="error">不支持</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="陆运保险">
            {record?.landInsurance ? <Tag color="success">支持</Tag> : <Tag color="error">不支持</Tag>}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card size="small" title="其他信息" style={{ marginTop: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="估算费用">¥{record?.estimatedCost?.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="服务质量">{record?.serviceQuality && renderServiceQualityTag(record.serviceQuality)}</Descriptions.Item>
          <Descriptions.Item label="附加信息" span={2}>{record?.additionalInfo}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
};

export default LogisticsProviderRoutesDetailModel;
