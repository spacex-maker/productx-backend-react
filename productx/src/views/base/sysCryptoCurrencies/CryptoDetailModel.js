import React from 'react';
import { Modal, Button, Descriptions, Typography, Space } from 'antd';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation
import { formatDate } from 'src/components/common/Common'; // 可能需要你自定义的日期格式化函数

const { Text } = Typography;

const CryptoDetailModal = ({
                             isVisible,
                             onCancel,
                             selectedCrypto,
                           }) => {

  const { t } = useTranslation(); // 使用 useTranslation 获取 t 函数

  const textStyle = { fontSize: '10px' }; // 统一的文本样式

  return (
    <Modal
      title={t('cryptoDetail')} // 使用 t 函数进行翻译
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          {t('close')} {/* 使用 t 函数进行翻译 */}
        </Button>,
      ]}
      width={600} // 调整宽度以适应内容
      style={{ zIndex: 1050 }} // 设置较高的 z-index
    >
      {selectedCrypto && (
        <div>
          <Space style={{ marginBottom: 20, width: '100%', justifyContent: 'space-between' }}>
            <Space style={{ width: 30 }}>
              <img
                src={selectedCrypto.logoUrl}
                alt={`${selectedCrypto.name} logo`}
                style={{ width: '50px', height: '50px', borderRadius: '25%' }}
              />
            </Space>
            <Space direction="vertical" style={{ width: 300 }}>
              <Text style={textStyle}><strong>{t('name')}：</strong> {selectedCrypto.name}</Text>
              <Text style={textStyle}><strong>{t('chineseName')}：</strong> {selectedCrypto.chineseName}</Text>
              <Text style={textStyle}><strong>{t('symbol')}：</strong> {selectedCrypto.symbol}</Text>
              <Text style={textStyle}><strong>{t('type')}：</strong> {selectedCrypto.type}</Text>
            </Space>
          </Space>

          <Descriptions bordered size="small" column={1} style={{ fontSize: '14px' }}>
            <Descriptions.Item label={t('description')}>
              <Text style={textStyle}>{selectedCrypto.description}</Text>
            </Descriptions.Item>

            <Descriptions.Item label={t('marketInfo')}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={textStyle}><strong>{t('marketCap')}：</strong> {selectedCrypto.marketCap}</Text>
                <Text style={textStyle}><strong>{t('price')}：</strong> {selectedCrypto.price}</Text>
                <Text style={textStyle}><strong>{t('24hChange')}：</strong> {selectedCrypto.value24hChange}%</Text>
                <Text style={textStyle}><strong>{t('24hHigh')}：</strong> {selectedCrypto.value24hHigh}</Text>
                <Text style={textStyle}><strong>{t('24hLow')}：</strong> {selectedCrypto.value24hLow}</Text>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label={t('supplyInfo')}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={textStyle}><strong>{t('totalSupply')}：</strong> {selectedCrypto.totalSupply}</Text>
                <Text style={textStyle}><strong>{t('circulatingSupply')}：</strong> {selectedCrypto.circulatingSupply}</Text>
                <Text style={textStyle}><strong>{t('maxSupply')}：</strong> {selectedCrypto.maxSupply}</Text>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label={t('otherInfo')}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={textStyle}><strong>{t('platform')}：</strong> {selectedCrypto.platform}</Text>
                <Text style={textStyle}><strong>{t('website')}：</strong> <a href={selectedCrypto.website} target="_blank" rel="noopener noreferrer">{selectedCrypto.website}</a></Text>
                <Text style={textStyle}><strong>{t('whitepaperUrl')}：</strong> <a href={selectedCrypto.whitepaperUrl} target="_blank" rel="noopener noreferrer">{selectedCrypto.whitepaperUrl}</a></Text>
                <Text style={textStyle}><strong>{t('socialLinks')}：</strong> <a href={selectedCrypto.socialLinks.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></Text>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label={t('regulationInfo')}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={textStyle}><strong>{t('regulatedRegion')}：</strong> {selectedCrypto.regulatedRegion}</Text>
                <Text style={textStyle}><strong>{t('regulationStatus')}：</strong> {selectedCrypto.regulationStatus}</Text>
                <Text style={textStyle}><strong>{t('fundingRound')}：</strong> {selectedCrypto.fundingRound}</Text>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label={t('blockchainInfo')}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text style={textStyle}><strong>{t('blockchainType')}：</strong> {selectedCrypto.blockchainType}</Text>
                <Text style={textStyle}><strong>{t('hashAlgorithm')}：</strong> {selectedCrypto.hashAlgorithm}</Text>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
};

export default CryptoDetailModal;
