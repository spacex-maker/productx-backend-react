import React from 'react';
import { Button } from 'antd';

const UserProductHotSearchTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
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
          <th>{t('searchTerm')}</th>
          <th>{t('totalSearchCount')}</th>
          <th>{t('mobileSearchCount')}</th>
          <th>{t('desktopSearchCount')}</th>
          <th>{t('tabletSearchCount')}</th>
          <th>{t('lastSearchedAt')}</th>
          <th>{t('countryCode')}</th>
          <th>{t('language')}</th>
          <th>{t('categoryId')}</th>
          <th>{t('operations')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`td_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.id}`}
                ></label>
              </div>
            </td>
            <td>{item.searchTerm}</td>
            <td>{item.totalSearchCount}</td>
            <td>{item.mobileSearchCount}</td>
            <td>{item.desktopSearchCount}</td>
            <td>{item.tabletSearchCount}</td>
            <td>{item.lastSearchedAt}</td>
            <td>{item.countryCode}</td>
            <td>{item.language}</td>
            <td>{item.categoryId}</td>
            <td>
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

export default UserProductHotSearchTable;
