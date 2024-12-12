import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import RepairServiceMerchantsTable from './RepairServiceMerchantsTable';
import UpdateRepairServiceMerchantsModal from './UpdateRepairServiceMerchantsModal';
import RepairServiceMerchantsCreateFormModal from './RepairServiceMerchantsCreateFormModal';
import RepairServiceMerchantsDetailModal from './RepairServiceMerchantsDetailModal';
import { useTranslation } from 'react-i18next';

const updateMerchantStatus = async (id, newStatus) => {
  await api.post('/manage/repair-service-merchants/change-status', { id, status: newStatus ? 1 : 0 });
};

const createMerchant = async (merchantData) => {
  await api.post('/manage/repair-service-merchants/create', merchantData);
};

const updateMerchant = async (updateData) => {
  await api.put('/manage/repair-service-merchants/update', updateData);
};

const RepairServiceMerchants = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    merchantName: '',
    contactPerson: '',
    contactPhone: '',
    status: '',
    city: '',
    province: '',
    serviceTypes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
  } = UseSelectableRows();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      );
      const response = await api.get('/manage/repair-service-merchants/list', {
        params: filteredParams,
      });

      if (response) {
        setData(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      message.error(err?.response?.message || t('获取数据失败'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const handleStatusChange = async (id, event) => {
    try {
      const newStatus = event.target.checked;
      await updateMerchantStatus(id, newStatus);
      message.success(t('statusUpdateSuccess'));
      await fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
      message.error(err?.response?.data?.message || t('statusUpdateFailed'));
    }
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({ ...prevParams, [name]: value }));
  };

  const handleCreateMerchant = async (values) => {
    try {
      await createMerchant(values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (err) {
      console.error('Failed to create merchant:', err);
      message.error(err?.response?.data?.message || t('createFailed'));
    }
  };

  const handleUpdateMerchant = async (values) => {
    try {
      await updateMerchant(values);
      message.success(t('更新成功'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (err) {
      console.error('Failed to update merchant:', err);
      message.error(err?.response?.data?.message || t('更新失败'));
    }
  };

  const handleEditClick = (merchant) => {
    setSelectedMerchant(merchant);
    updateForm.setFieldsValue(merchant);
    setIsUpdateModalVisible(true);
  };

  const handleViewDetail = (record) => {
    setSelectedMerchant(record);
    setIsDetailModalVisible(true);
  };

  const columns = [
    {
      title: t('operation'),
      key: 'operation',
      width: 120,
      render: (_, record) => (
        <Space size={4}>
          <Button 
            type="link" 
            size="small"
            style={{ padding: '4px', height: 'auto', fontSize: '10px' }}
            onClick={() => handleViewDetail(record)}
          >
            {t('detail')}
          </Button>
          <Button 
            type="link" 
            size="small"
            style={{ padding: '4px', height: 'auto', fontSize: '10px' }}
            onClick={() => handleEditClick(record)}
          >
            {t('edit')}
          </Button>
          <Button 
            type="link" 
            size="small"
            style={{ padding: '4px', height: 'auto', fontSize: '10px', color: record.status ? '#ff4d4f' : '#52c41a' }}
            onClick={() => handleStatusChange(record)}
          >
            {record.status ? t('disable') : t('enable')}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                size="small"
                value={searchParams.merchantName}
                onChange={handleSearchChange}
                name="merchantName"
                placeholder={t('pleaseInputMerchantName')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.contactPerson}
                onChange={handleSearchChange}
                name="contactPerson"
                placeholder={t('pleaseInputContactPerson')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.contactPhone}
                onChange={handleSearchChange}
                name="contactPhone"
                placeholder={t('pleaseInputContactPhone')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.city}
                onChange={handleSearchChange}
                name="city"
                placeholder={t('pleaseInputCity')}
                allowClear
              />
            </Col>
            <Col>
              <Input
                size="small"
                value={searchParams.province}
                onChange={handleSearchChange}
                name="province"
                placeholder={t('pleaseInputProvince')}
                allowClear
              />
            </Col>
            <Col>
              <Select
                size="small"
                value={searchParams.status}
                onChange={(value) => handleSearchChange({ target: { name: 'status', value } })}
                allowClear
                placeholder={t('businessStatus')}
              >
                <Select.Option value={true}>{t('operating')}</Select.Option>
                <Select.Option value={false}>{t('closed')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Button
                size="small"
                type="primary"
                onClick={fetchData}
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
                {t('createMerchant')}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <RepairServiceMerchantsTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleViewDetail={handleViewDetail}
          />
        </Spin>
      </div>

      <RepairServiceMerchantsCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreateMerchant}
        form={createForm}
      />

      <UpdateRepairServiceMerchantsModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdateMerchant={handleUpdateMerchant}
        selectedMerchant={selectedMerchant}
      />

      <RepairServiceMerchantsDetailModal
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        merchantData={selectedMerchant}
      />
    </div>
  );
};

export default RepairServiceMerchants;
