import React from 'react';
import { Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../../utils/dateUtils';

const UserAccountChangeLogTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
}) => {
  const { t } = useTranslation();

  const getChangeTypeTag = (changeType) => {
    switch (changeType) {
      case 'AI_MODEL_FEE':
        return <Tag color="red">{t('aiModelFee')}</Tag>;
      case 'FROZEN':
        return <Tag color="blue">{t('frozen')}</Tag>;
      case 'UNFROZEN':
        return <Tag color="green">{t('unfrozen')}</Tag>;
      case 'DEPOSIT':
        return <Tag color="green">{t('deposit')}</Tag>;
      case 'WITHDRAW':
        return <Tag color="orange">{t('withdraw')}</Tag>;
      default:
        return <Tag>{changeType}</Tag>;
    }
  };

  const getAmountStyle = (amount) => {
    if (amount > 0) {
      return { color: 'green' };
    } else if (amount < 0) {
      return { color: 'red' };
    }
    return {};
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
          <th>{t('user')}</th>
          <th>{t('coinType')}</th>
          <th>{t('changeType')}</th>
          <th>{t('amount')}</th>
          <th>{t('balanceBeforeChange')}</th>
          <th>{t('balanceAfterChange')}</th>
          <th>{t('orderId')}</th>
          <th>{t('remark')}</th>
          <th>{t('createTime')}</th>
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
                <label className="custom-control-label" htmlFor={`td_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img 
                  src={item.avatar} 
                  alt="avatar" 
                  style={{ width: '24px', height: '24px', borderRadius: '50%' }} 
                />
                <span>{item.nickname}</span>
                <span style={{ color: '#999', fontSize: '12px' }}>({item.userId})</span>
              </div>
            </td>
            <td>{item.coinType}</td>
            <td>{getChangeTypeTag(item.changeType)}</td>
            <td style={getAmountStyle(item.amount)}>
              {item.amount > 0 ? '+' : ''}{item.amount}
            </td>
            <td>{item.balanceBeforeChange}</td>
            <td>{item.balanceAfterChange}</td>
            <td>{item.orderId || '-'}</td>
            <td>
              <Tooltip title={item.remark}>
                <div className="text-truncate" style={{ maxWidth: '200px' }}>
                  {item.remark}
                </div>
              </Tooltip>
            </td>
            <td>{formatDate(item.createTime)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserAccountChangeLogTable;
