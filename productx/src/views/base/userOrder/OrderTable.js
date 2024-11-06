import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { formatDate } from "src/components/common/Common";
import DetailOrderModal from "src/views/base/userOrder/DetailOrderModal";

const OrderTable = ({
                      data,
                      selectAll,
                      selectedRows,
                      handleSelectAll,
                      handleSelectRow,
                      handleStatusChange,
                      handleEditClick,
                      handleDeleteClick
                    }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // 解析支付方式为 USDT(ERC20) 格式
  const parsePaymentType = (paymentType) => {
    if (paymentType && paymentType.includes('##')) {
      const [currency, network] = paymentType.split('##');
      return `${network}`;
    }
    return paymentType; // 如果没有符合的格式，则返回原支付方式
  };

  // 显示订单详情的模态框
  const handleViewDetails = (order) => {
    setOrderId(order);  // 设置当前查看的订单
    setIsModalVisible(true);  // 打开模态框
  };

  // 关闭订单详情模态框
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setOrderId(null);
  };

  return (
    <div>
      <table className="table table-bordered table-striped">
        <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          {['订单ID', '用户ID', '收货人', '手机号', '订单状态', '支付方式', '支付时间', '总金额', '配送方式'].map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column" key="操作">操作</th>
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
                  id={`td_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">{item.userId}</td>
            <td className="text-truncate">{item.receiverName}</td>
            <td className="text-truncate">{item.phoneNum}</td>
            <td className="text-truncate">{item.orderStatus}</td>
            <td className="text-truncate">{parsePaymentType(item.paymentType)}</td>
            <td className="text-truncate">{formatDate(item.payTime)}</td>
            <td className="text-truncate">{item.totalAmount}</td>
            <td className="text-truncate">{item.shippingMethod}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                修改
              </Button>

              <Button type="link" onClick={() => handleViewDetails(item.id)}>
                查看详情
              </Button>

              <Popconfirm
                title="确定要删除这个订单吗？"
                onConfirm={() => handleDeleteClick(item.id)}
                okText="是"
                cancelText="否"
              >
                <Button type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </td>
          </tr>
        ))}
        </tbody>
      </table>

      <DetailOrderModal
        visible={isModalVisible}
        orderId={orderId}
        onCancel={handleCloseModal}
      />
    </div>
  );
};

export default OrderTable;
