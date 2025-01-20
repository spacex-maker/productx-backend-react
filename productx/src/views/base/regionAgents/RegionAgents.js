import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, Spin, Select, Col, Row, DatePicker, message, Tooltip, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import RegionAgentsTable from './RegionAgentsTable';
import RegionAgentsCreateFormModal from './RegionAgentsCreateFormModal';
import UpdateRegionAgentsModal from './UpdateRegionAgentsModal';
import RegionAgentsDetailModal from './RegionAgentsDetailModal';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const RegionAgents = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    agentName: '',
    agentType: '',
    regionCode: '',
    regionName: '',
    agentLevel: '',
    isExclusive: '',
    auditStatus: '',
    status: '',
    startTime: null,
    endTime: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedAgentDetail, setSelectedAgentDetail] = useState(null);
  const [agentTypes, setAgentTypes] = useState([]);
  const [agentTypesLoading, setAgentTypesLoading] = useState(false);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams)
          .filter(([_, value]) => value !== '' && value !== null)
          .map(([key, value]) => {
            if (key === 'startTime') {
              return [key, dayjs(value).startOf('day').format('YYYY-MM-DD HH:mm:ss')];
            }
            if (key === 'endTime') {
              return [key, dayjs(value).endOf('day').format('YYYY-MM-DD HH:mm:ss')];
            }
            return [key, value];
          })
      );

      const response = await api.get('/manage/region-agents/page', {
        params: { 
          currentPage, 
          size: pageSize, 
          ...filteredParams 
        }
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

  const handleSearchChange = (name, value) => {
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAgent = async (values) => {
    try {
      await api.post('/manage/region-agents/create', values);
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('创建失败', error);
    }
  };

  const handleUpdateAgent = async (values) => {
    try {
      await api.post('/manage/region-agents/update', values);
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('更新失败', error);
    }
  };

  const handleViewDetail = (record) => {
    console.log('详情数据:', record);
    setSelectedAgentDetail(record);
    setIsDetailModalVisible(true);
  };

  const handleEditClick = (record) => {
    setSelectedAgent(record);
    setIsUpdateModalVisible(true);
  };

  const fetchAgentTypes = async () => {
    setAgentTypesLoading(true);
    try {
      const response = await api.get('/manage/region-agents/list-type');
      if (response) {
        setAgentTypes(response);
      }
    } catch (error) {
      console.error('获取代理类型失败:', error);
      message.error('获取代理类型失败');
    } finally {
      setAgentTypesLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentTypes();
  }, []);

  return (
    <div className="page-container">
      <div className="mb-3">
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <Input
              placeholder={t('pleaseInputAgentName')}
              onChange={(e) => handleSearchChange('agentName', e.target.value)}
              style={{ width: 150 }}
              allowClear
            />
          </Col>
          <Col>
            <Select
              placeholder={t('pleaseSelectAgentType')}
              allowClear
              loading={agentTypesLoading}
              onChange={(value) => handleSearchChange('agentType', value)}
              style={{ width: 150 }}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ minWidth: '160px' }}
            >
              {agentTypes.map(type => (
                <Select.Option key={type.code} value={type.code}>
                  <Tooltip title={type.description}>
                    {type.name}
                  </Tooltip>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Input
              placeholder={t('pleaseInputRegionCode')}
              onChange={(e) => handleSearchChange('regionCode', e.target.value)}
              style={{ width: 150 }}
              allowClear
            />
          </Col>
          <Col>
            <Input
              placeholder={t('pleaseInputRegionName')}
              onChange={(e) => handleSearchChange('regionName', e.target.value)}
              style={{ width: 150 }}
              allowClear
            />
          </Col>
          <Col>
            <Select
              placeholder={t('pleaseSelectAgentLevel')}
              allowClear
              onChange={(value) => handleSearchChange('agentLevel', value)}
              style={{ width: 150 }}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ minWidth: '160px' }}
            >
              <Select.Option value={1}>{t('primaryAgent')}</Select.Option>
              <Select.Option value={2}>{t('secondaryAgent')}</Select.Option>
              <Select.Option value={3}>{t('tertiaryAgent')}</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder={t('pleaseSelectIsExclusive')}
              allowClear
              onChange={(value) => handleSearchChange('isExclusive', value)}
              style={{ width: 150 }}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ minWidth: '160px' }}
            >
              <Select.Option value={1}>{t('yes')}</Select.Option>
              <Select.Option value={0}>{t('no')}</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder={t('pleaseSelectAuditStatus')}
              allowClear
              onChange={(value) => handleSearchChange('auditStatus', value)}
              style={{ width: 150 }}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ minWidth: '160px' }}
            >
              <Select.Option value={0}>{t('pendingAudit')}</Select.Option>
              <Select.Option value={1}>{t('approved')}</Select.Option>
              <Select.Option value={2}>{t('rejected')}</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              placeholder={t('pleaseSelectStatus')}
              allowClear
              onChange={(value) => handleSearchChange('status', value)}
              style={{ width: 150 }}
              dropdownMatchSelectWidth={false}
              dropdownStyle={{ minWidth: '160px' }}
            >
              <Select.Option value={1}>{t('enabled')}</Select.Option>
              <Select.Option value={0}>{t('disabled')}</Select.Option>
            </Select>
          </Col>
          <Col>
            <DatePicker.RangePicker
              placeholder={[t('cooperationStartDate'), t('cooperationEndDate')]}
              onChange={(dates) => {
                if (dates) {
                  handleSearchChange('startTime', dates[0]);
                  handleSearchChange('endTime', dates[1]);
                } else {
                  handleSearchChange('startTime', null);
                  handleSearchChange('endTime', null);
                }
              }}
              style={{ width: 280 }}
            />
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={fetchData}>
                {t('search')}
              </Button>
              <Button onClick={() => {
                setSearchParams({
                  agentName: '',
                  agentType: '',
                  regionCode: '',
                  regionName: '',
                  agentLevel: '',
                  isExclusive: '',
                  auditStatus: '',
                  status: '',
                  startTime: null,
                  endTime: null,
                });
              }}>
                {t('reset')}
              </Button>
              <Button
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                {t('createAgent')}
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <div className="table-container">
        <Spin spinning={isLoading}>
          <RegionAgentsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleViewDetail={handleViewDetail}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={Math.ceil(totalNum / pageSize)}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <RegionAgentsCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateAgent}
        form={createForm}
      />

      <UpdateRegionAgentsModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onFinish={handleUpdateAgent}
        form={updateForm}
        initialValues={selectedAgent}
      />

      <RegionAgentsDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        data={selectedAgentDetail}
      />
    </div>
  );
};

export default RegionAgents;
