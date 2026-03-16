import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
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

  return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="select_all_orders"
                    checked={selectAll}
                    onChange={(event) => handleSelectAll(event, data)}
                  />
                  <label className="custom-control-label" htmlFor="select_all_orders"></label>
                </div>
              </th>
              <th>{t('orderId')}</th>
              <th>{t('userId')}</th>
              <th>{t('receiver')}</th>
              <th>{t('phoneNumber')}</th>
              <th>{t('orderStatus')}</th>
              <th>{t('paymentMethod')}</th>
              <th>{t('paymentTime')}</th>
              <th>{t('totalAmount')}</th>
              <th>{t('deliveryMethod')}</th>
              <th className="fixed-column">{t('action')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="record-font">
                <td>
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`order_checkbox_${item.id}`}
                      checked={selectedRows.includes(item.id)}
                      onChange={() => handleSelectRow(item.id, data)}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor={`order_checkbox_${item.id}`}
                    ></label>
                  </div>
                </td>
                <td className="text-truncate" title={item.id}>
                  {item.id}
                </td>
                <td className="text-truncate" title={item.userId}>
                  {item.userId}
                </td>
                <td className="text-truncate" title={item.receiverName}>
                  {item.receiverName || '—'}
                </td>
                <td className="text-truncate" title={item.phoneNum}>
                  {item.phoneNum || '—'}
                </td>
                <td>
                  <OrderStatus status={item.orderStatus} />
                </td>
                <td className="text-truncate" title={item.paymentType}>
                  {parsePaymentType(item.paymentType) || '—'}
                </td>
                <td className="text-truncate" title={item.payTime}>
                  {item.payTime ? formatDate(item.payTime) : '—'}
                </td>
                <td className="text-truncate" title={item.totalAmount}>
                  {item.totalAmount != null ? item.totalAmount : '—'}
                </td>
                <td className="text-truncate" title={item.shippingMethod}>
                  <DeliveryMethod method={item.shippingMethod} />
                </td>
                <td className="fixed-column">
                  <Button type="link" size="small" onClick={() => handleEditClick(item)}>
                    {t('edit')}
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => handleViewDetails(item.id)}
                    loading={loadingDetails === item.id}
                  >
                    {t('detail')}
                  </Button>
                  <Popconfirm
                    title={t('confirmDelete?')}
                    onConfirm={() => handleDeleteClick(item.id)}
                    okText="是"
                    cancelText="否"
                  >
                    <Button type="link" danger size="small">
                      {t('delete')}
                    </Button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
