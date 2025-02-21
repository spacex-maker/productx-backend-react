import React, { useMemo } from 'react';
import { Button, Image, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import DefaultAvatar from 'src/components/DefaultAvatar';

const RepairServiceMerchantsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
  handleViewDetail,
}) => {
  const { t } = useTranslation();

  const serviceTypeColors = useMemo(() => ({
    'mobileRepair': 'blue',
    'computerRepair': 'cyan',
    'applianceRepair': 'purple',
    'furnitureRepair': 'magenta',
    'plumbing': 'green',
    'electricalRepair': 'orange',
    'carRepair': 'red',
    'other': 'default'
  }), []);

  const getServiceTypes = (types) => {
    if (!types) return [];
    if (Array.isArray(types)) return types;
    return [];
  };

  const columns = [
    t('merchantInfo'),
    t('contactInfo'),
    t('serviceTypes'),
    t('businessStatus'),
    t('rating'),
    t('createTime'),
    t('updateTime')
  ];

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="select_all"></label>
            </div>
          </th>
          {columns.map((field) => (
            <th key={field}>{field}</th>
          ))}
          <th className="fixed-column">{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {item.merchantLogo ? (
                  <Image
                    src={item.merchantLogo}
                    alt={item.merchantName}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                ) : (
                  <DefaultAvatar name={item.merchantName} size={40} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500' }}>{item.merchantName}</span>
                  <span style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {item.id}</span>
                </div>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>{item.contactPerson}</div>
                <div>{item.contactPhone}</div>
                <div>{item.contactEmail}</div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  {item.province} {item.city} {item.address}
                </div>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {getServiceTypes(item.serviceTypes).map(type => (
                  <Tag 
                    key={type} 
                    color={serviceTypeColors[type]}
                    style={{ margin: 0, fontSize: '10px', lineHeight: '16px', padding: '0 4px' }}
                  >
                    {t(type)}
                  </Tag>
                ))}
              </div>
            </td>
            <td>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={(e) => handleStatusChange(item.id, e)}
                />
                <span className="toggle-switch-slider"></span>
              </label>
            </td>
            <td>
              <Tag color={item.rating >= 4 ? 'green' : item.rating >= 3 ? 'orange' : 'red'}>
                {item.rating?.toFixed(1)}
              </Tag>
            </td>
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleViewDetail(item)}>
                {t('detail')}
              </Button>
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RepairServiceMerchantsTable;
