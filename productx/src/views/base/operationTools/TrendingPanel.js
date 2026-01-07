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
  List,
  Avatar,
  Statistic,
  Row,
  Col,
  Select,
  Badge,
} from 'antd';
import {
  FireOutlined,
  ReloadOutlined,
  TrophyOutlined,
  RiseOutlined,
  WeiboOutlined,
  GoogleOutlined,
  ZhihuOutlined,
} from '@ant-design/icons';
import api from 'src/axiosInstance';

const { Option } = Select;

const TrendingPanel = () => {
  const [trendingNews, setTrendingNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // table, list
  const [newsType, setNewsType] = useState('general'); // general: 综合新闻, science: 科学探索

  useEffect(() => {
    fetchTrendingNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, newsType]);

  const fetchTrendingNews = async () => {
    setLoading(true);
    try {
      // 切换类型时，直接调用刷新接口获取对应类型的最新数据
      const response = await api.post('/manage/operation-tools/trending/refresh', null, {
        params: { 
          limit: limit,
          type: newsType
        }
      });
      setTrendingNews(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('获取热点新闻失败', error);
      message.error('获取热点新闻失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshNews = async () => {
    setLoading(true);
    try {
      const response = await api.post('/manage/operation-tools/trending/refresh', null, {
        params: { 
          limit: 20,
          type: newsType // 传递新闻类型参数
        }
      });
      const typeName = newsType === 'science' ? '科学探索' : '综合新闻';
      message.success(`刷新成功！已获取最新${typeName}数据`);
      // 刷新完成后重新加载列表
      fetchTrendingNews();
    } catch (error) {
      console.error('刷新热点失败', error);
      message.error('刷新失败，请查看日志');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    const colorMap = {
      科技: 'blue',
      娱乐: 'pink',
      体育: 'green',
      财经: 'gold',
      游戏: 'purple',
      健康: 'cyan',
      社会: 'default',
      教育: 'orange',
      文化: 'magenta',
    };
    return colorMap[cat] || 'default';
  };

  const getSourceIcon = (source) => {
    const iconMap = {
      微博: <WeiboOutlined style={{ color: '#e6162d' }} />,
      百度: <GoogleOutlined style={{ color: '#4e6ef2' }} />,
      知乎: <ZhihuOutlined style={{ color: '#0084ff' }} />,
    };
    return iconMap[source] || <FireOutlined />;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return '#ff4d4f';
    if (rank === 2) return '#ff7a45';
    if (rank === 3) return '#ffa940';
    return '#d9d9d9';
  };

  const formatHotValue = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  const columns = [
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 80,
      render: (rank) => (
        <Badge
          count={rank}
          style={{
            backgroundColor: getRankColor(rank),
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        />
      ),
    },
    {
      title: '热点标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <a
            href={record.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: record.rank <= 3 ? 'bold' : 'normal' }}
          >
            {text}
          </a>
          {record.summary && (
            <span style={{ fontSize: '12px', color: '#999' }}>
              {record.summary}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: '热度值',
      dataIndex: 'hotValue',
      key: 'hotValue',
      width: 120,
      sorter: (a, b) => a.hotValue - b.hotValue,
      render: (value) => (
        <Space>
          <RiseOutlined style={{ color: '#ff4d4f' }} />
          <span style={{ fontWeight: 'bold', color: '#ff4d4f' }}>
            {formatHotValue(value)}
          </span>
        </Space>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      filters: [
        { text: '科技', value: '科技' },
        { text: '娱乐', value: '娱乐' },
        { text: '体育', value: '体育' },
        { text: '财经', value: '财经' },
        { text: '游戏', value: '游戏' },
        { text: '健康', value: '健康' },
        { text: '社会', value: '社会' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (cat) => <Tag color={getCategoryColor(cat)}>{cat}</Tag>,
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source) => (
        <Space>
          {getSourceIcon(source)}
          {source}
        </Space>
      ),
    },
  ];

  // 统计信息
  const categoryCount = {};
  trendingNews.forEach((news) => {
    categoryCount[news.category] = (categoryCount[news.category] || 0) + 1;
  });
  const topCategory = Object.keys(categoryCount).sort(
    (a, b) => categoryCount[b] - categoryCount[a]
  )[0];

  const sourceCount = {};
  trendingNews.forEach((news) => {
    sourceCount[news.source] = (sourceCount[news.source] || 0) + 1;
  });

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="热点总数"
              value={trendingNews.length}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="热门分类"
              value={topCategory || '-'}
              valueStyle={{ color: '#1890ff', fontSize: '20px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Top 3 平均热度"
              value={
                trendingNews.length >= 3
                  ? formatHotValue(
                      (trendingNews[0]?.hotValue +
                        trendingNews[1]?.hotValue +
                        trendingNews[2]?.hotValue) /
                        3
                    )
                  : '-'
              }
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="数据来源"
              value={Object.keys(sourceCount).length}
              suffix="个平台"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 查询控制 */}
      <Card
        title="查询模式"
        extra={
          <Space>
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              size="small"
            >
              <Radio.Button value="table">表格</Radio.Button>
              <Radio.Button value="list">列表</Radio.Button>
            </Radio.Group>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchTrendingNews}
              loading={loading}
            >
              刷新
            </Button>
          </Space>
        }
        style={{ marginBottom: 20 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space wrap>
            <span>新闻类型：</span>
            <Radio.Group
              value={newsType}
              onChange={(e) => setNewsType(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="general">综合新闻</Radio.Button>
              <Radio.Button value="science">科学探索</Radio.Button>
            </Radio.Group>
          </Space>

          <Space wrap>
            <span>显示前</span>
            <InputNumber
              min={5}
              max={50}
              value={limit}
              onChange={(value) => setLimit(value || 10)}
              style={{ width: 80 }}
            />
            <span>条</span>
          </Space>
        </Space>
      </Card>

      {/* 内容区域 */}
      <Card 
        title={`${newsType === 'science' ? '科学探索' : '综合新闻'} Top ${trendingNews.length}`}
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefreshNews}
            loading={loading}
          >
            从API刷新
          </Button>
        }
      >
        <Spin spinning={loading}>
          {trendingNews.length === 0 ? (
            <Empty description="暂无热点数据" />
          ) : viewMode === 'table' ? (
            <Table
              columns={columns}
              dataSource={trendingNews}
              rowKey={(record, index) => index}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条热点`,
              }}
              size="middle"
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={trendingNews}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Tag color={getCategoryColor(item.category)}>
                      {item.category}
                    </Tag>,
                    <Space>
                      <RiseOutlined style={{ color: '#ff4d4f' }} />
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                        {formatHotValue(item.hotValue)}
                      </span>
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: getRankColor(item.rank),
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.rank}
                      </Avatar>
                    }
                    title={
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontWeight: item.rank <= 3 ? 'bold' : 'normal',
                          fontSize: item.rank <= 3 ? '16px' : '14px',
                        }}
                      >
                        {item.title}
                      </a>
                    }
                    description={
                      <Space>
                        {getSourceIcon(item.source)}
                        <span>{item.source}</span>
                        {item.summary && (
                          <span style={{ color: '#999' }}>| {item.summary}</span>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default TrendingPanel;


