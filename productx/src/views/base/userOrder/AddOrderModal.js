import React from 'react';
import { Input, Modal, Form, Switch, DatePicker, Alert } from 'antd';
import api from 'src/axiosInstance';

const AddOrderModal = ({ isVisible, onCancel, onFinish, parentId }) => {
  const [form] = Form.useForm();

  const handleAddOrderOk = async () => {
    try {
      const values = await form.validateFields();

      const requestData = {
        userId: values.userId,
        receiverName: values.receiverName,
        phoneNum: values.phoneNum,
        orderStatus: values.orderStatus,
        paymentType: values.paymentType,
        payTime: values.payTime ? values.payTime.format('YYYY-MM-DD HH:mm:ss') : null, // 格式化日期时间
        totalAmount: values.totalAmount,
        shippingMethod: values.shippingMethod,
        status: values.status || true, // 默认启用状态
      };

      await api.post('/manage/orders/create', requestData); // 假设后端接口为 /manage/orders/create
      form.resetFields();
      onFinish(parentId); // 执行父级操作
      onCancel();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  return (
    <Modal
      title="新增订单"
      open={isVisible}
      onCancel={onCancel}
      onOk={handleAddOrderOk}
      okText="提交"
      cancelText="取消"
      centered
    >
      {/* 提示消息 */}
      <Alert
        message="新增订单时，请确保订单信息准确无误"
        type="warning"
        showIcon
        style={{ marginBottom: '16px' }}
      />

      <Form form={form} layout="vertical">
        {/* 用户ID */}
        <Form.Item
          name="userId"
          label="用户ID"
          rules={[{ required: true, message: '请输入用户ID' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="请输入用户ID" />
        </Form.Item>

        {/* 收货人 */}
        <Form.Item
          name="receiverName"
          label="收货人"
          rules={[{ required: true, message: '请输入收货人姓名' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="请输入收货人姓名" />
        </Form.Item>

        {/* 手机号 */}
        <Form.Item
          name="phoneNum"
          label="手机号"
          rules={[{ required: true, message: '请输入手机号' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        {/* 订单状态 */}
        <Form.Item
          name="orderStatus"
          label="订单状态"
          rules={[{ required: true, message: '请输入订单状态' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="请输入订单状态" />
        </Form.Item>

        {/* 支付方式 */}
        <Form.Item
          name="paymentType"
          label="支付方式"
          rules={[{ required: true, message: '请输入支付方式' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="请输入支付方式" />
        </Form.Item>

        {/* 支付时间 */}
        <Form.Item
          name="payTime"
          label="支付时间"
          rules={[{ required: true, message: '请选择支付时间' }]}
          style={{ marginBottom: '12px' }}
        >
          <DatePicker showTime placeholder="请选择支付时间" />
        </Form.Item>

        {/* 总金额 */}
        <Form.Item
          name="totalAmount"
          label="总金额"
          rules={[{ required: true, message: '请输入总金额' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="请输入总金额" />
        </Form.Item>

        {/* 配送方式 */}
        <Form.Item
          name="shippingMethod"
          label="配送方式"
          rules={[{ required: true, message: '请输入配送方式' }]}
          style={{ marginBottom: '12px' }}
        >
          <Input placeholder="请输入配送方式" />
        </Form.Item>

        {/* 订单启用状态 */}
        <Form.Item
          name="status"
          label="是否生效"
          valuePropName="checked"
          style={{ marginBottom: '12px' }}
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrderModal;
