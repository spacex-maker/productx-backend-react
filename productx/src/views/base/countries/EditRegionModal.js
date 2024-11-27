import React from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';
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
      width={400}
      style={{ fontSize: '10px' }}
      styles={{ padding: '8px' }}
      destroyOnClose
    >
      <Form
        form={form}
        onFinish={onOk}
        layout="vertical"
        size="small"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              label={<span style={formStyles.label}>行政区划编码</span>}
              name="code"
              rules={[{ required: true, message: '请输入编码' }]}
              style={formStyles.formItem}
            >
              <Input
                style={formStyles.input}
                placeholder="例如：CN-BJ"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={formStyles.label}>国家码</span>}
              name="countryCode"
              rules={[{ required: true, message: '请输入国家码' }]}
              style={formStyles.formItem}
            >
              <Input
                style={formStyles.input}
                placeholder="例如：CN"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 其他表单项... */}
        {/* 复制原有的其他 Row 和 Form.Item */}

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
