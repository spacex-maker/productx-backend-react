import React, {useEffect} from 'react';
import {Modal, Form, Input, InputNumber, Select, DatePicker, message, Card} from 'antd';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import {
  TagOutlined,
  CompassOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PoweroffOutlined,
  NodeIndexOutlined,
  TeamOutlined,
  BorderOuterOutlined,
  DollarOutlined,
  PayCircleOutlined,
  GoldOutlined,
  UserDeleteOutlined,
  HeartOutlined,
  BankOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
  ReadOutlined,
  MedicineBoxOutlined,
  WifiOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  SafetyOutlined,
  RocketOutlined,
  TranslationOutlined,
  MessageOutlined,
  CarOutlined,
  InteractionOutlined,
  FundOutlined,
  LockOutlined,
  GlobalOutlined,
  TrophyOutlined,
  KeyOutlined
} from '@ant-design/icons';

const {TextArea} = Input;

const UpdateCountryModal = ({
                              isVisible,
                              onCancel,
                              onOk,
                              form,
                              handleUpdateCountry,
                              selectedCountry
                            }) => {
  const {t} = useTranslation();

  // 统一的图标样式
  const iconStyle = {
    fontSize: '10px',
    marginRight: '2px',
    color: '#1890ff'
  };

  // 表单字段分组
  const formGroups = {
    basicInfo: [
      { name: 'id', label: t('id'), icon: <KeyOutlined style={iconStyle} />, required: true,
        component: <Input disabled /> 
      },
      { name: 'name', label: t('countryName'), icon: <TagOutlined style={iconStyle} />, required: true },
      { name: 'code', label: t('countryCode'), icon: <GlobalOutlined style={iconStyle} />, required: true },
      { name: 'continent', label: t('continent'), icon: <CompassOutlined style={iconStyle} />, required: true,
        component: (
          <Select>
            <Select.Option value="亚洲">{t('asia')}</Select.Option>
            <Select.Option value="欧洲">{t('europe')}</Select.Option>
            <Select.Option value="非洲">{t('africa')}</Select.Option>
            <Select.Option value="北美洲">{t('northAmerica')}</Select.Option>
            <Select.Option value="南美洲">{t('southAmerica')}</Select.Option>
            <Select.Option value="大洋洲">{t('oceania')}</Select.Option>
            <Select.Option value="南极洲">{t('antarctica')}</Select.Option>
          </Select>
        )
      },
      { name: 'capital', label: t('capital'), icon: <HomeOutlined style={iconStyle} /> },
      { name: 'coordinates', label: t('coordinates'), icon: <EnvironmentOutlined style={iconStyle} /> },
      { name: 'timezone', label: t('timezone'), icon: <ClockCircleOutlined style={iconStyle} /> },
      { name: 'status', label: t('status'), icon: <PoweroffOutlined style={iconStyle} />, required: true,
        component: (
          <Select>
            <Select.Option value={true}>{t('enabled')}</Select.Option>
            <Select.Option value={false}>{t('disabled')}</Select.Option>
          </Select>
        )
      },
      { name: 'borderingCountries', label: t('borderingCountries'), icon: <NodeIndexOutlined style={iconStyle} />,
        component: <Select mode="tags" style={{ width: '100%' }} />
      }
    ],
    populationAndArea: [
      { name: 'population', label: t('population'), icon: <TeamOutlined style={iconStyle} />,
        component: <InputNumber style={{ width: '100%' }} />
      },
      { name: 'area', label: t('area'), icon: <BorderOuterOutlined style={iconStyle} />,
        component: <InputNumber style={{ width: '100%' }} />
      },
      { name: 'gdp', label: t('gdp'), icon: <DollarOutlined style={iconStyle} />,
        component: <InputNumber style={{ width: '100%' }} />
      },
      { name: 'currency', label: t('currency'), icon: <PayCircleOutlined style={iconStyle} /> },
      { name: 'foreignExchangeReserves', label: t('foreignExchangeReserves'), icon: <GoldOutlined style={iconStyle} />,
        component: <InputNumber style={{ width: '100%' }} />
      }
    ],
    economicIndicators: [
      { name: 'unemploymentRate', label: t('unemploymentRate'), icon: <UserDeleteOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={100} style={{width: '100%'}}/> },
      { name: 'povertyRate', label: t('povertyRate'), icon: <HeartOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={100} style={{width: '100%'}}/> },
      { name: 'incomeLevel', label: t('incomeLevel'), icon: <FundOutlined style={iconStyle} />,
        component: (
          <Select>
            <Select.Option value="高收入">{t('highIncome')}</Select.Option>
            <Select.Option value="中高收入">{t('upperMiddleIncome')}</Select.Option>
            <Select.Option value="中低收入">{t('lowerMiddleIncome')}</Select.Option>
            <Select.Option value="低收入">{t('lowIncome')}</Select.Option>
          </Select>
        )
      }
    ],
    socialDevelopment: [
      { name: 'hdi', label: t('hdi'), icon: <RiseOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={1} step={0.001} style={{width: '100%'}}/> },
      { name: 'educationLevel', label: t('educationLevel'), icon: <ReadOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={10} style={{width: '100%'}}/> },
      { name: 'healthcareLevel', label: t('healthcareLevel'), icon: <MedicineBoxOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={10} style={{width: '100%'}}/> },
      { name: 'internetPenetrationRate', label: t('internetPenetrationRate'), icon: <WifiOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={100} style={{width: '100%'}}/> },
      { name: 'energyConsumption', label: t('energyConsumption'), icon: <ThunderboltOutlined style={iconStyle} />,
        component: <InputNumber style={{width: '100%'}}/> },
      { name: 'airQualityIndex', label: t('airQualityIndex'), icon: <CloudOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={500} style={{width: '100%'}}/> }
    ],
    politicsAndSecurity: [
      { name: 'governmentType', label: t('governmentType'), icon: <BankOutlined style={iconStyle} /> },
      { name: 'politicalStability', label: t('politicalStability'), icon: <SafetyCertificateOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={10} style={{width: '100%'}}/> },
      { name: 'nationalSecurityIndex', label: t('nationalSecurityIndex'), icon: <SafetyOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={10} style={{width: '100%'}}/> },
      { name: 'militaryStrengthIndex', label: t('militaryStrengthIndex'), icon: <RocketOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={10} style={{width: '100%'}}/> },
      { name: 'foreignPolicy', label: t('foreignPolicy'), icon: <GlobalOutlined style={iconStyle} /> },
      { name: 'legalSystem', label: t('legalSystem'), icon: <LockOutlined style={iconStyle} /> }
    ],
    cultureAndSociety: [
      { name: 'officialLanguages', label: t('officialLanguages'), icon: <TranslationOutlined style={iconStyle} /> },
      { name: 'majorReligions', label: t('majorReligions'), icon: <BankOutlined style={iconStyle} /> },
      { name: 'majorSports', label: t('majorSports'), icon: <TrophyOutlined style={iconStyle} /> },
      { name: 'linguisticDiversity', label: t('linguisticDiversity'), icon: <MessageOutlined style={iconStyle} />,
        component: <InputNumber min={0} max={1} step={0.01} style={{width: '100%'}}/> }
    ],
    infrastructureAndResources: [
      { name: 'transportInfrastructure', label: t('transportInfrastructure'), icon: <CarOutlined style={iconStyle} />,
        component: <TextArea rows={2}/> },
      { name: 'naturalResources', label: t('naturalResources'), icon: <GoldOutlined style={iconStyle} />,
        component: <TextArea rows={2}/> },
      { name: 'majorExports', label: t('majorExports'), icon: <InteractionOutlined style={iconStyle} />,
        component: <TextArea rows={2}/> },
      { name: 'majorImports', label: t('majorImports'), icon: <InteractionOutlined style={iconStyle} />,
        component: <TextArea rows={2}/> }
    ]
  };

  useEffect(() => {
    if (isVisible && selectedCountry) {
      // 设置所有字段的值
      form.setFieldsValue({
        ...selectedCountry,
        independenceDay: selectedCountry.independenceDay ? dayjs(selectedCountry.independenceDay) : null,
      });
    }
  }, [isVisible, selectedCountry, form]);



  return (
    <Modal
      title={t('updateCountry')}
      open={isVisible}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('confirm')}
      cancelText={t('cancel')}
      width={800}
      style={{top: 20}}
      styles={{padding: '4px'}}
    >
      <Form
        form={form}
        onFinish={handleUpdateCountry}
        layout="vertical"
        style={{
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          padding: '0 4px'
        }}
        size="small"
      >
        {Object.entries(formGroups).map(([groupKey, fields]) => (
          <Card
            key={groupKey}
            size="small"
            title={t(groupKey)}
            style={{ marginBottom: '4px' }}
            headStyle={{
              fontSize: '10px',
              padding: '2px 4px',
              minHeight: '16px',
              background: '#fafafa'
            }}
            styles={{ padding: '4px' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '4px'
            }}>
              {fields.map(field => (
                <Form.Item
                  key={field.name}
                  label={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {field.icon}
                      {field.label}
                    </span>
                  }
                  name={field.name}
                  rules={field.required ? [{ required: true }] : undefined}
                >
                  {field.component || <Input />}
                </Form.Item>
              ))}
            </div>
          </Card>
        ))}

        <Card
          size="small"
          title={t('otherInformation')}
          style={{marginBottom: '4px'}}
          headStyle={{
            fontSize: '10px',
            padding: '2px 4px',
            minHeight: '16px',
            background: '#fafafa'
          }}
          styles={{padding: '4px'}}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '4px'
          }}>
            <Form.Item label={t('historicalBackground')} name="historicalBackground">
              <TextArea rows={3}/>
            </Form.Item>
            <Form.Item label={t('tourismIndustry')} name="tourismIndustry">
              <TextArea rows={3}/>
            </Form.Item>
            <Form.Item label={t('socialSecurity')} name="socialSecurity">
              <TextArea rows={2}/>
            </Form.Item>
            <Form.Item label={t('internationalOrganizationsMembership')} name="internationalOrganizationsMembership">
              <TextArea rows={2}/>
            </Form.Item>
            <Form.Item label={t('flagImageUrl')} name="flagImageUrl">
              <Input/>
            </Form.Item>
            <Form.Item label={t('dialCode')} name="dialCode">
              <Input/>
            </Form.Item>
            <Form.Item label={t('isoCode')} name="isoCode">
              <Input/>
            </Form.Item>
            <Form.Item label={t('independenceDay')} name="independenceDay">
              <DatePicker style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item label={t('officialWebsite')} name="officialWebsite">
              <Input/>
            </Form.Item>
            <Form.Item label={t('worldHeritageSites')} name="worldHeritageSites">
              <InputNumber min={0} style={{width: '100%'}}/>
            </Form.Item>
          </div>
        </Card>


      </Form>

      <style jsx global>{`
        .ant-form-item {
          margin-bottom: 0;
        }

        .ant-form-item-label {
          padding: 0;
        }

        .ant-form-item-label > label {
          font-size: 10px !important;
          height: 16px !important;
          line-height: 16px !important;
          color: #666666 !important;
        }

        .ant-card {
          border-radius: 2px;
        }

        .ant-card-head {
          min-height: 16px;
          padding: 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .ant-card-head-title {
          font-size: 10px !important;
          padding: 2px 4px;
        }

        .ant-input, .ant-select-selector, .ant-picker, .ant-input-number {
          height: 22px !important;
          font-size: 10px !important;
          padding: 0 4px !important;
          color: #000000 !important;
        }

        .ant-input-number-input {
          height: 20px !important;
          font-size: 10px !important;
          padding: 0 4px !important;
          color: #000000 !important;
        }

        .ant-select-selection-item {
          line-height: 20px !important;
          font-size: 10px !important;
          color: #000000 !important;
        }

        textarea.ant-input {
          height: auto !important;
          min-height: 22px !important;
          padding: 2px 4px !important;
          color: #000000 !important;
        }

        .ant-modal-header {
          padding: 4px 8px;
        }

        .ant-modal-body {
          padding: 4px;
        }

        .ant-modal-footer {
          padding: 4px 8px;
        }

        .ant-btn {
          height: 22px !important;
          padding: 0 8px !important;
          font-size: 10px !important;
          color: #000000 !important;
        }

        .ant-form-item-explain {
          font-size: 10px !important;
          min-height: 16px !important;
        }

        .ant-select-selection-item-content {
          color: #000000 !important;
        }

        .ant-select-item-option-content {
          color: #000000 !important;
          font-size: 10px !important;
        }

        .ant-card-head-title {
          font-size: 10px !important;
          padding: 2px 4px !important;
          color: #666666 !important;
        }

        .ant-modal-title {
          font-size: 12px !important;
          color: #000000 !important;
        }

        .ant-input[disabled],
        .ant-input-number-disabled,
        .ant-select-disabled .ant-select-selector,
        .ant-picker-disabled {
          color: rgba(0, 0, 0, 0.25) !important;
          background-color: #f5f5f5 !important;
        }

        .ant-input::placeholder,
        .ant-input-number-input::placeholder,
        .ant-select-selection-placeholder {
          color: #999999 !important;
        }

        /* 添加图标相关样式 */
        .ant-form-item-label .anticon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          vertical-align: middle !important;
        }

        .ant-form-item-label > label {
          display: inline-flex !important;
          align-items: center !important;
        }

        /* 图标悬停效果 */
        .anticon:hover {
          color: #40a9ff !important;
          transition: color 0.3s !important;
        }
      `}</style>
    </Modal>
  );
};

export default UpdateCountryModal;
