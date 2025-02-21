import React, { useState } from 'react';
import { Modal, Descriptions, Typography, Button, message, Tooltip, Space, Tag, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CloudOutlined,
  KeyOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import api from 'src/axiosInstance';

const { Title } = Typography;

const ObjectStorageDetailModal = ({
  isVisible,
  onCancel,
  selectedStorage
}) => {
  const { t } = useTranslation();
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [lastVerifyTime, setLastVerifyTime] = useState(null);
  const [validationTime, setValidationTime] = useState(null);

  const getStatusTagColor = (status) => {
    const colorMap = {
      'ACTIVE': 'success',
      'INACTIVE': 'warning',
      'ERROR': 'error'
    };
    return colorMap[status] || 'default';
  };

  const handleVerify = async () => {
    if (!selectedStorage?.id) return;

    setVerifying(true);
    const startTime = Date.now();

    try {
      const response = await api.post('/manage/object-storage-config/verify', {
        id: selectedStorage.id
      });

      const endTime = Date.now();
      setValidationTime(endTime - startTime);

      if (response) {
        setVerifyStatus(response);
        setLastVerifyTime(new Date());
        message.success(t('verifySuccess'));
      } else {
        setVerifyStatus(false);
        message.error(t('verifyFailed'));
      }
    } catch (error) {
      console.error('Verify failed:', error);
      setVerifyStatus(false);
      message.error(t('verifyFailed'));
    } finally {
      setVerifying(false);
    }
  };

  const getVerifyStatusTag = () => {
    if (verifying) {
      return (
        <Tag icon={<SyncOutlined spin />} color="processing">
          {t('verifying')}
        </Tag>
      );
    }

    if (verifyStatus === null) {
      return (
        <Tooltip title={t('notVerifiedYet')}>
          <Tag icon={<QuestionCircleOutlined />} color="default">
            {t('notVerified')}
          </Tag>
        </Tooltip>
      );
    }

    const tooltipContent = (
      <div>
        {lastVerifyTime && (
          <div>{t('lastVerifyTime')}: {lastVerifyTime.toLocaleString()}</div>
        )}
        {validationTime && (
          <div>{t('validationTime')}: {(validationTime / 1000).toFixed(2)}s</div>
        )}
      </div>
    );

    return verifyStatus ? (
      <Tooltip title={tooltipContent}>
        <Tag icon={<CheckCircleOutlined />} color="success">
          {t('configValid')}
        </Tag>
      </Tooltip>
    ) : (
      <Tooltip title={tooltipContent}>
        <Tag icon={<CloseCircleOutlined />} color="error">
          {t('configInvalid')}
        </Tag>
      </Tooltip>
    );
  };

  const items = [
    {
      key: 'basic',
      label: (
        <Space>
          <DatabaseOutlined />
          {t('basicInfo')}
        </Space>
      ),
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('id')}>{selectedStorage?.id}</Descriptions.Item>
          <Descriptions.Item label={t('status')}>
            {selectedStorage?.status && (
              <Tag color={getStatusTagColor(selectedStorage.status)}>
                {t(selectedStorage.status)}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('storageProvider')}>{selectedStorage?.storageProvider}</Descriptions.Item>
          <Descriptions.Item label={t('storageType')}>{selectedStorage?.storageType}</Descriptions.Item>
          <Descriptions.Item label={t('accountName')}>{selectedStorage?.accountName}</Descriptions.Item>
          <Descriptions.Item label={t('configStatus')}>{getVerifyStatusTag()}</Descriptions.Item>
          <Descriptions.Item label={t('description')} span={2}>{selectedStorage?.description}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'credentials',
      label: (
        <Space>
          <KeyOutlined />
          {t('credentials')}
        </Space>
      ),
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('accessKey')}>{selectedStorage?.accessKey}</Descriptions.Item>
          <Descriptions.Item label={t('secretKey')}>******</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'storage',
      label: (
        <Space>
          <GlobalOutlined />
          {t('storageConfig')}
        </Space>
      ),
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('region')}>{selectedStorage?.region}</Descriptions.Item>
          <Descriptions.Item label={t('country')}>{selectedStorage?.country || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('bucketName')}>{selectedStorage?.bucketName}</Descriptions.Item>
          <Descriptions.Item label={t('endpoint')}>{selectedStorage?.endpoint}</Descriptions.Item>
          <Descriptions.Item label={t('isActive')}>
            <Tag color={selectedStorage?.isActive ? 'success' : 'default'}>
              {selectedStorage?.isActive ? t('yes') : t('no')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('isDefault')}>
            <Tag color={selectedStorage?.isDefault ? 'blue' : 'default'}>
              {selectedStorage?.isDefault ? t('yes') : t('no')}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'security',
      label: (
        <Space>
          <SecurityScanOutlined />
          {t('securityConfig')}
        </Space>
      ),
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('encryptionType')}>{selectedStorage?.encryptionType || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('isEncrypted')}>
            <Tag color={selectedStorage?.isEncrypted ? 'success' : 'default'}>
              {selectedStorage?.isEncrypted ? t('yes') : t('no')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('encryptionKey')}>{selectedStorage?.encryptionKey || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('compliance')}>{selectedStorage?.compliance || '-'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'advanced',
      label: (
        <Space>
          <SettingOutlined />
          {t('advancedConfig')}
        </Space>
      ),
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('apiUrl')}>{selectedStorage?.apiUrl || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('apiVersion')}>{selectedStorage?.apiVersion || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('maxStorageSize')}>{selectedStorage?.maxStorageSize || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('maxRequestLimit')}>{selectedStorage?.maxRequestLimit || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('tags')} span={2}>{selectedStorage?.tags || '-'}</Descriptions.Item>
        </Descriptions>
      )
    },
    {
      key: 'audit',
      label: (
        <Space>
          <HistoryOutlined />
          {t('auditInfo')}
        </Space>
      ),
      children: (
        <Descriptions bordered column={2}>
          <Descriptions.Item label={t('createTime')}>{selectedStorage?.createTime}</Descriptions.Item>
          <Descriptions.Item label={t('createBy')}>{selectedStorage?.createBy || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('updateTime')}>{selectedStorage?.updateTime}</Descriptions.Item>
          <Descriptions.Item label={t('updateBy')}>{selectedStorage?.updateBy || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('lastCheckedAt')}>{selectedStorage?.lastCheckedAt}</Descriptions.Item>
          <Descriptions.Item label={t('errorInfo')}>{selectedStorage?.errorMessage || '-'}</Descriptions.Item>
        </Descriptions>
      )
    }
  ];

  return (
    <Modal
      title={
        <Space>
          <CloudOutlined style={{ color: '#1890ff' }} />
          {t('storageDetail')}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="verify" type="primary" onClick={handleVerify} loading={verifying}>
          {t('verifyConfig')}
        </Button>,
        <Button key="close" onClick={onCancel}>
          {t('close')}
        </Button>
      ]}
    >
      <Tabs items={items} />
    </Modal>
  );
};

export default ObjectStorageDetailModal;
