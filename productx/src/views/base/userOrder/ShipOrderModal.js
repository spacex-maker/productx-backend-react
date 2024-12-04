import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';
import styled from 'styled-components';
import { UserOutlined, PhoneOutlined, HomeOutlined, BarcodeOutlined } from '@ant-design/icons';

// 添加样式组件
const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 12px;
  }

  .ant-modal-header {
    margin-bottom: 8px;
  }

  .ant-modal-title {
    font-size: 13px;
    color: #000 !important;
  }

  .ant-form {
    .ant-form-item {
      margin-bottom: 8px;
    }

    .ant-form-item-label {
      padding: 0;
      
      > label {
        font-size: 12px;
        color: #000 !important;
        height: 24px;
      }
    }

    .ant-input,
    .ant-input-number,
    .ant-picker,
    .ant-select-selector {
      font-size: 12px;
      height: 28px;
      padding: 0 8px;
      color: #000 !important;
      line-height: 28px;
    }

    .ant-input-affix-wrapper {
      padding: 0 8px;
      height: 28px;
      line-height: 28px;

      .ant-input {
        height: 26px;
        line-height: 26px;
      }

      .anticon {
        color: var(--cui-primary);
        font-size: 14px;
      }
    }

    .ant-input-number-input {
      height: 26px;
      line-height: 26px;
    }

    .ant-select-selection-item {
      line-height: 26px;
    }

    textarea.ant-input {
      height: auto !important;
      min-height: 56px;
      padding: 4px 8px;
      color: #000 !important;
      line-height: 1.5;
    }
  }

  .ant-form-item-explain {
    font-size: 11px;
    min-height: 18px;
    color: #000 !important;
  }

  .ant-modal-footer {
    margin-top: 12px;
    padding: 8px 0 0;
    border-top: 1px solid var(--cui-border-color);

    .ant-btn {
      height: 28px;
      padding: 0 12px;
      font-size: 12px;
    }
  }
`;

const ShipOrderModal = ({ visible, onCancel, orderData }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (visible && orderData) {
      form.setFieldsValue({
        receiverName: orderData.userOrder.receiverName,
        phoneNum: orderData.userOrder.phoneNum,
        deliveryAddress: orderData.userOrder.deliveryAddress,
        expressNumber: orderData.userOrder.expressNumber || '',
      });
    }
  }, [visible, orderData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await api.post('/manage/user-order/ship', {
        orderId: orderData.userOrder.id,
        ...values
      });
      
      message.success(t('shipSuccess'));
      onCancel(true);
    } catch (error) {
      console.error('发货失败:', error);
      message.error(t('shipFailed'));
    }
  };

  return (
    <StyledModal
      title={t('shipOrder')}
      open={visible}
      onCancel={() => onCancel(false)}
      onOk={handleSubmit}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={380}
      maskClosable={false}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        colon={false}
      >
        <Form.Item
          name="receiverName"
          label={t('receiverName')}
          rules={[{ required: true, message: t('receiverNameRequired') }]}
        >
          <Input
            placeholder={t('enterReceiverName')}
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="phoneNum"
          label={t('phoneNumber')}
          rules={[{ required: true, message: t('phoneNumberRequired') }]}
        >
          <Input
            placeholder={t('enterPhoneNumber')}
            prefix={<PhoneOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="deliveryAddress"
          label={t('deliveryAddress')}
          rules={[{ required: true, message: t('deliveryAddressRequired') }]}
        >
          <Input.TextArea
            rows={3}
            placeholder={t('enterDeliveryAddress')}
            prefix={<HomeOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="expressNumber"
          label={t('expressNumber')}
          rules={[{ required: true, message: t('expressNumberRequired') }]}
        >
          <Input
            placeholder={t('enterExpressNumber')}
            prefix={<BarcodeOutlined />}
          />
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default ShipOrderModal; 