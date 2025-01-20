import React from 'react';
import { Button, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { UseSelectableRows } from 'src/components/common/UseSelectableRows';

const UserProfileTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDetailClick,
}) => {
  const { t } = useTranslation();

  const formatArrayString = (str) => {
    try {
      return JSON.parse(str).join(', ');
    } catch {
      return str;
    }
  };

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
          {[
            'userId',
            'name',
            'age',
            'gender',
            'location',
            'registrationDate',
            'totalOrders',
            'avgOrderValue',
            'preferredCategories',
            'preferredBrands',
            'followersCount',
            'followingCount',
          ].map((field) => (
            <th key={field}>{t(field)}</th>
          ))}
          <th className="fixed-column">{t('action')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.userId} className="record-font">
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`td_checkbox_${item.userId}`}
                  checked={selectedRows.includes(item.userId)}
                  onChange={() => handleSelectRow(item.userId, data)}
                />
                <label
                  className="custom-control-label"
                  htmlFor={`td_checkbox_${item.userId}`}
                ></label>
              </div>
            </td>
            <td className="text-truncate">{item.userId}</td>
            <td className="text-truncate">{item.name}</td>
            <td className="text-truncate">{item.age}</td>
            <td className="text-center">
              <Tag
                color={
                  item.gender === 'male' ? 'blue' : item.gender === 'female' ? 'pink' : 'default'
                }
              >
                {t(item.gender)}
              </Tag>
            </td>
            <td className="text-truncate">{item.location}</td>
            <td className="text-truncate">{item.registrationDate}</td>
            <td className="text-truncate">{item.totalOrders}</td>
            <td className="text-truncate">{item.avgOrderValue}</td>
            <td className="text-truncate">{formatArrayString(item.preferredCategories)}</td>
            <td className="text-truncate">{formatArrayString(item.preferredBrands)}</td>
            <td className="text-truncate">{item.followersCount}</td>
            <td className="text-truncate">{item.followingCount}</td>
            <td className="fixed-column">
              <Button type="link" onClick={() => handleEditClick(item)}>
                {t('edit')}
              </Button>
              <Button type="link" onClick={() => handleDetailClick(item)}>
                {t('detail')}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserProfileTable;
