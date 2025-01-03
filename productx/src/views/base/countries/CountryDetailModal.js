import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Table, Card, Statistic, Row, Col, Spin, Empty, Button, Input, Form, Switch, Popconfirm, Descriptions, Avatar, List, Tag, message } from 'antd';
import { GlobalOutlined, TeamOutlined, EnvironmentOutlined, SearchOutlined, PlusOutlined, DeleteOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import {useTranslation} from 'react-i18next'; // 引入 useTranslation
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import EditRegionModal from './EditRegionModal';
import CountryStatisticsCard from './CountryStatisticsCard';

// 添加可调整列宽的表头单元格组件
const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            right: -5,
            bottom: 0,
            top: 0,
            width: 10,
            cursor: 'col-resize',
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

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
  const {t} = useTranslation(); // 使用 t() 方法进行翻译
  const [columnWidths, setColumnWidths] = useState({
    localName: 100,
    name: 130,
    shortName: 60,
    type: 60,
    region: 60,
    capital: 80,
    population: 80,
    areaKm2: 80,
    status: 50,
    action: 100,
  });
  const [maintainers, setMaintainers] = useState([]);
  const [maintainersLoading, setMaintainersLoading] = useState(false);
  const [historicalInputs, setHistoricalInputs] = useState({});
  const [lastSubmittedType, setLastSubmittedType] = useState(null);

  // 在组件加载时获取历史记录和最后提交的类型
  useEffect(() => {
    const savedHistory = localStorage.getItem('regionFormHistory');
    const lastType = localStorage.getItem('lastSubmittedType');
    
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setHistoricalInputs(history);
      
      if (lastType && history[lastType]) {
        setLastSubmittedType(lastType);
      }
    }
  }, []);

  // 修改表单样式定义
  const formStyles = {
    label: {
      color: '#000000',
      marginBottom: '2px'
    },
    input: {
      height: '24px',
      color: '#000000 !important',
      backgroundColor: '#ffffff !important',
      '&::placeholder': {
        color: '#999999'
      }
    },
    formItem: {
      marginBottom: '4px'
    },
    modalTitle: {
      color: '#000000'
    }
  };

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
            fontSize: '10px',
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
          fontSize: '10px',
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

  const handleResize = (index) => (e, { size }) => {
    const newColumnWidths = { ...columnWidths };
    const key = columns[index].dataIndex;
    newColumnWidths[key] = size.width;
    setColumnWidths(newColumnWidths);
  };

  const getColumns = () => {
    const resizableColumns = columns.map((col, index) => ({
      ...col,
      width: columnWidths[col.dataIndex],
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    }));
    return resizableColumns;
  };

  const components = {
    header: {
      cell: ResizableTitle,
    },
  };

  const styles = {
    '.react-resizable': {
      position: 'relative',
      backgroundClip: 'padding-box',
    },
    '.react-resizable-handle': {
      position: 'absolute',
      right: -5,
      bottom: 0,
      zIndex: 1,
      width: 10,
      height: '100%',
      cursor: 'col-resize',
      '&:hover': {
        backgroundColor: 'var(--cui-primary)',
        opacity: 0.1,
      },
    },
  };

  const columns = [
    {
      title: t('localName'),
      dataIndex: 'localName',
      key: 'localName',
      width: columnWidths.localName,
      fixed: 'left',
      ...getColumnSearchProps('localName'),
      render: (text, record) => (
        <div>
          <div style={{ fontSize: '9px' }}>{text}</div>
          <div style={{ fontSize: '10px', color: '#666' }}>{record.code}</div>
        </div>
      ),
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      width: columnWidths.name,
      fixed: 'left',
      ...getColumnSearchProps('name'),
      render: (text, record) => (
        <div>
          <div style={{ fontSize: '9px' }}>{text}</div>
          <div style={{ fontSize: '10px', color: '#666' }}>{record.enName}</div>
        </div>
      ),
    },
    {
      title: t('shortName'),
      dataIndex: 'shortName',
      key: 'shortName',
      width: columnWidths.shortName,
      ...getColumnSearchProps('shortName'),
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      width: columnWidths.type,
      ...getColumnSearchProps('type'),
    },
    {
      title: t('zone'),
      dataIndex: 'region',
      key: 'region',
      width: columnWidths.region,
      ...getColumnSearchProps('region'),
    },
    {
      title: t('capital'),
      dataIndex: 'capital',
      key: 'capital',
      width: columnWidths.capital,
      ...getColumnSearchProps('capital'),
    },
    {
      title: t('population'),
      dataIndex: 'population',
      key: 'population',
      width: columnWidths.population,
      ...getColumnSearchProps('population'),
      render: (val) => val ? `${(val / 10000).toFixed(2)}万` : '-',
    },
    {
      title: t('area'),
      dataIndex: 'areaKm2',
      key: 'areaKm2',
      width: columnWidths.areaKm2,
      ...getColumnSearchProps('areaKm2'),
      render: (val) => val ? `${val.toLocaleString()} km²` : '-',
    },
    {
      title: t('action'),
      key: 'action',
      width: columnWidths.action,
      fixed: 'right',
      render: (_, record) => (
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          fontSize: '10px'
        }}>
          <Switch
            checked={record.status}
            size="small"
            onChange={(checked) => handleStatusChange(record, checked)}
            style={{
              transform: 'scale(0.8)',
              marginTop: '-2px',
              minWidth: '28px',
              height: '16px'
            }}
          />
          <Button
            type="link"
            size="small"
            style={{
              fontSize: '10px',
              padding: '0 4px',
              height: '16px',
              lineHeight: '16px'
            }}
            onClick={() => handleDrillDown(record)}
          >
            {t('detail')}
          </Button>
          <Button
            type="link"
            size="small"
            style={{
              fontSize: '10px',
              padding: '0 4px',
              height: '16px',
              lineHeight: '16px'
            }}
            onClick={() => handleEdit(record)}
          >
            {t('edit')}
          </Button>
          <Popconfirm
            title={t('confirmDelete')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('confirm')}
            cancelText={t('cancel')}
            okButtonProps={{ size: 'small', style: { fontSize: '10px' } }}
            cancelButtonProps={{ size: 'small', style: { fontSize: '10px' } }}
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined style={{ fontSize: '10px' }} />}
              style={{
                fontSize: '10px',
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
      console.log('Form values before submit:', values);
      
      const params = {
        ...values,
        parentId: currentParentId,
        type: values.type ? values.type.trim() : 'ADMINISTRATIVE_DIVISION'
      };

      await api.post('/manage/global-addresses/create', params);
      
      if (values.type) {
        const newHistory = {
          ...historicalInputs,
          [values.type]: {
            ...values,
            timestamp: Date.now()
          }
        };
        localStorage.setItem('regionFormHistory', JSON.stringify(newHistory));
        setHistoricalInputs(newHistory);
        // 保存最后提交的类型
        localStorage.setItem('lastSubmittedType', values.type);
        setLastSubmittedType(values.type);
      }

      message.success(t('addSuccess'));
      setAddModalVisible(false);
      addForm.resetFields();
      fetchRegions(currentParentId);
    } catch (error) {
      console.error('新增失败:', error);
      message.error(t('addFailed'));
    }
  };

  // 修改类型变更处理函数
  const handleTypeChange = (e) => {
    const type = e.target.value.trim();
    console.log('Type input changed:', type);
    
    addForm.setFieldValue('type', type);
    
    const historicalData = historicalInputs[type];
    if (historicalData) {
      console.log('Found historical data:', historicalData);
      const { code, name, id, timestamp, ...autoFillData } = historicalData;
      addForm.setFieldsValue(autoFillData);
    }
  };

  // 获取维护人统计
  useEffect(() => {
    if (visible && country?.id) {
      fetchMaintainers();
    }
  }, [visible, country]);

  const fetchMaintainers = async () => {
    setMaintainersLoading(true);
    try {
      const response = await api.get('/manage/global-addresses/list-proof-info');
      if (response) {
        setMaintainers(response);
      }
    } catch (error) {
      console.error('Failed to fetch maintainers:', error);
    } finally {
      setMaintainersLoading(false);
    }
  };

  // 修改模态框打开处理函数
  const handleAddModalOpen = () => {
    addForm.resetFields(); // 先清空表单
    
    // 如果有最后提交的类型，自动填充相关数据
    if (lastSubmittedType && historicalInputs[lastSubmittedType]) {
      const lastData = historicalInputs[lastSubmittedType];
      console.log('Auto filling last submitted data:', lastData);
      
      // 排除不需要自动填充的字段
      const { code, name, id, timestamp, ...autoFillData } = lastData;
      
      // 设置类型和其他数据
      addForm.setFieldsValue({
        type: lastSubmittedType,
        ...autoFillData
      });
    }
    
    setAddModalVisible(true);
  };

  if (!country) return null;

  return (
    <Modal
      title={
        <div>

          {/* 维护人统计卡片 */}
          <Row gutter={[6, 6]} style={{ marginBottom: '6px' }}>
            <Col span={24}>
              <Card size="small" bodyStyle={{ padding: '4px' }}>
                <div style={{ 
                  fontSize: '9px', 
                  marginBottom: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  color: '#666'
                }}>
                  <TeamOutlined style={{ fontSize: '9px' }} />
                  {t('dataContributors')}
                </div>
                <Spin spinning={maintainersLoading} size="small">
                  <List
                    size="small"
                    grid={{ column: 6 }}
                    dataSource={maintainers}
                    style={{ margin: 0 }}
                    renderItem={item => (
                      <List.Item style={{ padding: '2px' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '9px'
                        }}>
                          <Avatar 
                            src={item.avatar} 
                            size={14}
                            style={{ 
                              backgroundColor: !item.avatar ? '#1890ff' : undefined,
                              fontSize: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {!item.avatar ? item.username.charAt(0).toUpperCase() : null}
                          </Avatar>
                          <span style={{ 
                            flex: '1',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '40px'
                          }}>
                            {item.username}
                          </span>
                          <Tag 
                            color="blue" 
                            style={{ 
                              fontSize: '8px',
                              lineHeight: '12px',
                              height: '14px',
                              padding: '0 2px',
                              margin: 0,
                              flexShrink: 0
                            }}
                          >
                            {item.count}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                  />
                </Spin>
              </Card>
            </Col>
          </Row>
          
          {/* 国家统计卡片 */}
          <CountryStatisticsCard country={country} />

          {/* 四个指标统计卡片 */}
          <Row gutter={[6, 6]} style={{ marginBottom: '6px' }}>
            <Col span={6}>
              <Card size="small" bodyStyle={{ padding: '6px' }}>
                <Statistic
                  title={<span style={{ fontSize: '10px' }}>{t('unemploymentRate')}</span>}
                  value={country?.unemploymentRate}
                  prefix={<TeamOutlined style={{ fontSize: '9px' }} />}
                  valueStyle={{ fontSize: '12px' }}
                  formatter={(value) => `${value}%`}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" bodyStyle={{ padding: '6px' }}>
                <Statistic
                  title={<span style={{ fontSize: '10px' }}>{t('educationLevel')}</span>}
                  value={country?.educationLevel}
                  prefix={<GlobalOutlined style={{ fontSize: '9px' }} />}
                  valueStyle={{ fontSize: '12px' }}
                  formatter={(value) => value?.toFixed(1)}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" bodyStyle={{ padding: '6px' }}>
                <Statistic
                  title={<span style={{ fontSize: '10px' }}>{t('healthcareLevel')}</span>}
                  value={country?.healthcareLevel}
                  prefix={<GlobalOutlined style={{ fontSize: '9px' }} />}
                  valueStyle={{ fontSize: '12px' }}
                  formatter={(value) => value?.toFixed(1)}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" bodyStyle={{ padding: '6px' }}>
                <Statistic
                  title={<span style={{ fontSize: '10px' }}>{t('internetPenetration')}</span>}
                  value={country?.internetPenetrationRate}
                  prefix={<GlobalOutlined style={{ fontSize: '9px' }} />}
                  valueStyle={{ fontSize: '12px' }}
                  formatter={(value) => `${value}%`}
                />
              </Card>
            </Col>
          </Row>

          {/* 行政区划统计卡片 */}
          <Row gutter={[6, 6]} style={{ marginBottom: '6px' }}>
            <Col span={8}>
              <Card size="small" bodyStyle={{ padding: '6px' }}>
                <Statistic
                  title={
                    <span style={{ fontSize: '10px' }}>
                      {currentRegion ? t('subRegionsCount') : t('regionsCount')}
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
                  title={<span style={{ fontSize: '10px' }}>{t('totalPopulation')}</span>}
                  value={regions.reduce((sum, region) => sum + (region.population || 0), 0)}
                  prefix={<TeamOutlined style={{ fontSize: '9px' }} />}
                  valueStyle={{ fontSize: '12px' }}
                  formatter={(value) => `${(value / 10000).toFixed(2)}${t('tenThousand')}`}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" bodyStyle={{ padding: '6px' }}>
                <Statistic
                  title={<span style={{ fontSize: '10px' }}>{t('totalArea')}</span>}
                  value={regions.reduce((sum, region) => sum + (region.areaKm2 || 0), 0)}
                  prefix={<EnvironmentOutlined style={{ fontSize: '9px' }} />}
                  valueStyle={{ fontSize: '12px' }}
                  formatter={(value) => `${value.toLocaleString()} km²`}
                />
              </Card>
            </Col>
          </Row>

          {/* 面包屑和按钮 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* 面包屑导航 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {breadcrumb.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <span>/</span>}
                  <span
                    style={{ cursor: 'pointer', color: '#1890ff' }}
                    onClick={() => handleGoBack(index)}
                  >
                    {item.name}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* 新增按钮 */}
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={handleAddModalOpen}
              style={{
                height: '24px',
                padding: '0 8px'
              }}
            >
              {t('addRegion')}
            </Button>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={null}
      styles={{ padding: '6px' }}
      closeIcon={<CloseOutlined />}
    >
      {/* 行政区划表格 */}
      <Spin spinning={loading}>
        {regions.length > 0 ? (
          <Table
            components={components}
            columns={getColumns()}
            dataSource={filteredData}
            size="small"
            scroll={{ x: 'max-content', y: 300 }}
            pagination={false}
            rowKey="id"
            style={{ fontSize: '10px' }}
            className="super-compact-table resizable-table"
            tableLayout="fixed"
            sticky={true}
            bordered
          />
        ) : (
          <Empty description={<span style={{ fontSize: '10px' }}>暂无行政区划数据</span>} />
        )}
      </Spin>

      {/* 新增表单弹窗 */}
      <Modal
        title={
          <div style={formStyles.modalTitle}>
            {t('addRegion', { type: currentRegion ? t('subRegion') : t('region') })}
          </div>
        }
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => addForm.submit()}
        width={400}
        style={{ padding: '8px' }}
        destroyOnClose
      >
        <Form
          form={addForm}
          onFinish={handleAdd}
          layout="vertical"
          size="small"
        >
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('regionCode')}</span>}
                name="code"
                rules={[{ required: true, message: t('pleaseInputCode') }]}
                style={formStyles.formItem}
              >
                <Input style={formStyles.input} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('countryCode')}</span>}
                name="countryCode"
                rules={[{ required: true, message: t('pleaseInputCountryCode') }]}
                style={formStyles.formItem}
              >
                <Input style={formStyles.input} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('localName')}</span>}
                name="localName"
                style={formStyles.formItem}
              >
                <Input style={formStyles.input} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('name')}</span>}
                name="name"
                rules={[{ required: true, message: t('pleaseInputName') }]}
                style={formStyles.formItem}
              >
                <Input style={formStyles.input} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('shortName')}</span>}
                name="shortName"
                style={formStyles.formItem}
              >
                <Input style={formStyles.input} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('type')}</span>}
                name="type"
                style={formStyles.formItem}
              >
                <Input
                  style={formStyles.input}
                  onChange={handleTypeChange}
                  list="typeHistory"
                  allowClear
                />
                <datalist id="typeHistory">
                  {Object.keys(historicalInputs).map(type => (
                    <option key={type} value={type} />
                  ))}
                </datalist>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('capital')}</span>}
                name="capital"
                style={formStyles.formItem}
              >
                <Input style={formStyles.input} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('population')}</span>}
                name="population"
                style={formStyles.formItem}
              >
                <Input type="number" style={formStyles.input} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('areaKm2')}</span>}
                name="areaKm2"
                style={formStyles.formItem}
              >
                <Input type="number" style={formStyles.input} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span style={formStyles.label}>{t('region')}</span>}
                name="region"
                style={formStyles.formItem}
              >
                <Input style={formStyles.input} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 使用新的编辑弹窗组件 */}
      <EditRegionModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        onOk={handleUpdate}
        form={editForm}
      />
      <style jsx>{`
        ${Object.entries(styles).map(([selector, rules]) =>
          `${selector} {
            ${Object.entries(rules).map(([prop, value]) =>
              `${prop}: ${value};`
            ).join('\n')}
          }`
        ).join('\n')}
      `}</style>
    </Modal>
  );
};

