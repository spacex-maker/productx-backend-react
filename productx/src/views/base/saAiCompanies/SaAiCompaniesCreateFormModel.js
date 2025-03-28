import React from 'react';
import { Modal, Form, Input, Switch, DatePicker, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const SaAiCompaniesCreateFormModal = ({
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
      width={800}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            // 转换日期格式
            if (values.foundedYear) {
              values.foundedYear = values.foundedYear.format('YYYY-MM-DD');
            }
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
          status: true,
          foundedYear: moment('2000-01-01')
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="companyCode"
              label={t('companyCode')}
              rules={[{ required: true, message: t('inputCompanyCode') }]}
            >
              <Input placeholder={t('inputCompanyCode')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="companyName"
              label={t('companyName')}
              rules={[{ required: true, message: t('inputCompanyName') }]}
            >
              <Input placeholder={t('inputCompanyName')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="headquarters"
              label={t('headquarters')}
              rules={[{ required: true, message: t('inputHeadquarters') }]}
            >
              <Input placeholder={t('inputHeadquarters')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="defaultModel"
              label={t('defaultModel')}
              rules={[{ required: true, message: t('inputDefaultModel') }]}
            >
              <Input placeholder={t('inputDefaultModel')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="foundedYear"
              label={t('foundedYear')}
              rules={[{ required: true, message: t('inputFoundedYear') }]}
            >
              <DatePicker 
                picker="date" 
                style={{ width: '100%' }}
                placeholder={t('inputFoundedYear')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label={t('enableStatus')}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="apiUrl"
              label={t('apiUrl')}
              rules={[{ required: true, message: t('inputApiUrl') }]}
            >
              <Input placeholder={t('inputApiUrl')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="websiteUrl"
              label={t('websiteUrl')}
              rules={[{ required: true, message: t('inputWebsiteUrl') }]}
            >
              <Input placeholder={t('inputWebsiteUrl')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={t('description')}
          rules={[{ required: true, message: t('inputDescription') }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder={t('inputDescription')}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          name="logoPath"
          label={t('logoPath')}
          rules={[{ required: true, message: t('inputLogoPath') }]}
        >
          <div>
            <Input 
              placeholder={t('inputLogoPath')} 
              onChange={(e) => {
                const value = e.target.value;
                form.setFieldsValue({ logoPath: value });
              }}
            />
            {form.getFieldValue('logoPath') && (
              <div style={{ marginTop: 8 }}>
                <img 
                  src={form.getFieldValue('logoPath')} 
                  alt="logo"
                  style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaAiCompaniesCreateFormModal;
