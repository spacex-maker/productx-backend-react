import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch } from 'antd';
import PropTypes from 'prop-types';

// 字节转GB
const bytesToGB = (bytes) => {
  if (!bytes || bytes === 0) return 0;
  return parseFloat((bytes / (1024 * 1024 * 1024)).toFixed(2));
};

const UpdateMsxUserStorageModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateStorage,
  selectedStorage,
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

  useEffect(() => {
    if (selectedStorage && isVisible) {
      form.setFieldsValue({
        id: selectedStorage.id,
        userId: selectedStorage.userId,
        nodeName: selectedStorage.nodeName,
        nodeCloud: selectedStorage.nodeCloud,
        nodeType: selectedStorage.nodeType,
        nodeRegion: selectedStorage.nodeRegion,
        status: selectedStorage.status,
        isDefault: selectedStorage.isDefault,
        storageLimit: bytesToGB(selectedStorage.storageLimit),
        bandwidthLimit: selectedStorage.bandwidthLimit,
      });
    }
  }, [selectedStorage, isVisible, form]);

  return (
    <Modal
      title={t('editStorage')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={560}
      maskClosable={false}
    >
      <Form form={form} onFinish={handleUpdateStorage} layout="vertical">
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('userId')}
          name="userId"
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('pleaseInputUserId')}
            min={1}
            disabled
          />
        </Form.Item>

        <Form.Item
          label={t('nodeName')}
          name="nodeName"
        >
          <Input placeholder={t('pleaseInputNodeName')} disabled />
        </Form.Item>

        <Form.Item
          label={t('nodeCloud')}
          name="nodeCloud"
        >
          <Select
            placeholder={t('pleaseSelectNodeCloud')}
            options={cloudOptions}
            disabled
          />
        </Form.Item>

        <Form.Item
          label={t('nodeType')}
          name="nodeType"
          tooltip={t('nodeTypeTooltip')}
        >
          <Select
            placeholder={t('pleaseSelectNodeType')}
            options={nodeTypeOptions}
            disabled
          />
        </Form.Item>

        <Form.Item
          label={t('nodeRegion')}
          name="nodeRegion"
        >
          <Select
            placeholder={t('pleaseSelectNodeRegion')}
            options={regionOptions}
            disabled
          />
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="status"
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
            precision={2}
            addonAfter="GB"
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

UpdateMsxUserStorageModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateStorage: PropTypes.func.isRequired,
  selectedStorage: PropTypes.object,
  t: PropTypes.func.isRequired,
  nodeTypeOptions: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default UpdateMsxUserStorageModel;
