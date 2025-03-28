import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const UpdateSaAiCompaniesModel = ({
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
      // 转换日期格式
      const values = {
        ...initialValues,
        foundedYear: initialValues.foundedYear ? moment(initialValues.foundedYear) : null
      };
      form.setFieldsValue(values);
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
            // 转换日期格式
            if (values.foundedYear) {
              values.foundedYear = values.foundedYear.format('YYYY-MM-DD');
            }
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
          name="companyCode"
          label={t('companyCode')}
          rules={[{ required: true, message: t('inputCompanyCode') }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="companyName"
          label={t('companyName')}
          rules={[{ required: true, message: t('inputCompanyName') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="headquarters"
          label={t('headquarters')}
          rules={[{ required: true, message: t('inputHeadquarters') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="defaultModel"
          label={t('defaultModel')}
          rules={[{ required: true, message: t('inputDefaultModel') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="foundedYear"
          label={t('foundedYear')}
          rules={[{ required: true, message: t('inputFoundedYear') }]}
        >
          <DatePicker picker="date" />
        </Form.Item>
        <Form.Item
          name="apiUrl"
          label={t('apiUrl')}
          rules={[{ required: true, message: t('inputApiUrl') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="websiteUrl"
          label={t('websiteUrl')}
          rules={[{ required: true, message: t('inputWebsiteUrl') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('description')}
          rules={[{ required: true, message: t('inputDescription') }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="logoPath"
          label={t('logoPath')}
          rules={[{ required: true, message: t('inputLogoPath') }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateSaAiCompaniesModel;
