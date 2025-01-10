import React from 'react';
import { Modal, Form, Input, Row, Col, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const EditRegionModal = ({ visible, onCancel, onOk, initialValues, form }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={t('editRegion')}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onOk}
        layout="vertical"
        size="small"
        initialValues={initialValues}
      >
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label={t('name')}
              name="name"
              rules={[{ required: true, message: t('pleaseInputName') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('enName')}
              name="enName"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('localName')}
              name="localName"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label={t('shortName')}
              name="shortName"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('population')}
              name="population"
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={t('areaKm2')}
              name="areaKm2"
            >
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={t('capital')}
              name="capital"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t('region')}
              name="region"
            >
              <Input placeholder={t('regionPlaceholder')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditRegionModal;
