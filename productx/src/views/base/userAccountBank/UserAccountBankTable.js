import React from 'react';
import { Button, Tag } from 'antd';
import { useTranslation } from 'react-i18next';

const UserAccountBankTable = ({ data, handleEditClick, handleDetailClick }) => {
  const { t } = useTranslation();

  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          {[
            'id',
            'userId',
            'bankName',
            'accountNumber',
            'accountHolderName',
            'swiftCode',
            'currencyCode',
            'isActive',
            'createTime',
            'updateTime',
          ].map((field) => (
            <th key={field}>{t(field)}</th>
          ))}
          <th className="fixed-column">{t('action')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="record-font">
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">{item.userId}</td>
            <td className="text-truncate">{item.bankName}</td>
            <td className="text-truncate">{item.accountNumber}</td>
            <td className="text-truncate">{item.accountHolderName}</td>
            <td className="text-truncate">{item.swiftCode}</td>
            <td className="text-truncate">{item.currencyCode}</td>
            <td className="text-center">
              <Tag color={item.isActive ? 'blue' : 'default'}>
                {item.isActive ? t('yes') : t('no')}
              </Tag>
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
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

export default UserAccountBankTable;
