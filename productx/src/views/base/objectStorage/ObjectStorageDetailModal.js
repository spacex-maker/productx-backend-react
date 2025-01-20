import React, { useState } from 'react';
import { Modal, Descriptions, Card, Tag, Typography, Divider, Button, message, Tooltip } from 'antd';
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

  const styles = {
    card: {
      marginBottom: '8px',
      fontSize: '10px'
    },
    icon: {
      fontSize: '12px',
      color: '#1890ff',
      marginRight: '4px'
    },
    cardTitle: {
      fontSize: '10px',
      margin: 0,
      padding: '4px 0',
      display: 'flex',
      alignItems: 'center'
    },
    descriptions: {
      fontSize: '10px',
      '& th.ant-descriptions-item-label': {
        fontSize: '10px !important',
        padding: '4px 8px !important'
      },
      '& td.ant-descriptions-item-content': {
        fontSize: '10px !important',
        padding: '4px 8px !important'
      }
    },
    tag: {
      fontSize: '10px',
      lineHeight: '16px',
      height: '16px',
      padding: '0 4px'
    },
    modalBody: {
      padding: '12px'
    },
    verifyButton: {
      fontSize: '10px',
      height: '20px',
      padding: '0 8px'
    }
  };

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

  return (
    <Modal
      title={
        <span style={styles.cardTitle}>
          <CloudOutlined style={styles.icon} />
          {t('storageDetail')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      width={700}
      footer={null}
      bodyStyle={styles.modalBody}
      className="storage-detail-modal"
    >
      <style>
        {`
          .storage-detail-modal .ant-card-head {
            min-height: 24px !important;
            padding: 0 8px !important;
          }
          .storage-detail-modal .ant-card-body {
            padding: 8px !important;
          }
          .storage-detail-modal .ant-descriptions-item-label,
          .storage-detail-modal .ant-descriptions-item-content {
            font-size: 10px !important;
            padding: 4px 8px !important;
            line-height: 1.2 !important;
          }
          .storage-detail-modal .ant-tag {
            font-size: 10px !important;
            line-height: 16px !important;
            height: 16px !important;
            padding: 0 4px !important;
            margin: 0 !important;
          }
          .storage-detail-modal .ant-descriptions-bordered .ant-descriptions-item-label {
            background-color: #fafafa;
            font-weight: normal !important;
          }
        `}
      </style>

      <Card

        style={styles.card}
        headStyle={styles.cardTitle}
        bodyStyle={{ padding: '8px' }}
        title={
          <span style={styles.cardTitle}>
            <DatabaseOutlined style={styles.icon} />
            {t('basicInfo')}
          </span>
        }
        extra={
          <Button
            type="primary"

            onClick={handleVerify}
            loading={verifying}
            style={styles.verifyButton}
          >
            {t('verifyConfig')}
          </Button>
        }
      >
        <Descriptions
          column={2}

          bordered
          style={styles.descriptions}
        >
          <Descriptions.Item label={t('id')}>{selectedStorage?.id}</Descriptions.Item>
          <Descriptions.Item label={t('status')}>
            {selectedStorage?.status && (
              <Tag color={getStatusTagColor(selectedStorage.status)} style={styles.tag}>
                {t(selectedStorage.status)}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('storageProvider')}>{selectedStorage?.storageProvider}</Descriptions.Item>
          <Descriptions.Item label={t('storageType')}>{selectedStorage?.storageType}</Descriptions.Item>
          <Descriptions.Item label={t('accountName')}>{selectedStorage?.accountName}</Descriptions.Item>
          <Descriptions.Item label={t('description')}>{selectedStorage?.description}</Descriptions.Item>
          <Descriptions.Item label={t('configStatus')} span={2}>
            {getVerifyStatusTag()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card

        style={styles.card}
        headStyle={styles.cardTitle}
        bodyStyle={{ padding: '8px' }}
        title={
          <span style={styles.cardTitle}>
            <KeyOutlined style={styles.icon} />
            {t('credentials')}
          </span>
        }
      >
        <Descriptions
          column={2}

          bordered
          style={styles.descriptions}
        >
          <Descriptions.Item label={t('accessKey')}>{selectedStorage?.accessKey}</Descriptions.Item>
          <Descriptions.Item label={t('secretKey')}>******</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card

        style={styles.card}
        headStyle={styles.cardTitle}
        bodyStyle={{ padding: '8px' }}
        title={
          <span style={styles.cardTitle}>
            <GlobalOutlined style={styles.icon} />
            {t('storageConfig')}
          </span>
        }
      >
        <Descriptions
          column={2}

          bordered
          style={styles.descriptions}
        >
          <Descriptions.Item label={t('region')}>{selectedStorage?.region}</Descriptions.Item>
          <Descriptions.Item label={t('country')}>{selectedStorage?.country || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('bucketName')}>{selectedStorage?.bucketName}</Descriptions.Item>
          <Descriptions.Item label={t('endpoint')}>{selectedStorage?.endpoint}</Descriptions.Item>
          <Descriptions.Item label={t('isActive')}>
            <Tag color={selectedStorage?.isActive ? 'success' : 'default'} style={styles.tag}>
              {selectedStorage?.isActive ? t('yes') : t('no')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('isDefault')}>
            <Tag color={selectedStorage?.isDefault ? 'blue' : 'default'} style={styles.tag}>
              {selectedStorage?.isDefault ? t('yes') : t('no')}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card

        style={styles.card}
        headStyle={styles.cardTitle}
        bodyStyle={{ padding: '8px' }}
        title={
          <span style={styles.cardTitle}>
            <SecurityScanOutlined style={styles.icon} />
            {t('securityConfig')}
          </span>
        }
      >
        <Descriptions
          column={2}

          bordered
          style={styles.descriptions}
        >
          <Descriptions.Item label={t('encryptionType')}>{selectedStorage?.encryptionType || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('isEncrypted')}>
            <Tag color={selectedStorage?.isEncrypted ? 'success' : 'default'} style={styles.tag}>
              {selectedStorage?.isEncrypted ? t('yes') : t('no')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('encryptionKey')}>{selectedStorage?.encryptionKey || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('compliance')}>{selectedStorage?.compliance || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card

        style={styles.card}
        headStyle={styles.cardTitle}
        bodyStyle={{ padding: '8px' }}
        title={
          <span style={styles.cardTitle}>
            <SettingOutlined style={styles.icon} />
            {t('advancedConfig')}
          </span>
        }
      >
        <Descriptions
          column={2}

          bordered
          style={styles.descriptions}
        >
          <Descriptions.Item label={t('apiUrl')}>{selectedStorage?.apiUrl || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('apiVersion')}>{selectedStorage?.apiVersion || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('maxStorageSize')}>{selectedStorage?.maxStorageSize || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('maxRequestLimit')}>{selectedStorage?.maxRequestLimit || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('tags')} span={2}>{selectedStorage?.tags || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card

        style={styles.card}
        headStyle={styles.cardTitle}
        bodyStyle={{ padding: '8px' }}
        title={
          <span style={styles.cardTitle}>
            <HistoryOutlined style={styles.icon} />
            {t('auditInfo')}
          </span>
        }
      >
        <Descriptions
          column={2}

          bordered
          style={styles.descriptions}
        >
          <Descriptions.Item label={t('createTime')}>{selectedStorage?.createTime}</Descriptions.Item>
          <Descriptions.Item label={t('createBy')}>{selectedStorage?.createBy || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('updateTime')}>{selectedStorage?.updateTime}</Descriptions.Item>
          <Descriptions.Item label={t('updateBy')}>{selectedStorage?.updateBy || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('lastCheckedAt')}>{selectedStorage?.lastCheckedAt}</Descriptions.Item>
          <Descriptions.Item label={t('errorInfo')}>{selectedStorage?.errorMessage || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
};

export default ObjectStorageDetailModal;
