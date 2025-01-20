import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Badge, Spin, Space, Tag } from 'antd';
import {
  UserOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  UserSwitchOutlined,
  UserAddOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import api from 'src/axiosInstance';

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-size: 12px;
    color: #000000;
    font-weight: 500;
  }

  .ant-descriptions-item-label {
    font-size: 10px;
    color: #666666;
    background-color: #fafafa;
    padding: 8px 12px !important;
  }


  .ant-descriptions-bordered .ant-descriptions-item-label {
    width: 100px;
  }

  .email-verified {
    color: #52c41a;
  }

  .email-unverified {
    color: #ff4d4f;
  }

  .ant-tag {
    margin: 1px;
    font-size: 10px;
    line-height: 16px;
    height: 18px;
  }

  .role-tag {
    border-radius: 10px;
    padding: 0 8px;
  }

  .description-icon {
    margin-right: 6px;
    color: #1890ff;
    font-size: 12px;
  }

  .roles-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    max-height: 72px;
    overflow-y: auto;
    padding: 2px 0;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #d9d9d9;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f0f0f0;
      border-radius: 2px;
    }
  }

  .ant-badge {
    .ant-badge-status-dot {
      width: 6px;
      height: 6px;
    }
    .ant-badge-status-text {
      font-size: 10px;
      margin-left: 4px;
    }
  }

  .ant-descriptions.ant-descriptions-small {
    .ant-descriptions-row > th,
    .ant-descriptions-row > td {
      padding: 8px 12px;
    }
  }
`;

const ManagerDetailModal = ({ isVisible, onCancel, managerId }) => {
  const [loading, setLoading] = useState(false);
  const [managerData, setManagerData] = useState(null);

  useEffect(() => {
    if (isVisible && managerId) {
      fetchManagerDetail();
    }
  }, [isVisible, managerId]);

  const fetchManagerDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/manage/manager/get-by-id?id=${managerId}`);
      setManagerData(response);
    } catch (error) {
      console.error('Failed to fetch manager detail:', error);
    } finally {
      setLoading(false);
    }
  };

  // 角色标签颜色映射
  const roleColors = [
    '#1890ff', '#52c41a', '#722ed1', '#faad14', '#13c2c2',
    '#eb2f96', '#f5222d', '#fa541c', '#fa8c16', '#a0d911'
  ];

  return (
    <StyledModal
      title={<Space ><UserOutlined />管理员详情</Space>}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={520}
      centered
    >
      <Spin spinning={loading}>
        {managerData && (
          <Descriptions column={1} bordered >
            <Descriptions.Item
              label={<Space><IdcardOutlined className="description-icon" />ID</Space>}
            >
              {managerData.id}
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><UserOutlined className="description-icon" />用户名</Space>}
            >
              {managerData.username}
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><MailOutlined className="description-icon" />邮箱</Space>}
            >
              <span className={managerData.emailVerification ? 'email-verified' : 'email-unverified'}>
                {managerData.email || '无'}
                {managerData.email && (
                  <Badge
                    status={managerData.emailVerification ? 'success' : 'error'}
                    text={managerData.emailVerification ? '已验证' : '未验证'}
                    style={{ marginLeft: '8px' }}
                  />
                )}
              </span>
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><PhoneOutlined className="description-icon" />手机号</Space>}
            >
              {managerData.phone || '无'}
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><TeamOutlined className="description-icon" />角色</Space>}
            >
              <div className="roles-container">
                {managerData.roles?.length > 0
                  ? managerData.roles.map((role, index) => (
                    <Tag
                      key={role.roleId}
                      color={roleColors[index % roleColors.length]}
                      className="role-tag"
                      icon={<TeamOutlined />}
                    >
                      {role.roleName}
                    </Tag>
                  ))
                  : <Tag color="default">无角色</Tag>
                }
              </div>
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><UserSwitchOutlined className="description-icon" />状态</Space>}
            >
              <Badge
                status={managerData.status ? 'success' : 'error'}
                text={managerData.status ? '启用' : '禁用'}
              />
            </Descriptions.Item>

            <Descriptions.Item
              label={<Space><UserAddOutlined className="description-icon" />创建人</Space>}
            >
              {managerData.createBy || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Spin>
    </StyledModal>
  );
};

export default ManagerDetailModal;
