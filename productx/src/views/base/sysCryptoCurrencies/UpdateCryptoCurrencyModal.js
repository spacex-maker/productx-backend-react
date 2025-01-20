import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateCryptoCurrencyModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateCurrency,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('updateCrypto')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      width={600}
    >
      <Form
        form={form}
        onFinish={handleUpdateCurrency}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Space direction="vertical" style={{ width: '100%' }} >
          <Form.Item
            label={t('cryptoName')}
            name="name"
            rules={[{ required: true, message: t('pleaseInputCryptoName') }]}
          >
            <Input placeholder={t('cryptoNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('cryptoSymbol')}
            name="symbol"
            rules={[{ required: true, message: t('pleaseInputCryptoSymbol') }]}
          >
            <Input placeholder={t('cryptoSymbolPlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('cryptoChineseName')}
            name="chineseName"
            rules={[{ required: true, message: t('pleaseInputCryptoChineseName') }]}
          >
            <Input placeholder={t('cryptoChineseNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('blockchainType')}
            name="blockchainType"
            rules={[{ required: true, message: t('pleaseSelectBlockchainType') }]}
          >
            <Select placeholder={t('blockchainTypePlaceholder')}>
              <Select.Option value="ETH">Ethereum</Select.Option>
              <Select.Option value="BSC">Binance Smart Chain</Select.Option>
              <Select.Option value="TRX">TRON</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t('transactionSpeed')}
            name="transactionSpeed"
            rules={[{ required: true, message: t('pleaseInputTransactionSpeed') }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              placeholder={t('transactionSpeedPlaceholder')}
              addonAfter="TPS"
            />
          </Form.Item>

          <Form.Item
            label={t('website')}
            name="website"
            rules={[
              { required: true, message: t('pleaseInputWebsite') },
              { type: 'url', message: t('invalidUrl') }
            ]}
          >
            <Input placeholder={t('websitePlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('whitepaper')}
            name="whitepaperUrl"
            rules={[
              { required: true, message: t('pleaseInputWhitepaper') },
              { type: 'url', message: t('invalidUrl') }
            ]}
          >
            <Input placeholder={t('whitepaperPlaceholder')} />
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
};

export default UpdateCryptoCurrencyModal;
