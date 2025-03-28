import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const SaAiAgentRoleCreateFormModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      title={t('addRole')}
      open={visible}
      width={800}
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
          status: true,
          sortOrder: 100,
          parentId: null
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t('roleName')}
              rules={[{ required: true, message: t('pleaseInputRoleName') }]}
            >
              <Input placeholder={t('pleaseInputRoleName')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label={t('category')}
              rules={[{ required: true, message: t('pleaseInputCategory') }]}
            >
              <Input placeholder={t('pleaseInputCategory')} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={t('description')}
          rules={[{ required: true, message: t('pleaseInputDescription') }]}
        >
          <Input.TextArea 
            rows={4} 
            placeholder={t('pleaseInputDescription')}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="parentId"
              label={t('parentId')}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                placeholder={t('pleaseInputParentId')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="sortOrder"
              label={t('sortOrder')}
              rules={[{ required: true, message: t('pleaseInputSortOrder') }]}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder={t('pleaseInputSortOrder')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
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
          <Col span={12}>
            <Form.Item
              name="icon"
              label={t('icon')}
            >
              <Input placeholder="icons/roles/example.png" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lang"
              label={t('lang')}
              rules={[{ required: true, message: t('pleaseSelectLang') }]}
            >
              <Select placeholder={t('pleaseSelectLang')}>
                <Select.Option value="zh">中文</Select.Option>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="ja">日本語</Select.Option>
                <Select.Option value="ko">한국어</Select.Option>
                <Select.Option value="fr">Français</Select.Option>
                <Select.Option value="de">Deutsch</Select.Option>
                <Select.Option value="es">Español</Select.Option>
                <Select.Option value="it">Italiano</Select.Option>
                <Select.Option value="ru">Русский</Select.Option>
                <Select.Option value="ar">العربية</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default SaAiAgentRoleCreateFormModal; 