// 更新全局样式
const styles = `
  .super-compact-table .ant-table-thead > tr > th {
    padding: 4px 6px;
    font-size: 10px;
    line-height: 1.2;
  }

  .super-compact-table .ant-table-tbody > tr > td {
    padding: 3px 6px;
    font-size: 10px;
    line-height: 1.2;
  }

  .super-compact-table .ant-table-cell {
    font-size: 10px;
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
    font-size: 10px;
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
    font-size: 10px;
  }

  .ant-table-column-title {
    font-size: 10px;
  }

  .ant-empty-description {
    font-size: 10px;
  }

  .ant-spin-text {
    font-size: 10px;
  }

  .ant-input-sm {
    font-size: 10px;
    padding: 5px 10px;
    line-height: 1.2;
  }

  .ant-dropdown {
    font-size: 10px;
  }

  .ant-dropdown-menu {
    padding: 2px;
  }

  .ant-dropdown-menu-item {
    padding: 5px 10px;
    font-size: 10px;
    line-height: 1.2;
  }

  .ant-btn-sm {
    font-size: 10px;
    padding: 5px 10px;
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
    font-size: 10px;
    padding: 5px 10px;
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
    font-size: 10px;
    height: 20px;
  }

  .ant-input {
    font-size: 10px;
    padding: 5px 10px;
    height: 20px;
  }

  .ant-form-item-explain {
    font-size: 10px;
    min-height: 16px;
  }

  .ant-modal-footer {
    padding: 6px 8px;
  }

  .ant-modal-footer .ant-btn {
    font-size: 10px;
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
    font-size: 10px;
  }

  .ant-popover-message {
    font-size: 10px;
    padding: 4px 0;
  }

  .ant-popover-buttons {
    margin-top: 4px;
  }

  .ant-popover-buttons .ant-btn {
    font-size: 10px;
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
