import React, { useState } from 'react';
import { Modal, Descriptions, Tag, Button, Table } from 'antd';
import { InfoCircleOutlined, MenuOutlined, ApiOutlined, ControlOutlined, AppstoreOutlined } from '@ant-design/icons';
import { formatDate } from 'src/components/common/Common';
import api from 'src/axiosInstance';

const RoleDetailModal = ({ isVisible, onCancel, roleDetail }) => {
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTypeTag = (type) => {
    switch (type) {
      case 1:
        return (
          <Tag color="#1890ff" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px' }}>
            <MenuOutlined style={{ marginRight: '4px' }} />菜单
          </Tag>
        );
      case 2:
        return (
          <Tag color="#52c41a" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px' }}>
            <ApiOutlined style={{ marginRight: '4px' }} />接口
          </Tag>
        );
      case 3:
        return (
          <Tag color="#722ed1" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px' }}>
            <ControlOutlined style={{ marginRight: '4px' }} />按钮
          </Tag>
        );
      case 4:
        return (
          <Tag color="#fa8c16" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px' }}>
            <AppstoreOutlined style={{ marginRight: '4px' }} />业务
          </Tag>
        );
      default:
        return '-';
    }
  };

  const fetchPermissions = async () => {
    if (!roleDetail?.id) return;
    setLoading(true);
    try {
      const response = await api.get(`/manage/role-permissions/list/${roleDetail.id}`);
      if (response) {
        setPermissions(response);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPermissions = async () => {
    await fetchPermissions();
    setPermissionModalVisible(true);
  };

  const permissionColumns = [
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      width: '25%',
      render: (text) => <span style={{ fontSize: '10px' }}>{text}</span>
    },
    {
      title: '英文名称',
      dataIndex: 'permissionNameEn',
      width: '25%',
      render: (text) => <span style={{ fontSize: '10px' }}>{text}</span>
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: '15%',
      render: (type) => getTypeTag(type)
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '35%',
      render: (text) => <span style={{ fontSize: '10px' }}>{text}</span>
    }
  ];

  return (
    <>
      <Modal
        title={
          <div style={{ fontSize: '12px', fontWeight: 500 }}>
            <InfoCircleOutlined style={{ marginRight: '4px' }} />
            角色详情
          </div>
        }
        open={isVisible}
        onCancel={onCancel}
        footer={null}
        width={600}
      >
        <Descriptions
          bordered
          size="small"
          column={2}
          labelStyle={{ width: '100px', fontSize: '10px' }}
          contentStyle={{ fontSize: '10px' }}
        >
          <Descriptions.Item label="角色ID">{roleDetail?.id}</Descriptions.Item>
          <Descriptions.Item label="角色名称">{roleDetail?.roleName}</Descriptions.Item>
          <Descriptions.Item label="英文名称">{roleDetail?.roleNameEn}</Descriptions.Item>
          <Descriptions.Item label="启用状态">
            <Tag color={roleDetail?.status ? '#52c41a' : '#f5222d'} style={{ fontSize: '10px' }}>
              {roleDetail?.status ? '启用' : '禁用'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="角色描述" span={2}>{roleDetail?.description || '-'}</Descriptions.Item>
          <Descriptions.Item label="系统角色">
            <Tag color={roleDetail?.roleNameEn === 'super_admin' || roleDetail?.id <= 18 ? '#1890ff' : '#d9d9d9'} style={{ fontSize: '10px' }}>
              {roleDetail?.roleNameEn === 'super_admin' || roleDetail?.id <= 18 ? '是' : '否'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="权限数量">
            <Button 
              type="link" 
              onClick={handleViewPermissions}
              style={{ fontSize: '10px', padding: '0' }}
            >
              <Tag color="#108ee9" style={{ fontSize: '10px', cursor: 'pointer' }}>
                {roleDetail?.permissionCount || 0} 个权限
              </Tag>
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="创建人">{roleDetail?.createBy || '-'}</Descriptions.Item>
          <Descriptions.Item label="更新人">{roleDetail?.updateBy || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{formatDate(roleDetail?.createTime) || '-'}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{formatDate(roleDetail?.updateTime) || '-'}</Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        title={
          <div style={{ fontSize: '12px', fontWeight: 500 }}>
            <InfoCircleOutlined style={{ marginRight: '4px' }} />
            {roleDetail?.roleName} - 权限列表
          </div>
        }
        open={permissionModalVisible}
        onCancel={() => setPermissionModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={permissions}
          columns={permissionColumns}
          rowKey="permissionId"
          size="small"
          loading={loading}
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>

      <style jsx global>{`
        .ant-modal-header {
          padding: 12px 24px !important;
          border-bottom: 1px solid #f0f0f0;
        }

        .ant-descriptions-header {
          margin-bottom: 8px !important;
        }

        .ant-descriptions-item-label {
          background-color: #fafafa !important;
          font-weight: 500 !important;
        }

        .ant-descriptions-item-content {
          color: rgba(0, 0, 0, 0.65) !important;
        }

        .ant-modal-close {
          height: 40px !important;
          width: 40px !important;
          line-height: 40px !important;
        }

        .ant-modal-close-x {
          font-size: 10px !important;
          width: 40px !important;
          height: 40px !important;
          line-height: 40px !important;
        }

        .ant-table-thead > tr > th {
          font-size: 10px !important;
          padding: 8px !important;
          background-color: #fafafa !important;
        }

        .ant-table-tbody > tr > td {
          padding: 8px !important;
        }

        .ant-table-tbody > tr:hover > td {
          background-color: #f5f5f5 !important;
        }
      `}</style>
    </>
  );
};

export default RoleDetailModal; 