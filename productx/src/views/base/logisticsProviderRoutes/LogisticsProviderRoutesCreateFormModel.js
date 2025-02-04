import React from 'react';
import { Modal, Form, Input, InputNumber, Switch, Card, Row, Col, Select } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const LogisticsProviderRoutesCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  return (
    <Modal
      title="新增物流路线"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="确认"
      cancelText="取消"
      width={800}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Card size="small" title="基本信息">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="providerId"
                label="提供商ID"
                rules={[{ required: true, message: '请输入提供商ID' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入提供商ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="routeId"
                label="路线ID"
                rules={[{ required: true, message: '请输入路线ID' }]}
              >
                <InputNumber style={{ width: '100%' }} placeholder="请输入路线ID" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" title="运输方式" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="airFreight"
                label="空运"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="seaFreight"
                label="海运"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="landFreight"
                label="陆运"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" title="追踪服务" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="airTrackingService"
                label="空运追踪"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="seaTrackingService"
                label="海运追踪"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="landTrackingService"
                label="陆运追踪"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" title="保险服务" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="airInsurance"
                label="空运保险"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="seaInsurance"
                label="海运保险"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="landInsurance"
                label="陆运保险"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" title="其他信息" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="estimatedCost"
                label="估算费用"
                rules={[{ required: true, message: '请输入估算费用' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  placeholder="请输入估算费用"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="serviceQuality"
                label="服务质量"
                rules={[{ required: true, message: '请选择服务质量' }]}
              >
                <Select placeholder="请选择服务质量">
                  <Option value="经济">经济</Option>
                  <Option value="标准">标准</Option>
                  <Option value="优先">优先</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="additionalInfo"
                label="附加信息"
              >
                <TextArea rows={4} placeholder="请输入附加信息" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
                initialValue={1}
              >
                <Select placeholder="请选择状态">
                  <Option value={0}>禁用</Option>
                  <Option value={1}>启用</Option>
                  <Option value={2}>内测中</Option>
                  <Option value={3}>暂停</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default LogisticsProviderRoutesCreateFormModel;
