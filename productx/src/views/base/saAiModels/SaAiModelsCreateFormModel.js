import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';

const SaAiModelsCreateFormModal = ({
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
            const submitValues = {
              ...values,
              releaseYear: values.releaseYear ? values.releaseYear.format('YYYY-MM-DD') : null
            };
            onOk(submitValues);
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
          contextLength: 4096,
          outputLength: 4096
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="companyCode"
              label={t('companyCode')}
              rules={[{ required: true, message: t('pleaseInputCompanyCode') }]}
            >
              <Input placeholder={t('pleaseInputCompanyCode')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="companyId"
              label={t('companyId')}
              rules={[{ required: true, message: t('pleaseInputCompanyId') }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder={t('pleaseInputCompanyId')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="modelName"
              label={t('modelName')}
              rules={[{ required: true, message: t('pleaseInputModelName') }]}
            >
              <Input placeholder={t('pleaseInputModelName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="modelCode"
              label={t('modelCode')}
              rules={[{ required: true, message: t('pleaseInputModelCode') }]}
            >
              <Input placeholder={t('pleaseInputModelCode')} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="releaseYear"
              label={t('releaseYear')}
              rules={[{ required: true, message: t('pleaseSelectReleaseYear') }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label={t('status')}
              rules={[{ required: true, message: t('pleaseSelectStatus') }]}
            >
              <Select placeholder={t('pleaseSelectStatus')}>
                <Select.Option value={true}>{t('active')}</Select.Option>
                <Select.Option value={false}>{t('inactive')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="contextLength"
              label={t('contextLength')}
              rules={[{ required: true, message: t('pleaseInputContextLength') }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputContextLength')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="thoughtChainLength"
              label={t('thoughtChainLength')}
            >
              <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputThoughtChainLength')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="outputLength"
              label={t('outputLength')}
              rules={[{ required: true, message: t('pleaseInputOutputLength') }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} placeholder={t('pleaseInputOutputLength')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="apiBaseUrl"
          label={t('apiBaseUrl')}
          rules={[{ required: true, message: t('pleaseInputApiBaseUrl') }]}
        >
          <Input placeholder={t('pleaseInputApiBaseUrl')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('description')}
          rules={[{ required: true, message: t('pleaseInputDescription') }]}
        >
          <Input.TextArea rows={4} placeholder={t('pleaseInputDescription')} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SaAiModelsCreateFormModal;
