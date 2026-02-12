import React, { useState, useEffect, useMemo } from 'react';
import api from 'src/axiosInstance';
import { Card, Row, Col, Spin, Statistic, message, theme, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import {
  LoginOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  GlobalOutlined,
  LaptopOutlined,
} from '@ant-design/icons';

/**
 * 用户登录日志统计看板
 * @param {Object} props.timeRange - { startTime, endTime } 可选
 */
const UserLoginLogDashboard = ({ timeRange = {} }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const textColor = token.colorText;
  const textColorSecondary = token.colorTextSecondary;
  const chartBg = 'transparent';
  const axisLineColor = token.colorBorderSecondary;
  const splitLineColor = token.colorSplit;

  useEffect(() => {
    fetchStats();
  }, [timeRange?.startTime, timeRange?.endTime]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = {};
      if (timeRange?.startTime) params.startTime = timeRange.startTime;
      if (timeRange?.endTime) params.endTime = timeRange.endTime;
      const res = await api.get('/manage/user-login-log/stats', { params });
      const data = res?.data ?? res;
      setStats(data || null);
    } catch (error) {
      console.error('获取登录日志统计失败', error);
      message.error(t('getFailed') || '获取失败');
    } finally {
      setLoading(false);
    }
  };

  const summary = stats?.summary ?? null;
  const byLoginMethod = stats?.byLoginMethod ?? [];
  const byChannel = stats?.byChannel ?? [];
  const byDeviceType = stats?.byDeviceType ?? [];
  const byCountry = stats?.byCountry ?? [];
  const byDomain = stats?.byDomain ?? [];
  const dailyTrend = stats?.dailyTrend ?? [];
  const topUsers = stats?.topUsers ?? [];
  const topIps = stats?.topIps ?? [];

  const makePieOption = (title, data, emptyText) => {
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
    const categories = list.map((i) => i.key || '-');
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
    const uniqueUsers = list.map((d) => Number(d.uniqueUsers || 0));
    const axisCommon = {
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
    };
    return {
      backgroundColor: chartBg,
      title: { text: t('loginLogStats.dailyTrend') || '每日趋势', left: 'center', textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor } },
      tooltip: { trigger: 'axis', backgroundColor: token.colorBgElevated, borderColor: token.colorBorder, textStyle: { color: textColor } },
      legend: { data: [t('loginLogStats.loginCount') || '登录次数', t('loginLogStats.uniqueUsers') || '独立用户数'], top: 30, textStyle: { color: textColor } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 55, containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: dates, ...axisCommon },
      yAxis: { type: 'value', ...axisCommon },
      series: [
        { name: t('loginLogStats.loginCount') || '登录次数', type: 'bar', data: counts, itemStyle: { color: '#1890ff' } },
        { name: t('loginLogStats.uniqueUsers') || '独立用户数', type: 'line', data: uniqueUsers, smooth: true, itemStyle: { color: '#52c41a' } },
      ],
    };
  }, [dailyTrend, t, textColor, axisLineColor, splitLineColor, chartBg, token.colorBgElevated, token.colorBorder]);

  const topUsersColumns = [
    { title: t('userId') || '用户ID', dataIndex: 'userId', key: 'userId', width: 100 },
    { title: t('username') || '用户名', dataIndex: 'username', key: 'username', ellipsis: true },
    { title: t('loginLogStats.loginCount') || '登录次数', dataIndex: 'count', key: 'count', width: 100 },
  ];

  const topIpsColumns = [
    { title: t('loginIp') || 'IP', dataIndex: 'key', key: 'key', ellipsis: true, width: 140 },
    { title: t('loginLogStats.region') || '地域', dataIndex: 'region', key: 'region', ellipsis: true },
    { title: t('loginLogStats.loginCount') || '登录次数', dataIndex: 'count', key: 'count', width: 100 },
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
        <strong>{t('loginLogStats.title') || '登录日志统计看板'}</strong>
      </div>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title={t('loginLogStats.totalCount') || '总登录次数'}
                value={summary?.totalCount ?? 0}
                prefix={<LoginOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title={t('loginLogStats.successCount') || '成功次数'}
                value={summary?.successCount ?? 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title={t('loginLogStats.failCount') || '失败次数'}
                value={summary?.failCount ?? 0}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small">
              <Statistic
                title={t('loginLogStats.uniqueUserCount') || '独立用户数'}
                value={summary?.uniqueUserCount ?? 0}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card size="small" title={t('loginLogStats.byLoginMethod') || '按登录方式'}>
              <ReactECharts
                option={makePieOption(t('loginLogStats.byLoginMethod') || '按登录方式', byLoginMethod)}
                style={{ height: 260 }}
                notMerge
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title={t('loginLogStats.byChannel') || '按登录渠道'}>
              <ReactECharts
                option={makePieOption(t('loginLogStats.byChannel') || '按登录渠道', byChannel)}
                style={{ height: 260 }}
                notMerge
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title={t('loginLogStats.byDeviceType') || '按设备类型'}>
              <ReactECharts
                option={makePieOption(t('loginLogStats.byDeviceType') || '按设备类型', byDeviceType)}
                style={{ height: 260 }}
                notMerge
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card size="small" title={t('loginLogStats.byCountry') || '按国家/地区'}>
              <ReactECharts
                option={makeBarOption(t('loginLogStats.byCountry') || '按国家/地区', byCountry, t('loginLogStats.loginCount') || '登录次数')}
                style={{ height: 280 }}
                notMerge
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title={t('loginLogStats.byDomain') || '按前端域名'}>
              <ReactECharts
                option={makeBarOption(t('loginLogStats.byDomain') || '按前端域名', byDomain, t('loginLogStats.loginCount') || '登录次数')}
                style={{ height: 280 }}
                notMerge
              />
            </Card>
          </Col>

          <Col span={24}>
            <Card size="small" title={t('loginLogStats.dailyTrend') || '每日趋势'}>
              <ReactECharts option={dailyTrendOption} style={{ height: 300 }} notMerge />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card size="small" title={t('loginLogStats.topUsers') || '登录次数 TOP 用户'}>
              <Table
                size="small"
                dataSource={topUsers}
                columns={topUsersColumns}
                rowKey="userId"
                pagination={false}
                scroll={{ y: 240 }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title={t('loginLogStats.topIps') || '登录次数 TOP IP'}>
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

export default UserLoginLogDashboard;
