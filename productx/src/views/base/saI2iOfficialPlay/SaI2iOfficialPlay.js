import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Input, message, Spin, Col, Row, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaI2iOfficialPlayTable from './SaI2iOfficialPlayTable';
import UpdateSaI2iOfficialPlayModal from './UpdateSaI2iOfficialPlayModal';
import SaI2iOfficialPlayCreateFormModal from './SaI2iOfficialPlayCreateFormModal';
import { useTranslation } from 'react-i18next';

const SaI2iOfficialPlay = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    playCode: '',
    playName: '',
    category: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedPlay, setSelectedPlay] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      const response = await api.get('/manage/sa-i2i-official-play/list', {
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
    setConfirmLoading(true);
    try {
      await api.post('/manage/sa-i2i-official-play/create', values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      await fetchData();
    } catch (error) {
      message.error(t('createFailed'));
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    setConfirmLoading(true);
    try {
      await api.post('/manage/sa-i2i-official-play/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      setSelectedPlay(null);
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleStatusChange = async (ids, status) => {
    const idList = Array.isArray(ids) ? ids : [ids];
    if (idList.length === 0) {
      message.warning(t('pleaseSelect'));
      return;
    }
    try {
      await api.post('/manage/sa-i2i-official-play/change-status', { ids: idList, status });
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
          <Col>
            <Input
              name="playCode"
              value={searchParams.playCode}
              onChange={handleSearchChange}
              placeholder={t('i2iPlayCode')}
              allowClear
              style={{ width: 150 }}
            />
          </Col>
          <Col>
            <Input
              name="playName"
              value={searchParams.playName}
              onChange={handleSearchChange}
              placeholder={t('i2iPlayName')}
              allowClear
              style={{ width: 150 }}
            />
          </Col>
          <Col>
            <Select
              value={searchParams.category}
              onChange={(value) => handleSelectChange(value, 'category')}
              placeholder={t('i2iPlayCategory')}
              style={{ width: 130 }}
              allowClear
            >
              <Select.Option value="style">{t('i2iPlayCategoryStyle')}</Select.Option>
              <Select.Option value="portrait">{t('i2iPlayCategoryPortrait')}</Select.Option>
              <Select.Option value="fun">{t('i2iPlayCategoryFun')}</Select.Option>
              <Select.Option value="scene">{t('i2iPlayCategoryScene')}</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              value={searchParams.status}
              onChange={(value) => handleSelectChange(value, 'status')}
              placeholder={t('selectStatus')}
              style={{ width: 120 }}
              allowClear
            >
              <Select.Option value={1}>{t('active')}</Select.Option>
              <Select.Option value={0}>{t('inactive')}</Select.Option>
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
                onClick={() =>
                  HandleBatchDelete({
                    url: '/manage/sa-i2i-official-play/delete-batch',
                    selectedRows,
                    fetchData,
                  })
                }
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

      <Spin spinning={isLoading}>
        <SaI2iOfficialPlayTable
          data={data}
          selectAll={selectAll}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          handleEditClick={(item) => {
            setSelectedPlay(item);
            setIsUpdateModalVisible(true);
          }}
          handleEnableStatusChange={(id, checked) => handleStatusChange(id, checked)}
        />
      </Spin>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrent(1);
        }}
      />

      <SaI2iOfficialPlayCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        confirmLoading={confirmLoading}
      />

      <UpdateSaI2iOfficialPlayModal
        visible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          setSelectedPlay(null);
        }}
        onOk={handleUpdate}
        initialValues={selectedPlay}
        confirmLoading={confirmLoading}
      />
    </div>
  );
};

export default SaI2iOfficialPlay;
