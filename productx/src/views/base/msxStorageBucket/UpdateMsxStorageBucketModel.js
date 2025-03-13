import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import PropTypes from 'prop-types';

const UpdateMsxStorageBucketModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateBucket,
  selectedBucket,
  t,
  storageTypeOptions,
  statusOptions,
}) => {
  useEffect(() => {
    if (selectedBucket && isVisible) {
      form.setFieldsValue({
        id: selectedBucket.id,
        bucketName: selectedBucket.bucketName,
        providerId: selectedBucket.providerId,
        regionName: selectedBucket.regionName,
        storageType: selectedBucket.storageType,
        status: selectedBucket.status,
        remark: selectedBucket.remark,
      });
    }
  }, [selectedBucket, isVisible, form]);

  return (
    <Modal
      title={t('editBucket')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={560}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateBucket}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('bucketName')}
          name="bucketName"
          rules={[{ required: true, message: t('pleaseInputBucketName') }]}
        >
          <Input placeholder={t('pleaseInputBucketName')} />
        </Form.Item>

        <Form.Item
          label={t('providerId')}
          name="providerId"
          rules={[{ required: true, message: t('pleaseInputProviderId') }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={t('pleaseInputProviderId')}
            min={1}
          />
        </Form.Item>

        <Form.Item
          label={t('regionName')}
          name="regionName"
          rules={[{ required: true, message: t('pleaseInputRegionName') }]}
        >
          <Input placeholder={t('pleaseInputRegionName')} />
        </Form.Item>

        <Form.Item
          label={t('storageType')}
          name="storageType"
          rules={[{ required: true, message: t('pleaseSelectStorageType') }]}
        >
          <Select
            placeholder={t('pleaseSelectStorageType')}
            options={storageTypeOptions}
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
          label={t('remark')}
          name="remark"
        >
          <Input.TextArea placeholder={t('pleaseInputRemark')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateMsxStorageBucketModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateBucket: PropTypes.func.isRequired,
  selectedBucket: PropTypes.object,
  t: PropTypes.func.isRequired,
  storageTypeOptions: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default UpdateMsxStorageBucketModel;
