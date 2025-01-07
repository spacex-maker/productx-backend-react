import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const SysLanguageCreateFormModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      title={t('addTitle')}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk(values);
            form.resetFields();
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
        initialValues={{
          isDeveloped: false,
          status: true
        }}
      >
        <Form.Item
          name="languageCode"
          label={t('languageCode')}
          rules={[{ required: true, message: t('inputLanguageCode') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="languageNameEn"
          label={t('englishName')}
          rules={[{ required: true, message: t('inputEnglishName') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="languageNameZh"
          label={t('chineseName')}
          rules={[{ required: true, message: t('inputChineseName') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="languageNameNative"
          label={t('nativeName')}
          rules={[{ required: true, message: t('inputNativeName') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="isDeveloped"
          label={t('developmentStatus')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="status"
          label={t('enableStatus')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SysLanguageCreateFormModal;
