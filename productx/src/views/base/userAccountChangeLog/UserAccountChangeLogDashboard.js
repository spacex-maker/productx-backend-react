import React, { useState, useEffect, useMemo } from 'react';
import api from 'src/axiosInstance';
import { Card, Row, Col, Spin, Statistic, message, theme } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useTranslation } from 'react-i18next';
import {
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

/**
 * 账户变更记录统计看板
 * @param {Object} props
 * @param {Object} props.timeRange - { startTime, endTime } 可选，与列表筛选时间一致时传入
 */
const UserAccountChangeLogDashboard = ({ timeRange = {} }) => {
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
      const res = await api.get('/manage/user-account-change-log/stats', { params });
      const data = res?.data ?? res;
      setStats(data || null);
    } catch (error) {
      console.error('获取统计看板失败', error);
      message.error('获取统计看板失败');
    } finally {
      setLoading(false);
    }
  };

  const summary = stats?.summary ?? null;
  const byChangeType = stats?.byChangeType ?? [];
  const byCoinType = stats?.byCoinType ?? [];
  const dailyTrend = stats?.dailyTrend ?? [];

  const changeTypeLabelMap = {
    AI_MODEL_FEE: t('aiModelFee'),
    FROZEN: t('frozen'),
    UNFROZEN: t('unfrozen'),
    DEPOSIT: t('deposit'),
    WITHDRAW: t('withdraw'),
    REFUND: t('refund'),
  };

  const pieOption = useMemo(() => {
    if (!byChangeType.length) {
      return {
        backgroundColor: chartBg,
        title: { text: t('accountChangeLogStats.byChangeType'), left: 'center', textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor } },
        series: [{ type: 'pie', data: [] }],
      };
    }
    const data = byChangeType.map((item) => ({
      name: changeTypeLabelMap[item.changeType] || item.changeType,
      value: Number(item.count),
    }));
    return {
      backgroundColor: chartBg,
      title: {
        text: t('accountChangeLogStats.byChangeType'),
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}笔 ({d}%)',
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { color: textColor },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '65%'],
          center: ['40%', '50%'],
          data,
          emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)' } },
          label: { formatter: '{b}\n{c}笔', color: textColor },
          labelLine: { lineStyle: { color: axisLineColor } },
        },
      ],
    };
  }, [byChangeType, changeTypeLabelMap, t, textColor, axisLineColor, chartBg, token.colorBgElevated, token.colorBorder]);

  const barOption = useMemo(() => {
    const axisCommon = {
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
      nameTextStyle: { color: textColorSecondary },
    };
    if (!byCoinType.length) {
      return {
        backgroundColor: chartBg,
        title: { text: t('accountChangeLogStats.byCoinType'), left: 'center', textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor } },
        xAxis: { type: 'category', data: [], ...axisCommon },
        series: [{ type: 'bar', data: [] }],
      };
    }
    const categories = byCoinType.map((item) => item.coinType);
    const countData = byCoinType.map((item) => Number(item.count));
    const amountData = byCoinType.map((item) => Number(item.totalAmount || 0));
    return {
      backgroundColor: chartBg,
      title: {
        text: t('accountChangeLogStats.byCoinType'),
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
        formatter: (params) => {
          const i = params[0]?.dataIndex;
          if (i == null) return '';
          const item = byCoinType[i];
          return `${item.coinType}<br/>笔数: ${item.count}<br/>金额合计: ${Number(item.totalAmount || 0).toFixed(2)}`;
        },
      },
      legend: {
        data: [t('accountChangeLogStats.recordCount'), t('accountChangeLogStats.totalAmount')],
        top: 30,
        textStyle: { color: textColor },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 60, containLabel: true },
      xAxis: { type: 'category', data: categories, ...axisCommon },
      yAxis: [
        { type: 'value', name: t('accountChangeLogStats.recordCount'), ...axisCommon },
        { type: 'value', name: t('accountChangeLogStats.totalAmount'), ...axisCommon },
      ],
      series: [
        { name: t('accountChangeLogStats.recordCount'), type: 'bar', data: countData, itemStyle: { color: '#1890ff' } },
        { name: t('accountChangeLogStats.totalAmount'), type: 'line', yAxisIndex: 1, data: amountData, itemStyle: { color: '#52c41a' }, smooth: true },
      ],
    };
  }, [byCoinType, t, textColor, textColorSecondary, axisLineColor, splitLineColor, chartBg, token.colorBgElevated, token.colorBorder]);

  const lineOption = useMemo(() => {
    const axisCommon = {
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
      nameTextStyle: { color: textColorSecondary },
    };
    if (!dailyTrend.length) {
      return {
        backgroundColor: chartBg,
        title: { text: t('accountChangeLogStats.dailyTrend'), left: 'center', textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor } },
        xAxis: { type: 'category', data: [], ...axisCommon },
        series: [{ type: 'line', data: [] }],
      };
    }
    const dates = dailyTrend.map((d) => d.date);
    const counts = dailyTrend.map((d) => Number(d.count));
    const inflows = dailyTrend.map((d) => Number(d.inflow || 0));
    const outflows = dailyTrend.map((d) => Number(d.outflow || 0));
    return {
      backgroundColor: chartBg,
      title: {
        text: t('accountChangeLogStats.dailyTrend'),
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      legend: {
        data: [t('accountChangeLogStats.recordCount'), t('accountChangeLogStats.inflow'), t('accountChangeLogStats.outflow')],
        top: 30,
        textStyle: { color: textColor },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 60, containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: dates, ...axisCommon },
      yAxis: { type: 'value', ...axisCommon },
      series: [
        { name: t('accountChangeLogStats.recordCount'), type: 'bar', data: counts, itemStyle: { color: '#1890ff' } },
        { name: t('accountChangeLogStats.inflow'), type: 'line', data: inflows, smooth: true, itemStyle: { color: '#52c41a' } },
        { name: t('accountChangeLogStats.outflow'), type: 'line', data: outflows, smooth: true, itemStyle: { color: '#ff4d4f' } },
      ],
    };
  }, [dailyTrend, t, textColor, textColorSecondary, axisLineColor, splitLineColor, chartBg, token.colorBgElevated, token.colorBorder]);

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
        <strong>{t('accountChangeLogStats.title')}</strong>
      </div>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic
                title={t('accountChangeLogStats.totalCount')}
                value={summary?.totalCount ?? 0}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic
                title={t('accountChangeLogStats.totalInflow')}
                value={Number(summary?.totalInflow ?? 0)}
                precision={2}
                prefix={<ArrowUpOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card size="small">
              <Statistic
                title={t('accountChangeLogStats.totalOutflow')}
                value={Number(summary?.totalOutflow ?? 0)}
                precision={2}
                prefix={<ArrowDownOutlined />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card size="small" title={t('accountChangeLogStats.byChangeType')}>
              <ReactECharts option={pieOption} style={{ height: 280 }} notMerge opts={{ locale: 'ZH' }} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card size="small" title={t('accountChangeLogStats.byCoinType')}>
              <ReactECharts option={barOption} style={{ height: 280 }} notMerge opts={{ locale: 'ZH' }} />
            </Card>
          </Col>
          <Col span={24}>
            <Card size="small" title={t('accountChangeLogStats.dailyTrend')}>
              <ReactECharts option={lineOption} style={{ height: 320 }} notMerge opts={{ locale: 'ZH' }} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default UserAccountChangeLogDashboard;
