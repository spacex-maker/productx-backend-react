import React, { useState, useEffect } from 'react';
import api from 'src/axiosInstance';
import { Card, Row, Col, Spin, DatePicker, Select, Button, Statistic, message, Space, theme } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import {
  DollarOutlined,
  ThunderboltOutlined,
  UserOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SaAiTokenUsageLogDashboard = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState(null);
  const [timeStatistics, setTimeStatistics] = useState([]);
  const [modelRanking, setModelRanking] = useState([]);
  const [ipRanking, setIpRanking] = useState([]);
  const [userRanking, setUserRanking] = useState([]);
  const [costStatistics, setCostStatistics] = useState(null);
  const [durationStatistics, setDurationStatistics] = useState(null);
  const [successRate, setSuccessRate] = useState(null);
  
  const [timeDimension, setTimeDimension] = useState('daily');
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]);
  const [currency, setCurrency] = useState('CNY');

  useEffect(() => {
    fetchAllData();
  }, [timeDimension, dateRange, currency]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const params = {
        timeDimension,
        startTime: dateRange[0]?.format('YYYY-MM-DD HH:mm:ss'),
        endTime: dateRange[1]?.format('YYYY-MM-DD HH:mm:ss'),
        currency,
      };

      const [
        overviewRes,
        timeRes,
        modelRes,
        ipRes,
        userRes,
        costRes,
        durationRes,
        successRes,
      ] = await Promise.all([
        api.get('/manage/sa-ai-token-usage-log/statistics/overview', { params }),
        api.get('/manage/sa-ai-token-usage-log/statistics/time', { params }),
        api.get('/manage/sa-ai-token-usage-log/statistics/model-ranking', { params }),
        api.get('/manage/sa-ai-token-usage-log/statistics/ip-ranking', { params }),
        api.get('/manage/sa-ai-token-usage-log/statistics/user-ranking', { params }),
        api.get('/manage/sa-ai-token-usage-log/statistics/cost', { params }),
        api.get('/manage/sa-ai-token-usage-log/statistics/duration', { params }),
        api.get('/manage/sa-ai-token-usage-log/statistics/success-rate', { params }),
      ]);

      if (overviewRes) setOverview(overviewRes);
      if (timeRes) setTimeStatistics(timeRes);
      if (modelRes) setModelRanking(modelRes);
      if (ipRes) setIpRanking(ipRes);
      if (userRes) setUserRanking(userRes);
      if (costRes) setCostStatistics(costRes);
      if (durationRes) setDurationStatistics(durationRes);
      if (successRes) setSuccessRate(successRes);
    } catch (error) {
      console.error('获取统计数据失败', error);
      message.error('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 时间趋势图配置
  const getTimeChartOption = () => {
    const timePoints = timeStatistics.map(item => item.timePoint);
    const totalTokens = timeStatistics.map(item => item.totalTokens || 0);
    const totalCost = timeStatistics.map(item => Number(item.totalCost || 0));
    const requestCount = timeStatistics.map(item => item.requestCount || 0);

    return {
      title: {
        text: 'Token使用趋势',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['总Token数', '总费用', '请求次数'],
        top: 35,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timePoints,
        axisLabel: { rotate: 45 },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Token数/请求数',
          position: 'left',
        },
        {
          type: 'value',
          name: '费用',
          position: 'right',
        },
      ],
      series: [
        {
          name: '总Token数',
          type: 'line',
          smooth: true,
          data: totalTokens,
          itemStyle: { color: '#1890ff' },
          areaStyle: { opacity: 0.3 },
        },
        {
          name: '总费用',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: totalCost,
          itemStyle: { color: '#52c41a' },
          areaStyle: { opacity: 0.3 },
        },
        {
          name: '请求次数',
          type: 'bar',
          data: requestCount,
          itemStyle: { color: '#faad14' },
        },
      ],
    };
  };

  // 模型排行榜图表配置
  const getModelRankingChartOption = () => {
    const top10 = modelRanking.slice(0, 10);
    const modelNames = top10.map(item => item.modelName || '未知');
    const totalTokens = top10.map(item => item.totalTokens || 0);

    return {
      title: {
        text: '模型Token消耗TOP10',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const data = top10[params[0].dataIndex];
          return `${data.modelName}<br/>
                  总Token: ${data.totalTokens?.toLocaleString()}<br/>
                  总费用: ${Number(data.totalCost || 0).toFixed(4)} ${currency}<br/>
                  请求次数: ${data.requestCount}`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: modelNames,
        axisLabel: { interval: 0 },
      },
      series: [
        {
          type: 'bar',
          data: totalTokens,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' },
              ]),
            },
          },
        },
      ],
    };
  };

  // IP排行榜图表配置
  const getIpRankingChartOption = () => {
    const top10 = ipRanking.slice(0, 10);
    const ipAddresses = top10.map(item => item.ipAddress || '未知');
    const totalTokens = top10.map(item => item.totalTokens || 0);

    return {
      title: {
        text: 'IP Token消耗TOP10',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: ipAddresses,
        axisLabel: { interval: 0 },
      },
      series: [
        {
          type: 'bar',
          data: totalTokens,
          itemStyle: { color: '#722ed1' },
        },
      ],
    };
  };

  // 用户排行榜图表配置
  const getUserRankingChartOption = () => {
    const top10 = userRanking.slice(0, 10);
    const usernames = top10.map(item => item.nickname || item.username || '未知');
    const totalTokens = top10.map(item => item.totalTokens || 0);

    return {
      title: {
        text: '用户Token消耗TOP10',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: usernames,
        axisLabel: { interval: 0 },
      },
      series: [
        {
          type: 'bar',
          data: totalTokens,
          itemStyle: { color: '#eb2f96' },
        },
      ],
    };
  };

  // Token分布饼图配置
  const getTokenDistributionOption = () => {
    if (modelRanking.length === 0) return {};
    
    const top5 = modelRanking.slice(0, 5);
    const otherTokens = modelRanking.slice(5).reduce((sum, item) => sum + (item.totalTokens || 0), 0);
    
    const data = top5.map(item => ({
      value: item.totalTokens || 0,
      name: item.modelName || '未知',
    }));
    
    if (otherTokens > 0) {
      data.push({ value: otherTokens, name: '其他' });
    }

    return {
      title: {
        text: 'Token分布（按模型）',
        left: 'center',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: 'Token分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          data: data,
        },
      ],
    };
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString();
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return `0.00 ${currency}`;
    return `${Number(amount).toFixed(4)} ${currency}`;
  };

  return (
    <div style={{ padding: '20px', background: token.colorBgLayout, minHeight: '100vh' }}>
      {/* 筛选条件 */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col>
            <span style={{ marginRight: 8 }}>时间维度：</span>
            <Select
              value={timeDimension}
              onChange={setTimeDimension}
              style={{ width: 120 }}
            >
              <Option value="daily">每日</Option>
              <Option value="weekly">每周</Option>
              <Option value="monthly">每月</Option>
              <Option value="quarterly">每季度</Option>
              <Option value="yearly">每年</Option>
            </Select>
          </Col>
          <Col>
            <RangePicker
              showTime
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Col>
          <Col>
            <span style={{ marginRight: 8 }}>货币：</span>
            <Select
              value={currency}
              onChange={setCurrency}
              style={{ width: 100 }}
            >
              <Option value="CNY">CNY</Option>
              <Option value="USD">USD</Option>
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={fetchAllData} loading={loading}>
              刷新数据
            </Button>
          </Col>
        </Row>
      </Card>

      <Spin spinning={loading}>
        {/* 概览统计卡片 */}
        {overview && (
          <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总请求数"
                  value={formatNumber(overview.totalRequests)}
                  prefix={<ApiOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总Token数"
                  value={formatNumber(overview.totalTokens)}
                  prefix={<ThunderboltOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总费用"
                  value={formatCurrency(overview.totalCost)}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="活跃用户数"
                  value={formatNumber(overview.activeUsers)}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="使用模型数"
                  value={formatNumber(overview.modelCount)}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="成功率"
                  value={overview.successRate?.toFixed(2) || 0}
                  suffix="%"
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#13c2c2' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="平均耗时"
                  value={overview.avgDuration?.toFixed(2) || 0}
                  suffix="ms"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
            {costStatistics && (
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="平均费用"
                    value={formatCurrency(costStatistics.avgCost)}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
            )}
          </Row>
        )}

        {/* 详细统计卡片 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          {costStatistics && (
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="最大费用"
                  value={formatCurrency(costStatistics.maxCost)}
                  valueStyle={{ color: '#ff4d4f' }}
                />
                <Statistic
                  title="最小费用"
                  value={formatCurrency(costStatistics.minCost)}
                  valueStyle={{ fontSize: 14, marginTop: 8, color: '#52c41a' }}
                />
              </Card>
            </Col>
          )}
          {durationStatistics && (
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="最大耗时"
                  value={formatNumber(durationStatistics.maxDuration)}
                  suffix="ms"
                  valueStyle={{ color: '#ff4d4f' }}
                />
                <Statistic
                  title="最小耗时"
                  value={formatNumber(durationStatistics.minDuration)}
                  suffix="ms"
                  valueStyle={{ fontSize: 14, marginTop: 8, color: '#52c41a' }}
                />
              </Card>
            </Col>
          )}
          {successRate && (
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="成功请求数"
                  value={formatNumber(successRate.successCount)}
                  valueStyle={{ color: '#52c41a' }}
                />
                <Statistic
                  title="失败请求数"
                  value={formatNumber(successRate.failCount)}
                  valueStyle={{ fontSize: 14, marginTop: 8, color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          )}
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]}>
          {/* 时间趋势图 */}
          <Col xs={24} lg={24}>
            <Card>
              <ReactECharts
                option={getTimeChartOption()}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>

          {/* Token分布饼图 */}
          <Col xs={24} lg={12}>
            <Card>
              <ReactECharts
                option={getTokenDistributionOption()}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>

          {/* 模型排行榜 */}
          <Col xs={24} lg={12}>
            <Card>
              <ReactECharts
                option={getModelRankingChartOption()}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>

          {/* IP排行榜 */}
          <Col xs={24} lg={12}>
            <Card>
              <ReactECharts
                option={getIpRankingChartOption()}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>

          {/* 用户排行榜 */}
          <Col xs={24} lg={12}>
            <Card>
              <ReactECharts
                option={getUserRankingChartOption()}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default SaAiTokenUsageLogDashboard;