import React from 'react';
import { Modal, Typography, Space, Row, Col, Card, Watermark } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'src/components/common/Common';
import {
  UserOutlined,
  BankOutlined,
  NumberOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Text } = Typography;

// IconText 组件定义
const IconText = ({ icon, text }) => (
  <Space size={4}>
    {icon}
    <Text style={{ fontSize: '10px' }}>{text}</Text>
  </Space>
);

const UserAccountBankDetailModal = ({ isVisible, onCancel, selectedAccount }) => {
  const { t } = useTranslation();

  const currentUser = useSelector((state) => state.user?.currentUser || {});
  const watermarkContent = `ID: ${currentUser?.id || ''} ${currentUser?.username || ''}`;

  const styles = {
    text: {
      fontSize: '10px',
      color: 'rgba(0, 0, 0, 0.85)'
    },
    card: {
      marginBottom: '8px',
      borderRadius: '4px',
    },
    cardBody: {
      padding: '8px',
    },
    cardHead: {
      minHeight: '24px',
      padding: '0 8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    row: {
      marginBottom: '4px'
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '12px' }}>
          <BankOutlined style={{ fontSize: '12px', color: '#1890ff', marginRight: '4px' }} />
          {t('accountDetails')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={500}
      maskClosable={false}
    >
      {selectedAccount && (
        <Watermark content={watermarkContent}>
          <div style={{ padding: '8px' }}>
            {/* 基本信息卡片 */}
            <Card
              size="small"
              title={<Text style={styles.text}><UserOutlined /> {t('basicInfo')}</Text>}
              style={styles.card}
              bodyStyle={styles.cardBody}
              headStyle={styles.cardHead}
            >
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Row gutter={[8, 4]}>
                  <Col span={12}>
                    <IconText
                      icon={<UserOutlined style={{ fontSize: '10px' }} />}
                      text={`${t('accountHolderName')}: ${selectedAccount.accountHolderName}`}
                    />
                  </Col>
                  <Col span={12}>
                    <IconText
                      icon={<NumberOutlined style={{ fontSize: '10px' }} />}
                      text={`${t('accountNumber')}: ${selectedAccount.accountNumber}`}
                    />
                  </Col>
                </Row>
                <IconText
                  icon={<BankOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('bankName')}: ${selectedAccount.bankName}`}
                />
                <IconText
                  icon={<SafetyCertificateOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('swiftCode')}: ${selectedAccount.swiftCode}`}
                />
                <IconText
                  icon={<DollarOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('currencyCode')}: ${selectedAccount.currencyCode}`}
                />
              </Space>
            </Card>

            {/* 其他信息卡片 */}
            <Card
              size="small"
              title={<Text style={styles.text}><ClockCircleOutlined /> {t('otherInfo')}</Text>}
              style={{ ...styles.card, marginBottom: 0 }}
              bodyStyle={styles.cardBody}
              headStyle={styles.cardHead}
            >
              <Row gutter={[8, 4]}>
                <Col span={12}>
                  <IconText
                    icon={<ClockCircleOutlined style={{ fontSize: '10px' }} />}
                    text={`${t('createTime')}: ${formatDate(selectedAccount.createTime)}`}
                  />
                </Col>
                <Col span={12}>
                  <IconText
                    icon={<ClockCircleOutlined style={{ fontSize: '10px' }} />}
                    text={`${t('updateTime')}: ${formatDate(selectedAccount.updateTime)}`}
                  />
                </Col>
              </Row>
              <Row gutter={[8, 4]} style={{ marginTop: '4px' }}>
                <Col span={12}>
                  <IconText
                    icon={<NumberOutlined style={{ fontSize: '10px' }} />}
                    text={`${t('userId')}: ${selectedAccount.userId}`}
                  />
                </Col>
                <Col span={12}>
                  <IconText
                    icon={<GlobalOutlined style={{ fontSize: '10px' }} />}
                    text={`${t('isActive')}: ${selectedAccount.isActive ? t('yes') : t('no')}`}
                  />
                </Col>
              </Row>
            </Card>
          </div>
        </Watermark>
      )}
    </Modal>
  );
};

export default UserAccountBankDetailModal;
