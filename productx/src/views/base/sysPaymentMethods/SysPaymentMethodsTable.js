import React from 'react';
import { Button, Switch, Tooltip, Image } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

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
  const STATUS_MAP = { 0: t('disabled'), 1: t('enabled'), 2: t('statusPendingConfig') };
  const METHOD_TYPE_MAP = {
    gateway: t('methodTypeGateway'),
    crypto: t('methodTypeCrypto'),
    manual: t('methodTypeManual'),
    giftcard: t('methodTypeGiftcard'),
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
                checked={selectAll}
                onChange={(e) => handleSelectAll(e, data)}
              />
              <label className="custom-control-label" />
            </div>
          </th>
          <th>{t('id')}</th>
          <th>{t('paymentMethodName')}</th>
          <th>{t('methodType')}</th>
          <th>{t('sort')}</th>
          <th>
            {t('status')}
            <Tooltip title={t('modifyingEnableStatusWillAffectPaymentOptions')}>
              <InfoCircleOutlined style={{ marginLeft: '4px' }} />
            </Tooltip>
          </th>
          <th>{t('isRecommend')}</th>
          <th>{t('badgeText')}</th>
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
                <label className="custom-control-label" />
              </div>
            </td>
            <td>{item.id}</td>
            <td>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {item.iconUrl ? (
                  <Image
                    src={item.iconUrl}
                    width={36}
                    height={36}
                    style={{ objectFit: 'cover', flexShrink: 0, borderRadius: '8px' }}
                  />
                ) : null}
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span>{item.paymentMethodName}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>{item.paymentMethodCode}</span>
                </span>
              </span>
            </td>
            <td>{METHOD_TYPE_MAP[item.methodType] || item.methodType}</td>
            <td>{item.sort}</td>
            <td>
              {item.status === 2 ? (
                <span>{STATUS_MAP[2]}</span>
              ) : (
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={item.status === 1}
                    onChange={(e) => handleStatusChange(item.id, e)}
                  />
                  <span className="toggle-switch-slider" />
                </label>
              )}
            </td>
            <td>{item.isRecommend ? t('yes') : t('no')}</td>
            <td>{item.badgeText || '—'}</td>
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

SysPaymentMethodsTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
};

export default SysPaymentMethodsTable;
