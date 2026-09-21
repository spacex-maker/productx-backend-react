import React, { useEffect, useState } from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Spin,
  Table,
  Avatar,
  Typography,
  Space,
  message,
  Divider,
} from 'antd';
import { UserOutlined, GlobalOutlined, StopOutlined } from '@ant-design/icons';
import api from 'src/axiosInstance';
import { useTranslation } from 'react-i18next';

const { Text, Paragraph } = Typography;

const KYC_STATUS_MAP = { 0: '未认证', 1: '审核中', 2: '已通过', 3: '审核失败', 4: '需重新认证' };
const KYC_COLOR = { 0: 'default', 1: 'processing', 2: 'success', 3: 'error', 4: 'warning' };

const formatNum = (v) => {
  if (v == null || v === '') return '—';
  const n = Number(v);
  return Number.isNaN(n) ? String(v) : n.toLocaleString();
};

const IpDetailModal = ({ open, clientIp, timeRange = {}, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (!open || !clientIp) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const params = { clientIp };
        if (timeRange?.startTime) params.startTime = timeRange.startTime;
        if (timeRange?.endTime) params.endTime = timeRange.endTime;
        const res = await api.get('/manage/api-access-log/ip-detail', { params });
        if (!cancelled) {
          setDetail(res?.data ?? res ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          message.error(t('apiAccessLogStats.ipDetailLoadFailed') || '加载 IP 详情失败');
          setDetail(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [open, clientIp, timeRange?.startTime, timeRange?.endTime, t]);

  const geo = detail?.geo;
  const geoOk = geo && geo.status === 'success';

  const pathColumns = [
    {
      title: t('apiAccessLogStats.apiPath') || '接口路径',
      dataIndex: 'key',
      key: 'key',
      ellipsis: true,
    },
    {
      title: t('apiAccessLogStats.callCount') || '访问次数',
      dataIndex: 'count',
      key: 'count',
      width: 100,
      render: (v) => formatNum(v),
    },
  ];

  const userColumns = [
    {
      title: t('apiAccessLogStats.relatedUsers') || '用户',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar || undefined} icon={<UserOutlined />} size="small">
            {record.username?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <div>
            <div>{record.nickname || record.username || '—'}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.userId}
              {record.username ? ` · ${record.username}` : ''}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: t('apiAccessLogStats.ipAccessCount') || '该IP访问次数',
      dataIndex: 'accessCount',
      key: 'accessCount',
      width: 120,
      render: (v) => formatNum(v),
    },
    {
      title: t('apiAccessLogStats.kycStatus') || '实名状态',
      dataIndex: 'kycStatus',
      key: 'kycStatus',
      width: 100,
      render: (v) =>
        v == null ? '—' : <Tag color={KYC_COLOR[v] || 'default'}>{KYC_STATUS_MAP[v] ?? v}</Tag>,
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <GlobalOutlined />
          <span>
            {t('apiAccessLogStats.ipDetailTitle') || 'IP 详情'}
            {clientIp ? `：${clientIp}` : ''}
          </span>
          {detail?.blocked ? (
            <Tag icon={<StopOutlined />} color="error">
              {t('apiAccessLogStats.ipBlocked') || '已封禁'}
            </Tag>
          ) : null}
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={860}
      destroyOnClose
    >
      <Spin spinning={loading}>
        {!detail && !loading ? (
          <Text type="secondary">{t('apiAccessLogStats.ipDetailEmpty') || '暂无数据'}</Text>
        ) : (
          <>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label={t('apiAccessLogStats.clientIp') || '访问IP'}>
                <Text copyable>{detail?.clientIp || clientIp || '—'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t('apiAccessLogStats.region') || '日志地域'}>
                {detail?.region || '—'}
              </Descriptions.Item>
              <Descriptions.Item label={t('apiAccessLogStats.callCount') || '访问次数'}>
                {formatNum(detail?.accessCount)}
              </Descriptions.Item>
              <Descriptions.Item label={t('apiAccessLogStats.successCount') || '成功次数'}>
                {formatNum(detail?.successCount)} / {formatNum(detail?.failCount)}{' '}
                <Text type="secondary">({t('apiAccessLogStats.failCount') || '失败'})</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t('apiAccessLogStats.avgDuration') || '平均耗时(ms)'}>
                {formatNum(detail?.avgDuration)}
              </Descriptions.Item>
              <Descriptions.Item label={t('apiAccessLogStats.uniqueUserCount') || '独立用户数'}>
                {formatNum(detail?.uniqueUserCount)}
              </Descriptions.Item>
              <Descriptions.Item label={t('apiAccessLogStats.uniquePathCount') || '独立接口数'}>
                {formatNum(detail?.uniquePathCount)}
              </Descriptions.Item>
              <Descriptions.Item label={t('apiAccessLogStats.firstAccessTime') || '首次访问'}>
                {detail?.firstAccessTime || '—'}
              </Descriptions.Item>
              <Descriptions.Item label={t('apiAccessLogStats.lastAccessTime') || '最近访问'} span={2}>
                {detail?.lastAccessTime || '—'}
              </Descriptions.Item>
              {detail?.blocked ? (
                <>
                  <Descriptions.Item label={t('apiAccessLogStats.blockReason') || '封禁原因'} span={2}>
                    {detail.blockReason || '—'}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('apiAccessLogStats.blockedAt') || '封禁时间'} span={2}>
                    {detail.blockedAt || '—'}
                  </Descriptions.Item>
                </>
              ) : null}
            </Descriptions>

            <Divider orientation="left" plain>
              {t('apiAccessLogStats.geoInfo') || '地理 / 运营商'}
            </Divider>
            {geoOk ? (
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label={t('apiAccessLogStats.country') || '国家'}>
                  {geo.country || '—'}
                  {geo.countryCode ? ` (${geo.countryCode})` : ''}
                </Descriptions.Item>
                <Descriptions.Item label={t('apiAccessLogStats.geoRegion') || '地区'}>
                  {[geo.regionName, geo.city].filter(Boolean).join(' / ') || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={t('apiAccessLogStats.isp') || 'ISP'}>
                  {geo.isp || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={t('apiAccessLogStats.org') || '组织'}>
                  {geo.org || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={t('apiAccessLogStats.asn') || 'ASN'} span={2}>
                  {geo.as || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={t('apiAccessLogStats.timezone') || '时区'}>
                  {geo.timezone || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={t('apiAccessLogStats.coordinates') || '坐标'}>
                  {geo.lat != null && geo.lon != null ? `${geo.lat}, ${geo.lon}` : '—'}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Text type="secondary">
                {geo?.message || t('apiAccessLogStats.geoUnavailable') || '暂无法解析地理位置'}
              </Text>
            )}

            <Divider orientation="left" plain>
              {t('apiAccessLogStats.ipTopPaths') || '该 IP 访问接口 TOP'}
            </Divider>
            <Table
              size="small"
              rowKey={(r, i) => `${r.key}-${i}`}
              columns={pathColumns}
              dataSource={detail?.topPaths || []}
              pagination={false}
              scroll={{ y: 220 }}
            />

            <Divider orientation="left" plain>
              {t('apiAccessLogStats.ipTopDomains') || '前端域名 TOP'}
            </Divider>
            <Table
              size="small"
              rowKey={(r, i) => `d-${r.key}-${i}`}
              columns={pathColumns.map((c) =>
                c.dataIndex === 'key'
                  ? { ...c, title: t('apiAccessLogStats.byDomain') || '前端域名' }
                  : c
              )}
              dataSource={detail?.topDomains || []}
              pagination={false}
              scroll={{ y: 160 }}
            />

            <Divider orientation="left" plain>
              {t('apiAccessLogStats.ipTopUserAgents') || 'User-Agent TOP'}
            </Divider>
            {(detail?.topUserAgents || []).length === 0 ? (
              <Text type="secondary">—</Text>
            ) : (
              <div style={{ maxHeight: 160, overflow: 'auto' }}>
                {(detail?.topUserAgents || []).map((item, idx) => (
                  <Paragraph
                    key={`${item.key}-${idx}`}
                    ellipsis={{ rows: 2, tooltip: item.key }}
                    style={{ marginBottom: 8, fontSize: 12 }}
                  >
                    <Tag>{formatNum(item.count)}</Tag>
                    {item.key || '—'}
                  </Paragraph>
                ))}
              </div>
            )}

            <Divider orientation="left" plain>
              {t('apiAccessLogStats.relatedUsers') || '关联用户'}
            </Divider>
            <Table
              size="small"
              rowKey={(r) => r.userId}
              columns={userColumns}
              dataSource={detail?.users || []}
              pagination={false}
              scroll={{ y: 240 }}
            />
          </>
        )}
      </Spin>
    </Modal>
  );
};

export default IpDetailModal;
