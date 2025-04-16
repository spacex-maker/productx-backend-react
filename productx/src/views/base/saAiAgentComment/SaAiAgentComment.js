import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaAiAgentCommentTable from './SaAiAgentCommentTable';
import UpdateSaAiAgentCommentModel from './UpdateSaAiAgentCommentModel';
import SaAiAgentCommentCreateFormModal from './SaAiAgentCommentCreateFormModel';
import { useTranslation } from 'react-i18next';

const SaAiAgentComment = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    agentId: '',
    parentId: '',
    userId: '',
    content: '',
    status: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '')
      );
      const response = await api.get('/manage/sa-ai-agent-comment/list', {
        params: { currentPage, pageSize, ...filteredParams },
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

  const handleCreateComment = async (values) => {
    try {
      await api.post('/manage/sa-ai-agent-comment/create', values);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleUpdateComment = async (values) => {
    try {
      await api.put('/manage/sa-ai-agent-comment/update', {
        ...values,
        id: selectedComment?.id
      });
      message.success('更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('更新失败:', error);
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
      content: status === 1 ? t('approveConfirmTitle') : status === 2 ? t('blockConfirmTitle') : t('rejectConfirmTitle'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await api.post('/manage/sa-ai-agent-comment/change-status', {
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

  const handleEditClick = (comment) => {
    setSelectedComment(comment);
    setIsUpdateModalVisible(true);
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

  const statusOptions = [
    { value: 0, label: t('pending') },
    { value: 1, label: t('approved') },
    { value: 2, label: t('blocked') },
    { value: -1, label: t('deleted') },
  ];

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.agentId}
                onChange={handleSearchChange}
                name="agentId"
                placeholder={t('agentId')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
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
                value={searchParams.content}
                onChange={handleSearchChange}
                name="content"
                placeholder={t('content')}
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
                options={statusOptions}
              />
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, 1)}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchApprove')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, 2)}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchBlock')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, -1)}
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
          <SaAiAgentCommentTable
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
        onPageSizeChange={handlePageSizeChange}
      />

      <SaAiAgentCommentCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateComment}
        confirmLoading={isLoading}
      />

      <UpdateSaAiAgentCommentModel
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={handleUpdateComment}
        initialValues={selectedComment}
        confirmLoading={isLoading}
      />
    </div>
  );
};

export default SaAiAgentComment;
