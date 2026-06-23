import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Input, message, Spin, Col, Row, Select, Space, Modal } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaAiVoiceCommentTable from './SaAiVoiceCommentTable';
import UpdateSaAiVoiceCommentModal from './UpdateSaAiVoiceCommentModal';
import { useTranslation } from 'react-i18next';

const SaAiVoiceComment = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    voiceId: '',
    userId: '',
    content: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

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
      const response = await api.get('/manage/sa-ai-voice-comment/list', {
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

  const handleUpdateComment = async (values) => {
    try {
      await api.put('/manage/sa-ai-voice-comment/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      setSelectedComment(null);
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

    Modal.confirm({
      title: t('confirmTitle'),
      content: status === 1 ? t('approveConfirmTitle') : t('rejectConfirmTitle'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await api.post('/manage/sa-ai-voice-comment/change-status', { ids: idList, status });
          message.success(t('updateSuccess'));
          await fetchData();
        } catch (error) {
          message.error(t('updateFailed'));
        }
      },
    });
  };

  const statusOptions = [
    { value: 0, label: t('pending') },
    { value: 1, label: t('approved') },
    { value: -1, label: t('deleted') },
  ];

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <Row gutter={[16, 16]} className="mb-3">
        <Col><Input name="voiceId" value={searchParams.voiceId} onChange={handleSearchChange} placeholder={t('voiceId')} allowClear style={{ width: 140 }} /></Col>
        <Col><Input name="userId" value={searchParams.userId} onChange={handleSearchChange} placeholder={t('userId')} allowClear style={{ width: 140 }} /></Col>
        <Col><Input name="content" value={searchParams.content} onChange={handleSearchChange} placeholder={t('content')} allowClear style={{ width: 180 }} /></Col>
        <Col>
          <Select value={searchParams.status} onChange={(value) => handleSelectChange(value, 'status')} placeholder={t('selectStatus')} style={{ width: 140 }} allowClear options={statusOptions} />
        </Col>
        <Col>
          <Space>
            <Button type="primary" onClick={fetchData} disabled={isLoading}>{isLoading ? <Spin /> : t('search')}</Button>
            <Button type="primary" onClick={() => handleStatusChange(selectedRows, 1)} disabled={selectedRows.length === 0}>{t('batchApprove')}</Button>
            <Button type="primary" onClick={() => handleStatusChange(selectedRows, -1)} disabled={selectedRows.length === 0}>{t('batchDelete')}</Button>
            <Button type="primary" onClick={() => HandleBatchDelete({ url: '/manage/sa-ai-voice-comment/delete-batch', selectedRows, fetchData })} disabled={selectedRows.length === 0}>{t('batchRemove')}</Button>
          </Space>
        </Col>
      </Row>

      <Spin spinning={isLoading}>
        <SaAiVoiceCommentTable
          data={data}
          selectAll={selectAll}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          handleEditClick={(item) => { setSelectedComment(item); setIsUpdateModalVisible(true); }}
          handleStatusChange={handleStatusChange}
        />
      </Spin>

      <Pagination totalPages={totalPages} current={currentPage} onPageChange={setCurrent} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrent(1); }} />

      <UpdateSaAiVoiceCommentModal
        visible={isUpdateModalVisible}
        onCancel={() => { setIsUpdateModalVisible(false); setSelectedComment(null); }}
        onOk={handleUpdateComment}
        initialValues={selectedComment}
        confirmLoading={isLoading}
      />
    </div>
  );
};

export default SaAiVoiceComment;
