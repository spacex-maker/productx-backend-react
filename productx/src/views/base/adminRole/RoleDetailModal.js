import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatDate } from 'src/components/common/Common';

const RoleDetailModal = ({ isVisible, onCancel, roleDetail }) => {
  return (
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
          <Tag color="#108ee9" style={{ fontSize: '10px' }}>
            {roleDetail?.permissionCount || 0} 个权限
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建人">{roleDetail?.createBy || '-'}</Descriptions.Item>
        <Descriptions.Item label="更新人">{roleDetail?.updateBy || '-'}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{formatDate(roleDetail?.createTime) || '-'}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{formatDate(roleDetail?.updateTime) || '-'}</Descriptions.Item>
      </Descriptions>

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
      `}</style>
    </Modal>
  );
};

export default RoleDetailModal; 