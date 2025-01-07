import React from 'react'
import { Modal, Form, Input, Switch } from 'antd'
import { useTranslation } from 'react-i18next'

const UpdateLanguageModal = ({
  visible,
  onCancel,
  onOk,
  initialValues,
  confirmLoading
}) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()

  return (
    <Modal
      title={t('editTitle')}
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            onOk(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        initialValues={initialValues}
        layout="vertical"
      >
        <Form.Item
          name="languageCode"
          label={t('languageCode')}
          rules={[{ required: true, message: t('inputLanguageCode') }]}
        >
          <Input disabled />
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
      </Form>
    </Modal>
  )
}

export default UpdateLanguageModal
