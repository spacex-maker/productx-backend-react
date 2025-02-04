import React from 'react';
import { Modal, Descriptions, Tag, Card, Row, Col, Rate } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const LogisticsProvidersDetailModel = ({
  isVisible,
  onCancel,
  record
}) => {
  const renderStatus = (isActive) => {
    return isActive ? (
      <Tag icon={<CheckCircleOutlined />} color="success">运营中</Tag>
    ) : (
      <Tag icon={<CloseCircleOutlined />} color="error">未运营</Tag>
    );
  };

  return (
    <Modal
      title="物流提供商详情"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card size="small" title="基本信息" headStyle={{ fontWeight: 'bold' }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="提供商名称">{record?.providerName}</Descriptions.Item>
              <Descriptions.Item label="总部所在地">{record?.headquarters}</Descriptions.Item>
              <Descriptions.Item label="成立年份">{record?.establishedYear}</Descriptions.Item>
              <Descriptions.Item label="运营状态">{renderStatus(record?.isActive)}</Descriptions.Item>
              <Descriptions.Item label="评分" span={2}>
                <Rate disabled defaultValue={record?.rating} allowHalf />
                <span className="ml-2">{record?.rating}</span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card size="small" title="联系方式" headStyle={{ fontWeight: 'bold' }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="联系电话">{record?.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="电子邮箱">{record?.contactEmail}</Descriptions.Item>
              <Descriptions.Item label="官方网站" span={2}>
                <a href={record?.website} target="_blank" rel="noopener noreferrer">
                  {record?.website}
                </a>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card size="small" title="认证信息" headStyle={{ fontWeight: 'bold' }}>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="认证资质">{record?.certifications}</Descriptions.Item>
              <Descriptions.Item label="最近审核日期">{record?.lastAuditDate}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card size="small" title="系统信息" headStyle={{ fontWeight: 'bold' }}>
            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="创建时间">{record?.createTime}</Descriptions.Item>
              <Descriptions.Item label="更新时间">{record?.updateTime}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default LogisticsProvidersDetailModel;
