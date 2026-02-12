import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, Divider } from 'antd';

const formItemLayout = { labelCol: { span: 10 }, wrapperCol: { span: 14 } };

const UpdateCreemProductConfigModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateConfig,
  selectedConfig,
  t
}) => {
  const tokenInputProps = {
    style: { width: '100%' },
    min: 0,
    precision: 0,
    formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
    parser: (value) => value.replace(/,/g, ''),
  };

  useEffect(() => {
    if (isVisible && selectedConfig) {
      form.setFieldsValue({
        id: selectedConfig.id,
        productName: selectedConfig.productName,
        creemProductId: selectedConfig.creemProductId,
        coinType: selectedConfig.coinType || 'USD',
        amount: selectedConfig.amount,
        baseToken: selectedConfig.baseToken,
        bonusToken: selectedConfig.bonusToken,
        tag: selectedConfig.tag,
        status: selectedConfig.status,
        sortOrder: selectedConfig.sortOrder,
      });
    }
  }, [isVisible, selectedConfig, form]);

  return (
    <Modal
      title={t('editCreemProductConfig')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={680}
    >
      <Form form={form} onFinish={handleUpdateConfig} layout="horizontal">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              {...formItemLayout}
              label={t('productName')}
              name="productName"
              rules={[{ required: true, message: t('pleaseInputProductName') }]}
            >
              <Input placeholder={t('pleaseInputProductName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...formItemLayout}
              label={t('creemProductId')}
              name="creemProductId"
              rules={[{ required: true, message: t('pleaseInputCreemProductId') }]}
            >
              <Input placeholder={t('pleaseInputCreemProductId')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item {...formItemLayout} label={t('coinType')} name="coinType">
              <Select>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="CNY">CNY</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              {...formItemLayout}
              label={t('amount')}
              name="amount"
              rules={[{ required: true, message: t('pleaseInputAmount') }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                placeholder={t('pleaseInputAmount')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item {...formItemLayout} label={t('baseToken')} name="baseToken">
              <InputNumber {...tokenInputProps} placeholder={t('pleaseInputBaseToken')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label={t('bonusToken')} name="bonusToken">
              <InputNumber {...tokenInputProps} placeholder={t('pleaseInputBonusToken')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item {...formItemLayout} label={t('tag')} name="tag">
              <Input placeholder={t('pleaseInputTag')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item {...formItemLayout} label={t('status')} name="status">
              <Select>
                <Select.Option value="ACTIVE">{t('active')}</Select.Option>
                <Select.Option value="INACTIVE">{t('inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item {...formItemLayout} label={t('sortOrder')} name="sortOrder">
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={0}
                placeholder={t('pleaseInputSortOrder')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateCreemProductConfigModel;
