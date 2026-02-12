import React, { useState, useEffect } from 'react';
import { Button, Form, Input, message, Spin, Col, Row, Modal, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import AppProductPackagesTable from './AppProductPackagesTable';
import UpdateAppProductPackagesModal from './UpdateAppProductPackagesModal';
import AppProductPackagesCreateFormModal from './AppProductPackagesCreateFormModal';
import { useTranslation } from 'react-i18next';
import api from 'src/axiosInstance';

const { Option } = Select;

const AppProductPackages = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    skuCode: '',
    type: undefined,
    name: '',
    status: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined)
      );
      const response = await api.get('/manage/app-product-packages/page', {
        params: { currentPage, pageSize, ...filteredParams },
      });
      if (response) {
        const list = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
        const total = response.totalNum ?? response.data?.totalNum ?? 0;
        setData(list);
        setTotalNum(total);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('getFailed') || '获取失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target || {};
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (values) => {
    setCreateLoading(true);
    try {
      await api.post('/manage/app-product-packages/create', values);
      message.success(t('createSuccess') || '创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed') || '创建失败');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    setUpdateLoading(true);
    try {
      await api.post('/manage/app-product-packages/update', values);
      message.success(t('updateSuccess') || '更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed') || '更新失败');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize) || 1;
  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows();

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.skuCode}
                onChange={handleSearchChange}
                name="skuCode"
                placeholder="SKU码"
                allowClear
                style={{ width: 160 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.name}
                onChange={handleSearchChange}
                name="name"
                placeholder={t('packageName') || '套餐名称'}
                allowClear
                style={{ width: 140 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.type}
                onChange={(value) => setSearchParams((p) => ({ ...p, type: value }))}
                placeholder={t('type') || '类型'}
                allowClear
                style={{ width: 120 }}
              >
                <Option value={1}>充值</Option>
                <Option value={2}>订阅</Option>
                <Option value={3}>活动</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => setSearchParams((p) => ({ ...p, status: value }))}
                placeholder={t('status') || '状态'}
                allowClear
                style={{ width: 100 }}
              >
                <Option value={0}>下架</Option>
                <Option value={1}>上架</Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin size="small" /> : null} {t('search') || '查询'}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  {t('add') || '新增'}
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    HandleBatchDelete({
                      url: '/manage/app-product-packages/delete-batch',
                      selectedRows,
                      fetchData,
                    })
                  }
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete') || '批量删除'}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <AppProductPackagesTable
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

      <AppProductPackagesCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        form={createForm}
        confirmLoading={createLoading}
      />

      <UpdateAppProductPackagesModal
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={handleUpdate}
        form={updateForm}
        selectedRow={selectedRow}
        confirmLoading={updateLoading}
      />
    </div>
  );
};

export default AppProductPackages;
