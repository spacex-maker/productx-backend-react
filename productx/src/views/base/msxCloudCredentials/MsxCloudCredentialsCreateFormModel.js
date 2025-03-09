import React from 'react';
import { Modal, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';

const MsxCloudCredentialsCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form,
  t,
  typeOptions,
  statusOptions,
}) => {
  return (
    <Modal
      title={t('addCredential')}
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
          initialValue={true}
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

MsxCloudCredentialsCreateFormModel.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  typeOptions: PropTypes.array.isRequired,
  statusOptions: PropTypes.array.isRequired,
};

export default MsxCloudCredentialsCreateFormModel;
