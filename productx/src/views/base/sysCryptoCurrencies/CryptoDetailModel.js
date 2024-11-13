import React, { useState, useEffect } from 'react';
import { Modal, Button, Descriptions, Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { Text } = Typography;

const CryptoDetailModal = ({
                             isVisible,
                             onCancel,
                             selectedCrypto,
                           }) => {
  const { t } = useTranslation();
  const [selectedCryptoDetail, setSelectedCryptoDetail] = useState(null);

  const textStyle = { fontSize: '12px' };

  useEffect(() => {
    const fetchCryptoDetail = async () => {
      if (isVisible && selectedCrypto && selectedCrypto.id) {
        try {
          const response = await api.get(`/manage/sys-crypto-currencies/detail?id=${selectedCrypto.id}`);
          if (response) {
            setSelectedCryptoDetail(response);
          } else {
            console.error('Failed to fetch crypto details, no data received');
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

  return (
    <Modal
      title={t('cryptoDetail')}
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} style={{ padding: '5px 10px' }}>
          {t('close')}
        </Button>,
      ]}
      width={800} // Adjusted width for better display
      style={{ zIndex: 1050 }}
      bodyStyle={{ padding: '10px 20px' }}
    >
      {selectedCryptoDetail ? (
        <div>
          <Space style={{ marginBottom: 10, width: '100%', justifyContent: 'space-between' }}>
            <img
              src={selectedCryptoDetail.logoUrl}
              alt={`${selectedCryptoDetail.name} logo`}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <Space direction="vertical" style={{ width: '70%' }}>
              <Text style={textStyle}><strong>{t('name')}：</strong> {selectedCryptoDetail.name}</Text>
              <Text style={textStyle}><strong>{t('chineseName')}：</strong> {selectedCryptoDetail.chineseName}</Text>
              <Text style={textStyle}><strong>{t('symbol')}：</strong> {selectedCryptoDetail.symbol}</Text>
            </Space>
          </Space>

          <Descriptions bordered size="small" column={1} style={{ fontSize: '12px', marginTop: 10 }}>
            {/* Description Section */}
            <Descriptions.Item label={t('description')}>
              <Text style={textStyle}>{selectedCryptoDetail.description || t('noDescription')}</Text>
            </Descriptions.Item>

            {/* Market Info Section */}
            <Descriptions.Item label={t('marketInfo')}>
              <Space direction="vertical" size={0}>
                <Text style={textStyle}><strong>{t('marketCap')}：</strong> ${selectedCryptoDetail.marketCap.toFixed(2)}</Text>
                <Text style={textStyle}><strong>{t('price')}：</strong> ${selectedCryptoDetail.price.toFixed(2)}</Text>
                <Text style={textStyle}><strong>{t('24hChange')}：</strong> {selectedCryptoDetail.value24hChange}%</Text>
                <Text style={textStyle}><strong>{t('24hHigh')}：</strong> ${selectedCryptoDetail.value24hHigh.toFixed(2)}</Text>
                <Text style={textStyle}><strong>{t('24hLow')}：</strong> ${selectedCryptoDetail.value24hLow.toFixed(2)}</Text>
              </Space>
            </Descriptions.Item>

            {/* Supply Info Section */}
            <Descriptions.Item label={t('supplyInfo')}>
              <Space direction="vertical" size={0}>
                <Text style={textStyle}><strong>{t('totalSupply')}：</strong> {selectedCryptoDetail.totalSupply.toFixed(0)}</Text>
                <Text style={textStyle}><strong>{t('circulatingSupply')}：</strong> {selectedCryptoDetail.circulatingSupply.toFixed(0)}</Text>
                <Text style={textStyle}><strong>{t('maxSupply')}：</strong> {selectedCryptoDetail.maxSupply.toFixed(0)}</Text>
              </Space>
            </Descriptions.Item>

            {/* Investor Info Section */}
            <Descriptions.Item label={t('investorInfo')}>
              <Space direction="vertical" size={0}>
                <Text style={textStyle}><strong>{t('totalInvestment')}：</strong> ${selectedCryptoDetail.totalInvestment.toFixed(2)}</Text>
                <Text style={textStyle}><strong>{t('fundingRound')}：</strong> {selectedCryptoDetail.fundingRound}</Text>
                <Text style={textStyle}><strong>{t('fundingDate')}：</strong> {selectedCryptoDetail.fundingDate}</Text>
                <Text style={textStyle}><strong>{t('investors')}：</strong> {JSON.parse(selectedCryptoDetail.investors).join(', ')}</Text>
              </Space>
            </Descriptions.Item>

            {/* Blockchain Info Section */}
            <Descriptions.Item label={t('blockchainInfo')}>
              <Space direction="vertical" size={0}>
                <Text style={textStyle}><strong>{t('blockchainType')}：</strong> {selectedCryptoDetail.blockchainType}</Text>
                <Text style={textStyle}><strong>{t('blockTime')}：</strong> {selectedCryptoDetail.blockTime} {t('seconds')}</Text>
                <Text style={textStyle}><strong>{t('transactionSpeed')}：</strong> {selectedCryptoDetail.transactionSpeed} {t('transactionsPerSecond')}</Text>
                <Text style={textStyle}><strong>{t('hashAlgorithm')}：</strong> {selectedCryptoDetail.hashAlgorithm}</Text>
              </Space>
            </Descriptions.Item>

            {/* Other Info Section */}
            <Descriptions.Item label={t('otherInfo')}>
              <Space direction="vertical" size={0}>
                <Text style={textStyle}><strong>{t('platform')}：</strong> {selectedCryptoDetail.platform}</Text>
                <Text style={textStyle}><strong>{t('website')}：</strong> <a href={selectedCryptoDetail.website} target="_blank" rel="noopener noreferrer">{selectedCryptoDetail.website}</a></Text>
                <Text style={textStyle}><strong>{t('whitepaper')}：</strong> <a href={selectedCryptoDetail.whitepaperUrl} target="_blank" rel="noopener noreferrer">{selectedCryptoDetail.whitepaperUrl}</a></Text>
                <Text style={textStyle}><strong>{t('socialLinks')}：</strong> {JSON.parse(selectedCryptoDetail.socialLinks)?.twitter && <a href={JSON.parse(selectedCryptoDetail.socialLinks).twitter} target="_blank" rel="noopener noreferrer">{t('twitter')}</a>}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <Text>{t('loadingDetails')}</Text>
      )}
    </Modal>
  );
};

export default CryptoDetailModal;
