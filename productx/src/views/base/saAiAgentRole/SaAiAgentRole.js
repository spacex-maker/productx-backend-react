import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Button, Form, Input, message, Spin, Col, Row, Select, Space, Modal } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import { HandleBatchDelete } from 'src/components/common/HandleBatchDelete';
import Pagination from 'src/components/common/Pagination';
import SaAiAgentRoleTable from './SaAiAgentRoleTable';
import UpdateSaAiAgentRoleModel from './UpdateSaAiAgentRoleModel';
import SaAiAgentRoleCreateFormModal from './SaAiAgentRoleCreateFormModal';
import { useTranslation } from 'react-i18next';

const SaAiAgentRole = () => {
  const { t } = useTranslation();
  
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    parentId: null,
    status: '',
    lang: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null)
      );
      
      // 将状态值转换为布尔类型
      if (filteredParams.status === 'active') {
        filteredParams.status = true;
      } else if (filteredParams.status === 'inactive') {
        filteredParams.status = false;
      }

      const { data, totalNum } = await api.get('/manage/sa-ai-agent-role/list', {
        params: { currentPage, pageSize: pageSize, ...filteredParams },
      });

      setData(data);
      setTotalNum(totalNum);
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

  const handleCreateRole = async (values) => {
    try {
      await api.post('/manage/sa-ai-agent-role/create', values);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      message.error('创建失败');
    }
  };

  const handleUpdateRole = async (values) => {
    try {
      await api.post('/manage/sa-ai-agent-role/update', values);
      message.success('更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
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
      content: status === 'active' ? t('enableConfirmTitle') : t('disableConfirmTitle'),
      okText: t('confirm'),
      cancelText: t('cancel'),
      onOk: async () => {
        try {
          await api.put('/manage/sa-ai-agent-role/change-status', {
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

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setIsUpdateModalVisible(true);
  };

  const handleEnableStatusChange = async (id, event) => {
    await handleStatusChange(id, event.target.checked ? 'active' : 'inactive');
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
                placeholder={t('roleName')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.category}
                onChange={handleSearchChange}
                name="category"
                placeholder={t('category')}
                allowClear
                style={{ width: 150 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.parentId}
                onChange={handleSearchChange}
                name="parentId"
                placeholder={t('parentId')}
                type="number"
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
                <Select.Option value="active">{t('active')}</Select.Option>
                <Select.Option value="inactive">{t('inactive')}</Select.Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.lang}
                onChange={(value) => handleSelectChange(value, 'lang')}
                placeholder={t('selectLang')}
                style={{ width: 150 }}
                allowClear
              >
                <Select.Option value="zh">中文</Select.Option>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="ja">日本語</Select.Option>
                <Select.Option value="ko">한국어</Select.Option>
                <Select.Option value="fr">Français</Select.Option>
                <Select.Option value="de">Deutsch</Select.Option>
                <Select.Option value="es">Español</Select.Option>
                <Select.Option value="it">Italiano</Select.Option>
                <Select.Option value="ru">Русский</Select.Option>
                <Select.Option value="ar">العربية</Select.Option>
              </Select>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : t('search')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, 'active')}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchEnable')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => handleStatusChange(selectedRows, 'inactive')}
                  disabled={selectedRows.length === 0}
                >
                  {t('batchDisable')}
                </Button>
                <Button
                  type="primary"
                  onClick={() => HandleBatchDelete({
                    url: '/manage/sa-ai-agent-role/delete-batch',
                    selectedRows,
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
          <SaAiAgentRoleTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleEditClick={handleEditClick}
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

      <SaAiAgentRoleCreateFormModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateRole}
        confirmLoading={isLoading}
      />

      <UpdateSaAiAgentRoleModel
        visible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={handleUpdateRole}
        initialValues={selectedRole}
        confirmLoading={isLoading}
      />
    </div>
  );
};

export default SaAiAgentRole;
