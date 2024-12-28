import React from 'react';
import { Modal, Descriptions, Card, Tag, Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CloudOutlined,
  KeyOutlined,
  GlobalOutlined,
  DatabaseOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  HistoryOutlined
} from '@ant-design/icons';

const { Title } = Typography;

const ObjectStorageDetailModal = ({
  isVisible,
  onCancel,
  selectedStorage
}) => {
  const { t } = useTranslation();

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
        size="small" 
        style={styles.card}
        headStyle={styles.cardTitle}
        bodyStyle={{ padding: '8px' }}
        title={
          <span style={styles.cardTitle}>
            <DatabaseOutlined style={styles.icon} />
            {t('basicInfo')}
          </span>
        }
      >
        <Descriptions 
          column={2} 
          size="small"
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
        </Descriptions>
      </Card>

      <Card 
        size="small" 
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
          size="small"
          bordered
          style={styles.descriptions}
        >
          <Descriptions.Item label={t('accessKey')}>{selectedStorage?.accessKey}</Descriptions.Item>
          <Descriptions.Item label={t('secretKey')}>******</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card 
        size="small" 
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
          size="small"
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
        size="small" 
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
          size="small"
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
        size="small" 
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
          size="small"
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
        size="small" 
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
          size="small"
          bordered
          style={styles.descriptions}
        >
          <Descriptions.Item label={t('createTime')}>{selectedStorage?.createTime}</Descriptions.Item>
          <Descriptions.Item label={t('createBy')}>{selectedStorage?.createBy || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('updateTime')}>{selectedStorage?.updateTime}</Descriptions.Item>
          <Descriptions.Item label={t('updateBy')}>{selectedStorage?.updateBy || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('lastCheckedAt')}>{selectedStorage?.lastCheckedAt}</Descriptions.Item>
          <Descriptions.Item label={t('errorMessage')}>{selectedStorage?.errorMessage || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
};

export default ObjectStorageDetailModal; 