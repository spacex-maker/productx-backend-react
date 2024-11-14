import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Table, Card, Statistic, Row, Col, Spin, Empty, Button, Input, Form, Switch, Popconfirm } from 'antd';
import { GlobalOutlined, TeamOutlined, EnvironmentOutlined, SearchOutlined, PlusOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';

const CountryDetailModal = ({ visible, country, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [searchValues, setSearchValues] = useState({});
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addForm] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (visible && country?.id) {
      setBreadcrumb([{ id: country.id, name: country.name }]);
      setCurrentRegion(null);
      fetchRegions(country.id);
    }
  }, [visible, country]);

  const fetchRegions = async (parentId) => {
    setLoading(true);
    try {
      const response = await api.get('/manage/global-addresses/list', {
        params: { parentId }
      });
      if (response) {
        setRegions(response);
      }
    } catch (error) {
      console.error('获取行政区划失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrillDown = (region) => {
    setBreadcrumb(prev => [...prev, { id: region.id, name: region.name }]);
    setCurrentRegion(region);
    fetchRegions(region.id);
  };

  const handleGoBack = (index) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    const targetRegion = newBreadcrumb[newBreadcrumb.length - 1];
    setBreadcrumb(newBreadcrumb);
    setCurrentRegion(index === 0 ? null : targetRegion);
    fetchRegions(targetRegion.id);
  };

  const handleSearch = (value, dataIndex) => {
    setSearchValues(prev => ({
      ...prev,
      [dataIndex]: value.trim().toLowerCase()
    }));
  };

  const filteredData = useMemo(() => {
    return regions.filter(item => {
      return Object.entries(searchValues).every(([key, value]) => {
        if (!value) return true;
        
        const itemValue = item[key];
        if (itemValue === null || itemValue === undefined) return false;
        
        if (typeof itemValue === 'number') {
          return itemValue.toString().includes(value);
        }
        
        return itemValue.toString().toLowerCase().includes(value);
      });
    });
  }, [regions, searchValues]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: () => (
      <div 
        style={{ 
          padding: '4px',
          background: '#fff',
          borderRadius: '2px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          position: 'absolute',
          zIndex: 1000,
          transform: 'translateY(4px)',
        }}
      >
        <Input
          size="small"
          style={{ 
            width: 100, 
            fontSize: '8px',
            padding: '2px 4px',
            height: '20px',
          }}
          placeholder="输入关键字"
          value={searchValues[dataIndex] || ''}
          onChange={(e) => handleSearch(e.target.value, dataIndex)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          fontSize: '8px',
          color: filtered ? '#1890ff' : undefined,
          position: 'relative',
          top: '-1px',
        }}
      />
    ),
    onFilter: true,
    filterDropdownStyle: {
      minWidth: 'auto',
      padding: 0,
      marginTop: '-4px',
    },
  });

  const handleStatusChange = async (record, checked) => {
    try {
      await api.post('/manage/global-addresses/change-status', {
        id: record.id,
        status: checked
      });
      const currentParentId = currentRegion ? currentRegion.id : country.id;
      fetchRegions(currentParentId);
    } catch (error) {
      console.error('状态切换失败:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.post('/manage/global-addresses/remove', { id });
      const currentParentId = currentRegion ? currentRegion.id : country.id;
      fetchRegions(currentParentId);
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      id: record.id,
      code: record.code,
      name: record.name,
      shortName: record.shortName,
      type: record.type,
      countryCode: record.countryCode,
      population: record.population,
      areaKm2: record.areaKm2,
      capital: record.capital,
      region: record.region,
    });
    setEditModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      await api.post('/manage/global-addresses/update', {
        ...values,
        id: editingRecord.id
      });
      setEditModalVisible(false);
      editForm.resetFields();
      const currentParentId = currentRegion ? currentRegion.id : country.id;
      fetchRegions(currentParentId);
    } catch (error) {
      console.error('修改失败:', error);
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      fixed: 'left',
      ...getColumnSearchProps('name'),
      render: (text, record) => (
        <div>
          <div style={{ fontSize: '9px' }}>{text}</div>
          <div style={{ fontSize: '8px', color: '#666' }}>{record.code}</div>
        </div>
      ),
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 60,
      ...getColumnSearchProps('shortName'),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 60,
      ...getColumnSearchProps('type'),
    },
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      width: 60,
      ...getColumnSearchProps('region'),
    },
    {
      title: '省会/首府',
      dataIndex: 'capital',
      key: 'capital',
      width: 80,
      ...getColumnSearchProps('capital'),
    },
    {
      title: '人口',
      dataIndex: 'population',
      key: 'population',
      width: 80,
      ...getColumnSearchProps('population'),
      render: (val) => val ? `${(val / 10000).toFixed(2)}万` : '-',
    },
    {
      title: '面积',
      dataIndex: 'areaKm2',
      key: 'areaKm2',
      width: 80,
      ...getColumnSearchProps('areaKm2'),
      render: (val) => val ? `${val.toLocaleString()} km²` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 50,
      render: (status, record) => (
        <Switch
          checked={status}
          size="small"
          onChange={(checked) => handleStatusChange(record, checked)}
          style={{ 
            transform: 'scale(0.8)',
            marginTop: '-2px',
            minWidth: '32px',
            height: '16px'
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ 
          display: 'flex', 
          gap: '4px',
          alignItems: 'center',
          fontSize: '8px'
        }}>
          <Button
            type="link"
            size="small"
            style={{ 
              fontSize: '8px', 
              padding: '0 4px',
              height: '16px',
              lineHeight: '16px'
            }}
            onClick={() => handleDrillDown(record)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            style={{ 
              fontSize: '8px', 
              padding: '0 4px',
              height: '16px',
              lineHeight: '16px'
            }}
            onClick={() => handleEdit(record)}
          >
            修改
          </Button>
          <Popconfirm
            title={<span style={{ fontSize: '8px' }}>确定要删除吗？</span>}
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ size: 'small', style: { fontSize: '8px' } }}
            cancelButtonProps={{ size: 'small', style: { fontSize: '8px' } }}
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined style={{ fontSize: '8px' }} />}
              style={{ 
                fontSize: '8px', 
                padding: '0 4px',
                height: '16px',
                lineHeight: '16px'
              }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleAdd = async (values) => {
    try {
      const currentParentId = currentRegion ? currentRegion.id : country.id;
      const params = {
        ...values,
        parentId: currentParentId
      };
      
      await api.post('/manage/global-addresses/create', params);
      setAddModalVisible(false);
      addForm.resetFields();
      fetchRegions(currentParentId);
    } catch (error) {
      console.error('新增失败:', error);
    }
  };

  if (!country) return null;

  return (
    <Modal
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 4px',
          marginRight: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
            <GlobalOutlined style={{ fontSize: '10px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {breadcrumb.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <span style={{ color: '#999' }}>/</span>}
                  <span
                    style={{
                      cursor: index < breadcrumb.length - 1 ? 'pointer' : 'default',
                      color: index < breadcrumb.length - 1 ? '#1890ff' : 'inherit',
                    }}
                    onClick={() => index < breadcrumb.length - 1 && handleGoBack(index)}
                  >
                    {item.name}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            style={{ 
              fontSize: '8px', 
              padding: '0 4px', 
              height: '20px',
              marginRight: '8px'
            }}
            onClick={() => setAddModalVisible(true)}
          >
            新增
          </Button>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={750}
      footer={null}
      bodyStyle={{ padding: '6px' }}
      closeIcon={<CloseOutlined style={{ fontSize: '10px' }} />}
    >
      {/* 统计信息 */}
      <Row gutter={[6, 6]} style={{ marginBottom: '6px' }}>
        <Col span={8}>
          <Card size="small" bodyStyle={{ padding: '6px' }}>
            <Statistic
              title={
                <span style={{ fontSize: '8px' }}>
                  {currentRegion ? '下级行政区' : '行政区划'}数量
                </span>
              }
              value={regions.length}
              prefix={<EnvironmentOutlined style={{ fontSize: '9px' }} />}
              valueStyle={{ fontSize: '12px' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" bodyStyle={{ padding: '6px' }}>
            <Statistic
              title={<span style={{ fontSize: '8px' }}>总人口</span>}
              value={regions.reduce((sum, region) => sum + (region.population || 0), 0)}
              prefix={<TeamOutlined style={{ fontSize: '9px' }} />}
              valueStyle={{ fontSize: '12px' }}
              formatter={(value) => `${(value / 10000).toFixed(2)}万`}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card size="small" bodyStyle={{ padding: '6px' }}>
            <Statistic
              title={<span style={{ fontSize: '8px' }}>总面积</span>}
              value={regions.reduce((sum, region) => sum + (region.areaKm2 || 0), 0)}
              prefix={<EnvironmentOutlined style={{ fontSize: '9px' }} />}
              valueStyle={{ fontSize: '12px' }}
              formatter={(value) => `${value.toLocaleString()} km²`}
            />
          </Card>
        </Col>
      </Row>

      {/* 行政区划表格 */}
      <Spin spinning={loading}>
        {regions.length > 0 ? (
          <Table
            columns={columns}
            dataSource={filteredData}
            size="small"
            scroll={{ x: 600, y: 300 }}
            pagination={false}
            rowKey="id"
            style={{ fontSize: '8px' }}
            className="super-compact-table"
            tableLayout="fixed"
            sticky={true}
          />
        ) : (
          <Empty description={<span style={{ fontSize: '8px' }}>暂无行政区划数据</span>} />
        )}
      </Spin>

      {/* 新增表单弹窗 */}
      <Modal
        title={
          <div style={{ fontSize: '10px' }}>
            新增{currentRegion ? '下级' : ''}行政区划
          </div>
        }
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
        onOk={() => addForm.submit()}
        width={400}
        bodyStyle={{ padding: '8px' }}
        destroyOnClose
      >
        <Form
          form={addForm}
          onFinish={handleAdd}
          layout="vertical"
          size="small"
          style={{ fontSize: '8px' }}
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>行政区划编码</span>}
                name="code"
                rules={[{ required: true, message: '请输入编码' }]}
              >
                <Input style={{ fontSize: '8px' }} placeholder="例如：CN-BJ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>国家码</span>}
                name="countryCode"
                rules={[{ required: true, message: '请输入国家码' }]}
              >
                <Input style={{ fontSize: '8px' }} placeholder="例如：CN" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>名称</span>}
                name="name"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input style={{ fontSize: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>简称</span>}
                name="shortName"
              >
                <Input style={{ fontSize: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>类型</span>}
                name="type"
                rules={[{ required: true, message: '请输入类型' }]}
              >
                <Input style={{ fontSize: '8px' }} placeholder="例如：省、市、区" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>区域</span>}
                name="region"
              >
                <Input style={{ fontSize: '8px' }} placeholder="例如：华北、华南" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>人口</span>}
                name="population"
              >
                <Input 
                  type="number" 
                  style={{ fontSize: '8px' }} 
                  placeholder="单位：人"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>面积</span>}
                name="areaKm2"
              >
                <Input 
                  type="number" 
                  style={{ fontSize: '8px' }} 
                  placeholder="单位：平方公里"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontSize: '8px' }}>省会/首府</span>}
            name="capital"
          >
            <Input style={{ fontSize: '8px' }} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改表单弹窗 */}
      <Modal
        title={<div style={{ fontSize: '10px' }}>修改行政区划</div>}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        onOk={() => editForm.submit()}
        width={400}
        bodyStyle={{ padding: '8px' }}
        destroyOnClose
      >
        <Form
          form={editForm}
          onFinish={handleUpdate}
          layout="vertical"
          size="small"
          style={{ fontSize: '8px' }}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>行政区划编码</span>}
                name="code"
                rules={[{ required: true, message: '请输入编码' }]}
              >
                <Input style={{ fontSize: '8px' }} placeholder="例如：CN-BJ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>国家码</span>}
                name="countryCode"
                rules={[{ required: true, message: '请输入国家码' }]}
              >
                <Input style={{ fontSize: '8px' }} placeholder="例如：CN" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>名称</span>}
                name="name"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input style={{ fontSize: '8px' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>简称</span>}
                name="shortName"
              >
                <Input style={{ fontSize: '8px' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>类型</span>}
                name="type"
                rules={[{ required: true, message: '请输入类型' }]}
              >
                <Input style={{ fontSize: '8px' }} placeholder="例如：省、市、区" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>区域</span>}
                name="region"
              >
                <Input style={{ fontSize: '8px' }} placeholder="例如：华北、华南" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>人口</span>}
                name="population"
              >
                <Input 
                  type="number" 
                  style={{ fontSize: '8px' }} 
                  placeholder="单位：人"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={{ fontSize: '8px' }}>面积</span>}
                name="areaKm2"
              >
                <Input 
                  type="number" 
                  style={{ fontSize: '8px' }} 
                  placeholder="单位：平方公里"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={<span style={{ fontSize: '8px' }}>省会/首府</span>}
            name="capital"
          >
            <Input style={{ fontSize: '8px' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

// 更新全局样式
const styles = `
  .super-compact-table .ant-table-thead > tr > th {
    padding: 4px 6px;
    font-size: 8px;
    line-height: 1.2;
  }
  
  .super-compact-table .ant-table-tbody > tr > td {
    padding: 3px 6px;
    font-size: 8px;
    line-height: 1.2;
  }
  
  .super-compact-table .ant-table-cell {
    font-size: 8px;
  }
  
  .ant-modal-header {
    padding: 6px 8px;
  }
  
  .ant-modal-close {
    top: 6px;
    right: 6px;
  }
  
  .ant-modal-close-x {
    font-size: 12px;
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
  
  .ant-modal-body {
    padding: 6px;
  }
  
  .ant-card-body {
    padding: 6px;
  }
  
  .ant-statistic-title {
    margin-bottom: 1px;
    font-size: 8px;
    line-height: 1.2;
  }
  
  .ant-statistic-content {
    font-size: 12px;
    line-height: 1.2;
  }
  
  .ant-statistic-content-value {
    font-size: 12px;
  }
  
  .ant-table {
    font-size: 8px;
  }
  
  .ant-table-column-title {
    font-size: 8px;
  }
  
  .ant-empty-description {
    font-size: 8px;
  }
  
  .ant-spin-text {
    font-size: 8px;
  }
  
  .ant-input-sm {
    font-size: 8px;
    padding: 2px 4px;
    line-height: 1.2;
  }
  
  .ant-dropdown {
    font-size: 8px;
  }
  
  .ant-dropdown-menu {
    padding: 2px;
  }
  
  .ant-dropdown-menu-item {
    padding: 2px 4px;
    font-size: 8px;
    line-height: 1.2;
  }
  
  .ant-btn-sm {
    font-size: 8px;
    padding: 2px 4px;
    height: auto;
    line-height: 1.2;
  }
  
  .ant-table-filter-trigger {
    margin: 0;
    padding: 0 2px;
    height: auto;
    line-height: 1;
  }
  
  .ant-table-filter-dropdown {
    min-width: auto !important;
    width: auto !important;
    padding: 0 !important;
    margin-top: -4px !important;
  }
  
  .ant-input-sm {
    font-size: 8px;
    padding: 2px 4px;
    line-height: 1.2;
    height: 20px;
  }
  
  .ant-table-thead > tr > th {
    position: relative;
  }
  
  .ant-table-filter-column {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .ant-table-filter-column-title {
    flex: auto;
    padding-right: 2px;
  }
  
  .ant-table-filter-trigger-container {
    position: static !important;
    margin: 0 !important;
  }
  
  .ant-table-filter-trigger {
    color: #bfbfbf;
  }
  
  .ant-table-filter-trigger:hover {
    color: #1890ff;
  }
  
  .ant-dropdown {
    padding: 0;
  }
  
  .ant-dropdown-menu {
    padding: 0;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  
  .ant-form-item {
    margin-bottom: 8px;
  }
  
  .ant-form-item-label {
    padding: 0;
  }
  
  .ant-form-item-label > label {
    font-size: 8px;
    height: 20px;
  }
  
  .ant-input {
    font-size: 8px;
    padding: 2px 4px;
    height: 20px;
  }
  
  .ant-form-item-explain {
    font-size: 8px;
    min-height: 16px;
  }
  
  .ant-modal-footer {
    padding: 6px 8px;
  }
  
  .ant-modal-footer .ant-btn {
    font-size: 8px;
    padding: 2px 8px;
    height: 20px;
  }
  
  .ant-switch {
    min-width: 32px;
    height: 16px;
    line-height: 16px;
  }
  
  .ant-switch-handle {
    width: 14px;
    height: 14px;
    top: 1px;
  }
  
  .ant-switch-checked .ant-switch-handle {
    left: calc(100% - 15px);
  }
  
  .ant-switch-small {
    min-width: 32px;
    height: 16px;
  }
  
  .ant-switch-small .ant-switch-handle {
    width: 14px;
    height: 14px;
  }
  
  .ant-switch-small.ant-switch-checked .ant-switch-handle {
    left: calc(100% - 15px);
  }
  
  .ant-popover {
    font-size: 8px;
  }
  
  .ant-popover-message {
    font-size: 8px;
    padding: 4px 0;
  }
  
  .ant-popover-buttons {
    margin-top: 4px;
  }
  
  .ant-popover-buttons .ant-btn {
    font-size: 8px;
    padding: 0 4px;
    height: 20px;
    line-height: 20px;
  }
  
  .ant-popconfirm-buttons {
    display: flex;
    gap: 4px;
  }
  
  .ant-popover-inner-content {
    padding: 4px 8px;
  }
  
  .ant-popover-arrow {
    display: none;
  }
`;

// 将样式添加到文档中
const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default CountryDetailModal;
