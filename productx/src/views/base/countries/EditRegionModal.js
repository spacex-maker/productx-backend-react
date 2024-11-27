import React from 'react';
import { Modal, Form, Input, Row, Col, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';

const EditRegionModal = ({ visible, onCancel, onOk, initialValues, form }) => {
  const { t } = useTranslation();

  // 表单样式定义
  const formStyles = {
    label: {
      fontSize: '10px',
      color: '#000000',
      marginBottom: '2px'
    },
    input: {
      fontSize: '10px',
      height: '20px',
      color: '#000000 !important',
      backgroundColor: '#ffffff !important'
    },
    formItem: {
      marginBottom: '4px'
    },
    modalTitle: {
      fontSize: '10px',
      color: '#000000'
    }
  };

  return (
    <Modal
      title={<div style={formStyles.modalTitle}>修改行政区划</div>}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      width={600}
      style={{ fontSize: '10px' }}
      styles={{ padding: '8px' }}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onOk}
        layout="vertical"
        size="small"
        initialValues={initialValues}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>行政区划编码</span>}
              name="code"
              rules={[{ required: true, message: '请输入编码' }]}
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} placeholder="例如：CN-BJ" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>国家码</span>}
              name="countryCode"
              rules={[{ required: true, message: '请输入国家码' }]}
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} placeholder="例如：CN" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>类型</span>}
              name="type"
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} placeholder="国家/省/市/区等" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>行政区划名称</span>}
              name="name"
              rules={[{ required: true, message: '请输入名称' }]}
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>英文名称</span>}
              name="enName"
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>本地名称</span>}
              name="localName"
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>简称</span>}
              name="shortName"
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>人口</span>}
              name="population"
              style={formStyles.formItem}
            >
              <InputNumber style={{ ...formStyles.input, width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label={<span style={formStyles.label}>面积(km²)</span>}
              name="areaKm2"
              style={formStyles.formItem}
            >
              <InputNumber style={{ ...formStyles.input, width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<span style={formStyles.label}>省会/首府</span>}
              name="capital"
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={formStyles.label}>区域</span>}
              name="region"
              style={formStyles.formItem}
            >
              <Input style={formStyles.input} placeholder="华北/华南等" />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <style jsx>{`
        :global(.ant-modal-content) {
          * {
            font-size: 10px !important;
          }
        }

        :global(.ant-form) {
          * {
            font-size: 10px !important;
          }
        }

        :global(.ant-modal-footer) {
          padding: 4px 8px !important;
        }

        :global(.ant-modal-footer .ant-btn) {
          height: 20px !important;
          padding: 0 8px !important;
          font-size: 10px !important;
        }
      `}</style>
    </Modal>
  );
};

export default EditRegionModal;
