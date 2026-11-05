import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Radio, Row, Spin, Statistic, Tag, Typography, theme } from 'antd';
import ReactECharts from 'echarts-for-react';

const { Text } = Typography;

const PostStockReportStats = ({ stats, loading, days, onDaysChange, t }) => {
  const { token } = theme.useToken();
  const chartBg = 'transparent';
  const textColor = token.colorText;
  const axisLineColor = token.colorBorderSecondary;
  const splitLineColor = token.colorSplit;

  const makePieOption = (title, data) => {
    const list = Array.isArray(data) ? data : [];
    const chartData = list.slice(0, 12).map((item) => ({
      name: item.name || item.key || '-',
      value: Number(item.count || 0),
    }));
    return {
      backgroundColor: chartBg,
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 4,
        top: 'middle',
        textStyle: { color: textColor, fontSize: 11 },
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['38%', '68%'],
          center: ['38%', '50%'],
          data: chartData,
          label: { color: textColor, formatter: '{d}%' },
          labelLine: { lineStyle: { color: axisLineColor } },
        },
      ],
    };
  };

  const makeBarOption = (title, data) => {
    const list = (Array.isArray(data) ? data : []).slice(0, 10);
    const categories = list.map((i) => {
      const name = i.name || i.key || '-';
      return name.length > 14 ? `${name.slice(0, 14)}...` : name;
    });
    const values = list.map((i) => Number(i.count || 0));
    const axisCommon = {
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
    };
    return {
      backgroundColor: chartBg,
      tooltip: {
        trigger: 'axis',
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      grid: { left: 8, right: 12, bottom: 8, top: 24, containLabel: true },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { ...axisCommon.axisLabel, rotate: categories.length > 6 ? 30 : 0 },
        axisLine: axisCommon.axisLine,
      },
      yAxis: { type: 'value', minInterval: 1, ...axisCommon },
      series: [
        {
          name: title,
          type: 'bar',
          data: values,
          itemStyle: { color: token.colorPrimary, borderRadius: [4, 4, 0, 0] },
          barMaxWidth: 36,
        },
      ],
    };
  };

  const dailyTrendOption = useMemo(() => {
    const list = Array.isArray(stats?.daily) ? stats.daily : [];
    const dates = list.map((d) => d.date);
    const created = list.map((d) => Number(d.createdCount || 0));
    const published = list.map((d) => Number(d.publishedCount || 0));
    const pending = list.map((d) => Number(d.pendingReviewCount || 0));
    const axisCommon = {
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
    };
    const createdLabel = t('createdTrend') || '入库';
    const publishedLabel = t('publishedTrend') || '发布';
    const pendingLabel = t('pendingReviewTrend') || '待审核';
    return {
      backgroundColor: chartBg,
      tooltip: {
        trigger: 'axis',
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      legend: {
        data: [createdLabel, publishedLabel, pendingLabel],
        top: 0,
        textStyle: { color: textColor },
      },
      grid: { left: 8, right: 16, bottom: 8, top: 40, containLabel: true },
      xAxis: { type: 'category', data: dates, boundaryGap: false, ...axisCommon },
      yAxis: { type: 'value', minInterval: 1, ...axisCommon },
      series: [
        {
          name: createdLabel,
          type: 'line',
          smooth: true,
          data: created,
          itemStyle: { color: '#1677ff' },
          areaStyle: { color: 'rgba(22,119,255,0.12)' },
        },
        {
          name: publishedLabel,
          type: 'line',
          smooth: true,
          data: published,
          itemStyle: { color: '#52c41a' },
          areaStyle: { color: 'rgba(82,196,26,0.10)' },
        },
        {
          name: pendingLabel,
          type: 'bar',
          data: pending,
          itemStyle: { color: '#faad14' },
          barMaxWidth: 18,
        },
      ],
    };
  }, [stats, t, token, textColor, axisLineColor, splitLineColor]);

  const statusBarOption = useMemo(
    () => makeBarOption(t('statusShare') || '入库状态', stats?.byStatus),
    [stats, t, token, textColor, axisLineColor, splitLineColor]
  );

  return (
    <Card
      size="small"
      style={{ marginBottom: 12 }}
      title={
        <span>
          {t('postStockReport') || '发帖统计报表'}
          {stats?.startDate && stats?.endDate ? (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {stats.startDate} ~ {stats.endDate}
            </Tag>
          ) : null}
          {stats?.timezone ? (
            <Text type="secondary" style={{ marginLeft: 8, fontWeight: 400, fontSize: 12 }}>
              {stats.timezone}
            </Text>
          ) : null}
        </span>
      }
      extra={
        <Radio.Group
          size="small"
          value={days}
          onChange={(e) => onDaysChange?.(e.target.value)}
          optionType="button"
          buttonStyle="solid"
          options={[
            { label: t('last7Days') || '近7天', value: 7 },
            { label: t('last14Days') || '近14天', value: 14 },
            { label: t('last30Days') || '近30天', value: 30 },
            { label: t('last90Days') || '近90天', value: 90 },
          ]}
        />
      }
    >
      <Spin spinning={loading}>
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={12} md={6}>
            <Card size="small">
              <Statistic title={t('periodPublished') || '区间发布'} value={stats?.publishedCount ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small">
              <Statistic title={t('periodCreated') || '区间入库'} value={stats?.createdCount ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small">
              <Statistic title={t('periodPendingReview') || '区间待审核'} value={stats?.pendingReviewCount ?? 0} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small">
              <Statistic title={t('agentTypes') || '活跃 Agent'} value={stats?.activeAgentCount ?? 0} />
            </Card>
          </Col>
        </Row>

        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Card size="small" title={t('dailyTrend') || '每日趋势'}>
              <ReactECharts option={dailyTrendOption} style={{ height: 320 }} notMerge />
            </Card>
          </Col>
        </Row>

        <Row gutter={[12, 12]}>
          <Col xs={24} md={8}>
            <Card size="small" title={t('agentShare') || 'Agent 占比'}>
              <ReactECharts
                option={makePieOption(t('agentShare') || 'Agent 占比', stats?.byAgent)}
                style={{ height: 280 }}
                notMerge
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" title={t('channelShare') || '频道占比'}>
              <ReactECharts
                option={makePieOption(t('channelShare') || '频道占比', stats?.byChannel)}
                style={{ height: 280 }}
                notMerge
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card size="small" title={t('styleShare') || '风格标签占比'}>
              {(stats?.byStyleTag || []).length === 0 ? (
                <div style={{ height: 280, displayContent: 'center', textAlign: 'center', color: token.colorTextSecondary }}>
                  {t('noStyleTags') || '暂无风格标签'}
                </div>
              ) : (
                <ReactECharts
                  option={makePieOption(t('styleShare') || '风格标签占比', stats?.byStyleTag)}
                  style={{ height: 280 }}
                  notMerge
                />
              )}
            </Card>
          </Col>
          <Col span={24}>
            <Card size="small" title={t('statusShare') || '入库状态分布'}>
              <ReactECharts option={statusBarOption} style={{ height: 260 }} notMerge />
            </Card>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};

PostStockReportStats.propTypes = {
  stats: PropTypes.object,
  loading: PropTypes.bool,
  days: PropTypes.number,
  onDaysChange: PropTypes.func,
  t: PropTypes.func.isRequired,
};

export default PostStockReportStats;