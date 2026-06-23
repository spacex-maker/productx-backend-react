import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Input, message, Spin, Col, Row, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaAiVoiceModelsTable from './SaAiVoiceModelsTable';
import UpdateSaAiVoiceModelsModal from './UpdateSaAiVoiceModelsModal';
import SaAiVoiceModelsCreateFormModal from './SaAiVoiceModelsCreateFormModal';
import { useTranslation } from 'react-i18next';

const SaAiVoiceModels = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    engineModelCode: '',
    voiceCode: '',
    voiceName: '',
    language: '',
    gender: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);

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
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      const response = await api.get('/manage/sa-ai-voice-models/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });
      setData(response?.data || []);
      setTotalNum(response?.totalNum || 0);
    } catch (error) {
      message.error(t('fetchFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrent(1);
  };

  const handleSelectChange = (value, field) => {
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleCreate = async (values) => {
    try {
      await api.post('/manage/sa-ai-voice-models/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdate = async (values) => {
    try {
      await api.post('/manage/sa-ai-voice-models/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      setSelectedVoice(null);
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleStatusChange = async (ids, status) => {
    const idList = Array.isArray(ids) ? ids : [ids];
    if (idList.length === 0) {
      message.warning(t('pleaseSelect'));
      return;
    }
    try {
      await api.post('/manage/sa-ai-voice-models/change-status', { ids: idList, status });
      message.success(t('updateSuccess'));
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <Row gutter={[16, 16]}>
          <Col><Input name="engineModelCode" value={searchParams.engineModelCode} onChange={handleSearchChange} placeholder={t('engineModelCode')} allowClear style={{ width: 150 }} /></Col>
          <Col><Input name="voiceCode" value={searchParams.voiceCode} onChange={handleSearchChange} placeholder={t('voiceCode')} allowClear style={{ width: 150 }} /></Col>
          <Col><Input name="voiceName" value={searchParams.voiceName} onChange={handleSearchChange} placeholder={t('voiceName')} allowClear style={{ width: 150 }} /></Col>
          <Col><Input name="language" value={searchParams.language} onChange={handleSearchChange} placeholder={t('language')} allowClear style={{ width: 120 }} /></Col>
          <Col>
            <Select value={searchParams.status} onChange={(value) => handleSelectChange(value, 'status')} placeholder={t('selectStatus')} style={{ width: 120 }} allowClear>
              <Select.Option value={true}>{t('active')}</Select.Option>
              <Select.Option value={false}>{t('inactive')}</Select.Option>
            </Select>
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={fetchData} disabled={isLoading}>{isLoading ? <Spin /> : t('search')}</Button>
              <Button type="primary" onClick={() => handleStatusChange(selectedRows, true)} disabled={selectedRows.length === 0}>{t('batchEnable')}</Button>
              <Button type="primary" onClick={() => handleStatusChange(selectedRows, false)} disabled={selectedRows.length === 0}>{t('batchDisable')}</Button>
              <Button type="primary" onClick={() => HandleBatchDelete({ url: '/manage/sa-ai-voice-models/delete-batch', selectedRows, fetchData })} disabled={selectedRows.length === 0}>{t('batchDelete')}</Button>
              <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>{t('addNew')}</Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Spin spinning={isLoading}>
        <SaAiVoiceModelsTable
          data={data}
          selectAll={selectAll}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          handleEditClick={(item) => { setSelectedVoice(item); setIsUpdateModalVisible(true); }}
          handleEnableStatusChange={(id, checked) => handleStatusChange(id, checked)}
        />
      </Spin>

      <Pagination totalPages={totalPages} current={currentPage} onPageChange={setCurrent} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrent(1); }} />

      <SaAiVoiceModelsCreateFormModal visible={isCreateModalVisible} onCancel={() => setIsCreateModalVisible(false)} onOk={handleCreate} confirmLoading={isLoading} />
      <UpdateSaAiVoiceModelsModal visible={isUpdateModalVisible} onCancel={() => { setIsUpdateModalVisible(false); setSelectedVoice(null); }} onOk={handleUpdate} initialValues={selectedVoice} confirmLoading={isLoading} />
    </div>
  );
};

export default SaAiVoiceModels;
