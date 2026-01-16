import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SysAiOperatorTable from './SysAiOperatorTable';
import UpdateSysAiOperatorModal from './UpdateSysAiOperatorModal';
import SysAiOperatorCreateModal from './SysAiOperatorCreateModal';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ListSysAiOperators = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    internalName: '',
    languageStyle: undefined,
    status: undefined,
    postSourceType: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedOperator, setSelectedOperator] = useState(null);

  const statusOptions = [
    { value: true, label: t('running') || '运行中' },
    { value: false, label: t('paused') || '已暂停' },
  ];

  const languageStyleOptions = [
    { value: 'CASUAL', label: t('casual') || '休闲' },
    { value: 'FORMAL', label: t('formal') || '正式' },
    { value: 'FRIENDLY', label: t('friendly') || '友好' },
    { value: 'PROFESSIONAL', label: t('professional') || '专业' },
  ];

  const postSourceTypeOptions = [
    { value: 'STOCK_POOL', label: t('stockPool') || '素材库' },
    { value: 'AI_GENERATE', label: t('aiGenerate') || 'AI生成' },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === 0 || value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      if (filteredParams.userId) {
        filteredParams.userId = Number(filteredParams.userId);
      }

      const response = await api.get('/manage/sys-ai-operator/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || response);
        setTotalNum(response['totalNum'] || 0);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      message.error(t('fetchDataFailed') || '获取数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (name, value) => {
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
    setCurrent(1);
  };

  const handleCreateOperator = async (values) => {
    try {
      await api.post('/manage/sys-ai-operator/create', values);
      message.success(t('createSuccess') || '创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed') || '创建失败');
    }
  };

  const handleUpdateOperator = async (values) => {
    try {
      await api.post('/manage/sys-ai-operator/update', values);
      message.success(t('updateSuccess') || '更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed') || '更新失败');
    }
  };

  const handleEditClick = (operator) => {
    setSelectedOperator(operator);
    setIsUpdateModalVisible(true);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.post('/manage/sys-ai-operator/change-status', {
        id,
        status,
      });
      message.success(t('updateSuccess') || '更新成功');
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed') || '更新失败');
    }
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection,
  } = UseSelectableRows();

  return (
    <div>
      <div className="card" style={{ marginTop: 0, marginBottom: 0 }}>
        <div className="card-body">
          <Row gutter={16}>
            <Col>
              <Input
                value={searchParams.userId}
                onChange={(e) => handleSearchChange('userId', e.target.value)}
                placeholder={t('userId') || '用户ID'}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.internalName}
                onChange={(e) => handleSearchChange('internalName', e.target.value)}
                placeholder={t('internalName') || '内部代号'}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.languageStyle}
                onChange={(value) => handleSearchChange('languageStyle', value)}
                placeholder={t('languageStyle') || '语言风格'}
                allowClear
                style={{ width: 150 }}
              >
                {languageStyleOptions.map((style) => (
                  <Option key={style.value} value={style.value}>
                    {style.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange('status', value)}
                placeholder={t('status') || '状态'}
                allowClear
                style={{ width: 150 }}
              >
                {statusOptions.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.postSourceType}
                onChange={(value) => handleSearchChange('postSourceType', value)}
                placeholder={t('postSourceType') || '发帖来源'}
                allowClear
                style={{ width: 150 }}
              >
                {postSourceTypeOptions.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  {t('add') || '添加'}
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sys-ai-operator/delete',
                    selectedRows,
                    fetchData,
                    resetSelection,
                    method: 'delete',
                  })}
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
          <SysAiOperatorTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleStatusChange={handleStatusChange}
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

      <SysAiOperatorCreateModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateOperator}
        form={createForm}
        t={t}
        languageStyleOptions={languageStyleOptions}
        postSourceTypeOptions={postSourceTypeOptions}
      />

      <UpdateSysAiOperatorModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateOperator={handleUpdateOperator}
        selectedOperator={selectedOperator}
        t={t}
        languageStyleOptions={languageStyleOptions}
        postSourceTypeOptions={postSourceTypeOptions}
      />
    </div>
  );
};

export default ListSysAiOperators;

