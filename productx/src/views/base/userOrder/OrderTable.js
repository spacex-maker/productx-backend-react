import React, { useState } from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { formatDate } from 'src/components/common/Common';
import DetailOrderModal from 'src/views/base/userOrder/DetailOrderModal';
import { useTranslation } from 'react-i18next';
import OrderStatus from 'src/components/common/OrderStatus';
import DeliveryMethod from 'src/components/common/DeliveryMethod';

const OrderTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(null);
  const { t } = useTranslation();

  const parsePaymentType = (paymentType) => {
    if (paymentType && paymentType.includes('##')) {
      const [currency, network] = paymentType.split('##');
      return `${network}`;
    }
    return paymentType;
  };

  // 显示订单详情的模态框
  const handleViewDetails = (order) => {
    setLoadingDetails(order);
    setOrderId(order);
    setIsModalVisible(true);
  };

  // 关闭订单详情模态框
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setOrderId(null);
    setLoadingDetails(null);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'id',
      width: 50,
      render: (id) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(id)}
          onChange={() => handleSelectRow(id, data)}
        />
      ),
    },
    {
      title: t('orderId'),
      dataIndex: 'id',
    },
    {
      title: t('userId'),
      dataIndex: 'userId',
    },
    {
      title: t('receiver'),
      dataIndex: 'receiverName',
    },
    {
      title: t('phoneNumber'),
      dataIndex: 'phoneNum',
    },
    {
      title: t('orderStatus'),
      dataIndex: 'orderStatus',
      render: (status) => <OrderStatus status={status} />,
    },
    {
      title: t('paymentMethod'),
      dataIndex: 'paymentType',
      render: (type) => parsePaymentType(type),
    },
    {
      title: t('paymentTime'),
      dataIndex: 'payTime',
      render: (time) => formatDate(time),
    },
    {
      title: t('totalAmount'),
      dataIndex: 'totalAmount',
    },
    {
      title: t('deliveryMethod'),
      dataIndex: 'shippingMethod',
      render: (method) => <DeliveryMethod method={method} />,
    },
    {
      title: t('action'),
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => handleEditClick(record)}>
            {t('edit')}
          </Button>
          <Button 
            type="link" 
            onClick={() => handleViewDetails(record.id)}
            loading={loadingDetails === record.id}
          >
            {t('detail')}
          </Button>
          <Popconfirm
            title={t('confirmDelete?')}
            onConfirm={() => handleDeleteClick(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" danger>
              {t('delete')}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        size="small"
        scroll={{ x: true }}
      />

      <DetailOrderModal 
        visible={isModalVisible} 
        orderId={orderId} 
        onCancel={handleCloseModal}
        afterClose={() => setLoadingDetails(null)}
      />
    </>
  );
};

export default OrderTable;
