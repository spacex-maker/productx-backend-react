import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import CourierTable from 'src/views/base/express/ExpressTable';
import UpdateCourierModal from 'src/views/base/express/UpdateExpressCompanyModal';
import CourierCreateFormModal from 'src/views/base/express/ExpressCompanyCreateFormModal';

const updateCourierStatus = async (id, newStatus) => {
  await api.post('/manage/express/change-status', { id, status: newStatus ? 1 : 0 });
};

const createCourier = async (courierData) => {
  await api.post('/manage/express/create', courierData);
};

const updateCourier = async (updateData) => {
  await api.put('/manage/express/update', updateData);
};

const ExpressList = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    courierName: '',
    courierCode: '',
    status: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedCourier, setSelectedCourier] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const handleDetailClick = (courier) => {
    setSelectedCourier(courier);
    setIsUpdateModalVisible(true);
  };

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
      const response = await api.get('/manage/express/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response && response.data) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked;
    await updateCourierStatus(id, newStatus);
    await fetchData();
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateCourier = async (values) => {
    await createCourier(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateCourier = async (values) => {
    await updateCourier(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleEditClick = (courier) => {
    updateForm.setFieldsValue({
      id: courier.id,
      courierName: courier.courierName,
      courierCode: courier.courierCode,
      status: courier.status,
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
                value={searchParams.courierName}
                onChange={handleSearchChange}
                name="courierName"
                placeholder="快递公司名称"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.courierCode}
                onChange={handleSearchChange}
                name="courierCode"
                placeholder="快递公司代码"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                className="search-box"
                name="status"
                onChange={(value) => handleSearchChange({ target: { name: 'status', value } })}
                allowClear
                placeholder="是否启用"
              >
                <Select.Option value="1">启用</Select.Option>
                <Select.Option value="0">禁用</Select.Option>
              </Select>
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
                新增快递公司
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/sys-couriers/delete-batch',
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
          <CourierTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
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
      <CourierCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateCourier}
        form={createForm}
      />
      <UpdateCourierModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateCourier={handleUpdateCourier}
        selectedCourier={selectedCourier}
      />
    </div>
  );
};

export default ExpressList;
