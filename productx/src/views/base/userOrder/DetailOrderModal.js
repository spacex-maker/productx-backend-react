import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Descriptions, Divider, Button, Popconfirm, Timeline, Modal, Space, Image, Avatar, Spin } from 'antd';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation
import api from "src/axiosInstance";
import { formatDate } from "src/components/common/Common";
import { UserOutlined, ShopOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { message } from 'antd';
import ShipOrderModal from './ShipOrderModal';
import OrderStatus from 'src/components/common/OrderStatus';

const DetailOrderModal = ({ visible, orderId, onCancel }) => {
  // 所有的 hooks 必须在组件顶部声明
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false); // 添加加载状态
  const { t } = useTranslation();
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [currentUserDetail, setCurrentUserDetail] = useState(null);
  const [shipModalVisible, setShipModalVisible] = useState(false);

  // 获取订单数据
  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        setLoading(true); // 开始加载
        try {
          const response = await api.get(`/manage/user-order/detail?id=${orderId}`);
          if (response) {
            setOrderData(response);
          }
        } catch (error) {
          console.error('请求失败:', error);
          message.error(t('fetchFailed'));
        } finally {
          setLoading(false); // 结束加载
        }
      };
      fetchOrderDetails();
    }
  }, [orderId]);

  // 用户详情弹窗组件 - 移到组件外部或使用 useMemo
  const UserDetailModal = useMemo(() => {
    return ({ visible, user, onCancel }) => {
      if (!user) return null;

      return (
        <Modal
          title="用户详情"
          open={visible}
          onCancel={onCancel}
          footer={null}
          width={400}
          styles={{ padding: '12px', fontSize: '12px' }}
        >
          {/* 用户基本信息 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px',
            marginBottom: '12px',
            background: '#fafafa',
            borderRadius: '2px'
          }}>
            <Avatar
              size={48}
              src={user.avatar}
              icon={<UserOutlined />}
            />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>
                {user.nickname || user.username}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                ID: {user.id}
              </div>
              <div style={{
                marginTop: '4px',
                padding: '0 8px',
                background: '#f6ffed',
                color: '#52c41a',
                fontSize: '11px',
                borderRadius: '10px',
                display: 'inline-block'
              }}>
                信用分：{user.creditScore || 0}
              </div>
            </div>
          </div>

          {/* 详细信息 */}
          <Descriptions
            size="small"
            column={1}
            labelStyle={{
              width: '80px',
              fontSize: '11px',
              color: '#666'
            }}
            contentStyle={{
              fontSize: '11px'
            }}
          >
            <Descriptions.Item
              label={<><MailOutlined style={{ marginRight: '4px' }} />邮箱</>}
            >
              {user.email || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={<><PhoneOutlined style={{ marginRight: '4px' }} />电话</>}
            >
              {user.phoneNumber || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={<><HomeOutlined style={{ marginRight: '4px' }} />地址</>}
            >
              {[user.country, user.state, user.city, user.address]
                .filter(Boolean)
                .join(', ') || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="邮编">
              {user.postalCode || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="简介">
              {user.description || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">
              {formatDate(user.createTime)}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      );
    };
  }, []); // 依赖项为空数组，因为这个组件不依赖外部变量

  // 处理函数
  const showUserDetail = useCallback((userDetail) => {
    setCurrentUserDetail(userDetail);
    setUserDetailVisible(true);
  }, []);

  // 处理发货弹窗关闭
  const handleShipModalClose = (success) => {
    setShipModalVisible(false);
    if (success) {
      // 重新获取订单数据
      fetchOrderDetails();
    }
  };

  if (!orderData) {
    return null;
  }

  const { userOrder, userProducts, orderStatusHistories, buyerDetail, sellerDetail } = orderData;

  // 解析支付方
  const parsePaymentType = (paymentType) => {
    if (paymentType && paymentType.includes('##')) {
      const [currency, network] = paymentType.split('##');
      return `${currency}(${network})`;
    }
    return paymentType;
  };

  return (
    <Modal
      title={t('detail')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={580}
      styles={{ padding: '12px', fontSize: '12px' }}
    >
      <Spin spinning={loading}>
        {/* 将现有内容包裹在 Spin 组件中 */}
        {orderData && (
          <>
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
                      style={{ cursor: 'pointer' }}
                      onClick={() => showUserDetail(buyerDetail)}
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
                      style={{ cursor: 'pointer' }}
                      onClick={() => showUserDetail(sellerDetail)}
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
              <Descriptions.Item label={t('orderStatus')}>
                <OrderStatus status={userOrder.orderStatus} />
              </Descriptions.Item>
              <Descriptions.Item label={t('paymentType')}>{parsePaymentType(userOrder.paymentType)}</Descriptions.Item>
              <Descriptions.Item label={t('payTime')}>{formatDate(userOrder.payTime)}</Descriptions.Item>
              <Descriptions.Item label={t('totalAmount')} span={2}>{userOrder.totalAmount} CNY</Descriptions.Item>
            </Descriptions>

            {/* 收货信息 */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                backgroundColor: '#fafafa',
                padding: '4px 8px',
                fontWeight: '500',
                fontSize: '12px',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <HomeOutlined style={{ marginRight: '4px' }} />
                {t('deliveryInfo')}
              </div>
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
              >
                <Descriptions.Item label={t('receiverName')}>{userOrder.receiverName}</Descriptions.Item>
                <Descriptions.Item label={t('phoneNumber')}>{userOrder.phoneNum}</Descriptions.Item>
                <Descriptions.Item label={t('shippingMethod')}>{userOrder.shippingMethod}</Descriptions.Item>
                <Descriptions.Item label={t('notes')}>{userOrder.notes || t('noNotes')}</Descriptions.Item>
                <Descriptions.Item label={t('deliveryAddress')} span={2}>{userOrder.deliveryAddress}</Descriptions.Item>
              </Descriptions>
            </div>

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
                marginBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{t('orderHistory')}</span>
                {orderData.userOrder.orderStatus === 'PAID' && (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => setShipModalVisible(true)}
                    style={{ fontSize: '12px', height: '24px' }}
                  >
                    {t('ship')}
                  </Button>
                )}
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

            {/* 用户详情弹窗 */}
            <UserDetailModal
              visible={userDetailVisible}
              user={currentUserDetail}
              onCancel={() => setUserDetailVisible(false)}
            />

            {/* 发货弹窗 */}
            <ShipOrderModal
              visible={shipModalVisible}
              onCancel={handleShipModalClose}
              orderData={orderData}
            />
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default DetailOrderModal;
