import React from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Progress, Row, Spin, Tag, Typography } from 'antd';

const { Text, Title } = Typography;

const pct = (ratio) => `${Math.round((ratio || 0) * 1000) / 10}%`;

const RankList = ({ title, items, emptyText }) => (
  <Card size="small" title={title} styles={{ body: { padding: '12px 16px', minHeight: 160 } }}>
    {!items || items.length === 0 ? (
      <Text type="secondary">{emptyText}</Text>
    ) : (
      items.slice(0, 8).map((item) => (
        <div key={item.key || item.name} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <Text ellipsis style={{ maxWidth: '70%' }} title={item.name}>
              {item.name}
            </Text>
            <Text type="secondary">
              {item.count} · {pct(item.ratio)}
            </Text>
          </div>
          <Progress
            percent={Math.round((item.ratio || 0) * 1000) / 10}
            showInfo={false}
            size="small"
            strokeColor="#1677ff"
          />
        </div>
      ))
    )}
  </Card>
);

RankList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  emptyText: PropTypes.string,
};

const TodayPostStockStats = ({ stats, loading, t }) => {
  if (!stats && !loading) {
    return null;
  }

  return (
    <Card
      size="small"
      style={{ marginBottom: 12 }}
      title={
        <span>
          {t('todayPostStats') || '今日发帖统计'}
          {stats?.statsDate ? (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {stats.statsDate}
            </Tag>
          ) : null}
          {stats?.timezone ? (
            <Text type="secondary" style={{ marginLeft: 8, fontWeight: 400, fontSize: 12 }}>
              {stats.timezone}
            </Text>
          ) : null}
        </span>
      }
    >
      <Spin spinning={loading}>
        <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
          <Col xs={12} md={6}>
            <Card size="small" styles={{ body: { textAlign: 'center' } }}>
              <Text type="secondary">{t('todayPublished') || '今日发布'}</Text>
              <Title level={3} style={{ margin: '4px 0 0' }}>
                {stats?.publishedCount ?? 0}
              </Title>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small" styles={{ body: { textAlign: 'center' } }}>
              <Text type="secondary">{t('todayCreated') || '今日入库'}</Text>
              <Title level={3} style={{ margin: '4px 0 0' }}>
                {stats?.createdCount ?? 0}
              </Title>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small" styles={{ body: { textAlign: 'center' } }}>
              <Text type="secondary">{t('todayPendingReview') || '今日待审核'}</Text>
              <Title level={3} style={{ margin: '4px 0 0' }}>
                {stats?.pendingReviewCount ?? 0}
              </Title>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card size="small" styles={{ body: { textAlign: 'center' } }}>
              <Text type="secondary">{t('agentTypes') || '活跃 Agent'}</Text>
              <Title level={3} style={{ margin: '4px 0 0' }}>
                {stats?.byAgent?.length ?? 0}
              </Title>
            </Card>
          </Col>
        </Row>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={8}>
            <RankList
              title={t('agentShare') || 'Agent 占比'}
              items={stats?.byAgent}
              emptyText={t('noData') || '暂无数据'}
            />
          </Col>
          <Col xs={24} md={8}>
            <RankList
              title={t('channelShare') || '频道占比'}
              items={stats?.byChannel}
              emptyText={t('noData') || '暂无数据'}
            />
          </Col>
          <Col xs={24} md={8}>
            <RankList
              title={t('styleShare') || '风格标签占比'}
              items={stats?.byStyleTag}
              emptyText={t('noStyleTags') || '暂无风格标签'}
            />
          </Col>
        </Row>
        {stats?.byStatus?.length > 0 ? (
          <div style={{ marginTop: 12 }}>
            <Text type="secondary" style={{ marginRight: 8 }}>
              {t('todayStatusShare') || '今日入库状态'}
            </Text>
            {stats.byStatus.map((s) => (
              <Tag key={s.key} style={{ marginBottom: 4 }}>
                {s.name}: {s.count} ({pct(s.ratio)})
              </Tag>
            ))}
          </div>
        ) : null}
      </Spin>
    </Card>
  );
};

TodayPostStockStats.propTypes = {
  stats: PropTypes.object,
  loading: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default TodayPostStockStats;
