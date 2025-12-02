import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const UpdateCreemProductConfigModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateConfig,
  selectedConfig,
  t
}) => {
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
      width={600}
    >
      <Form form={form} onFinish={handleUpdateConfig} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('productName')}
          name="productName"
          rules={[{ required: true, message: t('pleaseInputProductName') }]}
        >
          <Input placeholder={t('pleaseInputProductName')} />
        </Form.Item>

        <Form.Item
          label={t('creemProductId')}
          name="creemProductId"
          rules={[{ required: true, message: t('pleaseInputCreemProductId') }]}
        >
          <Input placeholder={t('pleaseInputCreemProductId')} />
        </Form.Item>

        <Form.Item
          label={t('coinType')}
          name="coinType"
        >
          <Select>
            <Select.Option value="USD">USD</Select.Option>
            <Select.Option value="CNY">CNY</Select.Option>
            <Select.Option value="EUR">EUR</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
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

        <Form.Item
          label={t('baseToken')}
          name="baseToken"
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            placeholder={t('pleaseInputBaseToken')}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/,/g, '')}
          />
        </Form.Item>

        <Form.Item
          label={t('bonusToken')}
          name="bonusToken"
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            placeholder={t('pleaseInputBonusToken')}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/,/g, '')}
          />
        </Form.Item>

        <Form.Item
          label={t('tag')}
          name="tag"
        >
          <Input placeholder={t('pleaseInputTag')} />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
        >
          <Select>
            <Select.Option value="ACTIVE">{t('active')}</Select.Option>
            <Select.Option value="INACTIVE">{t('inactive')}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('sortOrder')}
          name="sortOrder"
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={0}
            placeholder={t('pleaseInputSortOrder')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCreemProductConfigModel;
