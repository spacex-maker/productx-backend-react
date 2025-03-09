import React, { useState, useEffect } from 'react';
import { Modal, Space, Tag, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import api from 'src/axiosInstance';

const MsxCloudProviderRegionsModal = ({
  isVisible,
  onCancel,
  providerId,
  providerName,
  t,
  countries
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchParams, setSearchParams] = useState({
    countryCode: undefined,
    regionCode: '',
    status: undefined
  });

  const statusOptions = [
    { value: 'ACTIVE', label: t('active') },
    { value: 'INACTIVE', label: t('inactive') }
  ];

  const fetchData = async () => {
    if (!providerId) return;
    
    setLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => {
          if (value === false) return true;
          return value !== '' && value !== null && value !== undefined;
        })
      );

      const response = await api.get('/manage/cloud-provider-regions/list-by-provide-id', {
        params: { 
          providerId,
          ...filteredParams
        }
      });

      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error('Failed to fetch regions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && providerId) {
      fetchData();
    }
  }, [isVisible, providerId, searchParams]);

  const getCountryInfo = (countryCode) => {
    const country = countries?.find(c => c.code === countryCode);
    if (!country) return { name: countryCode, flagImageUrl: '' };
    return country;
  };

  return (
    <Modal
      title={`${t('regionInfo')} - ${providerName}`}
      open={isVisible}
      onCancel={onCancel}
      width={900}
      footer={null}
    >
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Select
            placeholder={t('selectCountry')}
            value={searchParams.countryCode}
            onChange={(value) => setSearchParams(prev => ({ ...prev, countryCode: value }))}
            allowClear
            style={{ width: 200 }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              const country = countries.find((c) => c.code === option.value);
              return (
                country?.name.toLowerCase().includes(input.toLowerCase()) ||
                country?.code.toLowerCase().includes(input.toLowerCase())
              );
            }}
          >
            {countries.map((country) => (
              <Select.Option key={country.id} value={country.code}>
                <Space>
                  <img
                    src={country.flagImageUrl}
                    alt={country.name}
                    style={{
                      width: 20,
                      height: 15,
                      objectFit: 'cover',
                      borderRadius: 2,
                      border: '1px solid #f0f0f0'
                    }}
                  />
                  <span>{country.name}</span>
                  <span style={{ color: '#999' }}>({country.code})</span>
                </Space>
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder={t('regionCode')}
            value={searchParams.regionCode}
            onChange={(e) => setSearchParams(prev => ({ ...prev, regionCode: e.target.value }))}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder={t('status')}
            value={searchParams.status}
            onChange={(value) => setSearchParams(prev => ({ ...prev, status: value }))}
            allowClear
            style={{ width: 150 }}
            options={statusOptions}
          />
        </Space>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>{t('country')}</th>
              <th>{t('regionCode')}</th>
              <th>{t('regionName')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="record-font">
                <td className="text-truncate">
                  {item.countryCode && (
                    <Space>
                      <img
                        src={getCountryInfo(item.countryCode).flagImageUrl}
                        alt={item.countryCode}
                        style={{
                          width: 20,
                          height: 15,
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '1px solid #f0f0f0',
                          verticalAlign: 'middle'
                        }}
                      />
                      <span>{getCountryInfo(item.countryCode).name}</span>
                    </Space>
                  )}
                </td>
                <td className="text-truncate">{item.regionCode}</td>
                <td className="text-truncate">{item.regionName}</td>
                <td className="text-truncate">
                  <Tag color={item.status === 'ACTIVE' ? 'success' : 'warning'}>
                    {t(item.status.toLowerCase())}
                  </Tag>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

MsxCloudProviderRegionsModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  providerId: PropTypes.number,
  providerName: PropTypes.string,
  t: PropTypes.func.isRequired,
  countries: PropTypes.array.isRequired
};

export default MsxCloudProviderRegionsModal; 