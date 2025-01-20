import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, Spin, Row, Col, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import UserAccountBankTable from "./UserAccountBankTable";
import UpdateUserAccountBankModal from "./UpdateUserAccountBankModal";
import UserAccountBankDetailModal from "./UserAccountBankDetailModal";
import UserAccountBankCreateFormModal from "./UserAccountBankCreateFormModal";
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ListUserAccountBank = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    swiftCode: '',
    currencyCode: '',
    isActive: undefined
  });

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchData();
  }, [searchParams]);

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

      const response = await api.get('/manage/user-account-bank/list-user-bank', {
        params: { 
          currentPage: current, 
          pageSize, 
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

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setCurrent(1);
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateAccount = async (values) => {
    // 创建账户逻辑
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateAccount = async (values) => {
    try {
      await api.put('/manage/user-account-bank/update', {
        ...values,
        id: selectedAccount.id  // 确保包含要更新的账户ID
      });
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();  // 刷新数据
    } catch (error) {
      console.error('更新账户失败:', error);
    }
  };

  const handleEditClick = (account) => {
    setSelectedAccount(account);
    setIsUpdateModalVisible(true);
  };

  const handleDetailClick = (account) => {
    setSelectedAccount(account);
    setIsDetailModalVisible(true);
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
              <Input
                value={searchParams.bankName}
                onChange={handleSearchChange}
                name="bankName"
                placeholder={t('bankName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.accountNumber}
                onChange={handleSearchChange}
                name="accountNumber"
                placeholder={t('accountNumber')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.accountHolderName}
                onChange={handleSearchChange}
                name="accountHolderName"
                placeholder={t('accountHolderName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.swiftCode}
                onChange={handleSearchChange}
                name="swiftCode"
                placeholder={t('swiftCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.currencyCode}
                onChange={handleSearchChange}
                name="currencyCode"
                placeholder={t('currencyCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.isActive}
                onChange={(value) => handleSearchChange({ target: { name: 'isActive', value }})}
                placeholder={t('isActive')}
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
                  {t('createAccount')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/user-account-bank/delete-batch',
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
          <UserAccountBankTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
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

      <UserAccountBankCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateAccount}
        form={createForm}
      />

      <UpdateUserAccountBankModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateAccount={handleUpdateAccount}
        selectedAccount={selectedAccount}
      />

      <UserAccountBankDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        selectedAccount={selectedAccount}
      />

      <style>
        {`
          .ant-input::placeholder {
            color: #bfbfbf;
          }
          .ant-select-selection-placeholder {
            color: #bfbfbf;
          }
        `}
      </style>
    </div>
  );
};

export default ListUserAccountBank;
