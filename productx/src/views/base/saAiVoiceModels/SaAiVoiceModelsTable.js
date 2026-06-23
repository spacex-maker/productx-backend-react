import React from 'react';
import { Button, Image, Switch } from 'antd';
import { useTranslation } from 'react-i18next';

const SaAiVoiceModelsTable = ({
  data,
  selectAll,
  selectedRows,
  handleSelectAll,
  handleSelectRow,
  handleEditClick,
  handleEnableStatusChange,
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
                id="voice_select_all"
                checked={selectAll}
                onChange={(event) => handleSelectAll(event, data)}
              />
              <label className="custom-control-label" htmlFor="voice_select_all"></label>
            </div>
          </th>
          <th>{t('coverImage')}</th>
          <th>{t('engineModelCode')}</th>
          <th>{t('voiceCode')}</th>
          <th>{t('voiceName')}</th>
          <th>{t('language')}</th>
          <th>{t('gender')}</th>
          <th>{t('tokenCost')}</th>
          <th>{t('usageCount')}</th>
          <th>{t('commentCount')}</th>
          <th>{t('sortOrder')}</th>
          <th>{t('status')}</th>
          <th>{t('operation')}</th>
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
                  id={`voice_checkbox_${item.id}`}
                  checked={selectedRows.includes(item.id)}
                  onChange={() => handleSelectRow(item.id, data)}
                />
                <label className="custom-control-label" htmlFor={`voice_checkbox_${item.id}`}></label>
              </div>
            </td>
            <td>
              {item.coverImage ? (
                <Image src={item.coverImage} width={40} height={40} style={{ objectFit: 'cover' }} />
              ) : '-'}
            </td>
            <td>{item.engineModelCode}</td>
            <td>{item.voiceCode}</td>
            <td>
              <div>{item.voiceName}</div>
              {item.voiceNameEn && <div style={{ color: '#999', fontSize: 12 }}>{item.voiceNameEn}</div>}
            </td>
            <td>{item.language || '-'}</td>
            <td>{item.gender || '-'}</td>
            <td>{item.tokenCost ?? '-'}</td>
            <td>{item.usageCount ?? 0}</td>
            <td>{item.commentCount ?? 0}</td>
            <td>{item.sortOrder ?? 0}</td>
            <td>
              <Switch
                checked={!!item.status}
                onChange={(checked) => handleEnableStatusChange(item.id, checked)}
                checkedChildren={t('active')}
                unCheckedChildren={t('inactive')}
              />
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

export default SaAiVoiceModelsTable;
