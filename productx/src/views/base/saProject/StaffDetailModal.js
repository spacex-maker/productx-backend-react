import React from 'react';
import { Modal, Descriptions, Avatar } from 'antd';
import { useTranslation } from 'react-i18next';

const StaffDetailModal = ({
  visible,
  onCancel,
  staffData
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('staffDetails')}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <Avatar src={staffData?.avatarUrl} size={100} />
      </div>
      <Descriptions bordered column={1}>
        <Descriptions.Item label={t('id')}>{staffData?.id}</Descriptions.Item>
        <Descriptions.Item label={t('agentId')}>{staffData?.agentId}</Descriptions.Item>
        <Descriptions.Item label={t('projectId')}>{staffData?.projectId}</Descriptions.Item>
        <Descriptions.Item label={t('agentName')}>{staffData?.agentName}</Descriptions.Item>
        <Descriptions.Item label={t('modelType')}>{staffData?.modelType}</Descriptions.Item>
        <Descriptions.Item label={t('roles')}>{staffData?.roles}</Descriptions.Item>
        <Descriptions.Item label={t('mbtiCode')}>{staffData?.mbtiCode}</Descriptions.Item>
        <Descriptions.Item label={t('prompt')}>{staffData?.prompt}</Descriptions.Item>
        <Descriptions.Item label={t('priority')}>{staffData?.priority}</Descriptions.Item>
        <Descriptions.Item label={t('temperature')}>{staffData?.temperature || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('maxTokens')}>{staffData?.maxTokens || '-'}</Descriptions.Item>
        <Descriptions.Item label={t('enableMemory')}>
          {staffData?.enableMemory ? t('yes') : t('no')}
        </Descriptions.Item>
        <Descriptions.Item label={t('enableRag')}>
          {staffData?.enableRag ? t('yes') : t('no')}
        </Descriptions.Item>
        <Descriptions.Item label={t('enableExternal')}>
          {staffData?.enableExternal ? t('yes') : t('no')}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default StaffDetailModal; 