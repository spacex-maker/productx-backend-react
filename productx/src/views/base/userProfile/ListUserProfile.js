import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, Spin, Row, Col, Select, DatePicker, InputNumber } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from "src/components/common/Pagination";
import UserProfileTable from "./UserProfileTable";
import UpdateUserProfileModal from "./UpdateUserProfileModal";
import UserProfileDetailModal from "./UserProfileDetailModal";
import UserProfileCreateFormModal from "./UserProfileCreateFormModal";
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ListUserProfile = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    name: '',
    gender: undefined,
    location: '',
    registrationDateStart: '',
    registrationDateEnd: '',
    minTotalOrders: '',
    maxTotalOrders: '',
    minAvgOrderValue: '',
    maxAvgOrderValue: '',
    preferredCategories: '',
    preferredBrands: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  useEffect(() => {
    fetchData();
  }, [current, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      if (filteredParams.userId) {
        filteredParams.userId = Number(filteredParams.userId);
      }
      if (filteredParams.minTotalOrders) {
        filteredParams.minTotalOrders = Number(filteredParams.minTotalOrders);
      }
      if (filteredParams.maxTotalOrders) {
        filteredParams.maxTotalOrders = Number(filteredParams.maxTotalOrders);
      }

      const response = await api.get('/manage/user-profile/list-profile', {
        params: { currentPage: current, pageSize, ...filteredParams },
      });

      if (response) {
        setData(response.data);
        setTotalNum(response.totalNum);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateProfile = async (values) => {
    await api.post('/manage/user-profile/create', values);
    setIsCreateModalVisible(false);
    createForm.resetFields();
    await fetchData();
  };

  const handleUpdateProfile = async (values) => {
    await api.put(`/manage/user-profile/update`, values);
    setIsUpdateModalVisible(false);
    updateForm.resetFields();
    await fetchData();
  };

  const handleEditClick = (profile) => {
    setSelectedProfile(profile);
    setIsUpdateModalVisible(true);
  };

  const handleDetailClick = (profile) => {
    setSelectedProfile(profile);
    setIsDetailModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[10, 10]}>
            <Col>
              <Input
                size="small"
                value={searchParams.userId}
                onChange={handleSearchChange}
                name="userId"
                placeholder={t('userId')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.name}
                onChange={handleSearchChange}
                name="name"
                placeholder={t('name')}
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                className="search-box"
                value={searchParams.gender}
                onChange={(value) => handleSearchChange({target: {name: 'gender', value}})}
                allowClear
                placeholder={t('gender')}
              >
                <Option value="MALE">{t('male')}</Option>
                <Option value="FEMALE">{t('female')}</Option>
                <Option value="OTHER">{t('other')}</Option>
              </Select>
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.location}
                onChange={handleSearchChange}
                name="location"
                placeholder={t('location')}
                allowClear
              />
            </Col>
            <Col>
              <RangePicker
                size="small"
                onChange={(dates) => {
                  setSearchParams(prev => ({
                    ...prev,
                    registrationDateStart: dates?.[0]?.format('YYYY-MM-DD') || '',
                    registrationDateEnd: dates?.[1]?.format('YYYY-MM-DD') || ''
                  }));
                }}
                placeholder={[t('startDate'), t('endDate')]}
              />
            </Col>
            <Col>
              <InputNumber
                size="small"
                value={searchParams.minTotalOrders}
                onChange={(value) => handleSearchChange({target: {name: 'minTotalOrders', value}})}
                placeholder={t('minTotalOrders')}
                style={{ width: 100 }}
              />
            </Col>
            <Col>
              <InputNumber
                size="small"
                value={searchParams.maxTotalOrders}
                onChange={(value) => handleSearchChange({target: {name: 'maxTotalOrders', value}})}
                placeholder={t('maxTotalOrders')}
                style={{ width: 100 }}
              />
            </Col>
            <Col>
              <InputNumber
                size="small"
                value={searchParams.minAvgOrderValue}
                onChange={(value) => handleSearchChange({target: {name: 'minAvgOrderValue', value}})}
                placeholder={t('minAvgOrderValue')}
                style={{ width: 100 }}
              />
            </Col>
            <Col>
              <InputNumber
                size="small"
                value={searchParams.maxAvgOrderValue}
                onChange={(value) => handleSearchChange({target: {name: 'maxAvgOrderValue', value}})}
                placeholder={t('maxAvgOrderValue')}
                style={{ width: 100 }}
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.preferredCategories}
                onChange={handleSearchChange}
                name="preferredCategories"
                placeholder={t('preferredCategories')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.preferredBrands}
                onChange={handleSearchChange}
                name="preferredBrands"
                placeholder={t('preferredBrands')}
                allowClear
              />
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
                className="search-button"
                disabled={isLoading}
              >
                {isLoading ? <Spin /> : t('search')}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => setIsCreateModalVisible(true)}
              >
                {t('createProfile')}
              </Button>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={() => HandleBatchDelete({
                  url: '/manage/user-profile/delete-batch',
                  selectedRows,
                  fetchData,
                })}
                disabled={selectedRows.length === 0}
              >
                {t('batchDelete')}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <UserProfileTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={current}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <UserProfileCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateProfile}
        form={createForm}
      />

      <UpdateUserProfileModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateProfile={handleUpdateProfile}
        selectedProfile={selectedProfile}
      />

      <UserProfileDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        selectedProfile={selectedProfile}
      />

      <style jsx>{`
        .search-container {
          margin-bottom: 10px;
        }
        .search-container .ant-input {
          font-size: 10px;
        }
      `}</style>
    </div>
  );
};

export default ListUserProfile;
