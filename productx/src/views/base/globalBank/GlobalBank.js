import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Modal, Button, Form, Input, message, Spin, Select, Col, Row } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import BankTable from 'src/views/base/globalBank/GlobalBankTable';
import UpdateBankModal from 'src/views/base/globalBank/UpdateGlobalBankModal';
import BankCreateFormModal from 'src/views/base/globalBank/GlobalBankCreateFormModal';

const updateBankStatus = async (id, newStatus) => {
  await api.post('/manage/global-bank/change-status', { id, status: newStatus ? 1 : 0 });
};

const createBank = async (bankData) => {
  await api.post('/manage/global-bank/create', bankData);
};

const updateBank = async (updateData) => {
  await api.put('/manage/global-bank/update', updateData);
};

const BankList = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    bankName: '',
    swiftCode: '',
    country: '',
    city: '',
    status: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedBank, setSelectedBank] = useState(null);

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
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      const response = await api.get('/manage/global-bank/list', {
        params: { 
          currentPage, 
          size: pageSize, 
          ...filteredParams 
        },
      });

      if (response) {
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
    await updateBankStatus(id, newStatus);
    await fetchData();
  };
  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setCurrent(1);
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateBank = async (values) => {
    await createBank(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateBank = async (values) => {
    await updateBank(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleEditClick = (bank) => {
    updateForm.setFieldsValue({ ...bank });
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
                value={searchParams.bankName}
                onChange={handleSearchChange}
                name="bankName"
                placeholder="银行名称"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.swiftCode}
                onChange={handleSearchChange}
                name="swiftCode"
                placeholder="SWIFT代码"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.country}
                onChange={handleSearchChange}
                name="country"
                placeholder="国家"
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.city}
                onChange={handleSearchChange}
                name="city"
                placeholder="城市"
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                name="supported"
                value={searchParams.status}
                onChange={(value) => {
                  setCurrent(1);
                  setSearchParams(prev => ({ ...prev, status: value }));
                }}
                allowClear
                placeholder="是否支持"
              >
                <Select.Option value="true">支持</Select.Option>
                <Select.Option value="false">不支持</Select.Option>
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
                新增银行
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/bank/delete-batch',
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
          <BankTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
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
      <BankCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateBank}
        form={createForm}
      />
      <UpdateBankModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateBank={handleUpdateBank}
        selectedBank={selectedBank}
      />
    </div>
  );
};

export default BankList;
