import React, { useEffect, useState } from 'react';
import { Descriptions, Divider, Button, Popconfirm, Timeline, Modal } from 'antd';
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
      title={t('detail')} // 假设 orderDetails 是一个常见的键，改成 t('orderDetails')
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      bodyStyle={{ padding: '8px 16px' }}
    >
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label={t('orderId')}>{userOrder.id}</Descriptions.Item>
        <Descriptions.Item label={t('userId')}>{userOrder.userId}</Descriptions.Item>
        <Descriptions.Item label={t('sellerId')}>{userOrder.sellerId}</Descriptions.Item>
        <Descriptions.Item label={t('receiverName')}>{userOrder.receiverName}</Descriptions.Item>
        <Descriptions.Item label={t('phoneNum')}>{userOrder.phoneNum}</Descriptions.Item>
        <Descriptions.Item label={t('orderStatus')}>{userOrder.orderStatus}</Descriptions.Item>
        <Descriptions.Item label={t('paymentType')}>{parsePaymentType(userOrder.paymentType)}</Descriptions.Item>
        <Descriptions.Item label={t('payTime')}>{formatDate(userOrder.payTime)}</Descriptions.Item>
        <Descriptions.Item label={t('totalAmount')}>{userOrder.totalAmount} CNY</Descriptions.Item>
        <Descriptions.Item label={t('shippingMethod')}>{userOrder.shippingMethod}</Descriptions.Item>
        <Descriptions.Item label={t('deliveryAddress')}>{userOrder.deliveryAddress}</Descriptions.Item>
        <Descriptions.Item label={t('notes')}>{userOrder.notes || t('noNotes')}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ margin: '8px 0' }} />
      {userOrderDetails.map((detail) => (
        <div key={detail.id} className="order-item" style={{ marginBottom: '8px' }}>
          <p><strong>{t('productName')}：</strong>{detail.productName}</p>
          <p><strong>{t('quantity')}：</strong>{detail.quantity}</p>
          <p><strong>{t('unitPrice')}：</strong>{detail.unitPrice} CNY</p>
          <p><strong>{t('totalPrice')}：</strong>{detail.totalPrice} CNY</p>
        </div>
      ))}
      <Divider style={{ margin: '8px 0' }} />
      <Timeline style={{ marginBottom: '8px' }}>
        {orderStatusHistories.map((history) => (
          <Timeline.Item key={history.id} color="green">
            <p><strong>{t('statusChange')}：</strong>{history.oldStatus} → {history.newStatus}</p>
            <p><strong>{t('changeTime')}：</strong>{formatDate(history.createTime)}</p>
            <p><strong>{t('operator')}：</strong>{history.createBy}</p>
            {history.remarks && <p><strong>{t('remarks')}：</strong>{history.remarks}</p>}
          </Timeline.Item>
        ))}
      </Timeline>

      <Divider style={{ margin: '8px 0' }} />

      <Popconfirm
        title={t('confirmCancel')}
        onConfirm={() => console.log('取消订单')}
        okText={t('yes')}
        cancelText={t('no')}
      >
        <Button type="primary" danger style={{ marginTop: '8px' }}>{t('deleteOrder')}</Button>
      </Popconfirm>
    </Modal>
  );
};

export default DetailOrderModal;
