import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row, Switch } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import WorkOrderTable from 'src/views/base/workOrder/WorkOrderTable'; // 确保你有这个表格组件
import UpdateWorkOrderModal from 'src/views/base/workOrder/UpdateWorkOrderModal'; // 确保你有这个更新模态框组件
import WorkOrderCreateFormModal from 'src/views/base/workOrder/WorkOrderCreateFormModal';
import WorkOrderStatus from "src/views/base/workOrder/WorkOrderStatus";
import WorkOrderTypes from "src/views/base/workOrder/WorkOrderType"; // 确保你有这个创建模态框组件

const WorkOrderList = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    title: '',
    status: '',
    createBy: '',
    categoryId: '',
    myOrder: false, // 新增的查询参数
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      );
      const responseData = await api.get('/manage/work-order/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });
      setData(responseData.data);
      setTotalNum(responseData.totalNum);
    } catch (error) {
      console.error('Failed to fetch work orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateWorkOrder = async (values) => {
    await api.post('/manage/work-order/create', values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateWorkOrder = async (values) => {
    await api.post('/manage/work-order/update', values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleEditClick = (workOrder) => {
    updateForm.setFieldsValue(workOrder);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                size="small"
                value={searchParams.title}
                onChange={handleSearchChange}
                name="title"
                placeholder="工单标题"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                name="status"
                onChange={(value) => handleSearchChange({ target: { name: 'status', value } })}
                allowClear
                placeholder="状态"
                popupMatchSelectWidth={false} // 确保下拉菜单宽度根据内容自适应
              >
                {Object.values(WorkOrderStatus).map((status) => (
                  <Select.Option key={status.value} value={status.value}>
                    {status.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                size="small"
                name="categoryId"
                onChange={(value) => setSearchParams((prev) => ({ ...prev, categoryId: value }))}
                allowClear
                placeholder="选择工单类型"
                popupMatchSelectWidth={false} // 确保下拉菜单宽度根据内容自适应
              >
                {WorkOrderTypes.map((type) => (
                  <Select.Option key={type.id} value={type.id}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Switch
                checked={searchParams.myOrder}
                onChange={(checked) => {
                  setSearchParams((prev) => ({ ...prev, myOrder: checked }));
                }}
                checkedChildren="我的工单"
                unCheckedChildren="所有工单"
              />
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                className="search-button"
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
                新增工单
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/work-order/delete-batch',
                    selectedRows,
                    fetchData,
                  })
                }
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
          <WorkOrderTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
          />
        </Spin>
      </div>
      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
      <WorkOrderCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateWorkOrder}
        form={createForm}
      />
      <UpdateWorkOrderModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateWorkOrder={handleUpdateWorkOrder}
        selectedWorkOrder={selectedWorkOrder}
      />
    </div>
  );
};

export default WorkOrderList;
