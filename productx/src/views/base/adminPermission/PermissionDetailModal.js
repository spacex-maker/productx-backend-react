import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { MenuOutlined, ApiOutlined, ControlOutlined, AppstoreOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { formatDate } from 'src/components/common/Common';

const PermissionDetailModal = ({ isVisible, onCancel, permissionDetail }) => {
  const getTypeTag = (type) => {
    switch (type) {
      case 1:
        return (
          <Tag color="#1890ff" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
            <MenuOutlined style={{ marginRight: '4px' }} />菜单
          </Tag>
        );
      case 2:
        return (
          <Tag color="#52c41a" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
            <ApiOutlined style={{ marginRight: '4px' }} />接口
          </Tag>
        );
      case 3:
        return (
          <Tag color="#722ed1" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
            <ControlOutlined style={{ marginRight: '4px' }} />按钮
          </Tag>
        );
      case 4:
        return (
          <Tag color="#fa8c16" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
            <AppstoreOutlined style={{ marginRight: '4px' }} />业务
          </Tag>
        );
      default:
        return '未知';
    }
  };

  return (
    <Modal
      title={
        <div>
          <InfoCircleOutlined style={{ marginRight: '4px' }} />
          权限详情
        </div>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Descriptions
        bordered
        column={1}
        size="small"
      >
        <Descriptions.Item label="权限ID">{permissionDetail?.id}</Descriptions.Item>
        <Descriptions.Item label="权限类型">{getTypeTag(permissionDetail?.type)}</Descriptions.Item>
        <Descriptions.Item label="权限名称">{permissionDetail?.permissionName}</Descriptions.Item>
        <Descriptions.Item label="英文名称">{permissionDetail?.permissionNameEn}</Descriptions.Item>
        <Descriptions.Item label="权限描述" span={2}>{permissionDetail?.description}</Descriptions.Item>
        <Descriptions.Item label="启用状态">
          <Tag color={permissionDetail?.status ? '#52c41a' : '#f5222d'}>
            {permissionDetail?.status ? '启用' : '禁用'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="系统权限">
          <Tag color={permissionDetail?.isSystem ? '#1890ff' : '#d9d9d9'}>
            {permissionDetail?.isSystem ? '是' : '否'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建人">{permissionDetail?.createBy || '-'}</Descriptions.Item>
        <Descriptions.Item label="更新人">{permissionDetail?.updateBy || '-'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{formatDate(permissionDetail?.createTime) || '-'}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{formatDate(permissionDetail?.updateTime) || '-'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PermissionDetailModal;
