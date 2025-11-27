import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaAiVideoIndustriesTable from './SaAiVideoIndustriesTable';
import UpdateSaAiVideoIndustriesModal from './UpdateSaAiVideoIndustriesModal';
import SaAiVideoIndustriesCreateFormModal from './SaAiVideoIndustriesCreateFormModal';
import SaAiVideoIndustriesDetailModal from './SaAiVideoIndustriesDetailModal';
import { useTranslation } from 'react-i18next';

const SaAiVideoIndustries = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    lang: '',
    industryCode: '',
    industryName: '',
    status: '',
    recommendModels: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedIndustryId, setSelectedIndustryId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection
  } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );
      const response = await api.get('/manage/sa-ai-video-industries/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data || []);
        setTotalNum(response['totalNum'] || 0);
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
    setSearchParams((prev) => ({ ...prev, [field]: value }));
    setCurrent(1);
  };

  const handleCreateIndustry = async (values) => {
    try {
      await api.post('/manage/sa-ai-video-industries/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    }
  };

  const handleUpdateIndustry = async (values) => {
    try {
      await api.post('/manage/sa-ai-video-industries/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      setSelectedIndustry(null);
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
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

    try {
      await api.post('/manage/sa-ai-video-industries/change-status', {
        ids: ids,
        status: status,
      });
      message.success(t('updateSuccess'));
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await api.post('/manage/sa-ai-video-industries/remove', { id });
      message.success(t('deleteSuccess'));
      await fetchData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error(t('deleteFailed'));
    }
  };

  const handleEditClick = (industry) => {
    setSelectedIndustry(industry);
    setIsUpdateModalVisible(true);
  };

  const handleDetailClick = (industry) => {
    setSelectedIndustryId(industry.id);
    setIsDetailModalVisible(true);
  };

  const handleEnableStatusChange = async (id, event) => {
    await handleStatusChange(id, event.target.checked);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

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
              <Select
                value={searchParams.lang}
                onChange={(value) => handleSelectChange(value, 'lang')}
                placeholder={t('selectLang')}
                style={{ width: 150 }}
                allowClear
              >
                <Select.Option value="zh-CN">中文</Select.Option>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="ja">日本語</Select.Option>
                <Select.Option value="ko">한국어</Select.Option>
                <Select.Option value="es">Español</Select.Option>
                <Select.Option value="fr">Français</Select.Option>
                <Select.Option value="de">Deutsch</Select.Option>
                <Select.Option value="it">Italiano</Select.Option>
                <Select.Option value="ru">Русский</Select.Option>
                <Select.Option value="ar">العربية</Select.Option>
              </Select>
            </Col>
            <Col>
              <Input
                value={searchParams.industryCode}
                onChange={handleSearchChange}
                name="industryCode"
                placeholder={t('industryCode')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.industryName}
                onChange={handleSearchChange}
                name="industryName"
                placeholder={t('industryName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.recommendModels}
                onChange={handleSearchChange}
                name="recommendModels"
                placeholder={t('recommendModels')}
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
                <Select.Option value={true}>{t('active')}</Select.Option>
                <Select.Option value={false}>{t('inactive')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
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
                    url: '/manage/sa-ai-video-industries/delete-batch',
                    selectedRows,
                    resetSelection,
                    fetchData,
                  })}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDelete')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('addNew')}
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <SaAiVideoIndustriesTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            handleDetailClick={handleDetailClick}
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

      <SaAiVideoIndustriesCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateIndustry}
        confirmLoading={isLoading}
      />

      <UpdateSaAiVideoIndustriesModal
        visible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          setSelectedIndustry(null);
        }}
        onOk={handleUpdateIndustry}
        initialValues={selectedIndustry}
        confirmLoading={isLoading}
      />

      <SaAiVideoIndustriesDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => {
          setIsDetailModalVisible(false);
          setSelectedIndustryId(null);
        }}
        industryId={selectedIndustryId}
      />
    </div>
  );
};

export default SaAiVideoIndustries;

