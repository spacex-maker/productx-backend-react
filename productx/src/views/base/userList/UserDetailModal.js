import React, { useState } from 'react';
import { Modal, Button, Typography, Space, Row, Col, Card, Watermark, Table, Tag, Descriptions } from 'antd';
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

  const currentUser = useSelector((state) => state.user?.currentUser || {});
  const watermarkContent = `ID: ${currentUser?.id || ''} ${currentUser?.username || ''}`;

  const getInviteLink = (inviteCode) => {
    return `${window.location.origin}/register?inviteCode=${inviteCode}`;
  };

  const IconText = ({ icon, text }) => (
    <Space size={4}>
      {icon}
      <Typography.Text type="secondary">{text}</Typography.Text>
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

  const handleShowAddresses = async () => {
    await fetchUserAddresses();
    setAddressModalVisible(true);
  };

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
      width: 120,
    },
    {
      title: t('contactAddress'),
      dataIndex: 'contactAddress',
      key: 'contactAddress',
      ellipsis: true,
      render: (text) => (
        <Space>
          <Typography.Text ellipsis>{text}</Typography.Text>
          <CopyOutlined onClick={() => handleCopy(text)} />
        </Space>
      ),
    },
    {
      title: t('currentUse'),
      dataIndex: 'currentUse',
      key: 'currentUse',
      width: 80,
      render: (currentUse) => (
        <Tag color={currentUse ? 'blue' : 'default'}>
          {currentUse ? t('yes') : t('no')}
        </Tag>
      ),
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (text) => formatDate(text)
    },
  ];

  return (
    <>
      <Modal
        title={
          <Space>
            <UserOutlined />
            {t('userDetail')}
          </Space>
        }
        open={isVisible}
        onCancel={onCancel}
        footer={[
          <Button key="back" size="small" onClick={onCancel}>
            {t('close')}
          </Button>
        ]}
        width={700}
        maskClosable={false}
      >
        {selectedUser && (
          <Watermark content={watermarkContent}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {/* 用户基本信息卡片 */}
              <Card size="small" title={
                <Space>
                  <UserOutlined />
                  {t('basicInfo')}
                </Space>
              }>
                <Row gutter={[16, 8]}>
                  <Col span={4}>
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.nickname}
                      style={{ width: '100%', borderRadius: 4 }}
                    />
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" size={4}>
                      <Space>
                        <Typography.Text strong>{selectedUser.username}</Typography.Text>
                        <Tag color={selectedUser.status ? 'success' : 'error'}>
                          {selectedUser.status ? t('active') : t('inactive')}
                        </Tag>
                      </Space>
                      <IconText icon={<UserOutlined />} text={`${t('nickname')}: ${selectedUser.nickname}`} />
                      <IconText icon={<IdcardOutlined />} text={`${t('fullName')}: ${selectedUser.fullName}`} />
                      <IconText icon={<PhoneOutlined />} text={`${t('phoneNumber')}: ${selectedUser.phoneNumber}`} />
                      <IconText icon={<QrcodeOutlined />} text={`${t('inviteCode')}: ${selectedUser.inviteCode}`} />
                    </Space>
                  </Col>
                  <Col span={8}>
                    {selectedUser.inviteCode && (
                      <Space direction="vertical" align="center" style={{ width: '100%' }}>
                        <QRCodeSVG
                          value={getInviteLink(selectedUser.inviteCode)}
                          size={80}
                          level="H"
                          includeMargin={true}
                        />
                        <Typography.Text type="secondary">
                          {t('scanQRCodeToRegister')}
                        </Typography.Text>
                      </Space>
                    )}
                  </Col>
                </Row>
              </Card>

              <Row gutter={16}>
                {/* 地址信息卡片 */}
                <Col span={12}>
                  <Card
                    size="small"
                    title={
                      <Space>
                        <EnvironmentOutlined />
                        {t('addressInfo')}
                      </Space>
                    }
                    extra={
                      <Button type="link" size="small" onClick={handleShowAddresses}>
                        {t('shippingAddressInfo')}
                      </Button>
                    }
                  >
                    <Space direction="vertical" size={4}>
                      <IconText icon={<GlobalOutlined />} text={`${t('country')}: ${selectedUser.country}`} />
                      <IconText icon={<EnvironmentOutlined />} text={`${t('state')}: ${selectedUser.state}`} />
                      <IconText icon={<HomeOutlined />} text={`${t('city')}: ${selectedUser.city}`} />
                      <Space>
                        <IconText icon={<EnvironmentOutlined />} text={`${t('defaultAddress')}: ${maskAddress(selectedUser.address)}`} />
                        <CopyOutlined onClick={() => handleCopy(selectedUser.address)} />
                      </Space>
                      <IconText icon={<NumberOutlined />} text={`${t('postalCode')}: ${selectedUser.postalCode}`} />
                    </Space>
                  </Card>
                </Col>

                {/* 财务信息卡片 */}
                <Col span={12}>
                  <Card
                    size="small"
                    title={
                      <Space>
                        <WalletOutlined />
                        {t('financialInfo')}
                      </Space>
                    }
                  >
                    <Descriptions size="small" column={1}>
                      <Descriptions.Item label={t('balance')}>
                        <Space>
                          <BankOutlined />
                          {selectedUser.balance}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('usdtAmount')}>
                        <Space>
                          <DollarOutlined />
                          {selectedUser.usdtAmount}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('usdtAddress')}>
                        <Space>
                          <CreditCardOutlined />
                          <Typography.Text ellipsis>{maskAddress(selectedUser.usdtAddress)}</Typography.Text>
                          <CopyOutlined onClick={() => handleCopy(selectedUser.usdtAddress)} />
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('usdtFrozenAmount')}>
                        <Space>
                          <LockOutlined />
                          {selectedUser.usdtFrozenAmount}
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>

              {/* 其他信息卡片 */}
              <Card
                size="small"
                title={
                  <Space>
                    <UserOutlined />
                    {t('otherInfo')}
                  </Space>
                }
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <IconText icon={<SafetyCertificateOutlined />} text={`${t('creditScore')}: ${selectedUser.creditScore}`} />
                  </Col>
                  <Col span={12}>
                    <IconText icon={<ClockCircleOutlined />} text={`${t('registrationTime')}: ${formatDate(selectedUser.createTime)}`} />
                  </Col>
                </Row>
              </Card>
            </Space>
          </Watermark>
        )}
      </Modal>

      {/* 地址列表弹窗 */}
      <Modal
        title={
          <Space>
            <HomeOutlined />
            {t('userAddressList')}
          </Space>
        }
        open={addressModalVisible}
        onCancel={() => setAddressModalVisible(false)}
        footer={[
          <Button key="close" size="small" onClick={() => setAddressModalVisible(false)}>
            {t('close')}
          </Button>
        ]}
        width={800}
        maskClosable={false}
      >
        <Table
          columns={columns}
          dataSource={addressList}
          rowKey="id"
          size="small"
          loading={loading}
          pagination={false}
          scroll={{ y: 400 }}
        />
      </Modal>
    </>
  );
};

export default UserDetailModal;
