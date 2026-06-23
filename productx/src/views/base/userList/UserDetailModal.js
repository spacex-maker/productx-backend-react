import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Card,
  Watermark,
  Table,
  Tag,
  Descriptions,
  Tabs,
  Spin,
  Statistic,
  Image,
  message,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';
import {
  UserOutlined,
  WalletOutlined,
  QrcodeOutlined,
  PhoneOutlined,
  HomeOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  CopyOutlined,
  MailOutlined,
  TeamOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import DefaultAvatar from 'src/components/DefaultAvatar';
import { formatDate } from 'src/components/common/Common';
import api from 'src/axiosInstance';

const { Text, Link } = Typography;

/** 解析 C 端站点根地址，优先级与 core InviteServiceImpl + C 端 Invite 页一致 */
const resolveClientBaseUrl = (configBaseUrl) => {
  if (configBaseUrl && /^https?:\/\//i.test(configBaseUrl)) {
    return configBaseUrl.replace(/\/$/, '');
  }
  const envUrl = import.meta.env.VITE_CLIENT_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  const { hostname, protocol, port } = window.location;
  if (hostname.startsWith('admin.')) {
    const clientHost = hostname.slice(6);
    const portSuffix = port && !['80', '443'].includes(port) ? `:${port}` : '';
    return `${protocol}//${clientHost}${portSuffix}`;
  }
  return window.location.origin.replace(/\/$/, '');
};

const buildInviteLink = (inviteCode, configBaseUrl) => {
  if (!inviteCode) return '';
  const base = resolveClientBaseUrl(configBaseUrl);
  return `${base}/signup?inviteCode=${encodeURIComponent(inviteCode)}`;
};

const KYC_STATUS_MAP = {
  0: { color: 'default', text: '未认证' },
  1: { color: 'processing', text: '审核中' },
  2: { color: 'success', text: '已通过' },
  3: { color: 'error', text: '审核失败' },
  4: { color: 'warning', text: '需重新认证' },
  5: { color: 'processing', text: '解绑审核中' },
  6: { color: 'warning', text: '解绑未通过' },
};

const ID_TYPE_MAP = {
  CHINA_ID_CARD: '中国身份证',
  PASSPORT: '护照',
  HK_ID_CARD: '香港身份证',
  OTHER: '其他证件',
};

const INVITE_RECORD_STATUS_MAP = {
  0: { color: 'default', text: '已点击/待注册' },
  1: { color: 'processing', text: '已注册' },
  2: { color: 'success', text: '已达标' },
  9: { color: 'error', text: '风控冻结' },
};

const CHANGE_TYPE_COLOR = {
  AI_MODEL_FEE: 'red',
  FROZEN: 'blue',
  UNFROZEN: 'green',
  DEPOSIT: 'green',
  WITHDRAW: 'orange',
  REFUND: 'cyan',
};

const showValue = (value, fallback = '—') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: 6 });
};

