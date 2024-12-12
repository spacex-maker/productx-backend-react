import React from 'react';
import { Modal, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';

const RepairServiceMerchantsDetailModal = ({
  isVisible,
  onCancel,
  merchantData
}) => {
  const { t } = useTranslation();

  const renderDetailItem = (label, value) => (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || '-'}</span>
    </div>
  );

  return (
    <Modal
      title={t('merchantDetail')}
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={480}
    >
      <div className="detail-container">
        <div className="detail-header">
          <div className="merchant-info">
            <h3 className="merchant-name">{merchantData?.merchantName}</h3>
            <div className="merchant-status">
              <span className={`status-dot ${merchantData?.status ? 'active' : 'inactive'}`} />
              {merchantData?.status ? t('operating') : t('closed')}
            </div>
          </div>
          {merchantData?.merchantLogo && (
            <div className="logo-wrapper">
              <img src={merchantData.merchantLogo} alt="logo" />
            </div>
          )}
        </div>

        <div className="detail-section">
          <div className="section-title">{t('basicInfo')}</div>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              {renderDetailItem(t('contactPerson'), merchantData?.contactPerson)}
            </Col>
            <Col span={12}>
              {renderDetailItem(t('contactPhone'), merchantData?.contactPhone)}
            </Col>
            <Col span={24}>
              {renderDetailItem(t('contactEmail'), merchantData?.contactEmail)}
            </Col>
          </Row>
        </div>

        <div className="detail-section">
          <div className="section-title">{t('addressInfo')}</div>
          <Row gutter={[16, 8]}>
            <Col span={8}>
              {renderDetailItem(t('province'), merchantData?.province)}
            </Col>
            <Col span={8}>
              {renderDetailItem(t('city'), merchantData?.city)}
            </Col>
            <Col span={24}>
              {renderDetailItem(t('address'), merchantData?.address)}
            </Col>
          </Row>
        </div>

        <div className="detail-section">
          <div className="section-title">{t('businessInfo')}</div>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              {renderDetailItem(t('workingHours'), merchantData?.workingHours)}
            </Col>
            <Col span={24}>
              {renderDetailItem(t('serviceTypes'), merchantData?.serviceTypes?.join(', '))}
            </Col>
            <Col span={24}>
              {renderDetailItem(t('paymentMethods'), merchantData?.paymentMethods?.join(', '))}
            </Col>
          </Row>
        </div>

        {merchantData?.remark && (
          <div className="detail-section">
            <div className="section-title">{t('remarks')}</div>
            <div className="remark-content">{merchantData.remark}</div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .detail-container {
          padding: 0 16px;
        }
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .merchant-info {
          flex: 1;
        }
        .merchant-name {
          font-size: 14px;
          font-weight: 500;
          color: #262626;
          margin: 0 0 8px;
        }
        .merchant-status {
          font-size: 10px;
          color: #8c8c8c;
          display: flex;
          align-items: center;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-right: 6px;
        }
        .status-dot.active {
          background-color: #52c41a;
        }
        .status-dot.inactive {
          background-color: #ff4d4f;
        }
        .logo-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #f0f0f0;
          margin-left: 16px;
        }
        .logo-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-section {
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 11px;
          color: #262626;
          font-weight: 500;
          margin-bottom: 8px;
          padding-left: 8px;
          border-left: 2px solid #1890ff;
        }
        .detail-item {
          display: flex;
          align-items: flex-start;
        }
        .detail-label {
          min-width: 70px;
          font-size: 10px;
          color: #8c8c8c;
          margin-right: 8px;
        }
        .detail-value {
          flex: 1;
          font-size: 10px;
          color: #262626;
          word-break: break-all;
        }
        .remark-content {
          font-size: 10px;
          color: #595959;
          background: #fafafa;
          padding: 8px;
          border-radius: 2px;
        }
        .ant-modal-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        .ant-modal-body {
          padding: 16px 0;
        }
        .ant-modal-title {
          font-size: 12px;
          color: #262626;
        }
      `}</style>
    </Modal>
  );
};

export default RepairServiceMerchantsDetailModal; 