import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox } from 'antd';

const { Option } = Select;

const UpdateQtsSupportedExchangesModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  handleUpdateExchange,
  selectedExchange,
}) => {
  useEffect(() => {
    if (isVisible && selectedExchange) {
      // 处理features字段，将JSON字符串转换为对象
      const formData = {
        ...selectedExchange,
        features: selectedExchange.features ? JSON.parse(selectedExchange.features) : {}
      };
      
      // 将features对象转换为checkbox需要的数组格式
      const features = Object.entries(formData.features)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
      
      form.setFieldsValue({
        ...formData,
        features
      });
    }
  }, [isVisible, selectedExchange, form]);

  return (
    <Modal
      title="修改交易所"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
      width={800}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateExchange}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="交易所名称"
          name="exchangeName"
          rules={[{ required: true, message: '请输入交易所名称' }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="API地址"
          name="apiUrl"
          rules={[{ required: true, message: '请输入API地址' }]}
        >
          <Input placeholder="请输入API地址" />
        </Form.Item>

        <Form.Item
          label="API Key"
          name="apiKey"
        >
          <Input placeholder="请输入API Key" />
        </Form.Item>

        <Form.Item
          label="API Secret"
          name="apiSecret"
        >
          <Input.Password placeholder="请输入API Secret" />
        </Form.Item>

        <Form.Item
          label="API Passphrase"
          name="apiPassphrase"
        >
          <Input.Password placeholder="请输入API Passphrase" />
        </Form.Item>

        <Form.Item
          label="描述信息"
          name="info"
          rules={[{ required: true, message: '请输入描述信息' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入描述信息" />
        </Form.Item>

        <Form.Item
          label="支持功能"
          name="features"
        >
          <Checkbox.Group>
            <Checkbox value="spot">现货</Checkbox>
            <Checkbox value="margin">杠杆</Checkbox>
            <Checkbox value="futures">期货</Checkbox>
            <Checkbox value="options">期权</Checkbox>
            <Checkbox value="swap">永续</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            <Option value={true}>启用</Option>
            <Option value={false}>禁用</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateQtsSupportedExchangesModal;
