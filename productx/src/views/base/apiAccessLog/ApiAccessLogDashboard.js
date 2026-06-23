import React, { useState, useEffect, useMemo } from 'react';
import api from 'src/axiosInstance';
import { Card, Row, Col, Spin, Statistic, message, theme, Table, Avatar, Tag, Tooltip, Button, Popconfirm } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useTranslation } from 'react-i18next';
import IpBlockModal from './IpBlockModal';
import {
  ApiOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FieldTimeOutlined,
  ThunderboltOutlined,
  UserOutlined,
  StopOutlined,
} from '@ant-design/icons';

const KYC_STATUS_MAP = { 0: '未认证', 1: '审核中', 2: '已通过', 3: '审核失败', 4: '需重新认证' };
const KYC_COLOR = { 0: 'default', 1: 'processing', 2: 'success', 3: 'error', 4: 'warning' };

const formatAmount = (value) => {
  if (value == null || value === '') return '—';
  const num = Number(value);
  return Number.isNaN(num) ? String(value) : num.toLocaleString(undefined, { maximumFractionDigits: 4 });
};

/**
 * API 访问日志统计看板（基于 api_access_logs 明细）
 * @param {Object} props.timeRange - { startTime, endTime } 可选
 */
const ApiAccessLogDashboard = ({ timeRange = {} }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockTargetIp, setBlockTargetIp] = useState(null);
  const [blockSubmitting, setBlockSubmitting] = useState(false);

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

  const handleOpenBlockModal = (record) => {
    setBlockTargetIp(record.clientIp);
    setBlockModalOpen(true);
  };

  const handleBlockSubmit = async (reason) => {
    if (!blockTargetIp) return;
    setBlockSubmitting(true);
    try {
      await api.post('/manage/ip-block-record/block', {
        ipAddress: blockTargetIp,
        reason,
      });
      message.success('IP 已封禁');
      setBlockModalOpen(false);
      setBlockTargetIp(null);
      await fetchStats();
    } catch (error) {
      message.error(error?.response?.data?.message || '封禁失败');
    } finally {
      setBlockSubmitting(false);
    }
  };

  const handleUnblockIp = async (ip) => {
    try {
      await api.post('/manage/ip-block-record/unblock', { ipAddress: ip });
      message.success('IP 已解除封禁');
      await fetchStats();
    } catch (error) {
      message.error(error?.response?.data?.message || '解除封禁失败');
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
  const topIpMultiUsers = stats?.topIpMultiUsers ?? [];

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

  const topIpMultiUsersColumns = [
    {
      title: t('apiAccessLogStats.rank') || '排名',
      key: 'rank',
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: t('apiAccessLogStats.clientIp') || '访问IP',
      dataIndex: 'clientIp',
      key: 'clientIp',
      width: 180,
      render: (value, record) => (
        <div>
          <div>{value || '—'}</div>
          {record.blocked ? (
            <Tag color="error" style={{ marginTop: 4 }}>
              {t('apiAccessLogStats.ipBlocked') || '已封禁'}
            </Tag>
          ) : null}
        </div>
      ),
    },
    {
      title: t('apiAccessLogStats.userCount') || '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 90,
      sorter: (a, b) => Number(a.userCount || 0) - Number(b.userCount || 0),
      defaultSortOrder: 'descend',
    },
    {
      title: t('apiAccessLogStats.callCount') || '访问次数',
      dataIndex: 'accessCount',
      key: 'accessCount',
      width: 100,
      sorter: (a, b) => Number(a.accessCount || 0) - Number(b.accessCount || 0),
    },
    {
      title: t('apiAccessLogStats.region') || '地域',
      dataIndex: 'region',
      key: 'region',
      width: 140,
      ellipsis: true,
      render: (value) => value || '-',
    },
    {
      title: t('apiAccessLogStats.relatedUsers') || '关联用户',
      dataIndex: 'users',
      key: 'users',
      width: 280,
      render: (users) => {
        if (!Array.isArray(users) || users.length === 0) return '-';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Avatar.Group max={{ count: 5 }} size="small">
              {users.map((user) => (
                <Tooltip
                  key={user.userId}
                  title={`${user.nickname || user.username || '-'} (ID: ${user.userId})`}
                >
                  <Avatar src={user.avatar || undefined} icon={<UserOutlined />}>
                    {user.username?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                </Tooltip>
              ))}
            </Avatar.Group>
            <span style={{ fontSize: 12, color: '#888' }}>
              {users.length} {t('apiAccessLogStats.usersUnit') || '个用户'}，{t('apiAccessLogStats.expandDetail') || '展开查看详情'}
            </span>
          </div>
        );
      },
    },
    {
      title: t('operation') || '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        record.blocked ? (
          <Popconfirm
            title={t('apiAccessLogStats.unblockConfirm') || '确认解除该 IP 封禁？'}
            onConfirm={() => handleUnblockIp(record.clientIp)}
            okText={t('confirm') || '确认'}
            cancelText={t('cancel') || '取消'}
          >
            <Button type="link" size="small">
              {t('apiAccessLogStats.unblockIp') || '解除封禁'}
            </Button>
          </Popconfirm>
        ) : (
          <Button
            type="link"
            size="small"
            danger
            icon={<StopOutlined />}
            onClick={() => handleOpenBlockModal(record)}
          >
            {t('apiAccessLogStats.blockIp') || '封禁IP'}
          </Button>
        )
      ),
    },
  ];

  const ipMultiUserDetailColumns = [
    {
      title: t('userInfo') || '用户信息',
      key: 'userInfo',
      width: 220,
      fixed: 'left',
      render: (_, user) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar src={user.avatar || undefined} icon={<UserOutlined />} size="small">
            {user.username?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500 }}>{user.username || '—'}</div>
            {user.nickname ? <div style={{ fontSize: 12, color: '#888' }}>{user.nickname}</div> : null}
            <div style={{ fontSize: 12, color: '#999' }}>ID: {user.userId ?? '—'}</div>
          </div>
        </div>
      ),
    },
    {
      title: t('email') || '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: true,
      render: (value) => value || '—',
    },
    {
      title: t('apiAccessLogStats.phoneNumber') || '手机号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 130,
      render: (value) => value || '—',
    },
    {
      title: t('apiAccessLogStats.tokenBalance') || 'Token余额',
      dataIndex: 'tokenBalance',
      key: 'tokenBalance',
      width: 110,
      render: (value) => formatAmount(value),
    },
    {
      title: t('apiAccessLogStats.cnyBalance') || 'CNY余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 100,
      render: (value) => formatAmount(value),
    },
    {
      title: t('status') || '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        status === false
          ? <Tag color="error">{t('disabled') || '禁用'}</Tag>
          : <Tag color="success">{t('enabled') || '正常'}</Tag>
      ),
    },
    {
      title: t('apiAccessLogStats.kycStatus') || '实名状态',
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      width: 100,
      render: (value) => (
        <Tag color={KYC_COLOR[value] || 'default'}>{KYC_STATUS_MAP[value] ?? '—'}</Tag>
      ),
    },
    {
      title: t('apiAccessLogStats.country') || '国家',
      dataIndex: 'countryCode',
      key: 'countryCode',
      width: 80,
      render: (value) => value || '—',
    },
    {
      title: t('apiAccessLogStats.ipAccessCount') || '该IP访问次数',
      dataIndex: 'accessCount',
      key: 'accessCount',
      width: 120,
      sorter: (a, b) => Number(a.accessCount || 0) - Number(b.accessCount || 0),
      defaultSortOrder: 'descend',
    },
    {
      title: t('apiAccessLogStats.userCreateTime') || '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 170,
      render: (value) => value || '—',
    },
  ];

  const renderIpMultiUserExpandedRow = (record) => (
    <Table
      size="small"
      columns={ipMultiUserDetailColumns}
      dataSource={Array.isArray(record.users) ? record.users : []}
      rowKey="userId"
      pagination={false}
      scroll={{ x: 1300 }}
    />
  );

  const topIpMultiUsersBarOption = useMemo(() => {
    const list = Array.isArray(topIpMultiUsers) ? topIpMultiUsers.slice(0, 10) : [];
    const categories = list.map((item) => item.clientIp || '-');
    const values = list.map((item) => Number(item.userCount || 0));
    const axisCommon = {
      axisLabel: { color: textColor },
      axisLine: { lineStyle: { color: axisLineColor } },
      splitLine: { lineStyle: { color: splitLineColor } },
    };
    return {
      backgroundColor: chartBg,
      title: {
        text: t('apiAccessLogStats.topIpMultiUsersChart') || '同IP多用户 TOP10',
        left: 'center',
        textStyle: { fontSize: 14, fontWeight: 'bold', color: textColor },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorder,
        textStyle: { color: textColor },
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 40, containLabel: true },
      xAxis: { type: 'category', data: categories, ...axisCommon },
      yAxis: {
        type: 'value',
        name: t('apiAccessLogStats.userCount') || '用户数',
        minInterval: 1,
        ...axisCommon,
      },
      series: [{ type: 'bar', data: values, itemStyle: { color: '#fa8c16' } }],
    };
  }, [topIpMultiUsers, t, textColor, axisLineColor, splitLineColor, chartBg, token.colorBgElevated, token.colorBorder]);

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

          <Col xs={24} lg={12}>
            <Card size="small" title={t('apiAccessLogStats.topIpMultiUsersChart') || '同IP多用户 TOP10'}>
              <ReactECharts option={topIpMultiUsersBarOption} style={{ height: 300 }} notMerge />
            </Card>
          </Col>
          <Col span={24}>
            <Card
              size="small"
              title={t('apiAccessLogStats.topIpMultiUsers') || '同IP多用户访问排名'}
            >
              <Table
                size="small"
                dataSource={topIpMultiUsers}
                columns={topIpMultiUsersColumns}
                rowKey="clientIp"
                expandable={{
                  expandedRowRender: renderIpMultiUserExpandedRow,
                  rowExpandable: (record) => Array.isArray(record.users) && record.users.length > 0,
                }}
                pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
                scroll={{ x: 1120 }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
      <IpBlockModal
        open={blockModalOpen}
        ip={blockTargetIp}
        loading={blockSubmitting}
        onCancel={() => {
          setBlockModalOpen(false);
          setBlockTargetIp(null);
        }}
        onSubmit={handleBlockSubmit}
      />
    </div>
  );
};

export default ApiAccessLogDashboard;
