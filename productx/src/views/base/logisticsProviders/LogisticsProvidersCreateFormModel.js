import React from 'react';
import { Modal, Form, Input, InputNumber, Select, Switch, Space, Card, Row, Col, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const LogisticsProvidersCreateFormModel = ({
  isVisible,
  onCancel,
  onFinish,
  form
}) => {
  return (
    <Modal
      title="新增物流提供商"
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
                name="providerName"
                label="提供商名称"
                rules={[{ required: true, message: '请输入提供商名称' }]}
              >
                <Input placeholder="请输入提供商名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="headquarters"
                label="总部所在地"
                rules={[{ required: true, message: '请输入总部所在地' }]}
              >
                <Input placeholder="请输入总部所在地" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="establishedYear"
                label="成立年份"
                rules={[{ required: true, message: '请选择成立年份' }]}
              >
                <DatePicker 
                  picker="year" 
                  style={{ width: '100%' }}
                  placeholder="请选择成立年份"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="评分"
                rules={[{ required: true, message: '请输入评分' }]}
              >
                <InputNumber
                  min={0}
                  max={5}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="请输入评分(0-5)"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" title="联系方式" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="电子邮箱"
                rules={[
                  { required: true, message: '请输入电子邮箱' },
                  { type: 'email', message: '请输入有效的电子邮箱' }
                ]}
              >
                <Input placeholder="请输入电子邮箱" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="website"
                label="官方网站"
                rules={[
                  { required: true, message: '请输入官方网站' },
                  { type: 'url', message: '请输入有效的网址' }
                ]}
              >
                <Input placeholder="请输入官方网站" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" title="认证信息" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="certifications"
                label="认证资质"
                rules={[{ required: true, message: '请输入认证资质' }]}
              >
                <TextArea rows={4} placeholder="请输入认证资质" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastAuditDate"
                label="最近审核日期"
                rules={[{ required: true, message: '请选择最近审核日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="请选择最近审核日期"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card size="small" title="其他信息" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="运营状态"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="运营中" unCheckedChildren="未运营" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default LogisticsProvidersCreateFormModel;
