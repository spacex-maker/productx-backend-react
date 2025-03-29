import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space, Modal } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import SaAiCompaniesTable from "./SaAiCompaniesTable";
import UpdateSaAiCompaniesModel from "./UpdateSaAiCompaniesModel";
import SaAiCompaniesCreateFormModal from "./SaAiCompaniesCreateFormModel";
import { useTranslation } from 'react-i18next';

const SaAiCompanies = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    companyCode: '',
    companyName: '',
    headquarters: '',
    status: '',
    defaultModel: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      const response = await api.get('/manage/sa-ai-companies/list', {
        params: { currentPage, pageSize: pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('获取数据失败', error);
      message.error('获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleSelectChange = (value, field) => {
    setSearchParams(prev => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleCreateCompany = async (values) => {
    try {
      await api.post('/manage/sa-ai-companies/create', values);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleUpdateCompany = async (values) => {
    try {
      await api.post('/manage/sa-ai-companies/update', values);
      message.success('更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleStatusChange = async (ids, status) => {
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    
    if (ids.length === 0) {
      message.warning(t('pleaseSelect'));
      return;
    }

    Modal.confirm({
      title: t('confirmTitle'),
      content: status ? t('enableConfirmTitle') : t('disableConfirmTitle'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await api.post('/manage/sa-ai-companies/change-status', {
            ids: ids,
            status: status,
          });
          message.success(t('updateSuccess'));
          await fetchData();
        } catch (error) {
          message.error(t('updateFailed'));
        }
      },
    });
  };

  const handleEditClick = (company) => {
    setSelectedCompany(company);
    setIsUpdateModalVisible(true);
  };

  const handleEnableStatusChange = async (id, event) => {
    await handleStatusChange(id, event.target.checked);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrent(1);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.companyCode}
                onChange={handleSearchChange}
                name="companyCode"
                placeholder={t('companyCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.companyName}
                onChange={handleSearchChange}
                name="companyName"
                placeholder={t('companyName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.headquarters}
                onChange={handleSearchChange}
                name="headquarters"
                placeholder={t('headquarters')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.defaultModel}
                onChange={handleSearchChange}
                name="defaultModel"
                placeholder={t('defaultModel')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSelectChange(value, 'status')}
                placeholder={t('selectStatus')}
                style={{ width: 150 }}
                allowClear
              >
                <Select.Option value={true}>{t('enabled')}</Select.Option>
                <Select.Option value={false}>{t('disabled')}</Select.Option>
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
                  {t('add')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, true)}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchEnable')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, false)}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDisable')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sa-ai-companies/delete-batch',
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
          <SaAiCompaniesTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleEnableStatusChange={handleEnableStatusChange}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      <SaAiCompaniesCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateCompany}
        confirmLoading={isLoading}
      />

      <UpdateSaAiCompaniesModel
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={handleUpdateCompany}
        initialValues={selectedCompany}
        confirmLoading={isLoading}
      />
    </div>
  );
};

export default SaAiCompanies;
