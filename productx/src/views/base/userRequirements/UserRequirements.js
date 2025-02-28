import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import UserRequirementsTable from "./UserRequirementsTable";
import UpdateUserRequirementsModal from "./UpdateUserRequirementsModel";
import UserRequirementsCreateFormModal from "./UserRequirementsCreateFormModel";
import UpdateStatusModal from './UpdateStatusModal';
import { useTranslation } from 'react-i18next';

const UserRequirements = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    title: '',
    status: '',
    category: '',
    userId: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [statusForm] = Form.useForm();
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  const statusOptions = [
    { value: 'PENDING', label: t('待处理') },
    { value: 'IN_PROGRESS', label: t('进行中') },
    { value: 'COMPLETED', label: t('已完成') },
    { value: 'REJECTED', label: t('已拒绝') },
    { value: 'ARCHIVED', label: t('已归档') },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      const response = await api.get('/manage/user-requirements/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
      });

      if (response.data) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('fetchDataFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateRequirement = async (values) => {
    try {
      await api.post('/manage/user-requirements/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateRequirement = async (values) => {
    try {
      await api.post('/manage/user-requirements/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleUpdateStatus = async () => {
    try {
      const values = await statusForm.validateFields();
      await api.post('/user-requirements/update-status', values);
      message.success(t('updateSuccess'));
      setIsStatusModalVisible(false);
      statusForm.resetFields();
      await fetchData();
    } catch (error) {
      if (error.errorFields) {
        return; // 表单验证错误，不处理
      }
      message.error(t('updateFailed'));
    }
  };

  const handleEditClick = (requirement) => {
    setSelectedRequirement(requirement);
    setIsUpdateModalVisible(true);
  };

  const handleStatusClick = (requirement) => {
    setSelectedRequirement(requirement);
    setIsStatusModalVisible(true);
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
                value={searchParams.title}
                onChange={(e) => handleSearchChange('title', e.target.value)}
                placeholder={t('需求标题')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange('status', value)}
                placeholder={t('需求状态')}
                allowClear
                style={{ width: 150 }}
                options={statusOptions}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.category}
                onChange={(e) => handleSearchChange('category', e.target.value)}
                placeholder={t('需求类别')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.userId}
                onChange={(e) => handleSearchChange('userId', e.target.value)}
                placeholder={t('提交用户ID')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  {t('添加需求')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/user-requirements/delete-batch',
                    selectedRows,
                    fetchData,
                    t,
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
          <UserRequirementsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleStatusClick={handleStatusClick}
            t={t}
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

      <UserRequirementsCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateRequirement}
        form={createForm}
        t={t}
      />

      <UpdateUserRequirementsModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateRequirement={handleUpdateRequirement}
        selectedRequirement={selectedRequirement}
        t={t}
      />

      <UpdateStatusModal
        isVisible={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        onOk={handleUpdateStatus}
        form={statusForm}
        selectedRequirement={selectedRequirement}
        t={t}
      />
    </div>
  );
};

export default UserRequirements;
