import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';

const UpdateSaProjectModel = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  confirmLoading
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  return (
    <Modal
      title={t('editTitle')}
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk({ ...values, id: initialValues?.id });
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="userId"
          label={t('userId')}
          rules={[{ required: true, message: t('pleaseInputUserId') }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="name"
          label={t('projectName')}
          rules={[{ required: true, message: t('pleaseInputName') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('description')}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="visibility"
          label={t('visibility')}
          rules={[{ required: true, message: t('pleaseSelect') }]}
        >
          <Select>
            <Select.Option value="public">{t('public')}</Select.Option>
            <Select.Option value="private">{t('private')}</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label={t('status')}
          rules={[{ required: true, message: t('pleaseSelectStatus') }]}
        >
          <Select>
            <Select.Option value="active">{t('active')}</Select.Option>
            <Select.Option value="inactive">{t('inactive')}</Select.Option>
            <Select.Option value="archived">{t('archived')}</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSaProjectModel;
