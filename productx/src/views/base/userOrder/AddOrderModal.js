import React from 'react';
import { Input, Modal, Form, Switch, DatePicker, Alert, Row, Col, Select, InputNumber } from 'antd';
import api from 'src/axiosInstance';
import { useTranslation } from "react-i18next";

const AddOrderModal = ({ isVisible, onCancel, onFinish, parentId }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const handleAddOrderOk = async () => {
    try {
      const values = await form.validateFields();

      const requestData = {
        userId: values.userId,
        receiverName: values.receiverName,
        phoneNum: values.phoneNum,
        orderStatus: values.orderStatus,
        paymentType: values.paymentType,
        payTime: values.payTime ? values.payTime.format('YYYY-MM-DD HH:mm:ss') : null,
        totalAmount: values.totalAmount,
        shippingMethod: values.shippingMethod,
        deliveryAddress: values.deliveryAddress,
        status: values.status || true,
      };

      await api.post('/manage/orders/create', requestData);
      form.resetFields();
      onFinish(parentId);
      onCancel();
    } catch (error) {
      console.error(t('errorAddingOrder'), error);
    }
  };

  const formItemStyle = {
    marginBottom: '6px',
    fontSize: '11px',
  };

  const inputStyle = {
    fontSize: '11px',
    height: '24px',
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#666',
  };

  return (
    <Modal
      title={t("addNewOrder")}
      open={isVisible}
      onCancel={onCancel}
      onOk={handleAddOrderOk}
      okText={t("submit")}
      cancelText={t("cancel")}
      width={560}
      styles={{ padding: '10px' }}
    >
      <Alert
        message={t("orderInfoWarning")}
        type="warning"
        showIcon
        style={{ marginBottom: '10px', padding: '3px 8px', fontSize: '11px' }}
      />

      <Form
        form={form}
        layout="vertical"
        colon={false}
        style={{ fontSize: '11px' }}
      >
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name="userId"
              label={<span style={labelStyle}>{t("userId")}</span>}
              rules={[{ required: true, message: t("enterUserId") }]}
              style={formItemStyle}
            >
              <Input
                placeholder={t("enterUserId")}
                size="small"
                style={inputStyle}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="receiverName"
              label={<span style={labelStyle}>{t("receiverName")}</span>}
              rules={[{ required: true, message: t("enterReceiverName") }]}
              style={formItemStyle}
            >
              <Input
                placeholder={t("enterReceiverName")}
                size="small"
                style={inputStyle}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name="phoneNum"
              label={<span style={labelStyle}>{t("phoneNumber")}</span>}
              rules={[{ required: true, message: t("enterPhoneNumber") }]}
              style={formItemStyle}
            >
              <Input
                placeholder={t("enterPhoneNumber")}
                size="small"
                style={inputStyle}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="orderStatus"
              label={<span style={labelStyle}>{t("orderStatus")}</span>}
              rules={[{ required: true, message: t("selectOrderStatus") }]}
              style={formItemStyle}
            >
              <Select
                placeholder={t("selectOrderStatus")}
                size="small"
                style={{ ...inputStyle, width: '100%' }}
                dropdownStyle={{ fontSize: '11px' }}
              >
                <Select.Option value="PENDING">{t("pending")}</Select.Option>
                <Select.Option value="PAID">{t("paid")}</Select.Option>
                <Select.Option value="SHIPPED">{t("shipped")}</Select.Option>
                <Select.Option value="ARRIVED">{t("arrived")}</Select.Option>
                <Select.Option value="COMPLETED">{t("completed")}</Select.Option>
                <Select.Option value="CANCELLED">{t("cancelled")}</Select.Option>
                <Select.Option value="RETURNING">{t("returning")}</Select.Option>
                <Select.Option value="RETURNED">{t("returned")}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name="paymentType"
              label={<span style={labelStyle}>{t("paymentType")}</span>}
              rules={[{ required: true, message: t("selectPaymentMethod") }]}
              style={formItemStyle}
            >
              <Select
                placeholder={t("selectPaymentMethod")}
                size="small"
                style={{ fontSize: '11px' }}
              >
                <Select.Option value="WECHAT">{t("wechatPay")}</Select.Option>
                <Select.Option value="ALIPAY">{t("alipay")}</Select.Option>
                <Select.Option value="BANK">{t("bankCard")}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="payTime"
              label={<span style={labelStyle}>{t("paymentTime")}</span>}
              rules={[{ required: true, message: t("selectPaymentTime") }]}
              style={formItemStyle}
            >
              <DatePicker
                showTime
                placeholder={t("selectPaymentTime")}
                size="small"
                style={{ width: '100%', fontSize: '11px' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              name="totalAmount"
              label={<span style={labelStyle}>{t("totalAmount")}</span>}
              rules={[{ required: true, message: t("enterTotalAmount") }]}
              style={formItemStyle}
            >
              <InputNumber
                placeholder={t("enterTotalAmount")}
                size="small"
                style={{ width: '100%', fontSize: '11px' }}
                precision={2}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="shippingMethod"
              label={<span style={labelStyle}>{t("shippingMethod")}</span>}
              rules={[{ required: true, message: t("selectShippingMethod") }]}
              style={formItemStyle}
            >
              <Select
                placeholder={t("selectShippingMethod")}
                size="small"
                style={{ fontSize: '11px' }}
              >
                <Select.Option value="EXPRESS">{t("express")}</Select.Option>
                <Select.Option value="SELF_PICKUP">{t("selfPickup")}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="deliveryAddress"
          label={<span style={labelStyle}>{t("deliveryAddress")}</span>}
          rules={[{ required: true, message: t("enterDeliveryAddress") }]}
          style={formItemStyle}
        >
          <Input.TextArea
            placeholder={t("enterDeliveryAddress")}
            rows={2}
            style={{ fontSize: '11px' }}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={<span style={labelStyle}>{t("orderStatus")}</span>}
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <Switch
            size="small"
            checkedChildren={t("enabled")}
            unCheckedChildren={t("disabled")}
            style={{ fontSize: '11px' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrderModal;
