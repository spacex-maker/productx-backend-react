import React from 'react';
import { Button, Space, Tag } from 'antd';
import PropTypes from 'prop-types';

const SiteSettingsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  t,
}) => {
  const getLangLabel = (lang) => {
    const langMap = {
      'zh': '中文',
      'en': 'English',
      'ja': '日本語',
      'ko': '한국어',
      'es': 'Español',
      'fr': 'Français',
      'de': 'Deutsch',
      'it': 'Italiano',
      'ru': 'Русский',
      'ar': 'العربية',
    };
    return langMap[lang] || lang;
  };

  const formatConfigValue = (value) => {
    if (!value) return '-';
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object') {
        return JSON.stringify(parsed, null, 2).substring(0, 100) + (JSON.stringify(parsed).length > 100 ? '...' : '');
      }
      return String(value).substring(0, 100) + (String(value).length > 100 ? '...' : '');
    } catch {
      return String(value).substring(0, 100) + (String(value).length > 100 ? '...' : '');
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
            'ID',
            t('configKey') || 'Config Key',
            t('description') || 'Description',
            t('language') || 'Language',
            t('status'),
            t('createTime'),
            t('updateTime'),
            t('operations')
          ].map((field) => (
            <th key={field}>{field}</th>
          ))}
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
            <td className="text-truncate">{item.id}</td>
            <td className="text-truncate">
              <div style={{ fontWeight: 500 }}>{item.configKey}</div>
            </td>
            <td className="text-truncate" title={item.description}>
              {item.description || '-'}
            </td>
            <td className="text-truncate">
              <Tag>{getLangLabel(item.lang)}</Tag>
            </td>
            <td className="text-truncate">
              {item.status === 1 ? (
                <Tag color="success">{t('active')}</Tag>
              ) : (
                <Tag color="warning">{t('inactive')}</Tag>
              )}
            </td>
            <td className="text-truncate">{item.createTime}</td>
            <td className="text-truncate">{item.updateTime}</td>
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

SiteSettingsTable.propTypes = {
  data: PropTypes.array.isRequired,
  selectAll: PropTypes.bool.isRequired,
  selectedRows: PropTypes.array.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  handleSelectRow: PropTypes.func.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default SiteSettingsTable;

