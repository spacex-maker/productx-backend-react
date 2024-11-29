import React from 'react';
import { Input, Modal, Form, Switch, DatePicker, Alert, Row, Col, Select, InputNumber } from 'antd';
import api from 'src/axiosInstance';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 12px;
  }

  .ant-modal-header {
    margin-bottom: 8px;
  }

  .ant-modal-title {
    font-size: 12px;
    color: #000000;
  }

  .ant-form {
    .ant-form-item {
      margin-bottom: 4px;
    }

    .ant-form-item-label {
      padding: 0;
      
      > label {
        font-size: 10px;
        color: #666;
        height: 20px;
      }
    }

    .ant-input,
    .ant-input-number,
    .ant-picker,
    .ant-select-selector {
      font-size: 10px;
      height: 24px !important;
      line-height: 24px;
      padding: 0 8px;
    }

    .ant-input-number-input {
      height: 22px;
    }

    .ant-select-selection-item {
      line-height: 22px;
    }

    textarea.ant-input {
      height: auto !important;
      min-height: 48px;
      padding: 4px 8px;
    }
  }

  .ant-alert {
    margin-bottom: 8px;
    padding: 4px 8px;
    font-size: 10px;
  }

  .ant-form-item-explain {
    font-size: 10px;
    min-height: 16px;
  }

  .ant-modal-footer {
    margin-top: 8px;
    padding: 8px 0 0;
    border-top: 1px solid #f0f0f0;

    .ant-btn {
      height: 24px;
      padding: 0 12px;
      font-size: 10px;
    }
  }
`;

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
        payTime: values.payTime?.format('YYYY-MM-DD HH:mm:ss'),
        totalAmount: values.totalAmount,
        shippingMethod: values.shippingMethod,
        deliveryAddress: values.deliveryAddress,
        status: values.status ?? true,
      };

      await api.post('/manage/orders/create', requestData);
      form.resetFields();
      onFinish(parentId);
      onCancel();
    } catch (error) {
      console.error(t('errorAddingOrder'), error);
    }
  };

  return (
    <StyledModal
      title={t("addNewOrder")}
      open={isVisible}
      onCancel={onCancel}
      onOk={handleAddOrderOk}
      okText={t("submit")}
      cancelText={t("cancel")}
      width={480}
      maskClosable={false}
      destroyOnClose
    >
      <Alert
        message={t("orderInfoWarning")}
        type="warning"
        showIcon
      />

      <Form
        form={form}
        layout="vertical"
        colon={false}
        initialValues={{ status: true }}
        preserve={false}
      >
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="userId"
              label={t("userId")}
              rules={[{ required: true, message: t("enterUserId") }]}
            >
              <Input placeholder={t("enterUserId")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="receiverName"
              label={t("receiverName")}
              rules={[{ required: true, message: t("enterReceiverName") }]}
            >
              <Input placeholder={t("enterReceiverName")} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="phoneNum"
              label={t("phoneNumber")}
              rules={[{ required: true, message: t("enterPhoneNumber") }]}
            >
              <Input placeholder={t("enterPhoneNumber")} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="orderStatus"
              label={t("orderStatus")}
              rules={[{ required: true, message: t("selectOrderStatus") }]}
            >
              <Select
                placeholder={t("selectOrderStatus")}
                size="small"
                style={{ fontSize: '11px' }}
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

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="paymentType"
              label={t("paymentType")}
              rules={[{ required: true, message: t("selectPaymentMethod") }]}
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
              label={t("paymentTime")}
              rules={[{ required: true, message: t("selectPaymentTime") }]}
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

        <Row gutter={8}>
          <Col span={12}>
            <Form.Item
              name="totalAmount"
              label={t("totalAmount")}
              rules={[{ required: true, message: t("enterTotalAmount") }]}
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
              label={t("shippingMethod")}
              rules={[{ required: true, message: t("selectShippingMethod") }]}
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
          label={t("deliveryAddress")}
          rules={[{ required: true, message: t("enterDeliveryAddress") }]}
        >
          <Input.TextArea
            placeholder={t("enterDeliveryAddress")}
            rows={2}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label={t("orderStatus")}
          valuePropName="checked"
        >
          <Switch
            size="small"
            checkedChildren={t("enabled")}
            unCheckedChildren={t("disabled")}
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default AddOrderModal;
