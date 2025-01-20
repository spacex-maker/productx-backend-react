import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Typography, Space, Divider, Statistic, Spin, Card, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { ArrowUpOutlined, ArrowDownOutlined, LinkOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const { Text, Title } = Typography;

const CryptoDetailModal = ({
  isVisible,
  onCancel,
  selectedCrypto,
}) => {
  const { t } = useTranslation();
  const [selectedCryptoDetail, setSelectedCryptoDetail] = useState(null);

  useEffect(() => {
    const fetchCryptoDetail = async () => {
      if (isVisible && selectedCrypto?.id) {
        try {
          const response = await api.get(`/manage/sys-crypto-currencies/detail?id=${selectedCrypto.id}`);
          if (response) {
            setSelectedCryptoDetail(response);
          }
        } catch (error) {
          console.error('Failed to fetch crypto details', error);
        }
      } else {
        setSelectedCryptoDetail(null);
      }
    };

    fetchCryptoDetail();
  }, [isVisible, selectedCrypto]);

  const renderHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, padding: '8px 0' }}>
      <img
        src={selectedCryptoDetail.logoUrl}
        alt={selectedCryptoDetail.name}
        style={{
          width: 48,
          height: 48,
          marginRight: 16,
          borderRadius: 6,
          padding: 6,
          border: '1px solid #f0f0f0',
          background: '#fff'
        }}
      />
      <div>
        <Title level={5} style={{ marginBottom: 2 }}>
          {selectedCryptoDetail.name}
          <Text type="secondary" style={{ fontSize: 14, marginLeft: 8 }}>
            {selectedCryptoDetail.symbol}
          </Text>
          <Tag color={selectedCryptoDetail.status ? 'success' : 'default'} style={{ marginLeft: 8, fontSize: 12 }}>
            {selectedCryptoDetail.status ? t('enabled') : t('disabled')}
          </Tag>
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>{selectedCryptoDetail.chineseName}</Text>
      </div>
    </div>
  );

  const renderMarketStats = () => (
    <Card  style={{ marginBottom: 16 }}>
      <Space size={32} wrap>
        <Statistic
          title={t('price')}
          value={selectedCryptoDetail.price}
          precision={2}
          prefix="$"
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title={t('24hChange')}
          value={selectedCryptoDetail.value24hChange}
          precision={2}
          prefix={selectedCryptoDetail.value24hChange >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          suffix="%"
          valueStyle={{
            color: selectedCryptoDetail.value24hChange >= 0 ? '#3f8600' : '#cf1322',
            fontSize: 16
          }}
        />
        <Statistic
          title={t('marketCap')}
          value={selectedCryptoDetail.marketCap}
          precision={0}
          prefix="$"
          valueStyle={{ fontSize: 16 }}
        />
        <Statistic
          title={t('volume24h')}
          value={selectedCryptoDetail.volume24h}
          precision={0}
          prefix="$"
          valueStyle={{ fontSize: 16 }}
        />
      </Space>
    </Card>
  );

  return (
    <Modal
      title={null}
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="back"  onClick={onCancel}>
          {t('close')}
        </Button>,
      ]}
      width={700}
      bodyStyle={{ padding: '0 16px 16px' }}
    >
      {selectedCryptoDetail ? (
        <>
          {renderHeader()}
          {renderMarketStats()}

          <Card title={t('blockchainInfo')}  style={{ marginBottom: 12 }}>
            <Descriptions column={2} bordered  contentStyle={{ padding: '4px 8px' }} labelStyle={{ padding: '4px 8px' }}>
              <Descriptions.Item label={t('blockchainType')}>
                {selectedCryptoDetail.blockchainType}
              </Descriptions.Item>
              <Descriptions.Item label={t('transactionSpeed')}>
                {selectedCryptoDetail.transactionSpeed} TPS
              </Descriptions.Item>
              <Descriptions.Item label={t('hashAlgorithm')}>
                {selectedCryptoDetail.hashAlgorithm}
              </Descriptions.Item>
              <Descriptions.Item label={t('consensusMechanism')}>
                {selectedCryptoDetail.consensusMechanism}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={t('supplyInfo')}  style={{ marginBottom: 12 }}>
            <Descriptions column={2} bordered  contentStyle={{ padding: '4px 8px' }} labelStyle={{ padding: '4px 8px' }}>
              <Descriptions.Item label={t('totalSupply')}>
                {selectedCryptoDetail.totalSupply.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('circulatingSupply')}>
                {selectedCryptoDetail.circulatingSupply.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('maxSupply')}>
                {selectedCryptoDetail.maxSupply.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('marketRank')}>
                #{selectedCryptoDetail.marketRank}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title={t('links')} >
            <Space split={<Divider type="vertical" />} size={4}>
              {selectedCryptoDetail.website && (
                <a href={selectedCryptoDetail.website} target="_blank" rel="noopener noreferrer">
                  <Space size={4}>
                    <LinkOutlined />
                    {t('website')}
                  </Space>
                </a>
              )}
              {selectedCryptoDetail.whitepaperUrl && (
                <a href={selectedCryptoDetail.whitepaperUrl} target="_blank" rel="noopener noreferrer">
                  <Space size={4}>
                    <LinkOutlined />
                    {t('whitepaper')}
                  </Space>
                </a>
              )}
              {selectedCryptoDetail.socialLinks && JSON.parse(selectedCryptoDetail.socialLinks)?.twitter && (
                <a href={JSON.parse(selectedCryptoDetail.socialLinks).twitter} target="_blank" rel="noopener noreferrer">
                  <Space size={4}>
                    <LinkOutlined />
                    Twitter
                  </Space>
                </a>
              )}
            </Space>
          </Card>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <Spin />
          <div style={{ marginTop: 8 }}>{t('loadingDetails')}</div>
        </div>
      )}
    </Modal>
  );
};

export default CryptoDetailModal;
