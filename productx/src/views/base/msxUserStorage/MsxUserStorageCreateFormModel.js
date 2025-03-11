import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import PropTypes from 'prop-types';

const MsxUserStorageCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
  nodeTypeOptions,
  statusOptions,
}) => {
  const cloudOptions = [
    { value: 'Tencent Cloud', label: 'Tencent Cloud' },
    { value: 'AWS', label: 'AWS' },
    { value: 'Aliyun', label: 'Aliyun' },
  ];

  const regionOptions = [
    { value: 'ap-nanjing', label: 'ap-nanjing' },
    { value: 'ap-beijing', label: 'ap-beijing' },
    { value: 'ap-shanghai', label: 'ap-shanghai' },
  ];

  return (
    <Modal
      title={t('addStorage')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={560}
      maskClosable={false}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label={t('userId')}
          name="userId"
          rules={[{ required: true, message: t('pleaseInputUserId') }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('pleaseInputUserId')}
            min={1}
          />
        </Form.Item>

        <Form.Item
          label={t('nodeName')}
          name="nodeName"
          rules={[{ required: true, message: t('pleaseInputNodeName') }]}
        >
          <Input placeholder={t('pleaseInputNodeName')} />
        </Form.Item>

        <Form.Item
          label={t('nodeCloud')}
          name="nodeCloud"
          rules={[{ required: true, message: t('pleaseSelectNodeCloud') }]}
        >
          <Select
            placeholder={t('pleaseSelectNodeCloud')}
            options={cloudOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('nodeType')}
          name="nodeType"
          rules={[{ required: true, message: t('pleaseSelectNodeType') }]}
          tooltip={t('nodeTypeTooltip')}
        >
          <Select
            placeholder={t('pleaseSelectNodeType')}
            options={nodeTypeOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('nodeRegion')}
          name="nodeRegion"
          rules={[{ required: true, message: t('pleaseSelectNodeRegion') }]}
        >
          <Select
            placeholder={t('pleaseSelectNodeRegion')}
            options={regionOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
          initialValue="ACTIVE"
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select
            placeholder={t('pleaseSelectStatus')}
            options={statusOptions}
          />
        </Form.Item>

        <Form.Item
          label={t('isDefault')}
          name="isDefault"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label={t('storageLimit')}
          name="storageLimit"
          rules={[{ required: true, message: t('pleaseInputStorageLimit') }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('pleaseInputStorageLimit')}
            min={0}
          />
        </Form.Item>

        <Form.Item
          label={t('bandwidthLimit')}
          name="bandwidthLimit"
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('pleaseInputBandwidthLimit')}
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

MsxUserStorageCreateFormModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  nodeTypeOptions: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default MsxUserStorageCreateFormModel;
