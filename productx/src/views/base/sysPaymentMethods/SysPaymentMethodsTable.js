import React from 'react';
import { Button, Switch, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const SysPaymentMethodsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleStatusChange,
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
                checked={selectAll}
                onChange={(e) => handleSelectAll(e, data)}
              />
              <label className="custom-control-label"></label>
            </div>
          </th>
          <th>{t('id')}</th>
          <th>{t('paymentMethodName')}</th>
          <th>{t('englishDescription')}</th>
          <th>{t('chineseDescription')}</th>
          <th>
            {t('status')}
            <Tooltip title={t('modifyingEnableStatusWillAffectPaymentOptions')}>
              <InfoCircleOutlined style={{ marginLeft: '4px' }} />
            </Tooltip>
          </th>
          <th>{t('createTime')}</th>
          <th>{t('updateTime')}</th>
          <th>{t('operation')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id)}
                />
                <label className="custom-control-label"></label>
              </div>
            </td>
            <td>{item.id}</td>
            <td>{item.paymentMethodName}</td>
            <td>{item.descriptionEn}</td>
            <td>{item.descriptionZh}</td>
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
            <td>{item.createTime}</td>
            <td>{item.updateTime}</td>
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

export default SysPaymentMethodsTable;
