import React from 'react';
import { Modal, Descriptions, Tag, Typography, Space, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserOutlined, ClockCircleOutlined, GlobalOutlined, DesktopOutlined } from '@ant-design/icons';

const { Title } = Typography;

const UserLoginLogDetail = ({ visible, onClose, data }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    return status ? 'success' : 'error';
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="login-detail-modal"
    >
      <div style={{ padding: '0 24px' }}>
        <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>
          {t('loginDetail')}
        </Title>

        {/* 用户信息部分 */}
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <UserOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 500 }}>{t('userInfo')}</span>
          </Space>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {data?.avatar ? (
              <img
                src={data.avatar}
                alt=""
                style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserOutlined style={{ fontSize: 24, color: '#999' }} />
              </div>
            )}
            <Descriptions column={1} labelStyle={{ whiteSpace: 'nowrap' }}>
              <Descriptions.Item label={t('username')}>{data?.username ?? '—'}</Descriptions.Item>
              <Descriptions.Item label={t('userId')}>{data?.userId ?? '—'}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 登录信息部分 */}
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <ClockCircleOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 500 }}>{t('loginTime')}</span>
          </Space>
          <Descriptions column={2} labelStyle={{ whiteSpace: 'nowrap' }}>
            <Descriptions.Item label={t('loginTime')}>{data?.loginTime}</Descriptions.Item>
            <Descriptions.Item label={t('loginStatus')}>
              <Tag color={getStatusColor(data?.status)}>
                {data?.status ? t('success') : t('failed')}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 位置与来源部分 */}
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <GlobalOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 500 }}>{t('location')} / 来源</span>
          </Space>
          <Descriptions column={2} labelStyle={{ whiteSpace: 'nowrap' }}>
            <Descriptions.Item label={t('loginIp')}>{data?.loginIp ?? '—'}</Descriptions.Item>
            <Descriptions.Item label={t('location')}>{data?.location || '—'}</Descriptions.Item>
            <Descriptions.Item label="国家代码">{data?.countryCode || '—'}</Descriptions.Item>
            <Descriptions.Item label="前端域名">{data?.frontendDomain || '—'}</Descriptions.Item>
          </Descriptions>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 登录方式与渠道 */}
        <div style={{ marginBottom: 24 }}>
          <Space align="center" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '16px', fontWeight: 500 }}>登录方式 / 渠道</span>
          </Space>
          <Descriptions column={2} labelStyle={{ whiteSpace: 'nowrap' }}>
            <Descriptions.Item label="登录方式">{data?.loginMethod || '—'}</Descriptions.Item>
            <Descriptions.Item label="登录渠道">{data?.loginChannel || '—'}</Descriptions.Item>
          </Descriptions>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        {/* 设备信息部分 */}
        <div>
          <Space align="center" style={{ marginBottom: 8 }}>
            <DesktopOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
            <span style={{ fontSize: '16px', fontWeight: 500 }}>{t('device')}</span>
          </Space>
          <Descriptions column={1} labelStyle={{ whiteSpace: 'nowrap' }}>
            <Descriptions.Item label="设备类型">{data?.deviceType || '—'}</Descriptions.Item>
            <Descriptions.Item label={t('device')}>{data?.device || '—'}</Descriptions.Item>
            <Descriptions.Item label={t('browser')}>{data?.browser || '—'}</Descriptions.Item>
            <Descriptions.Item label={t('os')}>{data?.os || '—'}</Descriptions.Item>
          </Descriptions>
        </div>

        {/* 失败原因（如果有） */}
        {data?.failReason && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <div>
              <Descriptions column={1}>
                <Descriptions.Item 
                  label={t('failReason')} 
                  labelStyle={{ color: '#ff4d4f', whiteSpace: 'nowrap' }}
                  contentStyle={{ color: '#ff4d4f' }}
                >
                  {data.failReason}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default UserLoginLogDetail; 