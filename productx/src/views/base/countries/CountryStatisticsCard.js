import React from 'react';
import { Card, Descriptions, Row, Col } from 'antd';
import {
  TeamOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  TagOutlined,
  CompassOutlined,
  DollarOutlined,
  BankOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  WifiOutlined,
  GoldOutlined,
  ThunderboltOutlined,
  TranslationOutlined,
  UserDeleteOutlined,
  HeartOutlined,
  UserOutlined,
  GlobalOutlined,
  CloudOutlined,
  CarOutlined,
  PieChartOutlined,
  InteractionOutlined,
  BuildOutlined,
  PhoneOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  TrophyOutlined,
  FlagOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const CountryStatisticsCard = ({ country }) => {
  const { t } = useTranslation();

  const cardStyles = {
    card: {
      marginBottom: '2px',
      borderRadius: '2px'
    },
    icon: {
      fontSize: '9px !important',
      marginRight: '2px',
      color: '#1890ff'
    }
  };

  // 将数据分组
  const cards = [
    {
      title: t('basicInfo'),
      items: [
        { label: t('countryCode'), value: country?.code, icon: <GlobalOutlined /> },
        { label: t('isoCode'), value: country?.isoCode, icon: <GlobalOutlined /> },
        { label: t('countryName'), value: country?.name, icon: <TagOutlined /> },
        { label: t('capital'), value: country?.capital, icon: <HomeOutlined /> },
        { label: t('continent'), value: country?.continent, icon: <CompassOutlined /> },
        { label: t('coordinates'), value: country?.coordinates, icon: <EnvironmentOutlined /> },
        { label: t('officialLanguages'), value: country?.officialLanguages, icon: <TranslationOutlined /> },
        { label: t('areaManager'), value: country?.areaManager, icon: <UserOutlined /> },
        { label: t('status'), value: country?.status ? t('enabled') : t('disabled'), icon: <SafetyOutlined /> },
        { label: t('dialCode'), value: country?.dialCode, icon: <PhoneOutlined /> }
      ]
    },
    {
      title: t('geographyAndClimate'),
      items: [
        { label: t('area'), value: country?.area, icon: <EnvironmentOutlined />, suffix: 'km²' },
        { label: t('timezone'), value: country?.timezone, icon: <ClockCircleOutlined /> },
        { label: t('climateType'), value: country?.climateType, icon: <CloudOutlined /> },
        { label: t('averageTemperature'), value: country?.averageAnnualTemperature, icon: <ThunderboltOutlined />, suffix: '°C' },
        { label: t('borderingCountries'), value: country?.borderingCountries?.join(', '), icon: <GlobalOutlined /> },
        { label: t('naturalResources'), value: country?.naturalResources, icon: <BuildOutlined /> }
      ]
    },
    {
      title: t('populationAndSociety'),
      items: [
        { label: t('population'), value: country?.population, icon: <TeamOutlined /> },
        { label: t('populationDensity'), value: country?.populationDensity, icon: <TeamOutlined />, suffix: '/km²' },
        { label: t('capitalPopulation'), value: country?.capitalPopulation, icon: <HomeOutlined /> },
        { label: t('birthRate'), value: country?.birthRate, icon: <UserOutlined />, suffix: '%' },
        { label: t('deathRate'), value: country?.deathRate, icon: <UserDeleteOutlined />, suffix: '%' },
        { label: t('majorReligions'), value: country?.majorReligions, icon: <BankOutlined /> },
        { label: t('linguisticDiversity'), value: country?.linguisticDiversity, icon: <TranslationOutlined /> },
        { label: t('educationLevel'), value: country?.educationLevel, icon: <BookOutlined /> },
        { label: t('healthcareLevel'), value: country?.healthcareLevel, icon: <MedicineBoxOutlined /> },
        { label: t('socialSecurity'), value: country?.socialSecurity, icon: <SafetyOutlined /> }
      ]
    },
    {
      title: t('economicIndicators'),
      items: [
        { label: t('gdp'), value: country?.gdp, icon: <DollarOutlined />, suffix: t('usd') },
        { label: t('incomeLevel'), value: country?.incomeLevel, icon: <PieChartOutlined /> },
        { label: t('unemploymentRate'), value: country?.unemploymentRate, icon: <UserDeleteOutlined />, suffix: '%' },
        { label: t('povertyRate'), value: country?.povertyRate, icon: <HeartOutlined />, suffix: '%' },
        { label: t('foreignExchangeReserves'), value: country?.foreignExchangeReserves, icon: <GoldOutlined /> },
        { label: t('currency'), value: country?.currency, icon: <DollarOutlined /> }
      ]
    },
    {
      title: t('tradeAndDevelopment'),
      items: [
        { label: t('majorExports'), value: country?.majorExports, icon: <InteractionOutlined /> },
        { label: t('majorImports'), value: country?.majorImports, icon: <InteractionOutlined /> },
        { label: t('greenEconomyIndex'), value: country?.greenEconomyIndex, icon: <BuildOutlined /> }
      ]
    },
    {
      title: t('otherInfo'),
      items: [
        { label: t('internationalOrganizations'), value: country?.internationalOrganizationsMembership, icon: <GlobalOutlined /> },
        { label: t('foreignPolicy'), value: country?.foreignPolicy, icon: <LinkOutlined /> },
        { label: t('militaryAlliances'), value: country?.militaryAlliances, icon: <SafetyCertificateOutlined /> },
        { label: t('specialNotes'), value: country?.specialNotes, icon: <FlagOutlined /> }
      ]
    }
  ];

  return (
    <div className="country-statistics">
      <Row gutter={[4, 4]}>
        {cards.slice(0, 5).map((card, index) => (
          <Col span={12} key={index}>
            <Card
              size="small"
              title={card.title}
              style={cardStyles.card}
              styles={{ padding: '2px !important' }}
              headStyle={{
                fontSize: '10px !important',
                padding: '2px 4px !important',
                minHeight: '16px !important',
                background: '#fafafa'
              }}
            >
              <Descriptions size="small" column={2} bordered>
                {card.items.map((item, idx) => (
                  <Descriptions.Item
                    key={idx}
                    label={
                      <span style={{
                        whiteSpace: 'nowrap',
                        fontSize: '10px !important',
                        display: 'flex',
                        alignItems: 'center',
                        height: '16px'
                      }}>
                        {React.cloneElement(item.icon, { style: cardStyles.icon })}
                        {item.label}
                      </span>
                    }
                    contentStyle={{
                      padding: '2px 4px !important',
                      fontSize: '10px !important',
                      whiteSpace: 'pre-wrap !important',
                      wordBreak: 'break-word !important'
                    }}
                    labelStyle={{
                      padding: '2px 4px !important',
                      fontSize: '10px !important'
                    }}
                  >
                    <span style={{ 
                      fontSize: '10px !important',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {item.render ? item.render(item.value) :
                        (item.value ? `${item.value}${item.suffix || ''}` : '-')}
                    </span>
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>
          </Col>
        ))}

        <Col span={24}>
          <Card
            size="small"
            title={cards[5].title}
            style={cardStyles.card}
            styles={{ padding: '2px !important' }}
            headStyle={{
              fontSize: '10px !important',
              padding: '2px 4px !important',
              minHeight: '16px !important',
              background: '#fafafa'
            }}
          >
            <Descriptions size="small" column={4} bordered>
              {cards[5].items.map((item, idx) => (
                <Descriptions.Item
                  key={idx}
                  label={
                    <span style={{
                      whiteSpace: 'nowrap',
                      fontSize: '10px !important',
                      display: 'flex',
                      alignItems: 'center',
                      height: '16px'
                    }}>
                      {React.cloneElement(item.icon, { style: cardStyles.icon })}
                      {item.label}
                    </span>
                  }
                  contentStyle={{
                    padding: '2px 4px !important',
                    fontSize: '10px !important',
                    whiteSpace: 'pre-wrap !important',
                    wordBreak: 'break-word !important'
                  }}
                  labelStyle={{
                    padding: '2px 4px !important',
                    fontSize: '10px !important'
                  }}
                >
                  <span style={{ 
                    fontSize: '10px !important',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {item.render ? item.render(item.value) :
                      (item.value ? `${item.value}${item.suffix || ''}` : '-')}
                  </span>
                </Descriptions.Item>
              ))}
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <style jsx global>{`
        .country-statistics {
          padding: 4px;
        }

        .country-statistics .ant-card {
          margin-bottom: 2px !important;
        }

        .country-statistics .ant-card-head {
          min-height: 16px !important;
          padding: 0 !important;
        }

        .country-statistics .ant-card-head-title {
          font-size: 10px !important;
          padding: 2px 4px !important;
        }

        .country-statistics .ant-descriptions-item {
          padding: 0 !important;
        }

        .country-statistics .ant-descriptions-row > th,
        .country-statistics .ant-descriptions-row > td {
          padding: 2px 4px !important;
        }

        .country-statistics .ant-descriptions-item-label {
          background-color: #fafafa !important;
          color: #666666 !important;
          height: 16px !important;
          line-height: 16px !important;
          font-size: 10px !important;
          white-space: nowrap !important;
        }

        .country-statistics .ant-descriptions-item-content {
          color: #000000 !important;
          min-height: 16px !important;
          line-height: 1.2 !important;
          font-size: 10px !important;
          white-space: pre-wrap !important;
          word-break: break-word !important;
          padding: 2px 4px !important;
        }

        .country-statistics .ant-descriptions-bordered {
          border: 1px solid #f0f0f0 !important;
        }

        .country-statistics .ant-descriptions-view {
          border: none !important;
        }

        .country-statistics .ant-descriptions-bordered .ant-descriptions-item {
          border-right: 1px solid #f0f0f0 !important;
          border-bottom: 1px solid #f0f0f0 !important;
        }

        .country-statistics .ant-descriptions-bordered .ant-descriptions-row {
          border-bottom: 1px solid #f0f0f0 !important;
        }

        .country-statistics .ant-card-body {
          padding: 2px !important;
          overflow: visible !important;
        }
      `}</style>
    </div>
  );
};

export default CountryStatisticsCard;
