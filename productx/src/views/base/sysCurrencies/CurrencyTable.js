import React from 'react';
import { Button } from 'antd';

const CurrencyTable = ({
                         data,
                         selectAll,
                         selectedRows,
                         handleSelectAll,
                         handleSelectRow,
                         handleStatusChange,
                         handleEditClick,
                         t
                       }) => {
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
        <th>{t('currencyNameEn')}</th>
        <th>{t('currencyNameZh')}</th>
        <th>{t('currencyCode')}</th>
        <th>{t('currencySymbol')}</th>
        <th>{t('status')}</th>
        <th className="fixed-column">{t('operations')}</th>
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
          <td className="text-truncate">
            <div>{item.currencyName}</div>
            <div>{item.id}</div>
          </td>
          <td className="text-truncate">{item.descriptionZh}</td>
          <td className="text-truncate">{item.currencyCode}</td>
          <td className="text-truncate">{item.symbol}</td>
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

export default CurrencyTable;
