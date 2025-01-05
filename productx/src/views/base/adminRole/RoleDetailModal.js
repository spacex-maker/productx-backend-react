import React, { useState, useMemo } from 'react';
import { Modal, Descriptions, Tag, Button, Table, Input, Space, Radio } from 'antd';
import {
  InfoCircleOutlined,
  MenuOutlined,
  ApiOutlined,
  ControlOutlined,
  AppstoreOutlined,
  SearchOutlined,
  LockOutlined
} from '@ant-design/icons';
import { formatDate } from 'src/components/common/Common';
import api from 'src/axiosInstance';

const RoleDetailModal = ({ isVisible, onCancel, roleDetail }) => {
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');

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
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            fontSize: '10px',
            color: record.isSystem === true ? '#1890ff' : 'rgba(0, 0, 0, 0.85)',
            fontWeight: record.isSystem === true ? 500 : 400
          }}>
            {text}
          </span>
          {record.isSystem === true && (
            <Tag color="#1890ff" style={{
              fontSize: '10px',
              padding: '0 4px',
              margin: 0,
              lineHeight: '16px'
            }}>
              系统权限
            </Tag>
          )}
        </div>
      )
    },
    {
      title: '英文名称',
      dataIndex: 'permissionNameEn',
      width: '25%',
      render: (text, record) => (
        <span style={{
          fontSize: '10px',
          color: record.isSystem === true ? '#1890ff' : 'rgba(0, 0, 0, 0.85)',
          fontWeight: record.isSystem === true ? 500 : 400
        }}>
          {text}
        </span>
      )
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

  const filteredPermissions = useMemo(() => {
    return permissions.filter(item => {
      const matchSearch = (
        item.permissionName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.permissionNameEn?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchText.toLowerCase())
      );

      const matchType = filterType === 'all' ||
        (filterType === 'menu' && item.type === 1) ||
        (filterType === 'api' && item.type === 2) ||
        (filterType === 'button' && item.type === 3) ||
        (filterType === 'business' && item.type === 4);

      return matchSearch && matchType;
    });
  }, [permissions, searchText, filterType]);

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
        <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
          <div style={{
            padding: '8px 12px',
            background: '#f6f6f6',
            borderRadius: '4px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
            <span>
              标记为 <span style={{ color: '#1890ff', fontWeight: 500 }}>蓝色</span> 且带有
              <Tag color="#1890ff" style={{
                fontSize: '10px',
                padding: '0 4px',
                margin: '0 4px',
                lineHeight: '16px'
              }}>
                系统权限
              </Tag>
              标签的为系统内置权限
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Input
              placeholder="搜索权限名称、英文名称或描述"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300, marginRight: '16px', fontSize: '10px' }}
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              allowClear
            />
            <Radio.Group
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              size="small"
            >
              <Radio.Button value="all" style={{ fontSize: '10px', padding: '0 8px' }}>
                全部
              </Radio.Button>
              <Radio.Button value="menu" style={{ fontSize: '10px', padding: '0 8px' }}>
                <MenuOutlined /> 菜单
              </Radio.Button>
              <Radio.Button value="api" style={{ fontSize: '10px', padding: '0 8px' }}>
                <ApiOutlined /> 接口
              </Radio.Button>
              <Radio.Button value="button" style={{ fontSize: '10px', padding: '0 8px' }}>
                <ControlOutlined /> 按钮
              </Radio.Button>
              <Radio.Button value="business" style={{ fontSize: '10px', padding: '0 8px' }}>
                <AppstoreOutlined /> 业务
              </Radio.Button>
            </Radio.Group>
          </div>
          <div style={{ fontSize: '10px', color: '#8c8c8c' }}>
            共 {filteredPermissions.length} 条权限记录
          </div>
        </Space>

        <Table
          dataSource={filteredPermissions}
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

        .ant-radio-button-wrapper {
          height: 24px !important;
          line-height: 22px !important;
          padding: 0 8px !important;
        }

        .ant-input-affix-wrapper {
          height: 24px !important;
          padding: 0 8px !important;
        }

        .ant-input-affix-wrapper input {
          font-size: 10px !important;
        }

        .ant-input-affix-wrapper .ant-input-prefix {
          margin-right: 4px !important;
        }
      `}</style>
    </>
  );
};

export default RoleDetailModal;
