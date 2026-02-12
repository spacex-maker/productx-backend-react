import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ImageUpload from 'src/components/common/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

const UpdateSysPaymentMethodsModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  form,
  selectedPaymentMethod,
}) => {
  const { t } = useTranslation();
  const [iconUrl, setIconUrl] = useState('');
  const METHOD_TYPES = [
    { value: 'gateway', label: t('methodTypeGateway') },
    { value: 'crypto', label: t('methodTypeCrypto') },
    { value: 'manual', label: t('methodTypeManual') },
    { value: 'giftcard', label: t('methodTypeGiftcard') },
  ];
  const STATUS_OPTIONS = [
    { value: 0, label: t('disabled') },
    { value: 1, label: t('enabled') },
    { value: 2, label: t('statusPendingConfig') },
  ];

  useEffect(() => {
    if (visible && selectedPaymentMethod) {
      const row = selectedPaymentMethod;
      setIconUrl(row.iconUrl || '');
      form.setFieldsValue({
        id: row.id,
        paymentMethodName: row.paymentMethodName,
        paymentMethodCode: row.paymentMethodCode,
        iconUrl: row.iconUrl,
        descriptionZh: row.descriptionZh,
        descriptionEn: row.descriptionEn,
        methodType: row.methodType || 'gateway',
        status: row.status !== undefined ? row.status : 1,
        sort: row.sort !== undefined ? row.sort : 99,
        currencySupport: row.currencySupport,
        feeRate: row.feeRate,
        feeFixed: row.feeFixed,
        feeCurrency: row.feeCurrency,
        minAmount: row.minAmount,
        maxAmount: row.maxAmount,
        dailyLimit: row.dailyLimit,
        badgeText: row.badgeText,
        configJson: row.configJson,
        remark: row.remark,
        isCredit: row.isCredit || false,
        isWallet: row.isWallet || false,
        isCrypto: row.isCrypto || false,
        supportSubscription: row.supportSubscription || false,
        supportRefund: row.supportRefund || false,
        supportAbandonedRecovery: row.supportAbandonedRecovery || false,
        supportManualReview: row.supportManualReview || false,
        isRecommend: row.isRecommend || false,
      });
    } else if (!visible) {
      setIconUrl('');
      form.resetFields();
    }
  }, [visible, selectedPaymentMethod, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const payload = {
        ...values,
        isCredit: values.isCredit || false,
        isWallet: values.isWallet || false,
        isCrypto: values.isCrypto || false,
        supportSubscription: values.supportSubscription || false,
        supportRefund: values.supportRefund || false,
        supportAbandonedRecovery: values.supportAbandonedRecovery || false,
        supportManualReview: values.supportManualReview || false,
        isRecommend: values.isRecommend || false,
      };
      onOk(payload);
    }).catch(() => {});
  };

  return (
    <Modal
      title={t('editPaymentMethod')}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={720}
      maskClosable={false}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Row gutter={16} align="top">
          <Col span={6}>
            <Form.Item label={t('paymentMethodIcon')} name="iconUrl">
              <ImageUpload
                imageUrl={iconUrl}
                onImageChange={(url) => {
                  setIconUrl(url);
                  form.setFieldsValue({ iconUrl: url });
                }}
                type="avatar"
                tipText={t('uploadIconTip')}
              />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item
              name="paymentMethodName"
              label={t('paymentMethodName')}
              rules={[{ required: true, message: t('pleaseInputPaymentMethodName') }]}
            >
              <Input placeholder={t('paymentMethodName')} maxLength={50} />
            </Form.Item>
            <Form.Item
              name="paymentMethodCode"
              label={t('paymentMethodCode')}
            >
              <Input placeholder={t('paymentMethodCodePlaceholder')} maxLength={50} disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="descriptionZh" label={t('chineseDescription')}>
              <TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="descriptionEn" label={t('englishDescription')}>
              <TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="methodType" label={t('methodType')}>
              <Select placeholder={t('methodType')}>
                {METHOD_TYPES.map((m) => (
                  <Option key={m.value} value={m.value}>{m.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="status" label={t('status')}>
              <Select placeholder={t('status')}>
                {STATUS_OPTIONS.map((s) => (
                  <Option key={s.value} value={s.value}>{s.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sort" label={t('sort')}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="currencySupport" label={t('currencySupport')}>
              <Input placeholder={t('currencySupportPlaceholder')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="feeRate" label={t('feeRate')}>
              <InputNumber min={0} max={1} step={0.0001} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="feeFixed" label={t('feeFixed')}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="minAmount" label={t('minAmount')}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="maxAmount" label={t('maxAmount')}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="dailyLimit" label={t('dailyLimit')}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="isCredit" label={t('isCredit')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="isWallet" label={t('isWallet')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="isCrypto" label={t('isCrypto')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="isRecommend" label={t('isRecommend')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="supportSubscription" label={t('supportSubscription')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="supportRefund" label={t('supportRefund')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="supportAbandonedRecovery" label={t('supportAbandonedRecovery')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="supportManualReview" label={t('supportManualReview')} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="badgeText" label={t('badgeText')}>
          <Input placeholder={t('badgeTextPlaceholderPayment')} maxLength={20} />
        </Form.Item>
        <Form.Item name="configJson" label={t('configJson')}>
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name="remark" label={t('remark')}>
          <Input maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSysPaymentMethodsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  confirmLoading: PropTypes.bool,
  form: PropTypes.object.isRequired,
  selectedPaymentMethod: PropTypes.object,
};

export default UpdateSysPaymentMethodsModal;
