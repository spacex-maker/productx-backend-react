import React from 'react';
import { Modal, Descriptions } from 'antd';
import { useTranslation } from 'react-i18next';

const CountryInfoModal = ({ visible, country, onCancel }) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={<div style={{ fontSize: '12px' }}>{country?.name} - {t('countryInfo')}</div>}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
      styles={{ padding: '12px', maxHeight: '80vh', overflow: 'auto' }}
    >
      {country && (
        <Descriptions
          size="small"
          column={2}
          bordered
          labelStyle={{ width: '150px', fontSize: '10px' }}
          contentStyle={{ fontSize: '10px' }}
        >
          <Descriptions.Item label={t('areaManager')}>{country.areaManager || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('name')}>{country.name || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('code')}>{country.code || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('continent')}>{country.continent || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('coordinates')}>{country.coordinates || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('officialLanguages')}>{country.officialLanguages || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('population')}>{country.population ? `${(country.population/10000).toFixed(2)}万` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('gdp')}>{country.gdp ? `$${(country.gdp/100000000).toFixed(2)}亿` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('area')}>{country.area ? `${country.area.toLocaleString()} km²` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('currency')}>{country.currency || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('timezone')}>{country.timezone || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('capital')}>{country.capital || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('dialCode')}>{country.dialCode || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('isoCode')}>{country.isoCode || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('independenceDay')}>{country.independenceDay || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('borderingCountries')}>{country.borderingCountries?.join(', ') || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('governmentType')}>{country.governmentType || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('populationDensity')}>{country.populationDensity || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('internationalOrganizations')}>{country.internationalOrganizationsMembership || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('climateType')}>{country.climateType || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('incomeLevel')}>{country.incomeLevel || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('hdi')}>{country.hdi || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('majorReligions')}>{country.majorReligions || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('historicalBackground')}>{country.historicalBackground || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('officialWebsite')}>{country.officialWebsite || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('averageTemperature')}>{country.averageAnnualTemperature || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('transportInfrastructure')}>{country.transportInfrastructure || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('legalSystem')}>{country.legalSystem || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('nationalSecurityIndex')}>{country.nationalSecurityIndex || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('capitalPopulation')}>{country.capitalPopulation ? `${(country.capitalPopulation/10000).toFixed(2)}万` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('majorExports')}>{country.majorExports || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('majorImports')}>{country.majorImports || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('povertyRate')}>{country.povertyRate ? `${country.povertyRate}%` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('unemploymentRate')}>{country.unemploymentRate ? `${country.unemploymentRate}%` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('politicalStability')}>{country.politicalStability || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('educationLevel')}>{country.educationLevel || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('healthcareLevel')}>{country.healthcareLevel || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('internetPenetration')}>{country.internetPenetrationRate ? `${country.internetPenetrationRate}%` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('foreignExchangeReserves')}>{country.foreignExchangeReserves ? `$${(country.foreignExchangeReserves/100000000).toFixed(2)}亿` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('energyConsumption')}>{country.energyConsumption || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('airQualityIndex')}>{country.airQualityIndex || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('majorSports')}>{country.majorSports || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('naturalResources')}>{country.naturalResources || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('socialSecurity')}>{country.socialSecurity || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('tourismIndustry')}>{country.tourismIndustry || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('greenEconomyIndex')}>{country.greenEconomyIndex || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('foreignPolicy')}>{country.foreignPolicy || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('militaryStrengthIndex')}>{country.militaryStrengthIndex || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('linguisticDiversity')}>{country.linguisticDiversity || '-'}</Descriptions.Item>
          <Descriptions.Item label={t('birthRate')}>{country.birthRate ? `${country.birthRate}‰` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('deathRate')}>{country.deathRate ? `${country.deathRate}‰` : '-'}</Descriptions.Item>
          <Descriptions.Item label={t('worldHeritageSites')}>{country.worldHeritageSites || '-'}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default CountryInfoModal;
