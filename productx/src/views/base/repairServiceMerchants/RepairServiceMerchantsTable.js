import React from 'react';
import { Button, Image, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const RepairServiceMerchantsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
}) => {
  const { t } = useTranslation();

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
          <th>ID</th>
          <th>{t('merchantName')}</th>
          <th>{t('logo')}</th>
          <th>{t('contactPerson')}</th>
          <th>{t('contactPhone')}</th>
          <th>{t('contactEmail')}</th>
          <th>{t('address')}</th>
          <th>{t('serviceTypes')}</th>
          <th>{t('businessStatus')}</th>
          <th>{t('rating')}</th>
          <th>{t('createTime')}</th>
          <th>{t('updateTime')}</th>
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
            <td>{item.id}</td>
            <td>{item.merchantName}</td>
            <td>
              {item.merchantLogo && (
                <Image
                  src={item.merchantLogo}
                  alt={item.merchantName}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              )}
            </td>
            <td>{item.contactPerson}</td>
            <td>{item.contactPhone}</td>
            <td>{item.contactEmail}</td>
            <td>
              {item.province} {item.city} {item.address}
            </td>
            <td>
              {item.serviceTypes?.split(',').map(type => (
                <Tag key={type} color="blue">{type}</Tag>
              ))}
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
