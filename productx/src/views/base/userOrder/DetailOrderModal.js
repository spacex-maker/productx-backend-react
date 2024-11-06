import React, { useEffect, useState } from 'react';
import { Descriptions, Divider, Button, Popconfirm, Timeline, Modal } from 'antd';
import api from "src/axiosInstance";
import {formatDate} from "src/components/common/Common";

const DetailOrderModal = ({ visible, orderId, onCancel }) => {
  const [orderData, setOrderData] = useState(null);

  // 获取订单数据
  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          // 使用 await 等待 API 返回数据
          const response = await api.get(`/manage/user-order/detail?id=${orderId}`);

          // 判断是否返回了数据
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
    return <div>Loading...</div>;
  }

  // 解析支付方式
  const parsePaymentType = (paymentType) => {
    if (paymentType && paymentType.includes('##')) {
      const [currency, network] = paymentType.split('##');
      return `${currency}(${network})`;
    }
    return paymentType; // 如果没有符合的格式，则返回原支付方式
  };

  const { userOrder, userOrderDetails, orderStatusHistories } = orderData;

  return (
    <Modal
      title="订单详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}  // 更紧凑的宽度
      bodyStyle={{ padding: '8px 16px' }}  // 调整Modal内部的padding
    >
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="订单ID">{userOrder.id}</Descriptions.Item>
        <Descriptions.Item label="用户ID">{userOrder.userId}</Descriptions.Item>
        <Descriptions.Item label="卖家ID">{userOrder.sellerId}</Descriptions.Item>
        <Descriptions.Item label="收货人">{userOrder.receiverName}</Descriptions.Item>
        <Descriptions.Item label="手机号">{userOrder.phoneNum}</Descriptions.Item>
        <Descriptions.Item label="订单状态">{userOrder.orderStatus}</Descriptions.Item>
        <Descriptions.Item label="支付方式">{parsePaymentType(userOrder.paymentType)}</Descriptions.Item>
        <Descriptions.Item label="支付时间">{formatDate(userOrder.payTime)}</Descriptions.Item>
        <Descriptions.Item label="总金额">{userOrder.totalAmount} CNY</Descriptions.Item>
        <Descriptions.Item label="配送方式">{userOrder.shippingMethod}</Descriptions.Item>
        <Descriptions.Item label="收货地址">{userOrder.deliveryAddress}</Descriptions.Item>
        <Descriptions.Item label="备注">{userOrder.notes || '无'}</Descriptions.Item>
      </Descriptions>
      <Divider style={{ margin: '8px 0' }} />
      {userOrderDetails.map((detail) => (
        <div key={detail.id} className="order-item" style={{ marginBottom: '8px' }}>
          <p><strong>产品名称：</strong>{detail.productName}</p>
          <p><strong>数量：</strong>{detail.quantity}</p>
          <p><strong>单价：</strong>{detail.unitPrice} CNY</p>
          <p><strong>总价：</strong>{detail.totalPrice} CNY</p>
        </div>
      ))}
      <Divider style={{ margin: '8px 0' }} />
      <Timeline style={{ marginBottom: '8px' }}>
        {orderStatusHistories.map((history) => (
          <Timeline.Item key={history.id} color="green">
            <p><strong>状态变更：</strong>{history.oldStatus} → {history.newStatus}</p>
            <p><strong>变更时间：</strong>{formatDate(history.createTime)}</p>
            <p><strong>操作人：</strong>{history.createBy}</p>
            {history.remarks && <p><strong>备注：</strong>{history.remarks}</p>}
          </Timeline.Item>
        ))}
      </Timeline>

      <Divider style={{ margin: '8px 0' }} />

      <Popconfirm
        title="确定要取消该订单吗？"
        onConfirm={() => console.log('取消订单')}
        okText="是"
        cancelText="否"
      >
        <Button type="primary" danger style={{ marginTop: '8px' }}>删除订单</Button>
      </Popconfirm>
    </Modal>
  );
};

export default DetailOrderModal;
