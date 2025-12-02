import React from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';

const CreemProductConfigCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t
}) => {
  return (
    <Modal
      title={t('addCreemProductConfig')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={600}
    >
      <Form form={form} onFinish={onFinish} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
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
          initialValue="USD"
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
          initialValue={0}
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
          initialValue={0}
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
          initialValue="ACTIVE"
        >
          <Select>
            <Select.Option value="ACTIVE">{t('active')}</Select.Option>
            <Select.Option value="INACTIVE">{t('inactive')}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('sortOrder')}
          name="sortOrder"
          initialValue={0}
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

export default CreemProductConfigCreateFormModel;
