import React, { useState } from 'react';
import { Modal, Button, Typography, Space, Row, Col, Card, Watermark, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from 'src/components/common/Common';
import api from 'src/axiosInstance';
import { QRCodeSVG } from 'qrcode.react';
import {
  UserOutlined,
  EnvironmentOutlined,
  WalletOutlined,
  QrcodeOutlined,
  PhoneOutlined,
  IdcardOutlined,
  GlobalOutlined,
  HomeOutlined,
  NumberOutlined,
  BankOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  DollarOutlined,
  CreditCardOutlined,
  LockOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { message } from 'antd';
import { useSelector } from 'react-redux';

const { Text } = Typography;

const UserDetailModal = ({ isVisible, onCancel, selectedUser }) => {
  const { t } = useTranslation();
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = useSelector((state) => {
    console.log('完整的 Redux 状态：', state);
    return state.user?.currentUser || {};
  });
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
    },
    addressButton: {
      fontSize: '10px',
      padding: '0px 4px',
      height: '20px',
      lineHeight: '20px'
    }
  };

  const getInviteLink = (inviteCode) => {
    return `${window.location.origin}/register?inviteCode=${inviteCode}`;
  };

  const IconText = ({ icon, text }) => (
    <Space size={4}>
      {icon}
      <Text style={styles.text}>{text}</Text>
    </Space>
  );

  const maskAddress = (address) => {
    if (!address) return '';
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(t('copySuccess'));
    }).catch(() => {
      message.error(t('copyFailed'));
    });
  };

  // 获取用户地址列表
  const fetchUserAddresses = async () => {
    if (!selectedUser?.id) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/manage/user-address/list/${selectedUser.id}`);

        setAddressList(response);
    
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  // 打开地址列表弹窗
  const handleShowAddresses = async () => {
    await fetchUserAddresses();
    setAddressModalVisible(true);
  };

  // 地址列表表格列配置
  const columns = [
    {
      title: t('contactName'),
      dataIndex: 'contactName',
      key: 'contactName',
      width: 120,
    },
    {
      title: t('phoneNum'),
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      width: 100,
    },
    {
      title: t('contactAddress'),
      dataIndex: 'contactAddress',
      key: 'contactAddress',
      ellipsis: true,
      render: (text) => (
        <Space>
          <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text}
          </span>
          <CopyOutlined
            style={{ fontSize: '10px', cursor: 'pointer' }}
            onClick={() => handleCopy(text)}
          />
        </Space>
      ),
    },
    {
      title: t('currentUse'),
      dataIndex: 'currentUse',
      key: 'currentUse',
      width: 80,
      render: (currentUse) => (
        <Tag color={currentUse ? 'blue' : 'default'} style={{ fontSize: '10px', padding: '0 4px' }}>
          {currentUse ? t('yes') : t('no')}
        </Tag>
      ),
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (text) => <span style={{ fontSize: '10px' }}>{text}</span>
    },
  ];

  return (
    <>
      <Modal
        title={<Text style={{ fontSize: '12px', fontWeight: 'bold' }}>{t('userDetail')}</Text>}
        open={isVisible}
        onCancel={onCancel}
        footer={[
          <Button key="back" size="small" onClick={onCancel}>
            {t('close')}
          </Button>
        ]}
        width={600}
        bodyStyle={{ padding: '12px' }}
      >
        {selectedUser && (
          <Watermark content={watermarkContent}>
            <div style={{ minHeight: '100%' }}>
              {/* 用户基本信息卡片（包含邀请信息） */}
              <Card
                size="small"
                style={styles.card}
                bodyStyle={styles.cardBody}
                headStyle={styles.cardHead}
                title={
                  <Text style={styles.text}>
                    <UserOutlined /> {t('basicInfo')}
                  </Text>
                }
              >
                <Row gutter={[8, 4]}>
                  <Col span={4}>
                    <img
                      src={selectedUser.avatar}
                      alt={`${selectedUser.nickname}`}
                      style={{ width: '50px', height: '50px', borderRadius: '4px' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Space size={4}>
                        <Text strong style={styles.text}>{selectedUser.username}</Text>
                        <Text type={selectedUser.status ? 'success' : 'danger'} style={styles.text}>
                          {selectedUser.status ? t('statusActive') : t('statusInactive')}
                        </Text>
                      </Space>
                      <IconText
                        icon={<UserOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('nickname')}: ${selectedUser.nickname}`}
                      />
                      <IconText
                        icon={<IdcardOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('fullName')}: ${selectedUser.fullName}`}
                      />
                      <IconText
                        icon={<PhoneOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('phoneNumber')}: ${selectedUser.phoneNumber}`}
                      />
                      <IconText
                        icon={<QrcodeOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('inviteCode')}: ${selectedUser.inviteCode}`}
                      />
                    </Space>
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    {selectedUser.inviteCode && (
                      <div>
                        <QRCodeSVG
                          value={getInviteLink(selectedUser.inviteCode)}
                          size={70}
                          level="H"
                          includeMargin={true}
                        />
                        <Text style={{ ...styles.text, display: 'block', marginTop: '2px' }}>
                          {t('scanQRCodeToRegister')}
                        </Text>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card>

              <Row gutter={8}>
                {/* 地址信息卡片 */}
                <Col span={8}>
                  <Card
                    size="small"
                    title={
                      <div style={styles.cardHead}>
                        <Text style={styles.text}>
                          <EnvironmentOutlined /> {t('addressInfo')}
                        </Text>
                        <Button 
                          type="link" 
                          size="small" 
                          icon={<HomeOutlined />}
                          onClick={handleShowAddresses}
                          style={styles.addressButton}
                        >
                          {t('shippingAddressInfo')}
                        </Button>
                      </div>
                    }
                    style={styles.card}
                    bodyStyle={styles.cardBody}
                    headStyle={styles.cardHead}
                  >
                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                      <IconText
                        icon={<GlobalOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('country')}: ${selectedUser.country}`}
                      />
                      <IconText
                        icon={<EnvironmentOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('state')}: ${selectedUser.state}`}
                      />
                      <IconText
                        icon={<HomeOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('city')}: ${selectedUser.city}`}
                      />
                      <IconText
                        icon={<EnvironmentOutlined style={{ fontSize: '10px' }} />}
                        text={
                          <Space>
                            {`${t('defaultAddress')}: ${maskAddress(selectedUser.address)}`}
                            <CopyOutlined
                              style={{ fontSize: '10px', cursor: 'pointer' }}
                              onClick={() => handleCopy(selectedUser.address)}
                            />
                          </Space>
                        }
                      />
                      <IconText
                        icon={<NumberOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('postalCode')}: ${selectedUser.postalCode}`}
                      />
                    </Space>
                  </Card>
                </Col>

                {/* 财务信息卡片 */}
                <Col span={16}>
                  <Card
                    size="small"
                    title={<Text style={styles.text}><WalletOutlined /> {t('financialInfo')}</Text>}
                    style={styles.card}
                    bodyStyle={styles.cardBody}
                    headStyle={styles.cardHead}
                  >
                    <Space direction="vertical" size={2} style={{ width: '100%' }}>
                      <Row gutter={[8, 4]}>
                        <Col span={12}>
                          <IconText
                            icon={<BankOutlined style={{ fontSize: '10px' }} />}
                            text={`${t('balance')}: ${selectedUser.balance}`}
                          />
                        </Col>
                        <Col span={12}>
                          <IconText
                            icon={<DollarOutlined style={{ fontSize: '10px' }} />}
                            text={`${t('usdtAmount')}: ${selectedUser.usdtAmount}`}
                          />
                        </Col>
                      </Row>
                      <IconText
                        icon={<CreditCardOutlined style={{ fontSize: '10px' }} />}
                        text={
                          <Space>
                            {`${t('usdtAddress')}: ${maskAddress(selectedUser.usdtAddress)}`}
                            <CopyOutlined
                              style={{ fontSize: '10px', cursor: 'pointer' }}
                              onClick={() => handleCopy(selectedUser.usdtAddress)}
                            />
                          </Space>
                        }
                      />
                      <IconText
                        icon={<LockOutlined style={{ fontSize: '10px' }} />}
                        text={`${t('usdtFrozenAmount')}: ${selectedUser.usdtFrozenAmount}`}
                      />
                    </Space>
                  </Card>
                </Col>
              </Row>

              {/* 其他信息卡片 */}
              <Card
                size="small"
                title={<Text style={styles.text}><UserOutlined /> {t('otherInfo')}</Text>}
                style={{ ...styles.card, marginBottom: 0 }}
                bodyStyle={styles.cardBody}
                headStyle={styles.cardHead}
              >
                <Row gutter={[8, 4]}>
                  <Col span={12}>
                    <IconText
                      icon={<SafetyCertificateOutlined style={{ fontSize: '10px' }} />}
                      text={`${t('creditScore')}: ${selectedUser.creditScore}`}
                    />
                  </Col>
                  <Col span={12}>
                    <IconText
                      icon={<ClockCircleOutlined style={{ fontSize: '10px' }} />}
                      text={`${t('registrationTime')}: ${formatDate(selectedUser.createTime)}`}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          </Watermark>
        )}
      </Modal>

      {/* 地址列表弹窗 */}
      <Modal
        title={
          <span style={{ fontSize: '12px' }}>
            <HomeOutlined style={{ marginRight: '4px' }} />
            {t('userAddressList')}
          </span>
        }
        open={addressModalVisible}
        onCancel={() => setAddressModalVisible(false)}
        footer={[
          <Button key="close" size="small" onClick={() => setAddressModalVisible(false)}>
            {t('close')}
          </Button>
        ]}
        width={700}
        bodyStyle={{ padding: '8px' }}
      >
        <Table
          columns={columns}
          dataSource={addressList}
          rowKey="id"
          size="small"
          loading={loading}
          pagination={false}
          scroll={{ y: 400 }}
          style={{ fontSize: '10px' }}
        />
        <style jsx global>{`
          .ant-table-thead > tr > th {
            padding: 4px 8px;
            font-size: 10px;
          }
          .ant-table-tbody > tr > td {
            padding: 4px 8px;
            font-size: 10px;
          }
        `}</style>
      </Modal>
    </>
  );
};

export default UserDetailModal;
