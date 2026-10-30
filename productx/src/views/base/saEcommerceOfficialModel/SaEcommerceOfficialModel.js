import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Input, message, Spin, Col, Row, Select, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaEcommerceOfficialModelTable from './SaEcommerceOfficialModelTable';
import UpdateSaEcommerceOfficialModelModal from './UpdateSaEcommerceOfficialModelModal';
import SaEcommerceOfficialModelCreateFormModal from './SaEcommerceOfficialModelCreateFormModal';
import { useTranslation } from 'react-i18next';

const SaEcommerceOfficialModel = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    modelCode: '',
    modelName: '',
    gender: '',
    poseKey: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
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
      const response = await api.get('/manage/sa-ecommerce-official-model/list', {
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
      await api.post('/manage/sa-ecommerce-official-model/create', values);
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
      await api.post('/manage/sa-ecommerce-official-model/update', values);
      message.success(t('updateSuccess'));
      setIsUpdateModalVisible(false);
      setSelectedModel(null);
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
      await api.post('/manage/sa-ecommerce-official-model/change-status', { ids: idList, status });
      message.success(t('updateSuccess'));
      await fetchData();
    } catch (error) {
      message.error(t('updateFailed'));
    }
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  const poseOptions = (
    <>
      <Select.Option value="standing">{t('ecomModelPoseStanding')}</Select.Option>
      <Select.Option value="walking">{t('ecomModelPoseWalking')}</Select.Option>
      <Select.Option value="three_quarter">{t('ecomModelPoseThreeQuarter')}</Select.Option>
      <Select.Option value="sit">{t('ecomModelPoseSit')}</Select.Option>
    </>
  );

  return (
    <div>
      <div className="mb-3">
        <Row gutter={[16, 16]}>
          <Col>
            <Input
              name="modelCode"
              value={searchParams.modelCode}
              onChange={handleSearchChange}
              placeholder={t('ecomModelCode')}
              allowClear
              style={{ width: 150 }}
            />
          </Col>
          <Col>
            <Input
              name="modelName"
              value={searchParams.modelName}
              onChange={handleSearchChange}
              placeholder={t('ecomModelName')}
              allowClear
              style={{ width: 150 }}
            />
          </Col>
          <Col>
            <Select
              value={searchParams.gender}
              onChange={(value) => handleSelectChange(value, 'gender')}
              placeholder={t('ecomModelGender')}
              style={{ width: 120 }}
              allowClear
            >
              <Select.Option value="female">{t('ecomModelGenderFemale')}</Select.Option>
              <Select.Option value="male">{t('ecomModelGenderMale')}</Select.Option>
            </Select>
          </Col>
          <Col>
            <Select
              value={searchParams.poseKey}
              onChange={(value) => handleSelectChange(value, 'poseKey')}
              placeholder={t('ecomModelPose')}
              style={{ width: 140 }}
              allowClear
            >
              {poseOptions}
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
                    url: '/manage/sa-ecommerce-official-model/delete-batch',
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
        <SaEcommerceOfficialModelTable
          data={data}
          selectAll={selectAll}
          selectedRows={selectedRows}
          handleSelectAll={handleSelectAll}
          handleSelectRow={handleSelectRow}
          handleEditClick={(item) => {
            setSelectedModel(item);
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

      <SaEcommerceOfficialModelCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreate}
        confirmLoading={confirmLoading}
      />

      <UpdateSaEcommerceOfficialModelModal
        visible={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          setSelectedModel(null);
        }}
        onOk={handleUpdate}
        initialValues={selectedModel}
        confirmLoading={confirmLoading}
      />
    </div>
  );
};

export default SaEcommerceOfficialModel;
