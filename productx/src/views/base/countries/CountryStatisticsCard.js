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
    icon: {
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
      <Row gutter={[8, 8]}>
        {cards.map((card, index) => (
          <Col span={24} key={index}>
            <Card
              size="small"
              title={card.title}
              bodyStyle={{ padding: '8px' }}
            >
              <Descriptions 
                size="small" 
                column={4}
                bordered
                contentStyle={{ 
                  fontSize: '12px',
                  padding: '4px 8px'
                }}
                labelStyle={{ 
                  fontSize: '12px',
                  padding: '4px 8px'
                }}
              >
                {card.items.map((item, idx) => (
                  <Descriptions.Item
                    key={idx}
                    label={
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}>
                        {React.cloneElement(item.icon, { style: cardStyles.icon })}
                        {item.label}
                      </span>
                    }
                  >
                    {item.render ? item.render(item.value) :
                      (item.value ? `${item.value}${item.suffix || ''}` : '-')}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CountryStatisticsCard;
