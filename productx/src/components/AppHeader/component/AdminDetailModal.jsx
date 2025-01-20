import React from 'react';
import { Modal, Form, Row, Col, Tag, Avatar } from 'antd';
import styled from 'styled-components';
// @ts-ignore
import defaultAvatar from '../../../assets/images/avatars/8.jpg';

const FormLabel = styled.span`
  color: #666;
  margin-bottom: 4px;
  display: block;
`;

const InfoText = styled.div`
  color: #000;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  min-height: 20px;
  line-height: 12px;
`;

const StatusTag = styled(Tag)`
  line-height: 18px !important;
  height: 20px !important;
  margin: 0 !important;
  width: 100% !important;
  text-align: center !important;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const AvatarWrapper = styled.div`
  margin-right: 16px;
`;

const UserInfo = styled.div`
  flex: 1;

  .username {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-bottom: 4px;
  }

  .role {
    color: #666;
  }
`;

export const AdminDetailModal = ({ visible, onCancel, adminInfo }) => {
  const getStatusTag = (status) => {
    if (status === true) {
      return <StatusTag color="success">启用</StatusTag>;
    } else if (status === false) {
      return <StatusTag color="error">禁用</StatusTag>;
    }
    return <StatusTag color="default">未知状态</StatusTag>;
  };

  return (
    <Modal
      title={<div style={{ fontSize: '12px', color: '#000000' }}>个人资料</div>}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <ProfileHeader>
        <AvatarWrapper>
          <Avatar
            size={64}
            src={adminInfo?.avatar || defaultAvatar}
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
          />
        </AvatarWrapper>
        <UserInfo>
          <div className="username">{adminInfo?.username}</div>
          <div className="role">角色 ID: {adminInfo?.roleId}</div>
          {getStatusTag(adminInfo?.status)}
        </UserInfo>
      </ProfileHeader>

      <Form layout="vertical" >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<FormLabel>邮箱</FormLabel>}>
              <InfoText>{adminInfo?.email || '--'}</InfoText>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<FormLabel>手机号</FormLabel>}>
              <InfoText>{adminInfo?.phone || '--'}</InfoText>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label={<FormLabel>创建者</FormLabel>}>
              <InfoText>{adminInfo?.createBy || '--'}</InfoText>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label={<FormLabel>第三方账号ID</FormLabel>}>
              <InfoText>{adminInfo?.thirdUserAccountId || '--'}</InfoText>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <style jsx>{`
        :global(.ant-modal-content) {
          * {
            font-size: 10px !important;
          }
        }
        :global(.ant-modal-header) {
          padding: 12px 16px !important;
        }
        :global(.ant-modal-body) {
          padding: 16px !important;
        }
        :global(.ant-modal-footer) {
          padding: 4px 8px !important;
        }
        :global(.ant-modal-footer .ant-btn) {
          height: 20px !important;
          padding: 0 8px !important;
          font-size: 10px !important;
        }
        :global(.ant-form-item) {
          margin-bottom: 12px !important;
        }
      `}</style>
    </Modal>
  );
};
