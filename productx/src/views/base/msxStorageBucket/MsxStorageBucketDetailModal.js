import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag, Space, Spin, message, Button, Card, Row, Col, Statistic } from 'antd';
import { SyncOutlined, CloudOutlined, DatabaseOutlined, FileOutlined, CheckCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next';

const MsxStorageBucketDetailModal = ({
  isVisible,
  onCancel,
  bucketId,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    if (isVisible && bucketId) {
      fetchDetail();
    } else {
      setDetailData(null);
    }
  }, [isVisible, bucketId]);

  const fetchDetail = async () => {
    if (!bucketId) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/manage/storage-bucket/${bucketId}/detail-info`);
      setDetailData(response);
    } catch (error) {
      console.error('Failed to fetch bucket detail:', error);
      message.error(t('fetchDataFailed') || '获取详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!bucketId) return;
    
    setSyncing(true);
    try {
      await api.post(`/manage/storage-bucket/sync/${bucketId}`);
      message.success(t('syncSuccess') || '同步成功');
      // 同步成功后重新获取详情
      await fetchDetail();
    } catch (error) {
      console.error('Failed to sync bucket:', error);
      message.error(t('syncFailed') || '同步失败');
    } finally {
      setSyncing(false);
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (!bytes) return { value: 0, unit: 'B' };
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return { value: parseFloat(size.toFixed(2)), unit: units[unitIndex] };
  };

  // 获取存储类型标签
  const getStorageTypeLabel = (type) => {
    const typeMap = {
      'STANDARD': t('standardStorage'),
      'LOW_FREQ': t('lowFreqStorage'),
      'ARCHIVE': t('archiveStorage'),
    };
    return typeMap[type] || type;
  };

  return (
    <Modal
      title={
        <Space>
          <span>{t('bucketInfo') || '存储桶详情'}</span>
          {detailData && (
            <Tag color={detailData.status ? 'success' : 'warning'}>
              {detailData.status ? t('enabled') : t('disabled')}
            </Tag>
          )}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('close')}
        </Button>,
        <Button
          key="sync"
          type="primary"
          icon={<SyncOutlined />}
          loading={syncing}
          onClick={handleSync}
        >
          {t('sync') || '同步'}
        </Button>,
      ]}
      width={900}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        {detailData && (
          <div>
            {/* 统计卡片区域 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title={t('objectCount') || '对象数量'}
                    value={detailData.objectCount !== undefined ? detailData.objectCount : 0}
                    prefix={<FileOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                    suffix="个"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title={t('totalSize') || '总大小'}
                    value={formatFileSize(detailData.totalSize).value}
                    suffix={formatFileSize(detailData.totalSize).unit}
                    prefix={<DatabaseOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }}>
                      <CloudOutlined style={{ marginRight: '8px' }} />
                      {getStorageTypeLabel(detailData.storageType)}
                    </div>
                    <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)' }}>
                      {t('storageType') || '存储类型'}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* 详细信息区域 */}
            <Card title={t('basicInformation') || '基本信息'} style={{ marginBottom: 16 }}>
              <Descriptions bordered column={2}>
                <Descriptions.Item label={t('bucketName')} span={2}>
                  <Space>
                    <strong>{detailData.bucketName}</strong>
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label={t('provider')} span={2}>
                  <Space>
                    {detailData.providerIcon && (
                      <img 
                        src={detailData.providerIcon} 
                        alt={detailData.providerName || ''}
                        style={{ 
                          width: 24, 
                          height: 24, 
                          objectFit: 'contain',
                          verticalAlign: 'middle'
                        }}
                      />
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>
                      {detailData.providerName || detailData.providerId}
                    </span>
                  </Space>
                </Descriptions.Item>

                <Descriptions.Item label={t('regionName')}>
                  {detailData.regionName}
                </Descriptions.Item>

                <Descriptions.Item label={t('status')}>
                  <Tag 
                    color={detailData.status ? 'success' : 'warning'}
                    icon={detailData.status ? <CheckCircleOutlined /> : null}
                  >
                    {detailData.status ? t('enabled') : t('disabled')}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label={t('createTime')}>
                  {detailData.createTime}
                </Descriptions.Item>

                <Descriptions.Item label={t('remark')} span={2}>
                  {detailData.remark || '-'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        )}
      </Spin>
    </Modal>
  );
};

MsxStorageBucketDetailModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  bucketId: PropTypes.number,
};

export default MsxStorageBucketDetailModal;

