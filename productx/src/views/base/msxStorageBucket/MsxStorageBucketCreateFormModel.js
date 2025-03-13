import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import PropTypes from 'prop-types';

const MsxStorageBucketCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
  storageTypeOptions,
  statusOptions,
}) => {
  return (
    <Modal
      title={t('addBucket')}
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={560}
      maskClosable={false}
    >
      <Form 
        form={form} 
        onFinish={onFinish}
        layout="vertical"
      >
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
          initialValue={true}
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

MsxStorageBucketCreateFormModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  storageTypeOptions: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default MsxStorageBucketCreateFormModel;