const maskAddress = (address) => {
  if (!address) return '—';
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const UserDetailModal = ({ isVisible, onCancel, selectedUser }) => {
  const { t } = useTranslation();
  const userId = selectedUser?.id;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [parentUser, setParentUser] = useState(null);
  const [kycDetail, setKycDetail] = useState(null);
  const [inviteStats, setInviteStats] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [inviteRecords, setInviteRecords] = useState([]);
  const [inviteRecordTotal, setInviteRecordTotal] = useState(0);
  const [inviteRecordPage, setInviteRecordPage] = useState(1);
  const [accountLogs, setAccountLogs] = useState([]);
  const [accountLogTotal, setAccountLogTotal] = useState(0);
  const [accountLogPage, setAccountLogPage] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [frontendBaseUrl, setFrontendBaseUrl] = useState('');

  const currentUser = useSelector((state) => state.user?.currentUser || {});
  const watermarkContent = `ID: ${currentUser?.id || ''} ${currentUser?.username || ''}`;

  const resetState = useCallback(() => {
    setUser(null);
    setParentUser(null);
    setKycDetail(null);
    setInviteStats(null);
    setAddressList([]);
    setInviteRecords([]);
    setInviteRecordTotal(0);
    setInviteRecordPage(1);
    setAccountLogs([]);
    setAccountLogTotal(0);
    setAccountLogPage(1);
    setActiveTab('overview');
    setFrontendBaseUrl('');
  }, []);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      message.success(t('copySuccess'));
    }).catch(() => {
      message.error(t('copyFailed'));
    });
  };

  const fetchInviteRecords = useCallback(async (uid, page = 1) => {
    const response = await api.get('/manage/invite-record/list', {
      params: { currentPage: page, pageSize: 10, inviterUid: uid },
    });
    setInviteRecords(response?.data || []);
    setInviteRecordTotal(response?.totalNum || 0);
    setInviteRecordPage(page);
  }, []);

  const fetchAccountLogs = useCallback(async (uid, page = 1) => {
    const response = await api.get('/manage/user-account-change-log/list', {
      params: { currentPage: page, pageSize: 10, userId: uid },
    });
    setAccountLogs(response?.data || []);
    setAccountLogTotal(response?.totalNum || 0);
    setAccountLogPage(page);
  }, []);

  const loadUserDetail = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [
        userRes,
        kycRes,
        statsRes,
        addressRes,
        inviteRes,
        logsRes,
        frontendBaseRes,
      ] = await Promise.all([
        api.get(`/manage/user/${userId}`),
        api.get(`/manage/user/kyc/${userId}`).catch(() => null),
        api.get(`/manage/user-invite-stats/uid/${userId}`).catch(() => null),
        api.get(`/manage/user-address/list/${userId}`).catch(() => []),
        api.get('/manage/invite-record/list', {
          params: { currentPage: 1, pageSize: 10, inviterUid: userId },
        }).catch(() => ({ data: [], totalNum: 0 })),
        api.get('/manage/user-account-change-log/list', {
          params: { currentPage: 1, pageSize: 10, userId },
        }).catch(() => ({ data: [], totalNum: 0 })),
        api.get('/manage/sys-config/frontend-base-url').catch(() => null),
      ]);

      setFrontendBaseUrl(frontendBaseRes || '');

      const userData = userRes || selectedUser;
      setUser(userData);
      setKycDetail(kycRes);
      setInviteStats(statsRes);
      setAddressList(Array.isArray(addressRes) ? addressRes : []);
      setInviteRecords(inviteRes?.data || []);
      setInviteRecordTotal(inviteRes?.totalNum || 0);
      setInviteRecordPage(1);
      setAccountLogs(logsRes?.data || []);
      setAccountLogTotal(logsRes?.totalNum || 0);
      setAccountLogPage(1);

      if (userData?.parentId) {
        try {
          const parent = await api.get(`/manage/user/${userData.parentId}`);
          setParentUser(parent);
        } catch {
          setParentUser(null);
        }
      } else {
        setParentUser(null);
      }
    } catch (error) {
      console.error('Failed to load user detail:', error);
      message.error('加载用户详情失败');
      setUser(selectedUser || null);
    } finally {
      setLoading(false);
    }
  }, [userId, selectedUser]);

  useEffect(() => {
    if (!isVisible || !userId) {
      resetState();
      return;
    }
    loadUserDetail();
  }, [isVisible, userId, loadUserDetail, resetState]);

  const displayUser = user || selectedUser;
  const kycStatusConfig = KYC_STATUS_MAP[displayUser?.kycStatus] || { color: 'default', text: '未知' };

  const addressColumns = useMemo(() => [
    { title: t('contactName'), dataIndex: 'contactName', key: 'contactName', width: 120 },
    { title: t('phoneNum'), dataIndex: 'phoneNum', key: 'phoneNum', width: 120 },
    {
      title: t('contactAddress'),
      dataIndex: 'contactAddress',
      key: 'contactAddress',
      ellipsis: true,
      render: (text) => (
        <Space>
          <Text ellipsis>{text}</Text>
          <CopyOutlined onClick={() => handleCopy(text)} style={{ cursor: 'pointer' }} />
        </Space>
      ),
    },
    {
      title: t('currentUse'),
      dataIndex: 'currentUse',
      key: 'currentUse',
      width: 80,
      render: (currentUse) => (
        <Tag color={currentUse ? 'blue' : 'default'}>{currentUse ? t('yes') : t('no')}</Tag>
      ),
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text) => formatDate(text),
    },
  ], [t]);

  const inviteRecordColumns = useMemo(() => [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
    { title: '被邀请人UID', dataIndex: 'inviteeUid', key: 'inviteeUid', width: 110 },
    { title: t('inviteCode'), dataIndex: 'inviteCode', key: 'inviteCode', width: 120 },
    { title: '渠道', dataIndex: 'channel', key: 'channel', width: 90 },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const config = INVITE_RECORD_STATUS_MAP[status] || { color: 'default', text: '未知' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: '奖励',
      dataIndex: 'rewardPoints',
      key: 'rewardPoints',
      width: 80,
      render: (v, row) => (
        <Space direction="vertical" size={0}>
          <Text>{showValue(v)}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {row.rewardIssued === 1 ? '已发放' : '未发放'}
          </Text>
        </Space>
      ),
    },
    { title: '注册IP', dataIndex: 'clientIp', key: 'clientIp', width: 120, ellipsis: true },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text) => formatDate(text),
    },
  ], [t]);

  const accountLogColumns = useMemo(() => [
    { title: t('coinType'), dataIndex: 'coinType', key: 'coinType', width: 110 },
    {
      title: t('changeType'),
      dataIndex: 'changeType',
      key: 'changeType',
      width: 120,
      render: (changeType) => (
        <Tag color={CHANGE_TYPE_COLOR[changeType] || 'default'}>{changeType || '—'}</Tag>
      ),
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount) => (
        <Text style={{ color: amount > 0 ? '#52c41a' : amount < 0 ? '#ff4d4f' : undefined }}>
          {formatMoney(amount)}
        </Text>
      ),
    },
    {
      title: t('balanceBeforeChange'),
      dataIndex: 'balanceBeforeChange',
      key: 'balanceBeforeChange',
      width: 110,
      render: (v) => formatMoney(v),
    },
    {
      title: t('balanceAfterChange'),
      dataIndex: 'balanceAfterChange',
      key: 'balanceAfterChange',
      width: 110,
      render: (v) => formatMoney(v),
    },
    { title: t('orderId'), dataIndex: 'orderId', key: 'orderId', width: 90, render: (v) => showValue(v) },
    { title: t('remark'), dataIndex: 'remark', key: 'remark', ellipsis: true },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (text) => formatDate(text),
    },
  ], [t]);

  const renderOverviewTab = () => (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card size="small">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
            {displayUser?.avatar ? (
              <img
                src={displayUser.avatar}
                alt={displayUser.username}
                style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <DefaultAvatar name={displayUser?.username} size={88} />
            )}
          </Col>
          <Col xs={24} sm={18}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Space wrap>
                <Text strong style={{ fontSize: 18 }}>{showValue(displayUser?.username)}</Text>
                <Tag color={displayUser?.status ? 'success' : 'error'}>
                  {displayUser?.status ? t('active') : t('inactive')}
                </Tag>
                <Tag color={displayUser?.isActive ? 'blue' : 'default'}>
                  {displayUser?.isActive ? '已激活' : '未激活'}
                </Tag>
                {displayUser?.isBelongSystem ? <Tag color="purple">系统用户</Tag> : null}
              </Space>
              <Space wrap>
                <Text type="secondary">ID: {showValue(displayUser?.id)}</Text>
                <Text type="secondary">{t('nickname')}: {showValue(displayUser?.nickname)}</Text>
              </Space>
              <Space wrap>
                <Tag icon={<MailOutlined />} color="default">{showValue(displayUser?.email)}</Tag>
                <Tag icon={<PhoneOutlined />} color="default">{showValue(displayUser?.phoneNumber)}</Tag>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>

      <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label={t('fullName')}>{showValue(displayUser?.fullName)}</Descriptions.Item>
        <Descriptions.Item label="真实姓名">{showValue(displayUser?.realName)}</Descriptions.Item>
        <Descriptions.Item label="实名状态">
          <Tag color={kycStatusConfig.color}>{kycStatusConfig.text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="认证国家">{showValue(displayUser?.kycCountry)}</Descriptions.Item>
        <Descriptions.Item label="认证等级">{showValue(displayUser?.kycLevel)}</Descriptions.Item>
        <Descriptions.Item label={t('creditScore')}>{showValue(displayUser?.creditScore)}</Descriptions.Item>
        <Descriptions.Item label="会员等级">{showValue(displayUser?.memberLevel)}</Descriptions.Item>
        <Descriptions.Item label="等级">{showValue(displayUser?.level)}</Descriptions.Item>
        <Descriptions.Item label="上级用户" span={2}>
          {displayUser?.parentId ? (
            <Space>
              <Text>UID {displayUser.parentId}</Text>
              {parentUser ? (
                <Text type="secondary">
                  ({showValue(parentUser.username)} / {showValue(parentUser.nickname)})
                </Text>
              ) : null}
            </Space>
          ) : '—'}
        </Descriptions.Item>
        <Descriptions.Item label={t('countryCode')}>{showValue(displayUser?.countryCode)}</Descriptions.Item>
        <Descriptions.Item label={t('state')}>{showValue(displayUser?.state)}</Descriptions.Item>
        <Descriptions.Item label={t('city')}>{showValue(displayUser?.city)}</Descriptions.Item>
        <Descriptions.Item label={t('postalCode')}>{showValue(displayUser?.postalCode)}</Descriptions.Item>
        <Descriptions.Item label={t('defaultAddress')} span={2}>
          <Space>
            <Text>{maskAddress(displayUser?.address)}</Text>
            {displayUser?.address ? (
              <CopyOutlined onClick={() => handleCopy(displayUser.address)} style={{ cursor: 'pointer' }} />
            ) : null}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={t('registrationTime')}>{formatDate(displayUser?.createTime)}</Descriptions.Item>
        <Descriptions.Item label="更新时间">{formatDate(displayUser?.updateTime)}</Descriptions.Item>
        <Descriptions.Item label="用户介绍" span={2}>{showValue(displayUser?.description)}</Descriptions.Item>
      </Descriptions>
    </Space>
  );

  const renderAssetsTab = () => (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="Token余额" value={formatMoney(displayUser?.tokenBalance)} prefix={<WalletOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="CNY余额" value={formatMoney(displayUser?.balance)} prefix={<BankOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card size="small">
            <Statistic title="USD余额" value={formatMoney(displayUser?.usdBalance)} prefix={<DollarOutlined />} />
          </Card>
        </Col>
      </Row>

      <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }} title={
        <Space><WalletOutlined /> USDT 信息</Space>
      }>
        <Descriptions.Item label={t('usdtAmount')}>{formatMoney(displayUser?.usdtAmount)}</Descriptions.Item>
        <Descriptions.Item label={t('usdtFrozenAmount')}>{formatMoney(displayUser?.usdtFrozenAmount)}</Descriptions.Item>
        <Descriptions.Item label={t('usdtAddress')} span={2}>
          <Space>
            <Text ellipsis style={{ maxWidth: 420 }}>{showValue(displayUser?.usdtAddress)}</Text>
            {displayUser?.usdtAddress ? (
              <CopyOutlined onClick={() => handleCopy(displayUser.usdtAddress)} style={{ cursor: 'pointer' }} />
            ) : null}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </Space>
  );

  const inviteLink = useMemo(
    () => buildInviteLink(displayUser?.inviteCode, frontendBaseUrl),
    [displayUser?.inviteCode, frontendBaseUrl],
  );
  const resolvedClientBase = useMemo(
    () => resolveClientBaseUrl(frontendBaseUrl),
    [frontendBaseUrl],
  );

  const renderInviteTab = () => (
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card size="small" title={<Space><QrcodeOutlined />{t('inviteCode')}</Space>}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={14}>
              <Space direction="vertical" size={8}>
                <Text type="secondary">注册站点：{resolvedClientBase}</Text>
                <Space>
                  <Text code>{showValue(displayUser?.inviteCode)}</Text>
                  {displayUser?.inviteCode ? (
                    <CopyOutlined onClick={() => handleCopy(displayUser.inviteCode)} style={{ cursor: 'pointer' }} />
                  ) : null}
                </Space>
                {inviteLink ? (
                  <Space wrap>
                    <Link href={inviteLink} target="_blank" ellipsis style={{ maxWidth: 360 }}>
                      {inviteLink}
                    </Link>
                    <CopyOutlined onClick={() => handleCopy(inviteLink)} style={{ cursor: 'pointer' }} />
                  </Space>
                ) : null}
                <Text type="secondary">{t('scanQRCodeToRegister')}</Text>
              </Space>
            </Col>
            <Col xs={24} md={10} style={{ textAlign: 'center' }}>
              {displayUser?.inviteCode ? (
                <QRCodeSVG value={inviteLink} size={120} level="H" includeMargin />
              ) : (
                <Text type="secondary">暂无邀请码</Text>
              )}
            </Col>
          </Row>
        </Card>

        <Descriptions bordered size="small" column={{ xs: 1, sm: 2, md: 3 }} title="邀请统计">
          <Descriptions.Item label="总邀请人数">{showValue(inviteStats?.totalInvitedCount, 0)}</Descriptions.Item>
          <Descriptions.Item label="有效邀请">{showValue(inviteStats?.validInvitedCount, 0)}</Descriptions.Item>
          <Descriptions.Item label="邀请等级">{showValue(inviteStats?.currentLevel, 0)}</Descriptions.Item>
          <Descriptions.Item label="累计奖励积分">{showValue(inviteStats?.totalRewardPoints, 0)}</Descriptions.Item>
          <Descriptions.Item label="待领取积分">{showValue(inviteStats?.pendingRewardPoints, 0)}</Descriptions.Item>
        </Descriptions>

        <Table
          size="small"
          rowKey="id"
          columns={inviteRecordColumns}
          dataSource={inviteRecords}
          pagination={{
            current: inviteRecordPage,
            pageSize: 10,
            total: inviteRecordTotal,
            showSizeChanger: false,
            onChange: (page) => fetchInviteRecords(userId, page),
          }}
          scroll={{ x: 900 }}
        />
      </Space>
    );

  const renderKycTab = () => {
    const detail = kycDetail;
    const statusConfig = KYC_STATUS_MAP[detail?.kycStatus ?? displayUser?.kycStatus] || { color: 'default', text: '未知' };
    const isUnbind = detail?.requestType === 'UNBIND';

    if (!detail && !displayUser?.kycStatus) {
      return <Text type="secondary">暂无实名认证信息</Text>;
    }

    return (
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="实名状态">
            <Tag color={statusConfig.color}>{statusConfig.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="认证国家">
            {showValue(detail?.countryCode || detail?.kycCountry || displayUser?.kycCountry)}
          </Descriptions.Item>
          <Descriptions.Item label="真实姓名">{showValue(detail?.fullName || displayUser?.realName)}</Descriptions.Item>
          <Descriptions.Item label="证件类型">
            {ID_TYPE_MAP[detail?.idType] || showValue(detail?.idType)}
          </Descriptions.Item>
          <Descriptions.Item label="证件号码" span={2}>{showValue(detail?.idNumber)}</Descriptions.Item>
          <Descriptions.Item label="提交时间">{showValue(detail?.submittedAt)}</Descriptions.Item>
          <Descriptions.Item label="审核通过时间">{showValue(detail?.verifiedAt)}</Descriptions.Item>
          {detail?.rejectReason ? (
            <Descriptions.Item label="拒绝原因" span={2}>{detail.rejectReason}</Descriptions.Item>
          ) : null}
          {isUnbind && detail?.reason ? (
            <Descriptions.Item label="解绑原因" span={2}>{detail.reason}</Descriptions.Item>
          ) : null}
        </Descriptions>

        {!isUnbind && (detail?.idFrontPhoto || detail?.idBackPhoto) ? (
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="证件正面">
                {detail?.idFrontPhoto ? (
                  <Image src={detail.idFrontPhoto} width="100%" style={{ borderRadius: 8 }} />
                ) : '—'}
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="证件反面">
                {detail?.idBackPhoto ? (
                  <Image src={detail.idBackPhoto} width="100%" style={{ borderRadius: 8 }} />
                ) : '—'}
              </Card>
            </Col>
          </Row>
        ) : null}

        {(displayUser?.kycStatus === 0 || detail?.kycStatus === 0) && !detail?.idFrontPhoto ? (
          <Text type="secondary">该用户尚未提交实名认证资料。</Text>
        ) : null}
      </Space>
    );
  };

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span><UserOutlined /> 概览</span>
      ),
      children: renderOverviewTab(),
    },
    {
      key: 'assets',
      label: (
        <span><WalletOutlined /> 账户资产</span>
      ),
      children: renderAssetsTab(),
    },
    {
      key: 'invite',
      label: (
        <span><TeamOutlined /> 邀请</span>
      ),
      children: renderInviteTab(),
    },
    {
      key: 'kyc',
      label: (
        <span><SafetyCertificateOutlined /> 实名认证</span>
      ),
      children: renderKycTab(),
    },
    {
      key: 'addresses',
      label: (
        <span><HomeOutlined /> 收货地址</span>
      ),
      children: (
        <Table
          size="small"
          rowKey="id"
          columns={addressColumns}
          dataSource={addressList}
          pagination={false}
          locale={{ emptyText: '暂无收货地址' }}
          scroll={{ x: 800, y: 360 }}
        />
      ),
    },
    {
      key: 'logs',
      label: (
        <span><HistoryOutlined /> 流水</span>
      ),
      children: (
        <Table
          size="small"
          rowKey="id"
          columns={accountLogColumns}
          dataSource={accountLogs}
          pagination={{
            current: accountLogPage,
            pageSize: 10,
            total: accountLogTotal,
            showSizeChanger: false,
            onChange: (page) => fetchAccountLogs(userId, page),
          }}
          scroll={{ x: 1000, y: 360 }}
        />
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          {t('userDetail')}
          {displayUser?.id ? <Text type="secondary">#{displayUser.id}</Text> : null}
        </Space>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="refresh" onClick={loadUserDetail} loading={loading}>
          刷新
        </Button>,
        <Button key="close" onClick={onCancel}>
          {t('close')}
        </Button>,
      ]}
      width={960}
      maskClosable={false}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        {displayUser ? (
          <Watermark content={watermarkContent}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
          </Watermark>
        ) : (
          !loading && <Text type="secondary">未选择用户</Text>
        )}
      </Spin>
    </Modal>
  );
};

export default UserDetailModal;
