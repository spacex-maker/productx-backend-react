import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import OrderTable from "src/views/base/userOrder/OrderTable"; // 假设你有一个订单表格组件
import OrderCreateFormModal from "src/views/base/userOrder/AddOrderModal"; // 新建订单模态框
import UpdateOrderModal from "src/views/base/userOrder/UpdateOrderModal"; // 更新订单模态框

const createOrder = async (orderData) => {
  await api.post('/manage/user-order/create', orderData);
};

const updateOrder = async (updateData) => {
  await api.put('/manage/user-order/update', updateData);
};

const UserOrder = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    orderStatus: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      );
      const response = await api.get('/manage/user-order/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response && response.data) {
        setData(response.data); // 更新数据结构
        setTotalNum(response.totalNum); // 获取总记录数
      } else {
        message.info("暂无数据(No Data)");
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateOrder = async (values) => {
    await createOrder(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateOrder = async (values) => {
    await updateOrder(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleDeleteClick = async (id) => {
    await api.post('/manage/user-order/remove', { id });
    await fetchData(); // 删除后重新获取数据
  };

  const handleEditClick = (order) => {
    updateForm.setFieldsValue({
      id: order.id,
      userId: order.userId,
      deliveryAddress: order.deliveryAddress,
      paymentType: order.paymentType,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
    });
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                size="small"
                value={searchParams.userId}
                onChange={handleSearchChange}
                name="userId"
                placeholder="用户ID"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                name="orderStatus"
                onChange={(value) => handleSearchChange({ target: { name: 'orderStatus', value: value } })}
                allowClear
                placeholder="选择订单状态"
              >
                <Option value="PENDING">待处理</Option>
                <Option value="PAID">已支付</Option>
                <Option value="SHIPPED">已发货</Option>
                <Option value="ARRIVED">已到达</Option>
                <Option value="COMPLETED">已完成</Option>
                <Option value="CANCELLED">已取消</Option>
                <Option value="RETURNING">退货中</Option>
                <Option value="RETURNED">已退货</Option>
              </Select>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                disabled={isLoading}
              >
                {isLoading ? <Spin /> : '查询'}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                新增订单
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/user-order/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
              >
                批量删除
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <OrderTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </Spin>
      </div>
      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <OrderCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateOrder}
        form={createForm}
      />
      <UpdateOrderModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateOrder={handleUpdateOrder}
        selectedOrder={selectedOrder} // 传递所选订单信息
      />
    </div>
  );
};

export default UserOrder;