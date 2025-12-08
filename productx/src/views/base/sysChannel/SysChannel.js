import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Space, Select, Switch } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SysChannelTable from './SysChannelTable';
import UpdateSysChannelModal from './UpdateSysChannelModal';
import SysChannelCreateFormModal from './SysChannelCreateFormModal';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const SysChannel = () => {
  const { t } = useTranslation();

  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    channelKey: '',
    name: '',
    type: undefined,
    isActive: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedChannel, setSelectedChannel] = useState(null);

  const statusOptions = [
    { value: true, label: t('active') || '启用' },
    { value: false, label: t('inactive') || '禁用' }
  ];

  const typeOptions = [
    { value: 'SYSTEM', label: t('systemRecommend') || '系统推荐' },
    { value: 'TAG', label: t('tagAggregation') || '标签聚合' },
    { value: 'MANUAL', label: t('manualMaintenance') || '人工维护' },
  ];

  const layoutModeOptions = [
    { value: 'MASONRY', label: t('masonry') || '瀑布流' },
    { value: 'GRID', label: t('grid') || '网格' },
    { value: 'FEED', label: t('feed') || '单列视频流' },
  ];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );
      const response = await api.get('/manage/sys-channel/list', {
        params: { currentPage, size: pageSize, ...filteredParams },
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

  const handleCreateChannel = async (values) => {
    try {
      await api.post('/manage/sys-channel/create', values);
      message.success(t('createSuccess') || '创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('createFailed') || '创建失败');
    }
  };

  const handleUpdateChannel = async (values) => {
    try {
      await api.post('/manage/sys-channel/update', values);
      message.success(t('updateSuccess') || '更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed') || '更新失败');
    }
  };

  const handleEditClick = (channel) => {
    setSelectedChannel(channel);
    setIsUpdateModalVisible(true);
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
                value={searchParams.channelKey}
                onChange={(e) => handleSearchChange('channelKey', e.target.value)}
                placeholder={t('channelKey') || '频道标识'}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.name}
                onChange={(e) => handleSearchChange('name', e.target.value)}
                placeholder={t('name') || '显示名称'}
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.type}
                onChange={(value) => handleSearchChange('type', value)}
                placeholder={t('type') || '类型'}
                allowClear
                style={{ width: 150 }}
              >
                {typeOptions.map((type) => (
                  <Option key={type.value} value={type.value}>
                    {type.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.isActive}
                onChange={(value) => handleSearchChange('isActive', value)}
                placeholder={t('status')}
                allowClear
                style={{ width: 150 }}
                options={statusOptions}
              />
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
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sys-channel/delete-batch',
                    selectedRows,
                    fetchData,
                    resetSelection,
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
          <SysChannelTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
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

      <SysChannelCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateChannel}
        form={createForm}
        t={t}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        layoutModeOptions={layoutModeOptions}
      />

      <UpdateSysChannelModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateChannel={handleUpdateChannel}
        selectedChannel={selectedChannel}
        t={t}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        layoutModeOptions={layoutModeOptions}
      />
    </div>
  );
};

export default SysChannel;

