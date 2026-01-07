import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  message,
  Spin,
  Radio,
  InputNumber,
  Empty,
  Timeline,
  Statistic,
  Row,
  Col,
  Badge,
} from 'antd';
import {
  CalendarOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import api from 'src/axiosInstance';

const HolidayPanel = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryMode, setQueryMode] = useState('upcoming'); // upcoming, yearly, next
  const [daysParam, setDaysParam] = useState(60);
  const [countParam, setCountParam] = useState(5);

  useEffect(() => {
    fetchHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryMode, daysParam, countParam]);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      let url = '';
      let params = {};

      if (queryMode === 'upcoming') {
        url = '/manage/operation-tools/holidays/upcoming';
        params = { days: daysParam };
      } else if (queryMode === 'yearly') {
        url = '/manage/operation-tools/holidays/yearly';
      } else if (queryMode === 'next') {
        url = '/manage/operation-tools/holidays/next';
        params = { count: countParam };
      }

      const response = await api.get(url, { params });
      setHolidays(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('获取节假日失败', error);
      message.error('获取节假日失败');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colorMap = {
      法定节假日: 'red',
      传统节日: 'orange',
      国际节日: 'blue',
      商业节日: 'cyan',
      纪念节日: 'purple',
    };
    return colorMap[type] || 'default';
  };

  const getDaysUntilColor = (days) => {
    if (days <= 7) return 'error';
    if (days <= 15) return 'warning';
    if (days <= 30) return 'processing';
    return 'default';
  };

  const columns = [
    {
      title: '节假日名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text, record) => (
        <Space>
          {record.isImportant && <StarOutlined style={{ color: '#faad14' }} />}
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (text) => (
        <Space>
          <CalendarOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '距今天数',
      dataIndex: 'daysUntil',
      key: 'daysUntil',
      width: 120,
      sorter: (a, b) => a.daysUntil - b.daysUntil,
      render: (days) => (
        <Badge
          status={getDaysUntilColor(days)}
          text={`${days} 天`}
        />
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      filters: [
        { text: '法定节假日', value: '法定节假日' },
        { text: '传统节日', value: '传统节日' },
        { text: '国际节日', value: '国际节日' },
        { text: '商业节日', value: '商业节日' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => <Tag color={getTypeColor(type)}>{type}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '重要程度',
      dataIndex: 'isImportant',
      key: 'isImportant',
      width: 100,
      filters: [
        { text: '重要', value: true },
        { text: '普通', value: false },
      ],
      onFilter: (value, record) => record.isImportant === value,
      render: (isImportant) => (
        <Tag color={isImportant ? 'gold' : 'default'}>
          {isImportant ? '重要' : '普通'}
        </Tag>
      ),
    },
  ];

  // 统计信息
  const importantCount = holidays.filter((h) => h.isImportant).length;
  const within30Days = holidays.filter((h) => h.daysUntil <= 30).length;
  const within7Days = holidays.filter((h) => h.daysUntil <= 7).length;

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总节假日数"
              value={holidays.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="重要节假日"
              value={importantCount}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="30天内"
              value={within30Days}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="7天内"
              value={within7Days}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 查询控制 */}
      <Card
        title="查询模式"
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchHolidays}
            loading={loading}
          >
            刷新
          </Button>
        }
        style={{ marginBottom: 20 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Radio.Group
            value={queryMode}
            onChange={(e) => setQueryMode(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="upcoming">未来N天内</Radio.Button>
            <Radio.Button value="next">最近N个</Radio.Button>
            <Radio.Button value="yearly">近一年全部</Radio.Button>
          </Radio.Group>

          {queryMode === 'upcoming' && (
            <Space>
              <span>查询未来</span>
              <InputNumber
                min={1}
                max={365}
                value={daysParam}
                onChange={(value) => setDaysParam(value || 60)}
                style={{ width: 80 }}
              />
              <span>天内的节假日</span>
            </Space>
          )}

          {queryMode === 'next' && (
            <Space>
              <span>查询最近</span>
              <InputNumber
                min={1}
                max={50}
                value={countParam}
                onChange={(value) => setCountParam(value || 5)}
                style={{ width: 80 }}
              />
              <span>个节假日</span>
            </Space>
          )}
        </Space>
      </Card>

      {/* 时间线视图（仅在有数据且数量较少时显示） */}
      {holidays.length > 0 && holidays.length <= 10 && (
        <Card title="时间线视图" style={{ marginBottom: 20 }}>
          <Timeline mode="left">
            {holidays.map((holiday, index) => (
              <Timeline.Item
                key={index}
                color={holiday.isImportant ? 'red' : 'blue'}
                label={
                  <Space>
                    {holiday.date}
                    <Tag color={getDaysUntilColor(holiday.daysUntil)}>
                      {holiday.daysUntil}天
                    </Tag>
                  </Space>
                }
              >
                <Space>
                  <strong>{holiday.name}</strong>
                  <Tag color={getTypeColor(holiday.type)}>{holiday.type}</Tag>
                </Space>
                <div style={{ marginTop: 5, color: '#666' }}>
                  {holiday.description}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      )}

      {/* 表格视图 */}
      <Card title="节假日列表">
        <Spin spinning={loading}>
          {holidays.length === 0 ? (
            <Empty description="暂无节假日数据" />
          ) : (
            <Table
              columns={columns}
              dataSource={holidays}
              rowKey={(record, index) => index}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个节假日`,
              }}
              size="middle"
            />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default HolidayPanel;

