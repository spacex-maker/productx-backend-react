import React, { useEffect, useState } from 'react';
import api from 'src/axiosInstance';
import { Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Spin, message } from 'antd';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';
import Pagination from 'src/components/common/Pagination';
import DeepSeekApiManageTable from './DeepSeekApiManageTable';

const { RangePicker } = DatePicker;

const DeepSeekApiManage = () => {
  const [data, setData] = useState([]);
  const [totalNum, setTotalNum] = useState(0);
  const [currentPage, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    userId: '',
    modelName: '',
    requestStackInfo: '',
    success: '',
    startTime: '',
    endTime: '',
  });

  const [settings, setSettings] = useState(null);
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [keySaving, setKeySaving] = useState(false);
  const [modelSaving, setModelSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState(undefined);
  const [keyForm] = Form.useForm();

  const { selectedRows, selectAll, handleSelectAll, handleSelectRow } = UseSelectableRows();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/manage/deepseek-api/settings');
      setSettings(response || null);
      setSelectedModel(response?.defaultModelCode);
    } catch (e) {
      console.error(e);
      // fallback older endpoint
      try {
        const keyOnly = await api.get('/manage/deepseek-api/api-key');
        setSettings({ apiKey: keyOnly, availableModels: [] });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== undefined && value !== null),
      );
      const response = await api.get('/manage/deepseek-api/calls/list', {
        params: { currentPage, pageSize, ...filteredParams },
      });
      if (response) {
        setData(response.data || []);
        setTotalNum(response.totalNum || 0);
      }
    } catch (error) {
      console.error('获取 DeepSeek 调用记录失败', error);
      message.error('获取调用记录失败');
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
    setSearchParams((prev) => ({ ...prev, [field]: value === undefined ? '' : value }));
    setCurrent(1);
  };

  const handleTimeChange = (dates) => {
    if (dates) {
      setSearchParams((prev) => ({
        ...prev,
        startTime: dates[0].format('YYYY-MM-DD HH:mm:ss'),
        endTime: dates[1].format('YYYY-MM-DD HH:mm:ss'),
      }));
    } else {
      setSearchParams((prev) => ({ ...prev, startTime: '', endTime: '' }));
    }
    setCurrent(1);
  };

  const openKeyModal = () => {
    keyForm.resetFields();
    setKeyModalOpen(true);
  };

  const saveApiKey = async () => {
    try {
      const values = await keyForm.validateFields();
      setKeySaving(true);
      await api.post('/manage/deepseek-api/api-key', { apiKey: values.apiKey });
      message.success('API Key 已更新');
      setKeyModalOpen(false);
      fetchSettings();
    } catch (e) {
      if (e?.errorFields) return;
      message.error(e?.message || '更新失败');
    } finally {
      setKeySaving(false);
    }
  };

  const saveDefaultModel = async () => {
    if (!selectedModel) {
      message.warning('请选择默认模型');
      return;
    }
    try {
      setModelSaving(true);
      await api.post('/manage/deepseek-api/default-model', { modelCode: selectedModel });
      message.success('系统默认模型已更新');
      fetchSettings();
    } catch (e) {
      message.error(e?.message || '更新失败');
    } finally {
      setModelSaving(false);
    }
  };

  const keyInfo = settings?.apiKey;
  const modelOptions = (settings?.availableModels || []).map((m) => ({
    value: m.code,
    label: `${m.name}${m.recommended ? '（推荐）' : ''}`,
    title: m.description,
  }));

  const totalPages = Math.ceil(totalNum / pageSize) || 1;

  return (
    <div>
      <Card size="small" title="系统配置" style={{ marginBottom: 16 }}>
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} md={12}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <div style={{ fontWeight: 600 }}>DeepSeek API Key</div>
              <div style={{ color: '#666' }}>
                配置键：{keyInfo?.configKey || 'AI_API_KEY_DeepSeek'}
                {' · '}
                {keyInfo?.configured
                  ? `已配置（${keyInfo.maskedKey}，长度 ${keyInfo.keyLength}）`
                  : '未配置'}
              </div>
              <Button type="primary" onClick={openKeyModal}>
                配置 API Key
              </Button>
            </Space>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <div style={{ fontWeight: 600 }}>系统默认模型</div>
              <div style={{ color: '#666', fontSize: 12 }}>
                未在业务里指定模型时使用此项（官网：deepseek-flash / deepseek-v4-pro）
              </div>
              <Space wrap>
                <Select
                  style={{ minWidth: 280 }}
                  placeholder="选择默认模型"
                  value={selectedModel}
                  onChange={setSelectedModel}
                  options={modelOptions}
                  optionLabelProp="label"
                />
                <Button type="primary" loading={modelSaving} onClick={saveDefaultModel}>
                  保存默认模型
                </Button>
              </Space>
              {selectedModel && (
                <div style={{ color: '#888', fontSize: 12 }}>
                  {(settings?.availableModels || []).find((m) => m.code === selectedModel)?.description
                    || `当前：${selectedModel}`}
                </div>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <div className="mb-3">
        <div className="search-container">
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                value={searchParams.userId}
                onChange={handleSearchChange}
                name="userId"
                placeholder="用户ID"
                allowClear
                style={{ width: 120 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.modelName}
                onChange={handleSearchChange}
                name="modelName"
                placeholder="模型名"
                allowClear
                style={{ width: 160 }}
              />
            </Col>
            <Col>
              <Input
                value={searchParams.requestStackInfo}
                onChange={handleSearchChange}
                name="requestStackInfo"
                placeholder="业务来源关键词"
                allowClear
                style={{ width: 200 }}
              />
            </Col>
            <Col>
              <Select
                value={searchParams.success === '' ? undefined : searchParams.success}
                onChange={(value) => handleSelectChange(value, 'success')}
                placeholder="状态"
                style={{ width: 120 }}
                allowClear
                options={[
                  { value: true, label: '成功' },
                  { value: false, label: '失败' },
                ]}
              />
            </Col>
            <Col span={6}>
              <RangePicker showTime onChange={handleTimeChange} style={{ width: '100%' }} />
            </Col>
            <Col>
              <Button type="primary" onClick={fetchData} disabled={isLoading}>
                {isLoading ? <Spin size="small" /> : '查询'}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <div className="table-responsive">
        <Spin spinning={isLoading}>
          <DeepSeekApiManageTable
            data={data}
            selectAll={selectAll}
            selectedRows={selectedRows}
            handleSelectAll={handleSelectAll}
            handleSelectRow={handleSelectRow}
          />
        </Spin>
      </div>

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

      <Modal
        title="配置 DeepSeek API Key"
        open={keyModalOpen}
        onCancel={() => setKeyModalOpen(false)}
        onOk={saveApiKey}
        confirmLoading={keySaving}
        destroyOnClose
      >
        <Form form={keyForm} layout="vertical">
          <Form.Item
            label="API Key"
            name="apiKey"
            rules={[{ required: true, message: '请输入 API Key' }]}
            extra="将写入系统配置 AI_API_KEY_DeepSeek，全站 DeepSeek 调用共用此 Key"
          >
            <Input.Password placeholder="sk-..." autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeepSeekApiManage;