import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Modal,
} from 'antd';
import api from 'src/axiosInstance';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import Pagination from 'src/components/common/Pagination';
import SaAiAgentConfigTable from './SaAiAgentConfigTable';
import SaAiAgentConfigCreateModal from './SaAiAgentConfigCreateModal';
import SaAiAgentConfigUpdateModal from './SaAiAgentConfigUpdateModal';

const { Option } = Select;

const providerOptions = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'ali_qwen', label: '阿里通义' },
  { value: 'local', label: '自建/本地' },
];

const booleanOptions = [
  { value: 1, label: '是' },
  { value: 0, label: '否' },
];

const SaAiAgentConfig = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState({
    agentUuid: '',
    name: '',
    provider: undefined,
    status: undefined,
    isPublic: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateForm] = Form.useForm();
  const [selectedConfig, setSelectedConfig] = useState(null);

  const {
    selectedRows,
    selectAll,
    handleSelectAll,
    handleSelectRow,
    resetSelection,
  } = UseSelectableRows();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined),
      );
      const response = await api.get('/manage/sys-ai-agent-config/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });
      if (response) {
        setData(response.data || response.records || []);
        setTotalNum(response.totalNum || response.total || 0);
      }
    } catch (error) {
      console.error('获取配置列表失败', error);
      message.error('获取配置列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  const normalizePayload = (values) => ({
    ...values,
    status: values.status ? 1 : 0,
    isPublic: values.isPublic ? 1 : 0,
  });

  const handleSearchChange = (name, value) => {
    setSearchParams((prev) => ({ ...prev, [name]: value }));
    setCurrent(1);
  };

  const handleCreate = async (values) => {
    try {
      const payload = normalizePayload(values);
      await api.post('/manage/sys-ai-agent-config/create', payload);
      message.success('创建成功');
      setIsCreateModalVisible(false);
      createForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('创建失败', error);
      message.error('创建失败');
    }
  };

  const handleUpdate = async (values) => {
    try {
      const payload = normalizePayload(values);
      await api.post('/manage/sys-ai-agent-config/update', payload);
      message.success('更新成功');
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      await fetchData();
    } catch (error) {
      console.error('更新失败', error);
      message.error('更新失败');
    }
  };

  const handleStatusChange = async (id, checked) => {
    try {
      await api.post('/manage/sys-ai-agent-config/change-status', { id, status: checked });
      message.success('状态已更新');
      await fetchData();
    } catch (error) {
      console.error('状态更新失败', error);
      message.error('状态更新失败');
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '确认删除该配置？',
      onOk: async () => {
        try {
          await api.delete('/manage/sys-ai-agent-config/delete', { data: { id } });
          message.success('删除成功');
          resetSelection();
          await fetchData();
        } catch (error) {
          console.error('删除失败', error);
          message.error('删除失败');
        }
      },
    });
  };

  const handleEditClick = (config) => {
    setSelectedConfig(config);
    setIsUpdateModalVisible(true);
  };

  const totalPages = Math.ceil(totalNum / pageSize);

  return (
    <div>
      <div className="card" style={{ marginTop: 0, marginBottom: 0 }}>
        <div className="card-body">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.agentUuid}
                onChange={(e) => handleSearchChange('agentUuid', e.target.value)}
                placeholder="Agent UUID"
                allowClear
                style={{ width: 180 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.name}
                onChange={(e) => handleSearchChange('name', e.target.value)}
                placeholder="名称"
                allowClear
                style={{ width: 160 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.provider}
                onChange={(value) => handleSearchChange('provider', value)}
                placeholder="厂商"
                allowClear
                style={{ width: 140 }}
              >
                {providerOptions.map((p) => (
                  <Option key={p.value} value={p.value}>
                    {p.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.status}
                onChange={(value) => handleSearchChange('status', value)}
                placeholder="状态"
                allowClear
                style={{ width: 120 }}
              >
                <Option value={1}>启用</Option>
                <Option value={0}>禁用</Option>
              </Select>
            </Col>
            <Col>
              <Select
                value={searchParams.isPublic}
                onChange={(value) => handleSearchChange('isPublic', value)}
                placeholder="公开"
                allowClear
                style={{ width: 120 }}
              >
                {booleanOptions.map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Space>
                <Button type="primary" onClick={fetchData} disabled={isLoading}>
                  {isLoading ? <Spin /> : '查询'}
                </Button>
                <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
                  新增配置
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <SaAiAgentConfigTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
            handleStatusChange={handleStatusChange}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
        </Spin>
      </div>

      <Pagination
        totalPages={totalPages}
        current={currentPage}
        onPageChange={setCurrent}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />

      <SaAiAgentConfigCreateModal
        isVisible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onFinish={handleCreate}
        form={createForm}
        providerOptions={providerOptions}
      />

      <SaAiAgentConfigUpdateModal
        isVisible={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={() => updateForm.submit()}
        form={updateForm}
        handleUpdate={handleUpdate}
        selectedConfig={selectedConfig}
        providerOptions={providerOptions}
      />
    </div>
  );
};

export default SaAiAgentConfig;


