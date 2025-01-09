import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Space, DatePicker, Switch, Tabs, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;
const { TabPane } = Tabs;

const CryptoCurrencyCreateFormModal = ({
  isVisible,
  onCancel,
  onFinish,
  form,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('createCrypto')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={800}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Tabs>
          <TabPane tab={t('basicInfo')} key="1">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t('cryptoName')}
                  name="name"
                  rules={[{ required: true, message: t('pleaseInputCryptoName') }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('cryptoSymbol')}
                  name="symbol"
                  rules={[{ required: true, message: t('pleaseInputCryptoSymbol') }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t('cryptoChineseName')}
              name="chineseName"
              rules={[{ required: true, message: t('pleaseInputCryptoChineseName') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('description')}
              name="description"
            >
              <TextArea rows={4} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t('assetCategory')}
                  name="assetCategory"
                >
                  <Select>
                    <Select.Option value="CURRENCY">{t('currency')}</Select.Option>
                    <Select.Option value="TOKEN">{t('token')}</Select.Option>
                    <Select.Option value="NFT">{t('nft')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('targetUseCase')}
                  name="targetUseCase"
                >
                  <Select>
                    <Select.Option value="PAYMENT">{t('payment')}</Select.Option>
                    <Select.Option value="DEFI">{t('defi')}</Select.Option>
                    <Select.Option value="GAMING">{t('gaming')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={t('technicalInfo')} key="2">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t('blockchainType')}
                  name="blockchainType"
                  rules={[{ required: true, message: t('pleaseSelectBlockchainType') }]}
                >
                  <Select>
                    <Select.Option value="ETH">{t('ethereum')}</Select.Option>
                    <Select.Option value="BSC">{t('binanceSmartChain')}</Select.Option>
                    <Select.Option value="TRX">{t('tron')}</Select.Option>
                    <Select.Option value="SOL">{t('solana')}</Select.Option>
                    <Select.Option value="MATIC">{t('polygon')}</Select.Option>
                    <Select.Option value="AVAX">{t('avalanche')}</Select.Option>
                    <Select.Option value="ADA">{t('cardano')}</Select.Option>
                    <Select.Option value="DOT">{t('polkadot')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('contractAddress')}
                  name="contractAddress"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t('transactionSpeed')}
                  name="transactionSpeed"
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    min={1}
                    addonAfter="TPS"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('hashAlgorithm')}
                  name="hashAlgorithm"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t('protocolVersion')}
                  name="protocolVersion"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('smartContractEnabled')}
                  name="smartContractEnabled"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab={t('marketInfo')} key="3">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t('totalSupply')}
                  name="totalSupply"
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('maxSupply')}
                  name="maxSupply"
                >
                  <InputNumber style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t('fundingRound')}
                  name="fundingRound"
                >
                  <Select>
                    <Select.Option value="SEED">{t('seedRound')}</Select.Option>
                    <Select.Option value="PRIVATE">{t('privateRound')}</Select.Option>
                    <Select.Option value="PUBLIC">{t('publicRound')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('fundingDate')}
                  name="fundingDate"
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t('investors')}
              name="investors"
            >
              <TextArea rows={2} />
            </Form.Item>
          </TabPane>

          <TabPane tab={t('links')} key="4">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t('website')}
                  name="website"
                  rules={[{ type: 'url', message: t('invalidUrl') }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t('whitepaper')}
                  name="whitepaperUrl"
                  rules={[{ type: 'url', message: t('invalidUrl') }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t('logoUrl')}
              name="logoUrl"
              rules={[{ type: 'url', message: t('invalidUrl') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={t('socialLinks')}
              name="socialLinks"
            >
              <TextArea rows={3} />
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  );
};

export default CryptoCurrencyCreateFormModal;
