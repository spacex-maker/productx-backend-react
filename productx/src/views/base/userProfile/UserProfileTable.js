import React from 'react';
import { Button, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const UserProfileTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleDetailClick
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
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
            />
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
            'followingCount'
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
              <input
                type="checkbox"
                checked={selectedRows.some(row => row.userId === item.userId)}
                onChange={(e) => handleSelectRow(e, item)}
              />
            </td>
            <td className="text-truncate">{item.userId}</td>
            <td className="text-truncate">{item.name}</td>
            <td className="text-truncate">{item.age}</td>
            <td className="text-center">
              <Tag color={item.gender === 'male' ? 'blue' : item.gender === 'female' ? 'pink' : 'default'}>
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
      <style jsx>{`
        .text-truncate {
          max-width: 150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .record-font {
          font-size: 10px;
        }
        .fixed-column {
          width: 120px;
          white-space: nowrap;
        }
        th {
          font-size: 10px;
          white-space: nowrap;
        }
      `}</style>
    </table>
  );
};

export default UserProfileTable;
