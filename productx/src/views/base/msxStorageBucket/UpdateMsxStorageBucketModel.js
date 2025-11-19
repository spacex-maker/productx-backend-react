import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import PropTypes from 'prop-types';

const UpdateMsxStorageBucketModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateBucket,
  selectedBucket,
  t,
}) => {
  useEffect(() => {
    if (selectedBucket && isVisible) {
      form.setFieldsValue({
        id: selectedBucket.id,
        status: selectedBucket.status ?? false,
        remark: selectedBucket.remark || '',
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
      width={520}
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
          label={t('status')}
          name="status"
          valuePropName="checked"
        >
          <Switch 
            checkedChildren={t('enabled')}
            unCheckedChildren={t('disabled')}
          />
        </Form.Item>

        <Form.Item
          label={t('remark')}
          name="remark"
        >
          <Input.TextArea 
            placeholder={t('pleaseInputRemark')}
            rows={4}
            showCount
            maxLength={500}
          />
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
};

export default UpdateMsxStorageBucketModel;
