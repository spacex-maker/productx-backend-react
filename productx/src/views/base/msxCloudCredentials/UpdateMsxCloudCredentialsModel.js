import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

const UpdateMsxCloudCredentialsModel = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateCredential,
  selectedCredential,
  t,
  typeOptions,
  statusOptions,
}) => {
  useEffect(() => {
    if (selectedCredential && isVisible) {
      form.setFieldsValue({
        id: selectedCredential.id,
        name: selectedCredential.name,
        accessKey: selectedCredential.accessKey,
        secretKey: selectedCredential.secretKey,
        type: selectedCredential.type,
        status: selectedCredential.status,
      });
    }
  }, [selectedCredential, isVisible, form]);

  return (
    <Modal
      title={t('editCredential')}
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
        onFinish={handleUpdateCredential}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={t('name')}
          name="name"
          rules={[{ required: true, message: t('pleaseInputName') }]}
        >
          <Input placeholder={t('pleaseInputName')} />
        </Form.Item>

        <Form.Item
          label={t('accessKey')}
          name="accessKey"
          rules={[{ required: true, message: t('pleaseInputAccessKey') }]}
        >
          <Input placeholder={t('pleaseInputAccessKey')} />
        </Form.Item>

        <Form.Item
          label={t('secretKey')}
          name="secretKey"
          rules={[{ required: true, message: t('pleaseInputSecretKey') }]}
        >
          <Input.Password placeholder={t('pleaseInputSecretKey')} />
        </Form.Item>

        <Form.Item
          label={t('type')}
          name="type"
          rules={[{ required: true, message: t('pleaseSelectType') }]}
        >
          <Select
            placeholder={t('pleaseSelectType')}
            options={typeOptions}
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
      </Form>
    </Modal>
  );
};

UpdateMsxCloudCredentialsModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleUpdateCredential: PropTypes.func.isRequired,
  selectedCredential: PropTypes.object,
  t: PropTypes.func.isRequired,
  typeOptions: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default UpdateMsxCloudCredentialsModel;
