import React, { useState, useEffect, useMemo } from 'react';
import api from 'src/axiosInstance';
import { Card, Row, Col, Spin, Statistic, message, theme, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

/**
 * API 访问日志统计看板（基于 api_access_logs 明细）
 * @param {Object} props.timeRange - { startTime, endTime } 可选
 */
const ApiAccessLogDashboard = ({ timeRange = {} }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const textColor = token.colorText;
  const axisLineColor = token.colorBorderSecondary;
  const splitLineColor = token.colorSplit;
  const chartBg = 'transparent';

  useEffect(() => {
    fetchStats();
  }, [timeRange?.startTime, timeRange?.endTime]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = {};
      if (timeRange?.startTime) params.startTime = timeRange.startTime;
      if (timeRange?.endTime) params.endTime = timeRange.endTime;
      const res = await api.get('/manage/api-access-log/stats', { params });
      const data = res?.data ?? res;
      setStats(data || null);
    } catch (error) {
      console.error('获取API访问统计失败', error);
      message.error(t('getFailed') || '获取失败');
    } finally {
      setLoading(false);
    }
  };

  const summary = stats?.summary ?? null;
  const byAppCode = stats?.byAppCode ?? [];
  const byApiPath = stats?.byApiPath ?? [];
  const byMethod = stats?.byMethod ?? [];
  const byRegion = stats?.byRegion ?? [];
  const byDomain = stats?.byDomain ?? [];
  const dailyTrend = stats?.dailyTrend ?? [];
  const topPaths = stats?.topPaths ?? [];
  const topIps = stats?.topIps ?? [];

  const makePieOption = (title, data) => {
    const list = Array.isArray(data) ? data : [];
    const chartData = list.map((item) => ({ name: item.key || '-', value: Number(item.count || 0) }));
    return {
      backgroundColor: chartBg,
      title: { text: title, left: 'center', textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor } },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}次 ({d}%)',
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      legend: { orient: 'vertical', right: 8, top: 'center', textStyle: { color: textColor } },
      series: [{
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['40%', '50%'],
        data: chartData,
        label: { color: textColor },
        labelLine: { lineStyle: { color: axisLineColor } },
      }],
    };
  };

  const makeBarOption = (title, data, yName) => {
    const list = Array.isArray(data) ? data : [];
    const categories = list.map((i) => (i.key || '-').length > 20 ? (i.key || '-').slice(0, 20) + '...' : (i.key || '-'));
    const values = list.map((i) => Number(i.count || 0));
    const axisCommon = {
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
    };
    return {
      backgroundColor: chartBg,
      title: { text: title, left: 'center', textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor } },
      tooltip: {
        trigger: 'axis',
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 40, containLabel: true },
      xAxis: { type: 'category', data: categories, ...axisCommon },
      yAxis: { type: 'value', name: yName, ...axisCommon },
      series: [{ type: 'bar', data: values, itemStyle: { color: '#1890ff' } }],
    };
  };

  const dailyTrendOption = useMemo(() => {
    const list = Array.isArray(dailyTrend) ? dailyTrend : [];
    const dates = list.map((d) => d.date);
    const counts = list.map((d) => Number(d.count || 0));
    const successCounts = list.map((d) => Number(d.successCount || 0));
    const axisCommon = {
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
    };
    return {
      backgroundColor: chartBg,
      title: {
        text: t('apiAccessLogStats.dailyTrend') || '每日趋势',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      legend: {
        data: [t('apiAccessLogStats.totalCount') || '总访问', t('apiAccessLogStats.successCount') || '成功'],
        top: 30,
        textStyle: { color: textColor },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 55, containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: dates, ...axisCommon },
      yAxis: { type: 'value', ...axisCommon },
      series: [
        { name: t('apiAccessLogStats.totalCount') || '总访问', type: 'bar', data: counts, itemStyle: { color: '#1890ff' } },
        { name: t('apiAccessLogStats.successCount') || '成功', type: 'line', data: successCounts, smooth: true, itemStyle: { color: '#52c41a' } },
      ],
    };
  }, [dailyTrend, t, textColor, axisLineColor, splitLineColor, chartBg, token.colorBgElevated, token.colorBorder]);

  const topPathsColumns = [
    { title: t('apiAccessLogStats.apiPath') || '接口路径', dataIndex: 'key', key: 'key', ellipsis: true },
    { title: t('apiAccessLogStats.callCount') || '访问次数', dataIndex: 'count', key: 'count', width: 100 },
  ];

  const topIpsColumns = [
    { title: t('apiAccessLogStats.clientIp') || 'IP', dataIndex: 'key', key: 'key', ellipsis: true },
    { title: t('apiAccessLogStats.callCount') || '访问次数', dataIndex: 'count', key: 'count', width: 100 },
  ];

  if (loading && !stats) {
    return (
      <div className="mb-3 d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        <Spin tip={t('loading') || '加载中...'} />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="mb-3" style={{ color: token.colorTextHeading }}>
        <strong>{t('apiAccessLogStats.title') || 'API 访问日志统计看板'}</strong>
      </div>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card size="small">
              <Statistic
                title={t('apiAccessLogStats.totalCount') || '总访问次数'}
                value={summary?.totalCount ?? 0}
                prefix={<ApiOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card size="small">
              <Statistic
                title={t('apiAccessLogStats.successCount') || '成功次数'}
                value={summary?.successCount ?? 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card size="small">
              <Statistic
                title={t('apiAccessLogStats.failCount') || '失败次数'}
                value={summary?.failCount ?? 0}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card size="small">
              <Statistic
                title={t('apiAccessLogStats.avgDuration') || '平均耗时(ms)'}
                value={summary?.avgDuration ?? 0}
                prefix={<FieldTimeOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={4}>
            <Card size="small">
              <Statistic
                title={t('apiAccessLogStats.maxDuration') || '最大耗时(ms)'}
                value={summary?.maxDuration ?? 0}
                prefix={<ThunderboltOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card size="small" title={t('apiAccessLogStats.byAppCode') || '按子系统'}>
              <ReactECharts
                option={makePieOption(t('apiAccessLogStats.byAppCode') || '按子系统', byAppCode)}
                style={{ height: 260 }}
                notMerge
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title={t('apiAccessLogStats.byMethod') || '按请求方法'}>
              <ReactECharts
                option={makePieOption(t('apiAccessLogStats.byMethod') || '按请求方法', byMethod)}
                style={{ height: 260 }}
                notMerge
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title={t('apiAccessLogStats.byApiPath') || '按接口路径(TOP)'}>
              <ReactECharts
                option={makeBarOption(t('apiAccessLogStats.byApiPath') || '按接口路径', byApiPath.slice(0, 10), t('apiAccessLogStats.callCount') || '次数')}
                style={{ height: 260 }}
                notMerge
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card size="small" title={t('apiAccessLogStats.byRegion') || '按地域'}>
              <ReactECharts
                option={makeBarOption(t('apiAccessLogStats.byRegion') || '按地域', byRegion, t('apiAccessLogStats.callCount') || '次数')}
                style={{ height: 280 }}
                notMerge
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title={t('apiAccessLogStats.byDomain') || '按前端域名'}>
              <ReactECharts
                option={makeBarOption(t('apiAccessLogStats.byDomain') || '按前端域名', byDomain, t('apiAccessLogStats.callCount') || '次数')}
                style={{ height: 280 }}
                notMerge
              />
            </Card>
          </Col>

          <Col span={24}>
            <Card size="small" title={t('apiAccessLogStats.dailyTrend') || '每日趋势'}>
              <ReactECharts option={dailyTrendOption} style={{ height: 300 }} notMerge />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card size="small" title={t('apiAccessLogStats.topPaths') || '访问 TOP 接口'}>
              <Table
                size="small"
                dataSource={topPaths}
                columns={topPathsColumns}
                rowKey="key"
                pagination={false}
                scroll={{ y: 240 }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title={t('apiAccessLogStats.topIps') || '访问 TOP IP'}>
              <Table
                size="small"
                dataSource={topIps}
                columns={topIpsColumns}
                rowKey="key"
                pagination={false}
                scroll={{ y: 240 }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default ApiAccessLogDashboard;
