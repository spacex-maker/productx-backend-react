import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Select, Col, Row, Space } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import PartnersTable from './PartnersTable';
import UpdatePartnersModal from './UpdatePartnersModal';
import PartnersCreateFormModal from './PartnersCreateFormModal';
import { useTranslation } from 'react-i18next';
import PartnerDetail from './PartnerDetail';

const updatePartnerStatus = async (id, newStatus) => {
  await api.post('/manage/partners/change-status', { id, status: newStatus ? 1 : 0 });
};

const createPartner = async (partnerData) => {
  await api.post('/manage/partners/create', partnerData);
};

const updatePartner = async (updateData) => {
  await api.put('/manage/partners/update', updateData);
};

const Partners = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    name: '',
    status: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState(null);

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
      const response = await api.get('/manage/partners/list', {
        params: filteredParams,
      });

      if (response) {
        setData(response);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      message.error(err?.response?.data?.message || t('获取数据失败'));
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
      await updatePartnerStatus(id, newStatus);
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

  const handleCreatePartner = async (values) => {
    try {
      await createPartner(values);
      message.success(t('createSuccess'));
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (err) {
      console.error('Failed to create partner:', err);
      message.error(err?.response?.data?.message || t('createFailed'));
    }
  };

  const handleUpdatePartner = async (values) => {
    try {
      await updatePartner(values);
      message.success(t('更新成功'));
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (err) {
      console.error('Failed to update partner:', err);
      message.error(err?.response?.data?.message || t('更新失败'));
    }
  };

  const handleEditClick = (partner) => {
    setSelectedPartner(partner);
    updateForm.setFieldsValue(partner);
    setIsUpdateModalVisible(true);
  };

  const handleDetailClick = (partner) => {
    setSelectedPartnerDetail(partner);
    setIsDetailModalVisible(true);
  };

  return (
    <div>
      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.name}
                onChange={handleSearchChange}
                name="name"
                placeholder={t('pleaseInputPartnerName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange({ target: { name: 'status', value } })}
                allowClear
                placeholder={t('businessStatus')}
                style={{ width: 150 }}
              >
                <Select.Option value={true}>{t('enable')}</Select.Option>
                <Select.Option value={false}>{t('disable')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  onClick={fetchData}
                  disabled={isLoading}
                >
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  {t('createPartner')}
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    HandleBatchDelete({
                      url: '/manage/partners/delete-batch',
                      selectedRows,
                      fetchData,
                    })
                  }
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
          <PartnersTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleDetailClick={handleDetailClick}
          />
        </Spin>
      </div>

      <PartnersCreateFormModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreatePartner}
        form={createForm}
      />

      <UpdatePartnersModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdatePartner={handleUpdatePartner}
        selectedPartner={selectedPartner}
      />

      <PartnerDetail
        isVisible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        partner={selectedPartnerDetail}
      />
    </div>
  );
};

export default Partners;
