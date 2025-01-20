import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Spin, Col, Row, Modal, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import SysPaymentMethodsTable from "./SysPaymentMethodsTable";
import UpdateSysPaymentMethodsModal from "./UpdateSysPaymentMethodsModel";
import SysPaymentMethodsCreateFormModal from "./SysPaymentMethodsCreateFormModel";
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { Option } = Select;

const SysPaymentMethods = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    paymentMethodName: '',
    descriptionEn: '',
    descriptionZh: '',
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      const response = await api.get('/manage/sys-payment-methods/page', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('getFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleStatusChange = async (id, event) => {
    const newStatus = event.target.checked;
    Modal.confirm({
      title: t('confirmStatusChange'),
      content: t('confirmPaymentMethodStatusChangeMessage'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await api.post('/manage/sys-payment-methods/change-status', {
            ids: [id],
            status: newStatus
          });
          message.success(t('updateSuccess'));
          await fetchData();
        } catch (error) {
          message.error(t('updateFailed'));
        }
      },
      onCancel() {
        // 取消时不做任何操作
      },
    });
  };

  const handleCreatePaymentMethod = async (values) => {
    try {
      await api.post('/manage/sys-payment-methods/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdatePaymentMethod = async (values) => {
    try {
      await api.post('/manage/sys-payment-methods/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
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
                value={searchParams.paymentMethodName}
                onChange={handleSearchChange}
                name="paymentMethodName"
                placeholder={t('paymentMethodName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.descriptionEn}
                onChange={handleSearchChange}
                name="descriptionEn"
                placeholder={t('englishDescription')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.descriptionZh}
                onChange={handleSearchChange}
                name="descriptionZh"
                placeholder={t('chineseDescription')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange({
                  target: { name: 'status', value }
                })}
                placeholder={t('status')}
                allowClear
                style={{ width: 150 }}
              >
                <Option value={true}>{t('enabled')}</Option>
                <Option value={false}>{t('disabled')}</Option>
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
                  {t('addPaymentMethod')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sys-payment-methods/delete-batch',
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
          <SysPaymentMethodsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleStatusChange={handleStatusChange}
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

      <SysPaymentMethodsCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreatePaymentMethod}
        form={createForm}
      />

      <UpdateSysPaymentMethodsModal
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={handleUpdatePaymentMethod}
        form={updateForm}
        selectedPaymentMethod={selectedPaymentMethod}
      />
    </div>
  );
};

export default SysPaymentMethods;
