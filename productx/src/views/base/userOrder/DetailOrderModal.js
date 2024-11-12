import React, { useEffect, useState } from 'react';
import { Descriptions, Divider, Button, Popconfirm, Timeline, Modal, Space, Image, Avatar } from 'antd';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation
import api from "src/axiosInstance";
import { formatDate } from "src/components/common/Common";
import { UserOutlined, ShopOutlined } from '@ant-design/icons';

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

  // 解析支付方
  const parsePaymentType = (paymentType) => {
    if (paymentType && paymentType.includes('##')) {
      const [currency, network] = paymentType.split('##');
      return `${currency}(${network})`;
    }
    return paymentType;
  };

  const {
    userOrder,
    userProducts,
    orderStatusHistories,
    buyerDetail,
    sellerDetail
  } = orderData;

  return (
    <Modal
      title={t('detail')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={580}
      bodyStyle={{ padding: '12px', fontSize: '12px' }}
    >
      {/* 买家和卖家信息 */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{
          display: 'flex',
          gap: '12px',
          padding: '8px',
          background: '#fafafa',
          borderRadius: '2px'
        }}>
          {/* 买家信息 */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '11px',
              color: '#666',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <UserOutlined style={{ fontSize: '11px' }}/>
              {t('buyerInfo')}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Avatar
                size={24}
                src={buyerDetail?.avatar}
                icon={<UserOutlined />}
              />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '500' }}>
                  {buyerDetail?.nickname || buyerDetail?.username || '-'}
                  <span style={{
                    marginLeft: '4px',
                    padding: '0 4px',
                    background: '#e6f7ff',
                    color: '#1890ff',
                    fontSize: '10px',
                    borderRadius: '2px'
                  }}>
                    {t('creditScore')}： {buyerDetail?.creditScore || 0}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  {buyerDetail?.city}{buyerDetail?.country ? `, ${buyerDetail.country}` : ''}
                </div>
              </div>
            </div>
          </div>

          {/* 分隔线 */}
          <Divider type="vertical" style={{ height: 'auto', margin: '0' }} />

          {/* 卖家信息 */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '11px',
              color: '#666',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShopOutlined style={{ fontSize: '11px' }}/>
              {t('sellerInfo')}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Avatar
                size={24}
                src={sellerDetail?.avatar}
                icon={<ShopOutlined />}
              />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '500' }}>
                  {sellerDetail?.nickname || sellerDetail?.username || '-'}
                  <span style={{
                    marginLeft: '4px',
                    padding: '0 4px',
                    background: '#f6ffed',
                    color: '#52c41a',
                    fontSize: '10px',
                    borderRadius: '2px'
                  }}>
                    {t('creditScore')}： {sellerDetail?.creditScore || 0}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  {sellerDetail?.city}{sellerDetail?.country ? `, ${sellerDetail.country}` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 订单基本信息 */}
      <Descriptions
        bordered
        size="small"
        column={2}
        labelStyle={{
          width: '90px',
          padding: '4px 8px',
          fontSize: '11px',
          backgroundColor: '#fafafa'
        }}
        contentStyle={{
          padding: '4px 8px',
          fontSize: '11px'
        }}
        style={{ marginBottom: '8px' }}
      >
        <Descriptions.Item label={t('orderId')}>{userOrder.id}</Descriptions.Item>
        <Descriptions.Item label={t('orderStatus')}>{userOrder.orderStatus}</Descriptions.Item>
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
        {userProducts.map((product) => (
          <div
            key={product.id}
            style={{
              padding: '4px 8px',
              borderBottom: '1px solid #f0f0f0',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            {/* 左侧产品信息 */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '500' }}>{product.productName}</div>
              <div style={{ color: '#666', fontSize: '11px', marginTop: '2px' }}>
                {product.productDescription}
              </div>
              <div style={{ color: '#999', fontSize: '11px', marginTop: '2px' }}>
                {t('category')}: {product.category}
              </div>
              <div style={{ color: '#999', fontSize: '11px' }}>
                {t('city')}: {product.city}
              </div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: '#ff4d4f' }}>
                <span>{product.price} CNY</span>
                {product.originalPrice && (
                  <span style={{
                    color: '#999',
                    textDecoration: 'line-through',
                    marginLeft: '8px'
                  }}>
                    {product.originalPrice} CNY
                  </span>
                )}
              </div>
            </div>

            {/* 右侧图片区域 */}
            <div style={{
              width: '100px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {/* 封面图 */}
              <Image
                width={100}
                height={75}
                src={product.imageCover}
                alt={product.productName}
                style={{
                  objectFit: 'cover',
                  borderRadius: '2px'
                }}
              />

              {/* 图片网格 */}
              {product.imageList?.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '2px',
                  width: '100px'
                }}>
                  {product.imageList.slice(0, 9).map((image, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        width: '32px',
                        height: '32px'
                      }}
                    >
                      <Image
                        src={image}
                        alt={`${product.productName} ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '2px'
                        }}
                        preview={{
                          src: image, // 预览时显示原图
                          mask: null // 移除预览遮罩文字
                        }}
                      />
                      {index === 8 && product.imageList.length > 9 && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(0,0,0,0.5)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          borderRadius: '2px'
                        }}>
                          +{product.imageList.length - 9}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
