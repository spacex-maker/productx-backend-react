import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, Spin, Row, Col, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import UserAddressTable from "./UserAddressTable";
import UpdateUserAddressModal from "./UpdateUserAddressModal";
import UserAddressDetailModal from "./UserAddressDetailModal";
import UserAddressCreateFormModal from "./UserAddressCreateFormModal";
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const updateAddressStatus = async (id, newStatus) => {
  await api.post('/manage/user-address/change-status', { id, status: newStatus });
};

const createAddress = async (addressData) => {
  await api.post('/manage/user-address/create', addressData);
};

const updateAddress = async (updateData) => {
  await api.put(`/manage/user-address/update`, updateData);
};

const ListUserAddress = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    username: '',
    receiverName: '',
    phone: '',
    detailAddress: '',
    isDefault: undefined
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  useEffect(() => {
    fetchData();
  }, [current, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      if (filteredParams.userId) {
        filteredParams.userId = Number(filteredParams.userId);
      }

      const response = await api.get('/manage/user-address/list-address', {
        params: { currentPage: current, pageSize, ...filteredParams },
      });

      if (response?.data) {
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
    await updateAddressStatus(id, newStatus);
    await fetchData();
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateAddress = async (values) => {
    await createAddress(values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateAddress = async (values) => {
    await updateAddress(values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleEditClick = (address) => {
    setSelectedAddress(address);
    setIsUpdateModalVisible(true);
  };

  const handleDetailClick = (address) => {
    setSelectedAddress(address);
    setIsDetailModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[10, 10]}>
            <Col>
              <Input
                size="small"
                value={searchParams.userId}
                onChange={handleSearchChange}
                name="userId"
                placeholder={t('userId')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.username}
                onChange={handleSearchChange}
                name="username"
                placeholder={t('username')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.receiverName}
                onChange={handleSearchChange}
                name="receiverName"
                placeholder={t('receiverName')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.phone}
                onChange={handleSearchChange}
                name="phone"
                placeholder={t('phone')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.detailAddress}
                onChange={handleSearchChange}
                name="detailAddress"
                placeholder={t('detailAddress')}
                allowClear
                style={{ maxWidth: '150px', minWidth: '100px' }}
              />
            </Col>
            <Col>
              <Select
                size="small"
                className="search-box"
                name="isDefault"
                onChange={(value) => handleSearchChange({target: {name: 'isDefault', value}})}
                allowClear
                placeholder={t('isDefault')}
              >
                <Option value={true}>{t('yes')}</Option>
                <Option value={false}>{t('no')}</Option>
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
                {isLoading ? <Spin /> : t('search')}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                {t('createAddress')}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/user-address/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
              >
                {t('batchDelete')}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <UserAddressTable
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
        current={current}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <UserAddressCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateAddress}
        form={createForm}
      />

      <UpdateUserAddressModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateAddress={handleUpdateAddress}
        selectedAddress={selectedAddress}
      />

      <UserAddressDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        selectedAddress={selectedAddress}
      />

      <style jsx>{`
        .search-container {
          margin-bottom: 10px;
        }
        .search-container .ant-input {
          font-size: 10px;
        }
      `}</style>
    </div>
  );
};

export default ListUserAddress;
