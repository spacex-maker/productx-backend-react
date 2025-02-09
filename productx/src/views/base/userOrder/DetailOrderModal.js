import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Descriptions, Divider, Button, Popconfirm, Timeline, Modal, Space, Image, Avatar, Spin, Card, Typography, Tag, Row, Col, List, Tabs } from 'antd';
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
          title={t('userDetail')}
          open={visible}
          onCancel={onCancel}
          footer={null}
          width={400}
        >
          {/* 用户基本信息 */}
          <Card size="small" className="mb-3">
            <Space align="start" size="middle">
              <Avatar
                size={64}
                src={user.avatar}
                icon={<UserOutlined />}
              />
              <Space direction="vertical" size={1}>
                <Typography.Title level={5} className="mb-0">
                  {user.nickname || user.username}
                </Typography.Title>
                <Typography.Text type="secondary">
                  ID: {user.id}
                </Typography.Text>
                <Tag color="success">
                  {t('creditScore')}: {user.creditScore || 0}
                </Tag>
              </Space>
            </Space>
          </Card>

          {/* 详细信息 */}
          <Card size="small">
            <Descriptions
              column={1}
              size="small"
            >
              <Descriptions.Item 
                label={
                  <Space>
                    <MailOutlined />
                    {t('email')}
                  </Space>
                }
              >
                {user.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item 
                label={
                  <Space>
                    <PhoneOutlined />
                    {t('phoneNumber')}
                  </Space>
                }
              >
                {user.phoneNumber || '-'}
              </Descriptions.Item>
              <Descriptions.Item 
                label={
                  <Space>
                    <HomeOutlined />
                    {t('address')}
                  </Space>
                }
              >
                {[user.country, user.state, user.city, user.address]
                  .filter(Boolean)
                  .join(', ') || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('postalCode')}>
                {user.postalCode || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('description')}>
                {user.description || '-'}
              </Descriptions.Item>
              <Descriptions.Item label={t('registerTime')}>
                {formatDate(user.createTime)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
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

  const tabItems = [
    {
      key: 'basic',
      label: t('basicInfo'),
      children: (
        <>
          {/* 买家和卖家信息 */}
          <Card size="small" className="mb-2">
            <Row gutter={16}>
              {/* 买家信息 */}
              <Col span={12}>
                <Space direction="vertical" size="small">
                  <Typography.Text type="secondary">
                    <UserOutlined /> {t('buyerInfo')}
                  </Typography.Text>
                  <Space align="start" size="middle">
                    <Avatar
                      size={48}
                      src={buyerDetail?.avatar}
                      icon={<UserOutlined />}
                      className="cursor-pointer"
                      onClick={() => showUserDetail(buyerDetail)}
                    />
                    <Space direction="vertical" size={2}>
                      <Typography.Text strong>
                        {buyerDetail?.nickname || buyerDetail?.username || '-'}
                      </Typography.Text>
                      <Tag color="blue">
                        {t('creditScore')}: {buyerDetail?.creditScore || 0}
                      </Tag>
                      <Typography.Text type="secondary" className="mt-1">
                        <HomeOutlined className="mr-1" />
                        {buyerDetail?.city}{buyerDetail?.country ? `, ${buyerDetail.country}` : ''}
                      </Typography.Text>
                    </Space>
                  </Space>
                </Space>
              </Col>

              {/* 卖家信息 */}
              <Col span={12}>
                <Space direction="vertical" size="small">
                  <Typography.Text type="secondary">
                    <ShopOutlined /> {t('sellerInfo')}
                  </Typography.Text>
                  <Space align="start" size="middle">
                    <Avatar
                      size={48}
                      src={sellerDetail?.avatar}
                      icon={<ShopOutlined />}
                      className="cursor-pointer"
                      onClick={() => showUserDetail(sellerDetail)}
                    />
                    <Space direction="vertical" size={2}>
                      <Typography.Text strong>
                        {sellerDetail?.nickname || sellerDetail?.username || '-'}
                      </Typography.Text>
                      <Tag color="success">
                        {t('creditScore')}: {sellerDetail?.creditScore || 0}
                      </Tag>
                      <Typography.Text type="secondary" className="mt-1">
                        <HomeOutlined className="mr-1" />
                        {sellerDetail?.city}{sellerDetail?.country ? `, ${sellerDetail.country}` : ''}
                      </Typography.Text>
                    </Space>
                  </Space>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* 订单基本信息 */}
          <Card size="small" className="mb-2">
            <Descriptions
              column={2}
              size="small"
              bordered
            >
              <Descriptions.Item label={t('orderId')}>{userOrder.id}</Descriptions.Item>
              <Descriptions.Item label={t('orderStatus')}>
                <OrderStatus status={userOrder.orderStatus} />
              </Descriptions.Item>
              <Descriptions.Item label={t('paymentType')}>{parsePaymentType(userOrder.paymentType)}</Descriptions.Item>
              <Descriptions.Item label={t('payTime')}>{formatDate(userOrder.payTime)}</Descriptions.Item>
              <Descriptions.Item label={t('totalAmount')} span={2}>{userOrder.totalAmount} CNY</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 收货信息 */}
          <Card 
            size="small" 
            className="mb-2"
            title={<><HomeOutlined /> {t('deliveryInfo')}</>}
          >
            <Descriptions
              column={2}
              size="small"
              bordered
            >
              <Descriptions.Item label={t('receiverName')}>{userOrder.receiverName}</Descriptions.Item>
              <Descriptions.Item label={t('phoneNumber')}>{userOrder.phoneNum}</Descriptions.Item>
              <Descriptions.Item label={t('shippingMethod')}>{userOrder.shippingMethod}</Descriptions.Item>
              <Descriptions.Item label={t('notes')}>{userOrder.notes || t('noNotes')}</Descriptions.Item>
              <Descriptions.Item label={t('deliveryAddress')} span={2}>{userOrder.deliveryAddress}</Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 商品信息 */}
          <Card 
            title={t('orderItems')} 
            size="small"
            className="mb-2"
          >
            <List
              dataSource={userProducts}
              renderItem={(product) => (
                <List.Item key={product.id}>
                  <Row gutter={16} style={{ width: '100%' }}>
                    {/* 左侧产品信息 */}
                    <Col flex="auto">
                      <Typography.Title level={5}>{product.productName}</Typography.Title>
                      <Typography.Text type="secondary">
                        {product.productDescription}
                      </Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        {t('category')}: {product.category}
                      </Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        {t('city')}: {product.city}
                      </Typography.Text>
                      <br />
                      <Typography.Text type="danger">
                        {product.price} CNY
                        {product.originalPrice && (
                          <Typography.Text type="secondary" delete className="ml-2">
                            {product.originalPrice} CNY
                          </Typography.Text>
                        )}
                      </Typography.Text>
                    </Col>

                    {/* 右侧图片区域 */}
                    <Col flex="100px">
                      <Space direction="vertical" size={4}>
                        {/* 封面图 */}
                        <Image
                          width={100}
                          height={75}
                          src={product.imageCover}
                          alt={product.productName}
                        />

                        {/* 图片网格 */}
                        {Array.isArray(product.imageList) && product.imageList.length > 0 && (
                          <Row gutter={[2, 2]}>
                            {product.imageList.slice(0, 9).map((image, index) => (
                              <Col span={8} key={index}>
                                <div className="relative">
                                  <Image
                                    src={image}
                                    alt={`${product.productName} ${index + 1}`}
                                    width={32}
                                    height={32}
                                    preview={{
                                      src: image,
                                      mask: null
                                    }}
                                  />
                                  {index === 8 && product.imageList.length > 9 && (
                                    <Tag className="absolute-center">
                                      +{product.imageList.length - 9}
                                    </Tag>
                                  )}
                                </div>
                              </Col>
                            ))}
                          </Row>
                        )}
                      </Space>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </Card>
        </>
      ),
    },
    {
      key: 'history',
      label: t('orderHistory'),
      children: (
        <Card 
          size="small"
          extra={
            orderData.userOrder.orderStatus === 'PAID' && (
              <Button
                type="primary"
                size="small"
                onClick={() => setShipModalVisible(true)}
              >
                {t('ship')}
              </Button>
            )
          }
        >
          <Timeline>
            {orderStatusHistories.map((history) => (
              <Timeline.Item key={history.id} color="blue">
                <Row justify="space-between">
                  <Col>
                    <Space direction="vertical" size={0}>
                      <Typography.Text>{history.oldStatus} → {history.newStatus}</Typography.Text>
                      <Typography.Text type="secondary">
                        {t('operator')}: {history.createBy}
                      </Typography.Text>
                      {history.remarks && (
                        <Typography.Text type="secondary">
                          {history.remarks}
                        </Typography.Text>
                      )}
                    </Space>
                  </Col>
                  <Col>
                    <Typography.Text type="secondary">
                      {formatDate(history.createTime)}
                    </Typography.Text>
                  </Col>
                </Row>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      ),
    },
  ];

  return (
    <Modal
      title={t('detail')}
      open={visible}
      onCancel={onCancel}
      footer={
        <Space size="small">
          <Button size="small" onClick={onCancel}>
            {t('close')}
          </Button>
          <Popconfirm
            title={t('confirmCancel')}
            onConfirm={() => console.log('取消订单')}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button size="small" type="primary" danger>
              {t('deleteOrder')}
            </Button>
          </Popconfirm>
        </Space>
      }
      width={800}
      styles={{
        body: {
          padding: 24,
          maxHeight: '80vh',
          overflow: 'auto'
        }
      }}
    >
      <Spin spinning={loading}>
        {orderData && (
          <Tabs items={tabItems} />
        )}
      </Spin>

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
    </Modal>
  );
};

export default DetailOrderModal;
