import React from 'react';
import { Modal, Avatar, Card, Tag, Space, Typography, Row, Col } from 'antd';
import styled from 'styled-components';
// @ts-ignore
import defaultAvatar from '../../../assets/images/avatars/8.jpg';

const { Text, Title } = Typography;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
  
  &::before {
    content: '';
    position: absolute;
    inset: -4px;
    background: conic-gradient(
      from 0deg,
      #1677ff,
      #87d068,
      #1677ff,
      #87d068,
      #1677ff
    );
    border-radius: 50%;
    animation: rotate 4s linear infinite;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: rgba(22, 119, 255, 0.3);
    border-radius: 50%;
    animation: glow 2s ease-in-out infinite;
    z-index: 2;
  }

  .ant-avatar {
    position: relative;
    z-index: 3;
    border: 2px solid white;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes glow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
  }
`;

export const AdminDetailModal = ({ visible, onCancel, adminInfo }) => {
  const getStatusTag = (status) => {
    if (status === true) {
      return <Tag color="success">启用</Tag>;
    } else if (status === false) {
      return <Tag color="error">禁用</Tag>;
    }
    return <Tag color="default">未知状态</Tag>;
  };

  // 对角色进行分组，每行显示2个
  const renderRoles = () => {
    return (
      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '1px' }}>
        <Row gutter={[16, 16]}>
          {adminInfo?.roles?.map((role) => (
            <Col span={12} key={role.roleId}>
              <Card 
                size="small"
                bordered
                style={{ height: '100%' }}
              >
                <div style={{ marginBottom: 8 }}>
                  <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                      <Text strong style={{ fontSize: 14 }}>{role.roleName}</Text>
                      <Tag color={role.roleStatus ? 'success' : 'error'}>
                        {role.roleStatus ? '启用' : '禁用'}
                      </Tag>
                    </Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>ID: {role.roleId}</Text>
                  </Space>
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {role.roleNameEn}
                  </Text>
                </div>
                
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 13 }}>
                    {role.description}
                  </Text>
                </div>

                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 8 }}>
                  <Row>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        创建者: {role.createBy}
                      </Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        更新者: {role.updateBy}
                      </Text>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Card bordered={false}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <AvatarWrapper>
            <Avatar
              size={100}
              src={adminInfo?.avatar || defaultAvatar}
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
          </AvatarWrapper>
          <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
            {adminInfo?.username}
          </Title>
          <Space size={8}>
            {getStatusTag(adminInfo?.status)}
            <Tag color={adminInfo?.emailVerification ? 'success' : 'warning'}>
              {adminInfo?.emailVerification ? '邮箱已验证' : '邮箱未验证'}
            </Tag>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card title="基本信息" size="small" bordered={false}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">邮箱：</Text>
                  <Text>{adminInfo?.email || '--'}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">手机号：</Text>
                  <Text>{adminInfo?.phone || '--'}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">ID：</Text>
                  <Text>{adminInfo?.id || '--'}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">创建者：</Text>
                  <Text>{adminInfo?.createBy || '--'}</Text>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={24}>
            <Card 
              title={
                <Space>
                  <span>角色信息</span>
                  <Tag>{adminInfo?.roles?.length || 0}个角色</Tag>
                </Space>
              } 
              size="small" 
              bordered={false}
            >
              {renderRoles()}
            </Card>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};
