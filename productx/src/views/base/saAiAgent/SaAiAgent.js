import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space, Modal, Tabs } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaAiAgentTable from './SaAiAgentTable';
import UpdateSaAiAgentModel from './UpdateSaAiAgentModel';
import UpdateSaAiAgentSystemModel from './UpdateSaAiAgentSystemModel';
import SaAiAgentCreateFormModal from './SaAiAgentCreateFormModel';
import SaAiAgentSystemCreateFormModal from './SaAiAgentSystemCreateFormModel';
import { useTranslation } from 'react-i18next';

const SaAiAgent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('user');
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [companiesData, setCompaniesData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    name: '',
    modelType: '',
    roles: '',
    mbtiCode: '',
    status: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isSystemCreateModalVisible, setIsSystemCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    fetchData();
    fetchCompaniesAndModels();
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    console.log('companiesData 发生变化:', companiesData);
  }, [companiesData]);

  const fetchCompaniesAndModels = async () => {
    try {
      const companies = await api.get('/manage/sa-ai-companies/company-and-model-tree');
      setCompaniesData(companies);
    } catch (error) {
      console.error('获取公司和模型数据失败:', error);
      message.error(t('fetchFailed'));
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.entries(searchParams).filter(([_, value]) => value !== '');
      const url = activeTab === 'user' ? '/manage/sa-ai-agent/list' : '/manage/sa-ai-agent/list-system';
      
      const { data, totalNum } = await api.get(url, {
        params: { currentPage, pageSize: pageSize, ...Object.fromEntries(filteredParams) },
      });

      setData(data || []);
      setTotalNum(totalNum || 0);
    } catch (error) {
      console.error('获取数据失败', error);
      message.error(t('fetchFailed'));
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
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleCreateAgent = async (values) => {
    try {
      const submitData = {
        name: values.name,
        avatarUrl: values.avatarUrl,
        bgImg: values.bgImg,
        modelType: values.modelType,
        roles: values.roles,
        mbtiCode: values.mbtiCode,
        status: values.status,
        prompt: values.prompt,
        temperature: values.temperature,
        maxTokens: values.maxTokens,
        isSystem: values.isSystem,
      };
      await api.post('/manage/sa-ai-agent/create', submitData);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      setIsSystemCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('创建失败:', error);
      message.error(error.response?.data?.message || '创建失败');
    }
  };

  const handleUpdateAgent = async (values) => {
    try {
      const submitData = {
        ...values,
        id: values.id,
        bgImg: values.bgImg,
      };
      const response = await api.post('/manage/sa-ai-agent/update', submitData);
      if (response) {
        message.success(t('updateSuccess'));
        setIsUpdateModalVisible(false);
        updateForm.resetFields();
        await fetchData();
      }
    } catch (error) {
      console.error('更新失败:', error);
      message.error(error.response?.data?.message || t('updateFailed'));
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
      content: status === 'active' ? t('enableConfirmTitle') : t('disableConfirmTitle'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await api.post('/manage/sa-ai-agent/change-status', {
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

  const handleEditClick = (agent) => {
    setSelectedAgent(agent);
    setIsUpdateModalVisible(true);
  };

  const handleEnableStatusChange = async (id, event) => {
    await handleStatusChange([id], event.target.checked ? 'active' : 'inactive');
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
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setCurrent(1);
          setSearchParams({
            userId: '',
            name: '',
            modelType: '',
            roles: '',
            mbtiCode: '',
            status: '',
          });
        }}
        items={[
          {
            key: 'user',
            label: t('userAiAgent'),
            children: (
              <>
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
                          value={searchParams.name}
                          onChange={handleSearchChange}
                          name="name"
                          placeholder={t('agentName')}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Col>
                      <Col>
                        <Input
                          value={searchParams.modelType}
                          onChange={handleSearchChange}
                          name="modelType"
                          placeholder={t('modelType')}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Col>
                      <Col>
                        <Input
                          value={searchParams.roles}
                          onChange={handleSearchChange}
                          name="roles"
                          placeholder={t('roles')}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Col>
                      <Col>
                        <Input
                          value={searchParams.mbtiCode}
                          onChange={handleSearchChange}
                          name="mbtiCode"
                          placeholder={t('mbtiCode')}
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
                          <Select.Option value="active">{t('active')}</Select.Option>
                          <Select.Option value="inactive">{t('inactive')}</Select.Option>
                        </Select>
                      </Col>
                      <Col>
                        <Space>
                          <Button type="primary" onClick={fetchData} disabled={isLoading}>
                            {isLoading ? <Spin /> : t('search')}
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => handleStatusChange(selectedRows, 'active')}
                            disabled={selectedRows.length === 0}
                          >
                            {t('batchEnable')}
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => handleStatusChange(selectedRows, 'inactive')}
                            disabled={selectedRows.length === 0}
                          >
                            {t('batchDisable')}
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => HandleBatchDelete({
                              url: '/manage/sa-ai-agent/delete-batch',
                              selectedRows,
                              fetchData,
                              resetSelection: () => handleSelectAll(false, [])
                            })}
                            disabled={selectedRows.length === 0}
                          >
                            {t('batchDelete')}
                          </Button>
                          <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                            {t('addNew')}
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="table-responsive">
                  <Spin spinning={isLoading}>
                    <SaAiAgentTable
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
              </>
            ),
          },
          {
            key: 'system',
            label: t('systemAiAgent'),
            children: (
              <>
                <div className="mb-3">
                  <div className="search-container">
                    <Row gutter={[16, 16]}>
                      <Col>
                        <Input
                          value={searchParams.name}
                          onChange={handleSearchChange}
                          name="name"
                          placeholder={t('agentName')}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Col>
                      <Col>
                        <Input
                          value={searchParams.modelType}
                          onChange={handleSearchChange}
                          name="modelType"
                          placeholder={t('modelType')}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Col>
                      <Col>
                        <Input
                          value={searchParams.roles}
                          onChange={handleSearchChange}
                          name="roles"
                          placeholder={t('roles')}
                          allowClear
                          style={{ width: 150 }}
                        />
                      </Col>
                      <Col>
                        <Input
                          value={searchParams.mbtiCode}
                          onChange={handleSearchChange}
                          name="mbtiCode"
                          placeholder={t('mbtiCode')}
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
                          <Select.Option value="active">{t('active')}</Select.Option>
                          <Select.Option value="inactive">{t('inactive')}</Select.Option>
                        </Select>
                      </Col>
                      <Col>
                        <Space>
                          <Button type="primary" onClick={fetchData} disabled={isLoading}>
                            {isLoading ? <Spin /> : t('search')}
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => handleStatusChange(selectedRows, 'active')}
                            disabled={selectedRows.length === 0}
                          >
                            {t('batchEnable')}
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => handleStatusChange(selectedRows, 'inactive')}
                            disabled={selectedRows.length === 0}
                          >
                            {t('batchDisable')}
                          </Button>
                          <Button
                            type="primary"
                            onClick={() => HandleBatchDelete({
                              url: '/manage/sa-ai-agent/delete-batch',
                              selectedRows,
                              fetchData,
                              resetSelection: () => handleSelectAll(false, [])
                            })}
                            disabled={selectedRows.length === 0}
                          >
                            {t('batchDelete')}
                          </Button>
                          <Button type="primary" onClick={() => setIsSystemCreateModalVisible(true)}>
                            {t('addNew')}
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                </div>

                <div className="table-responsive">
                  <Spin spinning={isLoading}>
                    <SaAiAgentTable
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
              </>
            ),
          },
        ]}
      />

      <SaAiAgentCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        onOk={handleCreateAgent}
        confirmLoading={isLoading}
        companiesData={companiesData || []}
      />

      <SaAiAgentSystemCreateFormModal
        visible={isSystemCreateModalVisible}
        onCancel={() => {
          setIsSystemCreateModalVisible(false);
          createForm.resetFields();
        }}
        onOk={handleCreateAgent}
        confirmLoading={isLoading}
        companiesData={companiesData || []}
      />

      {activeTab === 'user' ? (
        <UpdateSaAiAgentModel
          visible={isUpdateModalVisible}
          onCancel={() => {
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
          }}
          onOk={handleUpdateAgent}
          initialValues={selectedAgent}
          confirmLoading={isLoading}
          companiesData={companiesData || []}
        />
      ) : (
        <UpdateSaAiAgentSystemModel
          visible={isUpdateModalVisible}
          onCancel={() => {
            setIsUpdateModalVisible(false);
            updateForm.resetFields();
          }}
          onOk={handleUpdateAgent}
          initialValues={selectedAgent}
          confirmLoading={isLoading}
          companiesData={companiesData || []}
        />
      )}
    </div>
  );
};

export default SaAiAgent;
