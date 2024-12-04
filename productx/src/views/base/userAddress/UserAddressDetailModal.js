import React from 'react';
import { Modal, Typography, Space, Row, Col, Card, Watermark } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'src/components/common/Common';
import {
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  HomeOutlined,
  GlobalOutlined,
  AimOutlined,
  ClockCircleOutlined,
  NumberOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Text } = Typography;

const UserAddressDetailModal = ({ isVisible, onCancel, selectedAddress }) => {
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
    },
    row: {
      marginBottom: '4px'
    }
  };

  const IconText = ({ icon, text }) => (
    <Space size={4}>
      {icon}
      <Text style={styles.text}>{text}</Text>
    </Space>
  );

  return (
    <Modal
      title={
        <span style={{ fontSize: '12px' }}>
          <HomeOutlined style={{ fontSize: '12px', color: '#1890ff', marginRight: '4px' }} />
          {t('addressDetails')}
        </span>
      }
      open={isVisible}
      onCancel={onCancel}
      footer={null}
      width={500}
      maskClosable={false}
    >
      {selectedAddress && (
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
                      text={`${t('contactName')}: ${selectedAddress.contactName}`}
                    />
                  </Col>
                  <Col span={12}>
                    <IconText
                      icon={<PhoneOutlined style={{ fontSize: '10px' }} />}
                      text={`${t('phoneNum')}: ${selectedAddress.phoneNum}`}
                    />
                  </Col>
                </Row>
                <IconText
                  icon={<NumberOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('userId')}: ${selectedAddress.userId}`}
                />
              </Space>
            </Card>

            {/* 地址信息卡片 */}
            <Card
              size="small"
              title={<Text style={styles.text}><EnvironmentOutlined /> {t('addressInfo')}</Text>}
              style={styles.card}
              bodyStyle={styles.cardBody}
              headStyle={styles.cardHead}
            >
              <Space direction="vertical" size={2} style={{ width: '100%' }}>
                <Row gutter={[8, 4]}>
                  <Col span={12}>
                    <IconText
                      icon={<GlobalOutlined style={{ fontSize: '10px' }} />}
                      text={`${t('province')}: ${selectedAddress.province || '-'}`}
                    />
                  </Col>
                  <Col span={12}>
                    <IconText
                      icon={<AimOutlined style={{ fontSize: '10px' }} />}
                      text={`${t('city')}: ${selectedAddress.city || '-'}`}
                    />
                  </Col>
                </Row>
                <IconText
                  icon={<HomeOutlined style={{ fontSize: '10px' }} />}
                  text={`${t('contactAddress')}: ${selectedAddress.contactAddress}`}
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
                    text={`${t('createTime')}: ${formatDate(selectedAddress.createTime)}`}
                  />
                </Col>
                <Col span={12}>
                  <IconText
                    icon={<ClockCircleOutlined style={{ fontSize: '10px' }} />}
                    text={`${t('updateTime')}: ${formatDate(selectedAddress.updateTime)}`}
                  />
                </Col>
              </Row>
              <Row gutter={[8, 4]} style={{ marginTop: '4px' }}>
                <Col span={12}>
                  <IconText
                    icon={<NumberOutlined style={{ fontSize: '10px' }} />}
                    text={`${t('useCount')}: ${selectedAddress.useCount}`}
                  />
                </Col>
                <Col span={12}>
                  <IconText
                    icon={<HomeOutlined style={{ fontSize: '10px' }} />}
                    text={`${t('isDefault')}: ${selectedAddress.currentUse ? t('yes') : t('no')}`}
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

export default UserAddressDetailModal;
