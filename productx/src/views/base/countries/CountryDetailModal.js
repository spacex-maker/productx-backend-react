import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  Table,
  Card,
  Statistic,
  Row,
  Col,
  Spin,
  Empty,
  Button,
  Input,
  Form,
  Switch,
  Popconfirm,
  Descriptions,
  Avatar,
  List,
  Tag,
  message,
  Space,
  Tabs,
} from 'antd';
import {
  GlobalOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next'; // 引入 useTranslation
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import EditRegionModal from './EditRegionModal';
import CountryStatisticsCard from './CountryStatisticsCard';
import AddRegionModal from './AddRegionModal';

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

const ContributorsList = ({ maintainers, loading }) => {
  const { t } = useTranslation();

  const getContributorColor = (count) => {
    if (count >= 100000) return '#f50'; // 红色
    if (count >= 10000) return '#722ed1'; // 紫色
    if (count >= 1000) return '#13c2c2'; // 青色
    if (count >= 100) return '#52c41a'; // 绿色
    return '#1890ff'; // 蓝色
  };

  const getContributorTitle = (count) => {
    if (count >= 100000) return t('legendaryContributor'); // 传奇贡献者
    if (count >= 10000) return t('eliteContributor'); // 精英贡献者
    if (count >= 1000) return t('seniorContributor'); // 高级贡献者
    if (count >= 100) return t('activeContributor'); // 活跃贡献者
    return t('contributor'); // 贡献者
  };

  return (
    <Card
      title={
        <Space>
          <TeamOutlined style={{ fontSize: '14px' }} />
          <span style={{ fontSize: '14px' }}>{t('dataContributors')}</span>
        </Space>
      }
      bodyStyle={{ padding: '8px' }}
    >
      <Spin spinning={loading}>
        <Row gutter={[8, 8]}>
          {maintainers.map((item) => {
            const color = getContributorColor(item.count);
            const title = getContributorTitle(item.count);

            return (
              <Col span={6} key={item.id}>
                <Card
                  bordered={false}
                  bodyStyle={{
                    padding: '8px',
                    background: color + '0A',
                    borderRadius: '4px',
                    transition: 'all 0.3s'
                  }}
                  hoverable
                >
                  <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space size={8}>
                      <Avatar
                        size={24}
                        src={item.avatar}
                        style={{
                          border: `2px solid ${color}`,
                          backgroundColor: item.avatar ? 'transparent' : color
                        }}
                      >
                        {!item.avatar ? item.username.charAt(0).toUpperCase() : null}
                      </Avatar>
                      <div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#000000d9',
                          width: '80px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.username}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: color,
                          marginTop: '2px'
                        }}>
                          {title}
                        </div>
                      </div>
                    </Space>
                    <Tag
                      color={color}
                      style={{
                        fontSize: '11px',
                        padding: '0 4px',
                        minWidth: '48px',
                        textAlign: 'center'
                      }}
                    >
                      {item.count >= 10000
                        ? `${(item.count / 10000).toFixed(1)}w`
                        : item.count >= 1000
                          ? `${(item.count / 1000).toFixed(1)}k`
                          : item.count
                      }
                    </Tag>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Spin>
    </Card>
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
  const { t } = useTranslation(); // 使用 t() 方法进行翻译
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
  const [activeTab, setActiveTab] = useState('basicInfo'); // 添加标签页状态
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(null);

  // 在组件加载时获取历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('regionFormHistory');
    const lastType = localStorage.getItem('lastSubmittedType');

    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setHistoricalInputs(history);
      if (lastType) {
        setLastSubmittedType(lastType);
      }
    }
  }, []);

  // 监听模态框打开状态，自动填充数据
  useEffect(() => {
    if (addModalVisible && lastSubmittedType && historicalInputs[lastSubmittedType]) {
      const lastData = historicalInputs[lastSubmittedType];
      console.log('Auto filling last submitted data:', lastData);

      // 只排除 code、name 和 id，保留其他所有字段
      const { code, name, id, timestamp, ...autoFillData } = lastData;

      // 设置类型和其他数据
      addForm.setFieldsValue({
        type: lastSubmittedType,
        ...autoFillData
      });
    }
  }, [addModalVisible, lastSubmittedType, historicalInputs]);

  // 修改表单样式定义
  const formStyles = {
    label: {
      fontSize: '12px',
      color: '#000000',
      marginBottom: '2px',
    },
    input: {
      fontSize: '12px',
      height: '24px',
    },
    formItem: {
      marginBottom: '4px',
    },
    modalTitle: {
      fontSize: '12px',
      color: '#000000',
    },
  };

  // 将 handleTypeChange 函数移到组件内部
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
        params: { parentId },
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
    setBreadcrumb((prev) => [...prev, { id: region.id, name: region.name }]);
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
    setSearchValues((prev) => ({
      ...prev,
      [dataIndex]: value.trim().toLowerCase(),
    }));
  };

  const filteredData = useMemo(() => {
    return regions.filter((item) => {
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

  const handleSelectAll = (event, data) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    setSelectedRows(checked ? data.map(item => item.id) : []);
  };

  const handleSelectRow = (id, data) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter(rowId => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.length === data.length);
  };

  const handleStatusChange = async (record, checked) => {
    setLoadingStatus(record.id);
    try {
      await api.post('/manage/global-addresses/change-status', {
        id: record.id,
        status: checked,
      });
      const currentParentId = currentRegion ? currentRegion.id : country.id;
      fetchRegions(currentParentId);
    } catch (error) {
      console.error('状态切换失败:', error);
    } finally {
      setLoadingStatus(null);
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
        id: editingRecord.id,
      });
      setEditModalVisible(false);
      editForm.resetFields();
      const currentParentId = currentRegion ? currentRegion.id : country.id;
      fetchRegions(currentParentId);
    } catch (error) {
      console.error('修改失败:', error);
    }
  };

  const handleResize =
    (index) =>
    (e, { size }) => {
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
      width: 160,
      fixed: 'left',
      ...getColumnSearchProps('localName'),
      render: (text, record) => (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontSize: '12px', fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>{record.code}</div>
        </div>
      ),
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
      width: 160,
      fixed: 'left',
      ...getColumnSearchProps('name'),
      render: (text, record) => (
        <div style={{ padding: '4px 0' }}>
          <div style={{ fontSize: '12px', fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>{record.enName}</div>
        </div>
      ),
    },
    {
      title: t('shortName'),
      dataIndex: 'shortName',
      key: 'shortName',
      width: 120,
      ...getColumnSearchProps('shortName'),
      render: text => <span style={{ fontSize: '12px' }}>{text}</span>
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
      width: 140,
      ...getColumnSearchProps('type'),
      render: text => (
        <Tag color="blue" style={{ fontSize: '11px', padding: '0 4px' }}>
          {text}
        </Tag>
      )
    },
    {
      title: t('zone'),
      dataIndex: 'region',
      key: 'region',
      width: 120,
      ...getColumnSearchProps('region'),
      render: text => <span style={{ fontSize: '12px' }}>{text}</span>
    },
    {
      title: t('capital'),
      dataIndex: 'capital',
      key: 'capital',
      width: 120,
      ...getColumnSearchProps('capital'),
      render: text => <span style={{ fontSize: '12px' }}>{text}</span>
    },
    {
      title: t('population'),
      dataIndex: 'population',
      key: 'population',
      width: 100,
      align: 'right',
      ...getColumnSearchProps('population'),
      render: val => (
        <span style={{ fontSize: '12px' }}>
          {val ? `${(val / 10000).toFixed(2)}万` : '-'}
        </span>
      )
    },
    {
      title: t('area'),
      dataIndex: 'areaKm2',
      key: 'areaKm2',
      width: 120,
      align: 'right',
      ...getColumnSearchProps('areaKm2'),
      render: val => (
        <span style={{ fontSize: '12px' }}>
          {val ? `${val.toLocaleString()} km²` : '-'}
        </span>
      )
    },
    {
      title: t('action'),
      key: 'action',
      width: 160,
      fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Switch
            checked={record.status}
            onChange={(checked) => handleStatusChange(record, checked)}
            style={{
              transform: 'scale(0.8)',
              minWidth: '28px',
              height: '16px'
            }}
          />
          <Button
            type="link"
            onClick={() => handleDrillDown(record)}
            style={{
              fontSize: '12px',
              padding: '0 4px',
              height: '20px'
            }}
          >
            {t('detail')}
          </Button>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            style={{
              fontSize: '12px',
              padding: '0 4px',
              height: '20px'
            }}
          >
            {t('edit')}
          </Button>
          <Popconfirm
            title={t('confirmDelete')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('confirm')}
            cancelText={t('cancel')}
            okButtonProps={{ size: 'small' }}
            cancelButtonProps={{ size: 'small' }}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined style={{ fontSize: '12px' }} />}
              style={{
                padding: '0 4px',
                height: '20px'
              }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAddModalOpen = () => {
    addForm.resetFields(); // 先清空表单
    setAddModalVisible(true);
  };

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

  if (!country) return null;

  return (
    <Modal
      title={
        <div style={{ padding: '8px 0' }}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <ContributorsList
                maintainers={maintainers}
                loading={maintainersLoading}
              />
            </Col>
          </Row>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
      bodyStyle={{ padding: '12px' }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'basicInfo',
            label: t('basicInfo'),
            children: (
              <>
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    <CountryStatisticsCard country={country} />
                  </Col>
                </Row>
                
                <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                  {[
                    {
                      title: t('unemploymentRate'),
                      value: country?.unemploymentRate,
                      suffix: '%',
                      icon: <TeamOutlined />
                    },
                    {
                      title: t('educationLevel'),
                      value: country?.educationLevel,
                      formatter: val => val?.toFixed(1),
                      icon: <GlobalOutlined />
                    },
                    {
                      title: t('healthcareLevel'),
                      value: country?.healthcareLevel,
                      formatter: val => val?.toFixed(1),
                      icon: <GlobalOutlined />
                    },
                    {
                      title: t('internetPenetration'),
                      value: country?.internetPenetrationRate,
                      suffix: '%',
                      icon: <GlobalOutlined />
                    }
                  ].map((stat, index) => (
                    <Col span={6} key={index}>
                      <Card>
                        <Statistic
                          title={<span style={{ fontSize: '12px' }}>{stat.title}</span>}
                          value={stat.value}
                          prefix={React.cloneElement(stat.icon, { style: { fontSize: '12px' } })}
                          valueStyle={{ fontSize: '14px' }}
                          formatter={stat.formatter}
                          suffix={stat.suffix}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            ),
          },
          {
            key: 'regions',
            label: t('region'),
            children: (
              <>
                <Row style={{ marginBottom: '12px' }}>
                  <Col flex="auto">
                    <Space split="/">
                      {breadcrumb.map((item, index) => (
                        <Button
                          key={item.id}
                          type="link"
                          onClick={() => handleGoBack(index)}
                          style={{ padding: '0', fontSize: '12px' }}
                        >
                          {item.name}
                        </Button>
                      ))}
                    </Space>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddModalOpen}
                    >
                      {t('addRegion')}
                    </Button>
                  </Col>
                </Row>

                <Spin spinning={loading}>
                  {regions.length > 0 ? (
                    <div style={{ 
                      overflowX: 'auto', 
                      overflowY: 'auto', 
                      maxHeight: '600px',
                      marginTop: '8px'  // 仅保留上边距
                    }}>
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th style={{ width: '40px' }}>
                              <div className="custom-control custom-checkbox">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id="select_all"
                                  checked={selectAll}
                                  onChange={(event) => handleSelectAll(event, regions)}
                                />
                                <label className="custom-control-label" htmlFor="select_all"></label>
                              </div>
                            </th>
                            <th style={{ minWidth: '160px' }}>{t('localName')}</th>
                            <th style={{ minWidth: '160px' }}>{t('name')}</th>
                            <th style={{ minWidth: '100px' }}>{t('shortName')}</th>
                            <th style={{ minWidth: '100px' }}>{t('type')}</th>
                            <th style={{ minWidth: '100px' }}>{t('zone')}</th>
                            <th style={{ minWidth: '100px' }}>{t('capital')}</th>
                            <th style={{ minWidth: '100px' }}>{t('population')}</th>
                            <th style={{ minWidth: '100px' }}>{t('area')}</th>
                            <th style={{ width: '60px' }}>{t('status')}</th>
                            <th className="fixed-column" style={{ width: '150px' }}>{t('actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredData.map((item) => (
                            <tr key={item.id} className="record-font">
                              <td>
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.includes(item.id)}
                                    onChange={() => handleSelectRow(item.id, regions)}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor={`td_checkbox_${item.id}`}
                                  ></label>
                                </div>
                              </td>
                              <td className="text-truncate">
                                <div style={{ padding: '4px 0' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{item.localName}</div>
                                  <div style={{ fontSize: '11px', color: '#666' }}>{item.code}</div>
                                </div>
                              </td>
                              <td className="text-truncate">
                                <div style={{ padding: '4px 0' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 500 }}>{item.name}</div>
                                  <div style={{ fontSize: '11px', color: '#666' }}>{item.enName}</div>
                                </div>
                              </td>
                              <td className="text-truncate">{item.shortName}</td>
                              <td className="text-truncate">
                                <Tag color="blue" style={{ fontSize: '11px', padding: '0 4px' }}>
                                  {item.type}
                                </Tag>
                              </td>
                              <td className="text-truncate">{item.region}</td>
                              <td className="text-truncate">{item.capital}</td>
                              <td className="text-truncate text-right">
                                {item.population ? `${(item.population / 10000).toFixed(2)}万` : '-'}
                              </td>
                              <td className="text-truncate text-right">
                                {item.areaKm2 ? `${item.areaKm2.toLocaleString()} km²` : '-'}
                              </td>
                              <td>
                                <label className="toggle-switch">
                                  <input
                                    type="checkbox"
                                    checked={item.status}
                                    onChange={(e) => handleStatusChange(item, e.target.checked)}
                                    disabled={loadingStatus === item.id}
                                  />
                                  <span className="toggle-switch-slider"></span>
                                </label>
                              </td>
                              <td className="fixed-column">
                                <Space>
                                  <Button 
                                    type="link" 
                                    onClick={() => handleDrillDown(item)}
                                    style={{ padding: '0 4px', fontSize: '12px', height: '20px' }}
                                  >
                                    {t('detail')}
                                  </Button>
                                  <Button 
                                    type="link" 
                                    onClick={() => handleEdit(item)}
                                    style={{ padding: '0 4px', fontSize: '12px', height: '20px' }}
                                  >
                                    {t('edit')}
                                  </Button>
                                  <Popconfirm
                                    title={t('confirmDelete')}
                                    onConfirm={() => handleDelete(item.id)}
                                    okText={t('confirm')}
                                    cancelText={t('cancel')}
                                    okButtonProps={{ size: 'small' }}
                                    cancelButtonProps={{ size: 'small' }}
                                  >
                                    <Button
                                      type="link"
                                      danger
                                      icon={<DeleteOutlined style={{ fontSize: '12px' }} />}
                                      style={{ padding: '0 4px', height: '20px' }}
                                    />
                                  </Popconfirm>
                                </Space>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <Empty description={<span style={{ fontSize: '12px' }}>{t('noData')}</span>} />
                  )}
                </Spin>
              </>
            ),
          },
        ]}
      />

      <AddRegionModal
        visible={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          addForm.resetFields();
        }}
        onOk={handleAdd}
        form={addForm}
        handleTypeChange={handleTypeChange}
      />

      <EditRegionModal
        visible={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        onOk={handleUpdate}
        form={editForm}
      />
    </Modal>
  );
};

export default CountryDetailModal;
