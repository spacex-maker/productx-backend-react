import React from 'react';
import { Modal, Space, Tag, Typography, theme } from 'antd';
import PropTypes from 'prop-types';

const { Text } = Typography;

const MsxCloudProviderRegionsDetailModal = ({
  isVisible,
  onCancel,
  region,
  countries,
  providers,
  t,
}) => {
  const { token } = theme.useToken();

  if (!region) {
    return null;
  }

  const getCountryInfo = (countryCode) => {
    const country = countries.find((c) => c.code === countryCode);
    if (!country) return { name: countryCode, flagImageUrl: '' };
    return country;
  };

  const getProviderInfo = (providerId) => {
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return { providerName: `ID: ${providerId}`, iconImg: '' };
    return provider;
  };

  const countryInfo = region.countryCode ? getCountryInfo(region.countryCode) : null;
  const providerInfo = region.providerId ? getProviderInfo(region.providerId) : null;
  const gridColumnsCount = 6;
  const gridTemplate = '120px 1fr 120px 1fr 120px 1fr';
  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: gridTemplate,
    border: `1px solid ${token.colorSplit}`,
    borderRadius: 12,
    overflow: 'hidden',
    background: token.colorBgContainer,
  };

  const renderStatusTag = () => {
    if (!region.status) return '-';
    return region.status === 'ACTIVE' ? (
      <Tag color="success">{t('active')}</Tag>
    ) : (
      <Tag color="warning">{t('inactive')}</Tag>
    );
  };

  const createPair = (key, label, value) => ([
    { type: 'label', key: `${key}-label`, content: label },
    { type: 'value', key: `${key}-value`, content: value },
  ]);

  const mainGridItems = [
    ...createPair('provider', t('provider'), providerInfo ? (
      <Space align="center">
        {providerInfo.iconImg && (
          <img
            src={providerInfo.iconImg}
            alt={providerInfo.providerName}
            style={{
              width: 36,
              height: 36,
              objectFit: 'contain',
              borderRadius: 8,
              background: token.colorBgBase,
              padding: 6,
              border: `1px solid ${token.colorSplit}`,
            }}
          />
        )}
        <span>{providerInfo.providerName}</span>
      </Space>
    ) : '-'),
    ...createPair('country', t('country'), countryInfo ? (
      <Space align="center">
        {countryInfo.flagImageUrl && (
          <img
            src={countryInfo.flagImageUrl}
            alt={countryInfo.name}
            style={{
              width: 32,
              height: 22,
              objectFit: 'cover',
              borderRadius: 4,
              border: `1px solid ${token.colorSplit}`,
            }}
          />
        )}
        <span>{countryInfo.name} ({countryInfo.code})</span>
      </Space>
    ) : '-'),
    ...createPair('id', 'ID', region.id || '-'),
    ...createPair('regionCode', t('regionCode'), region.regionCode || '-'),
    ...createPair('regionName', t('regionName'), region.regionName || '-'),
    ...createPair('pingEndpoint', t('pingEndpoint'), (
      <Text ellipsis={{ tooltip: region.pingEndpoint }}>
        {region.pingEndpoint || '-'}
      </Text>
    )),
    ...createPair('status', t('status'), renderStatusTag()),
  ];

  while (mainGridItems.length % gridColumnsCount !== 0) {
    mainGridItems.push({ type: 'value', key: `placeholder-${mainGridItems.length}`, content: '' });
  }

  const metaGridItems = [
    ...createPair('createdAt', t('createTime'), region.createTime || '-'),
    ...createPair('updatedAt', t('updateTime'), region.updateTime || '-'),
    ...createPair('remark', t('remark'), <div style={{ whiteSpace: 'pre-wrap' }}>{region.remark || '-'}</div>),
  ];

  while (metaGridItems.length % gridColumnsCount !== 0) {
    metaGridItems.push({ type: 'value', key: `meta-placeholder-${metaGridItems.length}`, content: '' });
  }

  const renderGrid = (items, keyPrefix) => {
    const totalRows = Math.ceil(items.length / gridColumnsCount);
    return (
      <div style={gridContainerStyle}>
        {items.map((item, index) => {
          const row = Math.floor(index / gridColumnsCount);
          const isLastRow = row === totalRows - 1;
          const isLabel = item.type === 'label';
          const isLastCol = (index + 1) % gridColumnsCount === 0;
          return (
            <div
              key={`${keyPrefix}-${item.key}`}
              style={{
                padding: '14px 16px',
                borderRight: isLastCol ? 'none' : `1px solid ${token.colorSplit}`,
                borderBottom: isLastRow ? 'none' : `1px solid ${token.colorSplit}`,
                background: isLabel ? token.colorFillSecondary : token.colorBgContainer,
                color: isLabel ? token.colorTextSecondary : token.colorText,
                fontWeight: isLabel ? 600 : 400,
                display: 'flex',
                alignItems: isLabel ? 'center' : 'flex-start',
                minHeight: 60,
              }}
            >
              {item.content}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Modal
      title={t('detail')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={720}
      maskClosable={false}
    >
      {renderGrid(mainGridItems, 'main')}
      <div style={{ height: 16 }} />
      {renderGrid(metaGridItems, 'meta')}
    </Modal>
  );
};

MsxCloudProviderRegionsDetailModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  region: PropTypes.object,
  countries: PropTypes.array.isRequired,
  providers: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default MsxCloudProviderRegionsDetailModal;


