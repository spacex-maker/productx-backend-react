import React, { useEffect, useState } from 'react';
import { Descriptions, Divider, Button, Popconfirm, Timeline, Modal, Space } from 'antd';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation
import api from "src/axiosInstance";
import { formatDate } from "src/components/common/Common";
const DetailOrderModal = ({ visible, orderId, onCancel }) => {
  const [orderData, setOrderData] = useState(null);
  const { t } = useTranslation(); // 获取 t 函数

  // 获取订单数据
  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await api.get(`/manage/user-order/detail?id=${orderId}`);
          if (response) {
            setOrderData(response); // 设置数据
          } else {
            console.error('获取订单数据失败:', response);
          }
        } catch (error) {
          console.error('请求失败:', error);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  // 如果数据还没有加载完，显示loading
  if (!orderData) {
    return "";
  }

  // 解析支付方式
  const parsePaymentType = (paymentType) => {
    if (paymentType && paymentType.includes('##')) {
      const [currency, network] = paymentType.split('##');
      return `${currency}(${network})`;
    }
    return paymentType;
  };

  const { userOrder, userOrderDetails, orderStatusHistories } = orderData;

  return (
    <Modal
      title={t('detail')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={580}
      bodyStyle={{ padding: '12px', fontSize: '10px' }}
    >
      {/* 基本信息 */}
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{
          width: '90px',
          padding: '4px 8px',
          fontSize: '12px',
          backgroundColor: '#fafafa'
        }}
        contentStyle={{
          padding: '4px 8px',
          fontSize: '12px'
        }}
        style={{ marginBottom: '8px' }}
      >
        <Descriptions.Item label={t('orderId')}>{userOrder.id}</Descriptions.Item>
        <Descriptions.Item label={t('orderStatus')}>{userOrder.orderStatus}</Descriptions.Item>
        <Descriptions.Item label={t('userId')}>{userOrder.userId}</Descriptions.Item>
        <Descriptions.Item label={t('sellerId')}>{userOrder.sellerId}</Descriptions.Item>
        <Descriptions.Item label={t('receiverName')}>{userOrder.receiverName}</Descriptions.Item>
        <Descriptions.Item label={t('phoneNumber')}>{userOrder.phoneNum}</Descriptions.Item>
        <Descriptions.Item label={t('paymentType')}>{parsePaymentType(userOrder.paymentType)}</Descriptions.Item>
        <Descriptions.Item label={t('payTime')}>{formatDate(userOrder.payTime)}</Descriptions.Item>
        <Descriptions.Item label={t('totalAmount')} span={2}>{userOrder.totalAmount} CNY</Descriptions.Item>
        <Descriptions.Item label={t('shippingMethod')} span={2}>{userOrder.shippingMethod}</Descriptions.Item>
        <Descriptions.Item label={t('deliveryAddress')} span={2}>{userOrder.deliveryAddress}</Descriptions.Item>
        <Descriptions.Item label={t('notes')} span={2}>{userOrder.notes || t('noNotes')}</Descriptions.Item>
      </Descriptions>

      {/* 商品信息 */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          backgroundColor: '#fafafa',
          padding: '4px 8px',
          fontWeight: '500',
          fontSize: '12px',
          marginBottom: '4px'
        }}>
          {t('orderItems')}
        </div>
        {userOrderDetails.map((detail) => (
          <div
            key={detail.id}
            style={{
              padding: '4px 8px',
              borderBottom: '1px solid #f0f0f0',
              fontSize: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ flex: 1 }}>
              <div>{detail.productName}</div>
              <div style={{ color: '#999', fontSize: '11px' }}>
                {t('quantity')}: {detail.quantity} × {detail.unitPrice} CNY
              </div>
            </div>
            <div style={{ color: '#ff4d4f', fontWeight: '500' }}>
              {detail.totalPrice} CNY
            </div>
          </div>
        ))}
      </div>

      {/* 订单状态历史 */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          backgroundColor: '#fafafa',
          padding: '4px 8px',
          fontWeight: '500',
          fontSize: '12px',
          marginBottom: '4px'
        }}>
          {t('orderHistory')}
        </div>
        <Timeline
          style={{
            padding: '4px 8px',
            fontSize: '12px'
          }}
        >
          {orderStatusHistories.map((history) => (
            <Timeline.Item
              key={history.id}
              color="blue"
              style={{ paddingBottom: '4px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px' }}>{history.oldStatus} → {history.newStatus}</div>
                  <div style={{ color: '#999', fontSize: '11px' }}>
                    {t('operator')}: {history.createBy}
                  </div>
                  {history.remarks && (
                    <div style={{ color: '#666', fontSize: '11px' }}>
                      {history.remarks}
                    </div>
                  )}
                </div>
                <div style={{ color: '#999', fontSize: '11px' }}>
                  {formatDate(history.createTime)}
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>

      {/* 操作按钮 */}
      <div style={{ textAlign: 'right', fontSize: '12px' }}>
        <Space size={4}>
          <Button size="small" onClick={onCancel} style={{ fontSize: '12px', height: '24px' }}>
            {t('close')}
          </Button>
          <Popconfirm
            title={t('confirmCancel')}
            onConfirm={() => console.log('取消订单')}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button size="small" type="primary" danger style={{ fontSize: '12px', height: '24px' }}>
              {t('deleteOrder')}
            </Button>
          </Popconfirm>
        </Space>
      </div>
    </Modal>
  );
};

export default DetailOrderModal;
