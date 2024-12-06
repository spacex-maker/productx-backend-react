import React from 'react';
import { Button, Image } from 'antd';
import { useTranslation } from 'react-i18next';

const PartnersTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleStatusChange,
  handleEditClick,
}) => {
  const { t } = useTranslation();

  const columns = [
    'ID',
    t('partnerName'),
    'Logo',
    t('websiteUrl'),
    t('description'),
    t('businessStatus'),
    t('createTime'),
    t('updateTime'),
    t('createBy'),
    t('updateBy'),
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
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">{item.name}</td>
            <td>
              <Image
                src={item.logoUrl}
                alt={item.name}
                style={{ width: '50px', height: '50px' }}
              />
            </td>
            <td className="text-truncate">
              <a href={item.websiteUrl} target="_blank" rel="noopener noreferrer">
                {item.websiteUrl}
              </a>
            </td>
            <td className="text-truncate">{item.description}</td>
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
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
            <td className="text-truncate">{item.createBy}</td>
            <td className="text-truncate">{item.updateBy}</td>
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

export default PartnersTable;

