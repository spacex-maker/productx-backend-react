import React, { useMemo } from 'react';
import { Modal, Row, Col, Tag, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
  MobileOutlined,
  LaptopOutlined,
  ToolOutlined,
  TableOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  CarOutlined,
  QuestionOutlined,
  ShopOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  WalletOutlined,
  FileTextOutlined,
  StarOutlined,
  CommentOutlined,
  OrderedListOutlined,
  FieldTimeOutlined,
  SafetyCertificateOutlined,
  GlobalOutlined,
  LinkOutlined,
  IeOutlined,
  CrownOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserSwitchOutlined,
  EditOutlined,
  CheckCircleOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import moment from 'moment';

const RepairServiceMerchantsDetailModal = ({
  isVisible,
  onCancel,
  merchantData
}) => {
  const { t } = useTranslation();

  // 服务类型标签的颜色映射
  const serviceTypeColors = useMemo(() => ({
    'mobileRepair': 'blue',
    'computerRepair': 'cyan',
    'applianceRepair': 'purple',
    'furnitureRepair': 'magenta',
    'plumbing': 'green',
    'electricalRepair': 'orange',
    'carRepair': 'red',
    'other': 'default'
  }), []);

  // 服务类型图标映射
  const serviceTypeIcons = useMemo(() => ({
    'mobileRepair': <MobileOutlined />,
    'computerRepair': <LaptopOutlined />,
    'applianceRepair': <ToolOutlined />,
    'furnitureRepair': <TableOutlined />,
    'plumbing': <ExperimentOutlined />,
    'electricalRepair': <ThunderboltOutlined />,
    'carRepair': <CarOutlined />,
    'other': <QuestionOutlined />
  }), []);

  const renderDetailItem = (label, value, icon) => (
    <div className="detail-item">
      <span className="detail-label">
        {icon && <span className="detail-icon">{icon}</span>}
        {label}:
      </span>
      <span className="detail-value">{value || '-'}</span>
    </div>
  );

  const renderDateTime = (dateTime) => {
    return dateTime ? moment(dateTime).format('YYYY-MM-DD HH:mm:ss') : '-';
  };

  const renderStatus = (status) => {
    return status ? 
      <Tag color="success" style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
        {t('operating')}
      </Tag> : 
      <Tag color="error" style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
        {t('closed')}
      </Tag>;
  };

  const renderVipLevel = (isVip) => {
    return isVip ? 
      <Tag color="gold" icon={<CrownOutlined />} style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
        {t('vip')}
      </Tag> : 
      <Tag color="default" style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}>
        {t('regular')}
      </Tag>;
  };

  const renderServiceTypes = (types) => {
    if (!types || !types.length) return '-';
    return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {types.map(type => (
          <Tag 
            key={type}
            color={serviceTypeColors[type]}
            style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}
            icon={serviceTypeIcons[type]}
          >
            {t(type)}
          </Tag>
        ))}
      </div>
    );
  };

  const renderPaymentMethods = (methods) => {
    if (!methods || !methods.length) return '-';
    return (
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {methods.map(method => (
          <Tag 
            key={method}
            style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}
          >
            {method}
          </Tag>
        ))}
      </div>
    );
  };

  return (
    <Modal
      title={t('merchantDetail')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={680}
    >
      <Row gutter={[8, 0]}>
        <Col span={12}>
          <div className="detail-section">
            <div className="section-title">{t('basicInfo')}</div>
            {renderDetailItem(t('merchantName'), merchantData?.merchantName, <ShopOutlined />)}
            {renderDetailItem(t('status'), renderStatus(merchantData?.status), <CheckCircleOutlined />)}
            {renderDetailItem(t('vipLevel'), renderVipLevel(merchantData?.vipLevel), <CrownOutlined />)}
            {renderDetailItem(t('joinedPartnerProgram'), merchantData?.joinedPartnerProgram ? t('yes') : t('no'), <TeamOutlined />)}
          </div>

          <div className="detail-section">
            <div className="section-title">{t('contactInfo')}</div>
            {renderDetailItem(t('contactPerson'), merchantData?.contactPerson, <UserOutlined />)}
            {renderDetailItem(t('contactPhone'), merchantData?.contactPhone, <PhoneOutlined />)}
            {renderDetailItem(t('contactEmail'), merchantData?.contactEmail, <MailOutlined />)}
          </div>

          <div className="detail-section">
            <div className="section-title">{t('addressInfo')}</div>
            {renderDetailItem(t('province'), merchantData?.province, <EnvironmentOutlined />)}
            {renderDetailItem(t('city'), merchantData?.city, <EnvironmentOutlined />)}
            {renderDetailItem(t('address'), merchantData?.address, <EnvironmentOutlined />)}
            {renderDetailItem(t('postalCode'), merchantData?.postalCode, <EnvironmentOutlined />)}
          </div>
        </Col>

        <Col span={12}>
          <div className="detail-section">
            <div className="section-title">{t('businessInfo')}</div>
            {renderDetailItem(t('workingHours'), merchantData?.workingHours, <ClockCircleOutlined />)}
            {renderDetailItem(t('paymentMethods'), 
              renderPaymentMethods(merchantData?.paymentMethods), 
              <WalletOutlined />
            )}
            {renderDetailItem(t('serviceTypes'), 
              renderServiceTypes(merchantData?.serviceTypes), 
              <AppstoreOutlined />
            )}
          </div>

          <div className="detail-section">
            <div className="section-title">{t('performanceInfo')}</div>
            {renderDetailItem(t('rating'), merchantData?.rating?.toFixed(1), <StarOutlined />)}
            {renderDetailItem(t('totalReviews'), merchantData?.totalReviews, <CommentOutlined />)}
            {renderDetailItem(t('completedOrders'), merchantData?.completedOrders, <OrderedListOutlined />)}
            {renderDetailItem(t('pendingOrders'), merchantData?.pendingOrders, <OrderedListOutlined />)}
            {renderDetailItem(t('avgCompletionTime'), merchantData?.avgCompletionTime, <FieldTimeOutlined />)}
          </div>

          <div className="detail-section">
            <div className="section-title">{t('additionalInfo')}</div>
            {renderDetailItem(t('certifications'), merchantData?.certifications, <SafetyCertificateOutlined />)}
            {renderDetailItem(t('websiteUrl'), merchantData?.websiteUrl, <GlobalOutlined />)}
            {renderDetailItem(t('socialMediaLinks'), merchantData?.socialMediaLinks, <LinkOutlined />)}
            {renderDetailItem(t('registrationChannel'), merchantData?.registrationChannel, <IeOutlined />)}
          </div>
        </Col>
      </Row>

      <Divider style={{ margin: '8px 0' }} />

      <Row>
        <Col span={24}>
          <div className="detail-section">
            <div className="section-title">{t('systemInfo')}</div>
            {renderDetailItem(t('createTime'), renderDateTime(merchantData?.createTime), <CalendarOutlined />)}
            {renderDetailItem(t('updateTime'), renderDateTime(merchantData?.updateTime), <CalendarOutlined />)}
            {renderDetailItem(t('createBy'), merchantData?.createBy, <UserSwitchOutlined />)}
            {renderDetailItem(t('updateBy'), merchantData?.updateBy, <EditOutlined />)}
            {renderDetailItem(t('remark'), merchantData?.remark, <FileTextOutlined />)}
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .detail-section {
          margin-bottom: 12px;
        }
        .section-title {
          font-size: 11px;
          color: #262626;
          font-weight: 500;
          margin-bottom: 6px;
          padding-left: 6px;
          border-left: 2px solid #1890ff;
        }
        .detail-item {
          margin-bottom: 6px;
          font-size: 10px;
          display: flex;
          align-items: flex-start;
        }
        .detail-label {
          color: #666;
          width: 80px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .detail-icon {
          color: #1890ff;
        }
        .detail-value {
          flex: 1;
          color: #262626;
          word-break: break-all;
          padding-right: 4px;
        }
      `}</style>
    </Modal>
  );
};

export default RepairServiceMerchantsDetailModal; 