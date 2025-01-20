import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, DatePicker } from 'antd';

const UpdateOrderModal = ({
                            isVisible,
                            onCancel,
                            onOk,
                            form,
                            handleUpdateOrder,
                            selectedOrder // 用于传递选中的订单信息
                          }) => {
  // 当模态框打开时，设置表单字段的值
  useEffect(() => {
    if (isVisible && selectedOrder) {
      form.setFieldsValue({
        id: selectedOrder.id,
        userId: selectedOrder.userId,
        receiverName: selectedOrder.receiverName,
        phoneNum: selectedOrder.phoneNum,
        orderStatus: selectedOrder.orderStatus,
        paymentType: selectedOrder.paymentType,
        payTime: selectedOrder.payTime ? moment(selectedOrder.payTime) : null,
        totalAmount: selectedOrder.totalAmount,
        shippingMethod: selectedOrder.shippingMethod,
      });
    }
  }, [isVisible, selectedOrder, form]);

  return (
    <Modal
      title="修改订单信息"
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText="确认"
      cancelText="取消"
    >
      <Form form={form} onFinish={handleUpdateOrder}>
        {/* 隐藏ID字段 */}
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        {/* 用户ID */}
        <Form.Item
          label="用户ID"
          name="userId"
          rules={[{ required: true, message: '请输入用户ID' }]}
        >
          <Input placeholder="请输入用户ID" />
        </Form.Item>

        {/* 收货人 */}
        <Form.Item
          label="收货人"
          name="receiverName"
          rules={[{ required: true, message: '请输入收货人姓名' }]}
        >
          <Input placeholder="请输入收货人姓名" />
        </Form.Item>

        {/* 手机号 */}
        <Form.Item
          label="手机号"
          name="phoneNum"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>

        {/* 订单状态 */}
        <Form.Item
          label="订单状态"
          name="orderStatus"
          rules={[{ required: true, message: '请选择订单状态' }]}
        >
          <Input placeholder="请输入订单状态" />
        </Form.Item>

        {/* 支付方式 */}
        <Form.Item
          label="支付方式"
          name="paymentType"
          rules={[{ required: true, message: '请输入支付方式' }]}
        >
          <Input placeholder="请输入支付方式" />
        </Form.Item>

        {/* 支付时间 */}
        <Form.Item
          label="支付时间"
          name="payTime"
          rules={[{ required: true, message: '请选择支付时间' }]}
        >
          <DatePicker showTime placeholder="请选择支付时间" />
        </Form.Item>

        {/* 总金额 */}
        <Form.Item
          label="总金额"
          name="totalAmount"
          rules={[{ required: true, message: '请输入总金额' }]}
        >
          <Input placeholder="请输入总金额" />
        </Form.Item>

        {/* 配送方式 */}
        <Form.Item
          label="配送方式"
          name="shippingMethod"
          rules={[{ required: true, message: '请输入配送方式' }]}
        >
          <Input placeholder="请输入配送方式" />
        </Form.Item>

        {/* 订单启用状态 */}
        <Form.Item
          label="启用状态"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateOrderModal;
