import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import OrderTable from 'src/views/base/userOrder/OrderTable'; // 假设你有一个订单表格组件
import OrderCreateFormModal from 'src/views/base/userOrder/AddOrderModal'; // 新建订单模态框
import UpdateOrderModal from 'src/views/base/userOrder/UpdateOrderModal'; // 更新订单模态框
import { useTranslation } from 'react-i18next'; // 引入 useTranslation

const { Option } = Select;

const createOrder = async (orderData) => {
  await api.post('/manage/user-order/create', orderData);
};

const updateOrder = async (updateData) => {
  await api.put('/manage/user-order/update', updateData);
};

const UserOrder = () => {
  const { t } = useTranslation(); // 使用 t() 方法进行翻译
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

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null),
      );
      const response = await api.get('/manage/user-order/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response && response.data) {
        setData(response.data); // 更新数据结构
        setTotalNum(response.totalNum); // 获取总记录数
      } else {
        message.info(t('noData'));
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
                value={searchParams.userId}
                onChange={handleSearchChange}
                name="userId"
                placeholder={t('userId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.orderStatus}
                onChange={(value) => handleSearchChange({ target: { name: 'orderStatus', value }})}
                placeholder={t('selectOrderStatus')}
                allowClear
                style={{ width: 150 }}
              >
                <Option value="PENDING">{t('pending')}</Option>
                <Option value="PAID">{t('paid')}</Option>
                <Option value="SHIPPED">{t('shipped')}</Option>
                <Option value="ARRIVED">{t('arrived')}</Option>
                <Option value="COMPLETED">{t('completed')}</Option>
                <Option value="CANCELLED">{t('cancelled')}</Option>
                <Option value="RETURNING">{t('returning')}</Option>
                <Option value="RETURNED">{t('returned')}</Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('createOrder')}
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    HandleBatchDelete({
                      url: '/manage/user-order/delete-batch',
                      selectedRows,
                      fetchData,
                    })
                  }
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete')}
                </Button>
              </Space>
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
