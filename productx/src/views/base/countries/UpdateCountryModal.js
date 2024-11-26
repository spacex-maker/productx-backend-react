import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { TextArea } = Input;

const UpdateCountryModal = ({
  isVisible,
  onCancel,
  onOk,
  form,
  selectedCountry
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible && selectedCountry) {
      // 设置所有字段的值
      form.setFieldsValue({
        ...selectedCountry,
        independenceDay: selectedCountry.independenceDay ? dayjs(selectedCountry.independenceDay) : null,
      });
    }
  }, [isVisible, selectedCountry, form]);

  const handleUpdateCountry = async (values) => {
    try {
      const response = await fetch('/manage/countries/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          // 转换日期格式
          independenceDay: values.independenceDay ? values.independenceDay.format('YYYY-MM-DD') : null,
          // 确保数值类型正确
          population: values.population ? Number(values.population) : null,
          gdp: values.gdp ? Number(values.gdp) : null,
          area: values.area ? Number(values.area) : null,
          populationDensity: values.populationDensity ? Number(values.populationDensity) : null,
          hdi: values.hdi ? Number(values.hdi) : null,
          averageAnnualTemperature: values.averageAnnualTemperature ? Number(values.averageAnnualTemperature) : null,
          nationalSecurityIndex: values.nationalSecurityIndex ? Number(values.nationalSecurityIndex) : null,
          capitalPopulation: values.capitalPopulation ? Number(values.capitalPopulation) : null,
          povertyRate: values.povertyRate ? Number(values.povertyRate) : null,
          unemploymentRate: values.unemploymentRate ? Number(values.unemploymentRate) : null,
          politicalStability: values.politicalStability ? Number(values.politicalStability) : null,
          educationLevel: values.educationLevel ? Number(values.educationLevel) : null,
          healthcareLevel: values.healthcareLevel ? Number(values.healthcareLevel) : null,
          internetPenetrationRate: values.internetPenetrationRate ? Number(values.internetPenetrationRate) : null,
          foreignExchangeReserves: values.foreignExchangeReserves ? Number(values.foreignExchangeReserves) : null,
          energyConsumption: values.energyConsumption ? Number(values.energyConsumption) : null,
          airQualityIndex: values.airQualityIndex ? Number(values.airQualityIndex) : null,
          greenEconomyIndex: values.greenEconomyIndex ? Number(values.greenEconomyIndex) : null,
          militaryStrengthIndex: values.militaryStrengthIndex ? Number(values.militaryStrengthIndex) : null,
          linguisticDiversity: values.linguisticDiversity ? Number(values.linguisticDiversity) : null,
          birthRate: values.birthRate ? Number(values.birthRate) : null,
          deathRate: values.deathRate ? Number(values.deathRate) : null,
          worldHeritageSites: values.worldHeritageSites ? Number(values.worldHeritageSites) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('更新失败');
      }

      message.success('更新成功');
      onCancel();
    } catch (error) {
      message.error('更新失败：' + error.message);
    }
  };

  return (
    <Modal
      title={t('updateCountry')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={900}
      style={{ top: 20 }}
    >
      <Form
        form={form}
        onFinish={handleUpdateCountry}
        layout="vertical"
        style={{
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          padding: '0 8px'
        }}
        size="small"
      >
        <Form.Item name="id" hidden><Input /></Form.Item>

        <h3 style={{
          fontSize: '13px',
          margin: '8px 0',
          color: '#1f1f1f',
          fontWeight: 500
        }}>{t('basicInfo')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item
            label={t('countryName')}
            name="name"
            rules={[{ required: true }]}
            style={{ marginBottom: '4px' }}
          >
            <Input />
          </Form.Item>
          <Form.Item label={t('countryCode')} name="code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label={t('continent')} name="continent" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="亚洲">{t('asia')}</Select.Option>
              <Select.Option value="欧洲">{t('europe')}</Select.Option>
              <Select.Option value="非洲">{t('africa')}</Select.Option>
              <Select.Option value="北美洲">{t('northAmerica')}</Select.Option>
              <Select.Option value="南美洲">{t('southAmerica')}</Select.Option>
              <Select.Option value="大洋洲">{t('oceania')}</Select.Option>
              <Select.Option value="南极洲">{t('antarctica')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={t('capital')} name="capital">
            <Input />
          </Form.Item>
          <Form.Item label={t('coordinates')} name="coordinates">
            <Input placeholder="格式: 纬度,经度" />
          </Form.Item>
          <Form.Item label={t('timezone')} name="timezone">
            <Input />
          </Form.Item>
          <Form.Item
            label={t('status')}
            name="status"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={true}>{t('enabled')}</Select.Option>
              <Select.Option value={false}>{t('disabled')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t('borderingCountries')}
            name="borderingCountries"
          >
            <Select mode="tags" style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <h3 style={{ fontSize: '14px', margin: '8px 0' }}>{t('populationAndArea')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item label={t('population')} name="population">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('area')} name="area">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('populationDensity')} name="populationDensity">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('capitalPopulation')} name="capitalPopulation">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('birthRate')} name="birthRate">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('deathRate')} name="deathRate">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <h3 style={{ fontSize: '14px', margin: '8px 0' }}>{t('economicIndicators')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item label={t('gdp')} name="gdp">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('currency')} name="currency">
            <Input />
          </Form.Item>
          <Form.Item label={t('foreignExchangeReserves')} name="foreignExchangeReserves">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('unemploymentRate')} name="unemploymentRate">
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('povertyRate')} name="povertyRate">
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('incomeLevel')} name="incomeLevel">
            <Select>
              <Select.Option value="高收入">{t('highIncome')}</Select.Option>
              <Select.Option value="中高收入">{t('upperMiddleIncome')}</Select.Option>
              <Select.Option value="中低收入">{t('lowerMiddleIncome')}</Select.Option>
              <Select.Option value="低收入">{t('lowIncome')}</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <h3 style={{ fontSize: '14px', margin: '8px 0' }}>{t('socialDevelopment')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item label={t('hdi')} name="hdi">
            <InputNumber min={0} max={1} step={0.001} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('educationLevel')} name="educationLevel">
            <InputNumber min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('healthcareLevel')} name="healthcareLevel">
            <InputNumber min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('internetPenetrationRate')} name="internetPenetrationRate">
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('energyConsumption')} name="energyConsumption">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('airQualityIndex')} name="airQualityIndex">
            <InputNumber min={0} max={500} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <h3 style={{ fontSize: '14px', margin: '8px 0' }}>{t('politicsAndSecurity')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item label={t('governmentType')} name="governmentType">
            <Input />
          </Form.Item>
          <Form.Item label={t('politicalStability')} name="politicalStability">
            <InputNumber min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('nationalSecurityIndex')} name="nationalSecurityIndex">
            <InputNumber min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('militaryStrengthIndex')} name="militaryStrengthIndex">
            <InputNumber min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('foreignPolicy')} name="foreignPolicy">
            <Input />
          </Form.Item>
          <Form.Item label={t('legalSystem')} name="legalSystem">
            <Input />
          </Form.Item>
        </div>

        <h3 style={{ fontSize: '14px', margin: '8px 0' }}>{t('cultureAndSociety')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item label={t('officialLanguages')} name="officialLanguages">
            <Input />
          </Form.Item>
          <Form.Item label={t('majorReligions')} name="majorReligions">
            <Input />
          </Form.Item>
          <Form.Item label={t('majorSports')} name="majorSports">
            <Input />
          </Form.Item>
          <Form.Item label={t('linguisticDiversity')} name="linguisticDiversity">
            <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <h3 style={{ fontSize: '14px', margin: '8px 0' }}>{t('infrastructureAndResources')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item label={t('transportInfrastructure')} name="transportInfrastructure">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label={t('naturalResources')} name="naturalResources">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label={t('majorExports')} name="majorExports">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label={t('majorImports')} name="majorImports">
            <TextArea rows={2} />
          </Form.Item>
        </div>

        <h3 style={{ fontSize: '14px', margin: '8px 0' }}>{t('otherInformation')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item label={t('historicalBackground')} name="historicalBackground">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label={t('tourismIndustry')} name="tourismIndustry">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item label={t('socialSecurity')} name="socialSecurity">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label={t('internationalOrganizationsMembership')} name="internationalOrganizationsMembership">
            <TextArea rows={2} />
          </Form.Item>
        </div>

        <h3 style={{ fontSize: '14px', margin: '8px 0' }}>{t('additionalBasicInfo')}</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          <Form.Item label={t('flagImageUrl')} name="flagImageUrl">
            <Input />
          </Form.Item>
          <Form.Item label={t('dialCode')} name="dialCode">
            <Input />
          </Form.Item>
          <Form.Item label={t('isoCode')} name="isoCode">
            <Input />
          </Form.Item>
          <Form.Item label={t('independenceDay')} name="independenceDay">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label={t('officialWebsite')} name="officialWebsite">
            <Input />
          </Form.Item>
          <Form.Item label={t('worldHeritageSites')} name="worldHeritageSites">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>
      </Form>

      <style jsx global>{`
        .ant-form-item {
          margin-bottom: 2px;
          max-width: 240px;
        }

        .ant-form-item-label {
          padding: 0;
        }

        .ant-form-item-label > label {
          font-size: 10px !important;
          height: 16px;
          line-height: 16px;
          color: rgba(0, 0, 0, 0.85);
        }

        h3 {
          margin: 4px 0 !important;
          padding: 0;
          line-height: 1;
        }

        .ant-input {
          height: 22px;
          font-size: 12px;
          border: 1px solid #d9d9d9;
          color: rgba(0, 0, 0, 0.85) !important;
          padding: 0 4px;
        }

        .ant-input-number {
          height: 22px;
          font-size: 12px;
        }

        .ant-input-number-input {
          height: 20px;
          color: rgba(0, 0, 0, 0.85) !important;
          padding: 0 4px;
        }

        .ant-select-selector {
          height: 22px !important;
          line-height: 22px !important;
        }

        .ant-select-selection-item {
          line-height: 20px !important;
        }

        .ant-picker {
          height: 22px;
        }

        .ant-form-item-control-input {
          min-height: 22px;
        }

        .ant-form > div {
          gap: 2px !important;
          margin-bottom: 4px !important;
        }

        textarea.ant-input {
          min-height: 44px;
          padding: 2px 4px;
        }

        .ant-modal-body {
          padding: 4px 8px;
        }

        .ant-modal-header {
          padding: 6px 12px;
        }

        .ant-modal-footer {
          padding: 6px 12px;
        }

        .ant-btn {
          height: 22px;
          padding: 0 8px;
        }

        .ant-input:hover, .ant-input-number:hover,
        .ant-select:hover, .ant-picker:hover {
          border-color: #40a9ff;
        }

        .ant-input:focus, .ant-input-number:focus,
        .ant-select-focused, .ant-picker-focused {
          border-color: #40a9ff;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
        }

        .ant-input[disabled], .ant-input-number-disabled,
        .ant-select-disabled, .ant-picker-disabled {
          color: rgba(0, 0, 0, 0.25);
          background: #f5f5f5;
          border-color: #d9d9d9;
        }

        .ant-input::placeholder,
        .ant-input-number-input::placeholder {
          color: #bfbfbf !important;
        }
      `}</style>
    </Modal>
  );
};

export default UpdateCountryModal;
