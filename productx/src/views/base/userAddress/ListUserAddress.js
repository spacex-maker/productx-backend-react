import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, Spin, Row, Col, Select, Space } from 'antd';
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

const deleteAddress = async (id) => {
  await api.delete('/manage/user-address/remove', { data: { id } });
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

  const handleDelete = async (id) => {
    try {
      await deleteAddress(id);
      await fetchData();
    } catch (error) {
      console.error('删除地址失败', error);
    }
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.username}
                onChange={handleSearchChange}
                name="username"
                placeholder={t('username')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.receiverName}
                onChange={handleSearchChange}
                name="receiverName"
                placeholder={t('receiverName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.phone}
                onChange={handleSearchChange}
                name="phone"
                placeholder={t('phone')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.detailAddress}
                onChange={handleSearchChange}
                name="detailAddress"
                placeholder={t('detailAddress')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.isDefault}
                onChange={(value) => handleSearchChange({target: {name: 'isDefault', value}})}
                placeholder={t('isDefault')}
                allowClear
                style={{ width: 150 }}
              >
                <Option value={true}>{t('yes')}</Option>
                <Option value={false}>{t('no')}</Option>
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
                  {t('createAddress')}
                </Button>
                <Button
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
              </Space>
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
            handleDelete={handleDelete}
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
